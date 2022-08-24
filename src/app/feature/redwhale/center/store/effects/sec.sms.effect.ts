import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, forkJoin, EMPTY, from, iif } from 'rxjs'
import { catchError, switchMap, tap, map, find, debounceTime } from 'rxjs/operators'

import _ from 'lodash'

import * as SMSActions from '../actions/sec.sms.actions'
import * as SMSReducer from '../reducers/sec.sms.reducer'
import * as SMSSelector from '../selectors/sec.sms.selector'

import { showToast } from '@appStore/actions/toast.action'

import { CenterUsersService } from '@services/center-users.service'
import { CenterUsersLockerService } from '@services/center-users-locker.service.service'
import { CenterUsersMembershipService } from '@services/center-users-membership.service'
import { CenterService } from '@services/center.service'
import { CenterHoldingService } from '@services/center-holding.service'
import { CenterContractService } from '@services/center-users-contract.service'
import { CenterSMSService, SendSMSMessageReqBody, UpdateMLAutoSendReqBody } from '@services/center-sms.service'
import { curUserListSelect, userListIds } from '../selectors/sec.sms.selector'
import { SMSAutoSend } from '@schemas/sms-auto-send'

@Injectable()
export class SMSEffect {
    constructor(
        private centerUsersApi: CenterUsersService,
        private store: Store,
        private actions$: Actions,
        private centerSMSApi: CenterSMSService,
        private centerUsersLockerApi: CenterUsersLockerService,
        private centerUsersMembershipApi: CenterUsersMembershipService,
        private centerService: CenterService,
        private centerHoldingApi: CenterHoldingService,
        private centerContractApi: CenterContractService
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
    updateAutoSend$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(SMSActions.startUpdateAutoSend),
                concatLatestFrom(() => [
                    this.store.select(SMSSelector.membershipAutoSendSetting),
                    this.store.select(SMSSelector.lockerAutoSendSetting),
                ]),
                tap(([{ centerId, reqBody, autoSendType }, mass, lass]) => {
                    console.log('SMSActions.startUpdateAutoSend : ', autoSendType, reqBody)
                    if (autoSendType == 'membership') {
                        console.log('SMSActions.startUpdateAutoSend -- membership update call')
                        this.centerSMSApi.updateMembershipAutoSend(centerId, reqBody).subscribe()
                    } else if (autoSendType == 'locker') {
                        console.log('SMSActions.startUpdateAutoSend -- locker update call')
                        this.centerSMSApi.updateLockerAutoSend(centerId, reqBody).subscribe()
                    }
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
