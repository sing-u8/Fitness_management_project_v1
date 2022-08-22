import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, forkJoin, EMPTY, from } from 'rxjs'
import { catchError, switchMap, tap, map, find } from 'rxjs/operators'

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
import { CenterSMSService } from '@services/center-sms.service'

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
}
