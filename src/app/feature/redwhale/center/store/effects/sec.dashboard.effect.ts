import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, EMPTY, iif, forkJoin } from 'rxjs'
import { catchError, switchMap, tap, map, exhaustMap, mapTo } from 'rxjs/operators'

import _ from 'lodash'

import * as DashboardActions from '../actions/sec.dashboard.actions'
import * as DashboardSelector from '../selectors/sec.dashoboard.selector'
import * as DashboardReducer from '../reducers/sec.dashboard.reducer'

import { showToast } from '@appStore/actions/toast.action'

import { CenterUsersService } from '@services/center-users.service'
import { FileService } from '@services/file.service'
import { CenterUsersLockerService } from '@services/center-users-locker.service.service'
import { CenterUsersMembershipService } from '@services/center-users-membership.service'
import { CenterUsersPaymentService } from '@services/center-users-payment.service'

import { CenterUser } from '@schemas/center-user'

@Injectable()
export class DashboardEffect {
    constructor(
        private centerUsersApi: CenterUsersService,
        private fileApi: FileService,
        private store: Store,
        private actions$: Actions,
        private centerUsersLockerApi: CenterUsersLockerService,
        private centerUsersMembershipApi: CenterUsersMembershipService,
        private centerUsersPaymentApi: CenterUsersPaymentService
    ) {}

    public loadMemberList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DashboardActions.startLoadMemberList),
            switchMap(({ centerId }) =>
                this.centerUsersApi.getUserList(centerId).pipe(
                    map((memberlist) => {
                        const usersSelectCateg = _.cloneDeep(DashboardReducer.UsersSelectCategInit)
                        const usersList = _.cloneDeep(DashboardReducer.UsersListInit)
                        usersList['member'] = memberlist.map((v) => ({
                            user: v,
                            holdSelected: false,
                        }))
                        usersSelectCateg.member.userSize = usersList['member'].length
                        return DashboardActions.finishLoadMemberList({
                            usersList,
                            usersSelectCateg,
                        })
                    }),
                    catchError((err: string) => of(DashboardActions.error({ error: err })))
                )
            )
        )
    )

    public directRegisterMember = createEffect(() =>
        this.actions$.pipe(
            ofType(DashboardActions.startDirectRegisterMember),
            switchMap(({ centerId, reqBody, imageFile, callback }) =>
                this.centerUsersApi.createUser(centerId, reqBody).pipe(
                    switchMap((createdUser) => {
                        if (imageFile != undefined) {
                            return this.fileApi
                                .createFile(
                                    {
                                        type_code: 'file_type_center_user_picture',
                                        center_id: centerId,
                                        center_user_id: createdUser.id,
                                    },
                                    imageFile
                                )
                                .pipe(
                                    switchMap((file) => {
                                        createdUser.center_user_picture = file[0].url
                                        callback ? callback() : null
                                        return [
                                            showToast({ text: '회원 등록이 완료되었습니다.' }),
                                            DashboardActions.finishDirectRegisterMember({ createdUser }),
                                        ]
                                    })
                                )
                        } else {
                            callback ? callback() : null
                            return [
                                showToast({ text: '회원 등록이 완료되었습니다.' }),
                                DashboardActions.finishDirectRegisterMember({ createdUser }),
                            ]
                        }
                    }),
                    catchError((err: string) => {
                        callback ? callback() : null
                        return of(DashboardActions.error({ error: err }))
                    })
                )
            )
        )
    )

    public getUserData = createEffect(() =>
        this.actions$.pipe(
            ofType(DashboardActions.startGetUserData),
            switchMap(({ centerId, centerUser }) =>
                forkJoin({
                    // lockers: this.centerUsersLockerApi.getLockerTickets(centerId, centerUser.id),
                    memberships: this.centerUsersMembershipApi.getMembershipTickets(centerId, centerUser.id),
                    // payments: this.centerUsersPaymentApi.getPayments(centerId, centerUser.id),
                    // reservations: []
                }).pipe(
                    switchMap(({ memberships }) => {
                        return [DashboardActions.finishGetUserData({ memberships })]
                    })
                )
            ),
            catchError((err: string) => of(DashboardActions.error({ error: err })))
        )
    )
}
