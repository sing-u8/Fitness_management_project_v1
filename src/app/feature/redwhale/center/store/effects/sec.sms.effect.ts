import { Injectable } from '@angular/core'
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of } from 'rxjs'
import { catchError, debounceTime, map, switchMap, tap } from 'rxjs/operators'

import _ from 'lodash'

import * as SMSActions from '../actions/sec.sms.actions'
import * as SMSReducer from '../reducers/sec.sms.reducer'
import * as SMSSelector from '../selectors/sec.sms.selector'

import { CenterUsersService } from '@services/center-users.service'
import { CenterSMSService, SendSMSMessageReqBody, UpdateMLAutoSendReqBody } from '@services/center-sms.service'
import { SMSAutoSend } from '@schemas/sms-auto-send'

@Injectable()
export class SMSEffect {
    constructor(
        private centerUsersApi: CenterUsersService,
        private store: Store,
        private actions$: Actions,
        private centerSMSApi: CenterSMSService
    ) {}

    public loadMemberList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SMSActions.startLoadMemberList),
            switchMap(({ centerId }) =>
                this.centerUsersApi.getUserList(centerId, 'all').pipe(
                    map((memberlist) => {
                        const userListValue: SMSReducer.UsersListValue = memberlist.map((v) => ({
                            user: v,
                            selected: false,
                        }))
                        // usersSelectCateg.member.userSize = usersList['member'].length
                        return SMSActions.finishLoadMemberList({
                            categ_type: 'member',
                            userListValue,
                        })
                    }),
                    catchError((err: string) => of(SMSActions.error({ error: err })))
                )
            )
        )
    )

    getUsersByCategory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SMSActions.startGetUsersByCategory),
            switchMap(({ centerId }) =>
                this.centerUsersApi.getUsersByCategory(centerId).pipe(
                    map((usersByCategs) => {
                        const userSelectCateg = {} as SMSReducer.UsersSelectCateg
                        usersByCategs.forEach((usersByCateg) => {
                            const type = SMSReducer.matchUsersCategoryTo(usersByCateg.category_code)
                            userSelectCateg[type] = {
                                name: usersByCateg.category_name,
                                userSize: usersByCateg.user_count,
                            }
                        })
                        return SMSActions.finishGetUsersByCategory({ userSelectCateg })
                    })
                )
            )
        )
    )

    getUserList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SMSActions.startGetUserList),
            switchMap(({ centerId, categ_type }) =>
                this.centerUsersApi.getUserList(centerId, SMSReducer.matchMemberSelectCategTo(categ_type)).pipe(
                    map((memberlist) => {
                        const userListValue: SMSReducer.UsersListValue = memberlist.map((v) => ({
                            user: v,
                            selected: false,
                        }))
                        // usersSelectCateg.member.userSize = usersList['member'].length
                        return SMSActions.finishLoadMemberList({
                            categ_type: categ_type,
                            userListValue,
                        })
                    }),
                    catchError((err: string) => of(SMSActions.error({ error: err })))
                )
            )
        )
    )

    refreshUserList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SMSActions.startRefreshMemberList),
            concatLatestFrom(() => [
                this.store.select(SMSSelector.curUserListSelect),
                this.store.select(SMSSelector.usersLists),
            ]),
            switchMap(([{ centerId }, curUserListSelect, usersLists]) =>
                this.centerUsersApi
                    .getUserList(centerId, SMSReducer.matchMemberSelectCategTo(curUserListSelect.key))
                    .pipe(
                        map((memberlist) => {
                            const userListValue: SMSReducer.UsersListValue = memberlist.map((v) => {
                                const selectedUser = usersLists[curUserListSelect.key].find((ud) => ud.user.id == v.id)
                                return {
                                    user: v,
                                    selected: selectedUser != undefined ? selectedUser.selected : false,
                                }
                            })
                            // usersSelectCateg.member.userSize = usersList['member'].length
                            return SMSActions.finishRefreshMemberList({
                                categ_type: curUserListSelect.key,
                                userListValue,
                            })
                        }),
                        catchError((err: string) => of(SMSActions.error({ error: err })))
                    )
            )
        )
    )

    getSMSPoint$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SMSActions.startGetSMSPoint),
            switchMap(({ centerId }) =>
                this.centerSMSApi.getSMSPoint(centerId).pipe(
                    switchMap((v) => {
                        return [
                            SMSActions.finishGetSMSPoint({
                                smsPoint: v.sms_point,
                            }),
                        ]
                    }),
                    catchError((err: string) => of(SMSActions.error({ error: err })))
                )
            )
        )
    )
    chargeSMSPoint$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SMSActions.startChargeSMSPoint),
            concatLatestFrom(() => [this.store.select(SMSSelector.smsPoint)]),
            switchMap(([{ centerId, smsPoint, cb }, curSMSPoint]) =>
                this.centerSMSApi.updateSMSPoint(centerId, { sms_point: curSMSPoint + smsPoint }).pipe(
                    switchMap(() => {
                        cb ? cb() : null
                        return [SMSActions.finishChargeSMSPoint({ smsPoint: smsPoint + curSMSPoint })]
                    })
                )
            ),
            catchError((err: string) => of(SMSActions.error({ error: err })))
        )
    )

    sendMessage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SMSActions.startSendGeneralMessage),
            concatLatestFrom(() => [
                this.store.select(SMSSelector.generalCaller),
                this.store.select(SMSSelector.generalTransmissionTime),
                this.store.select(SMSSelector.bookDate),
                this.store.select(SMSSelector.generalText),
                this.store.select(SMSSelector.userListIds),
                this.store.select(SMSSelector.bookTime),
                this.store.select(SMSSelector.curUserListSelect),
            ]),
            switchMap(([{ centerId, cb }, gCaller, gtTime, bookDate, gText, userListIds, bookTime]) => {
                let reqBody: SendSMSMessageReqBody = undefined
                if (gtTime.immediate) {
                    reqBody = {
                        sender_phone_number: gCaller.phone_number,
                        text: gText,
                        receiver_user_ids: userListIds,
                    }
                } else {
                    reqBody = {
                        sender_phone_number: gCaller.phone_number,
                        text: gText,
                        receiver_user_ids: userListIds,
                        reservation_datetime: `${bookDate.date} ${bookTime}`,
                    }
                    console.log
                }
                return this.centerSMSApi.sendSMSMessage(centerId, reqBody).pipe(
                    switchMap((v) => {
                        cb ? cb() : null
                        return [
                            SMSActions.finishSendGeneralMessage({
                                smsPoint: v.sms_point,
                            }),
                        ]
                    }),
                    catchError((err: string) => of(SMSActions.error({ error: err })))
                )
            })
        )
    )

    getCallerList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SMSActions.startGetCallerList),
            switchMap(({ centerId }) => {
                return this.centerSMSApi.getSMSCallerId(centerId).pipe(
                    switchMap((callerList) => {
                        return [SMSActions.finishGetCallerList({ callerList })]
                    })
                )
            }),
            catchError((err: string) => of(SMSActions.error({ error: err })))
        )
    )

    getMembershipAutoSend$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SMSActions.startGetMembershipAutoSend),
            switchMap(({ centerId }) => {
                return this.centerSMSApi.getMembershipAutoSend(centerId).pipe(
                    switchMap((smsAutoSend) => {
                        return [SMSActions.finishGetMembershipAutoSend({ smsAutoSend })]
                    })
                )
            }),
            catchError((err: string) => of(SMSActions.error({ error: err })))
        )
    )
    getLockerAutoSend$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SMSActions.startGetLockerAutoSend),
            switchMap(({ centerId }) => {
                return this.centerSMSApi.getLockerAutoSend(centerId).pipe(
                    switchMap((smsAutoSend) => {
                        return [SMSActions.finishGetLockerAutoSend({ smsAutoSend })]
                    })
                )
            }),
            catchError((err: string) => of(SMSActions.error({ error: err })))
        )
    )
    updateMembershipAutoSend$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(SMSActions.startUpdateMembershipAutoSend),
                concatLatestFrom(() => [this.store.select(SMSSelector.membershipAutoSendSetting)]),
                debounceTime(1000),
                tap(([{ centerId, reqBody }, mass]) => {
                    this.centerSMSApi
                        .updateMembershipAutoSend(centerId, {
                            ...mass,
                            ...reqBody,
                            time: _.has(reqBody, 'time') ? reqBody.time.slice(0, 5) : mass.time.slice(0, 5),
                        })
                        .subscribe()
                }),
                catchError((err: string) => of(SMSActions.error({ error: err })))
            ),
        { dispatch: false }
    )

    updateLockerAutoSend$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(SMSActions.startUpdateLockerAutoSend),
                concatLatestFrom(() => [this.store.select(SMSSelector.lockerAutoSendSetting)]),
                debounceTime(1000),
                tap(([{ centerId, reqBody }, lass]) => {
                    this.centerSMSApi
                        .updateLockerAutoSend(centerId, {
                            ...lass,
                            ...reqBody,
                            time: _.has(reqBody, 'time') ? reqBody.time.slice(0, 5) : lass.time.slice(0, 5),
                        })
                        .subscribe()
                }),
                catchError((err: string) => of(SMSActions.error({ error: err })))
            ),
        { dispatch: false }
    )

    getHistoryGroup$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SMSActions.startGetHistoryGroup),
            switchMap(({ centerId, start_date, end_date, cb }) => {
                return this.centerSMSApi.getSMSHistoryGroup(centerId, start_date, end_date).pipe(
                    switchMap((smsHistoryGroupList) => {
                        cb ? cb() : null
                        return [SMSActions.finishGetHistoryGroup({ smsHistoryGroupList })]
                    })
                )
            }),
            catchError((err: string) => of(SMSActions.error({ error: err })))
        )
    )

    getHistory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(SMSActions.startGetHistoryGroupDetail),
            switchMap(({ centerId, historyGroupId }) => {
                return this.centerSMSApi.getSMSHistoryGroupDetail(centerId, historyGroupId).pipe(
                    switchMap((smsHistoryList) => {
                        return [SMSActions.finishGetHistoryGroupDetail({ smsHistoryList })]
                    })
                )
            }),
            catchError((err: string) => of(SMSActions.error({ error: err })))
        )
    )

    // helper
    isSameValueAutoSetting(value: UpdateMLAutoSendReqBody, reference: SMSAutoSend) {
        const valueKeys = _.keys(value)
        const referByValueKeys = _.pick(reference, valueKeys)
        console.log('isSameValueAutoSetting -- ', value, ' -- ', reference, ' -- ', _.isEqual(value, referByValueKeys))
        return _.isEqual(value, referByValueKeys)
    }
}
