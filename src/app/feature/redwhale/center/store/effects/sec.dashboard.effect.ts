import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, forkJoin } from 'rxjs'
import { catchError, switchMap, tap, map, find } from 'rxjs/operators'

import _ from 'lodash'

import * as DashboardActions from '../actions/sec.dashboard.actions'
import * as DashboardReducer from '../reducers/sec.dashboard.reducer'
import * as DashboardSelector from '../selectors/sec.dashoboard.selector'

import { showToast } from '@appStore/actions/toast.action'

import { CenterUsersService } from '@services/center-users.service'
import { FileService } from '@services/file.service'
import { CenterUsersLockerService } from '@services/center-users-locker.service.service'
import { CenterUsersMembershipService } from '@services/center-users-membership.service'
import { CenterUsersPaymentService } from '@services/center-users-payment.service'
import { CenterUsersBookingService } from '@services/center-users-booking.service'
import { CenterService, DelegateRequestBody } from '@services/center.service'

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
        private centerUsersPaymentApi: CenterUsersPaymentService,
        private centerUsersBookingService: CenterUsersBookingService,
        private centerService: CenterService
    ) {}

    public loadMemberList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DashboardActions.startLoadMemberList),
            switchMap(({ centerId }) =>
                this.centerUsersApi.getUserList(centerId, 'all').pipe(
                    map((memberlist) => {
                        const userListValue: DashboardReducer.UsersListValue = memberlist.map((v) => ({
                            user: v,
                            holdSelected: false,
                        }))
                        // usersSelectCateg.member.userSize = usersList['member'].length
                        return DashboardActions.finishLoadMemberList({
                            categ_type: 'member',
                            userListValue,
                        })
                    }),
                    catchError((err: string) => of(DashboardActions.error({ error: err })))
                )
            )
        )
    )

    getUsersByCategory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DashboardActions.startGetUsersByCategory),
            switchMap(({ centerId }) =>
                this.centerUsersApi.getUsersByCategory(centerId).pipe(
                    map((usersByCategs) => {
                        const userSelectCateg = {} as DashboardReducer.UsersSelectCateg
                        usersByCategs.forEach((usersByCateg) => {
                            const type = DashboardReducer.matchUsersCategoryTo(usersByCateg.category_code)
                            userSelectCateg[type] = {
                                name: usersByCateg.category_name,
                                userSize: usersByCateg.user_count,
                            }
                        })
                        console.log(
                            ' DashboardActions.startGetUsersByCategory effect : ',
                            userSelectCateg,
                            ' - ',
                            usersByCategs
                        )
                        return DashboardActions.finishGetUsersByCategory({ userSelectCateg })
                    })
                )
            )
        )
    )

    getUserList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DashboardActions.startGetUserList),
            switchMap(({ centerId, categ_type }) =>
                this.centerUsersApi.getUserList(centerId, DashboardReducer.matchMemberSelectCategTo(categ_type)).pipe(
                    map((memberlist) => {
                        const userListValue: DashboardReducer.UsersListValue = memberlist.map((v) => ({
                            user: v,
                            holdSelected: false,
                        }))
                        // usersSelectCateg.member.userSize = usersList['member'].length
                        return DashboardActions.finishLoadMemberList({
                            categ_type: categ_type,
                            userListValue,
                        })
                    }),
                    catchError((err: string) => of(DashboardActions.error({ error: err })))
                )
            )
        )
    )

    public refreshCenterUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DashboardActions.startRefreshCenterUser),
            concatLatestFrom(() => [this.store.select(DashboardSelector.curUserListSelect)]),
            switchMap(([{ centerId, centerUser }, userListSelect]) =>
                forkJoin({
                    userInCategory: this.centerUsersApi
                        .getUserList(centerId, DashboardReducer.matchMemberSelectCategTo(userListSelect.key))
                        .pipe(map((users) => _.find(users, (user) => user.id == centerUser.id))),
                    userInAll: this.centerUsersApi
                        .getUserList(centerId, '', centerUser.center_user_name)
                        .pipe(map((users) => _.find(users, (user) => user.id == centerUser.id))),
                }).pipe(
                    switchMap(({ userInCategory, userInAll }) => {
                        return [
                            DashboardActions.finishRefreshCenterUser({
                                categ_type: userListSelect.key,
                                refreshCenterUser: userInAll,
                                isUserInCurCateg: !_.isEmpty(userInCategory),
                            }),
                        ]
                    })
                )
            )
        )
    )

    public refreshMyCenterUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DashboardActions.startRefreshMyCenterUser),
            concatLatestFrom(() => [
                this.store.select(DashboardSelector.curUserListSelect),
                this.store.select(DashboardSelector.isLoading),
            ]),
            switchMap(([{ centerId, user }, userListSelect, isLoading]) => {
                if (isLoading == 'idle' || _.isEmpty(centerId)) {
                    return []
                } else {
                    return forkJoin({
                        userInCategory: this.centerUsersApi
                            .getUserList(centerId, DashboardReducer.matchMemberSelectCategTo(userListSelect.key))
                            .pipe(map((users) => _.find(users, (user) => user.id == user.id))),
                        userInAll: this.centerUsersApi
                            .getUserList(centerId, '', user.name)
                            .pipe(map((users) => _.find(users, (user) => user.id == user.id))),
                    }).pipe(
                        switchMap(({ userInCategory, userInAll }) => {
                            return [
                                DashboardActions.finishRefreshMyCenterUser({
                                    categ_type: userListSelect.key,
                                    refreshCenterUser: userInAll,
                                    isUserInCurCateg: !_.isEmpty(userInCategory),
                                }),
                            ]
                        })
                    )
                }
            })
        )
    )

    public directRegisterMember$ = createEffect(() =>
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
                    lockers: this.centerUsersLockerApi.getLockerTickets(centerId, centerUser.id),
                    memberships: this.centerUsersMembershipApi.getMembershipTickets(centerId, centerUser.id),
                    payments: this.centerUsersPaymentApi.getPayments(centerId, centerUser.id),
                    // reservations: this.centerUsersBookingService.getBookings(centerId, centerUser.id),
                }).pipe(
                    switchMap(({ memberships, lockers, payments }) => {
                        return [
                            DashboardActions.finishGetUserData({
                                memberships,
                                lockers,
                                payments,
                                reservations: [],
                            }),
                        ]
                    })
                )
            ),
            catchError((err: string) =>
                of(
                    DashboardActions.error({ error: err }),
                    DashboardActions.finishGetUserData({ memberships: [], lockers: [], payments: [], reservations: [] })
                )
            )
        )
    )

    public setCurUserMemo = createEffect(
        () =>
            this.actions$.pipe(
                ofType(DashboardActions.startSetCurUserData),
                switchMap(({ centerId, reqBody, userId, callback }) =>
                    this.centerUsersApi.updateUser(centerId, userId, reqBody).pipe(
                        tap(() => {
                            callback ? callback() : null
                        })
                    )
                ),
                catchError((err: string) => of(DashboardActions.error({ error: err })))
            ),
        { dispatch: false }
    )

    public delegate = createEffect(
        () =>
            this.actions$.pipe(
                ofType(DashboardActions.startDelegate),
                switchMap(({ centerId, reqBody, callback }) =>
                    this.centerService.delegate(centerId, reqBody).pipe(
                        tap(() => {
                            callback ? callback() : null
                        })
                    )
                ),
                catchError((err: string) => of(DashboardActions.error({ error: err })))
            ),
        { dispatch: false }
    )

    public removeCurUserProfile = createEffect(() =>
        this.actions$.pipe(
            ofType(DashboardActions.startRemoveCurUserProfile),
            switchMap(({ profileUrl, centerId, userId, callback }) =>
                this.fileApi.deleteFile(profileUrl).pipe(
                    switchMap(() =>
                        this.fileApi.getFile('file_type_center_user_picture', centerId, userId).pipe(
                            switchMap((profiles) => {
                                const profileUrl = profiles.length == 0 ? null : profiles[0].url
                                callback ? callback() : null
                                return [DashboardActions.finishRemoveCurUserProfile({ userId, profileUrl })]
                            })
                        )
                    )
                )
            ),
            catchError((err: string) => of(DashboardActions.error({ error: err })))
        )
    )

    public registerUserProfile = createEffect(() =>
        this.actions$.pipe(
            ofType(DashboardActions.startRegisterCurUserProfile),
            switchMap(({ reqBody, profile, userId, callback }) =>
                this.fileApi.createFile(reqBody, profile).pipe(
                    switchMap((profile) => {
                        callback ? callback() : null
                        return [
                            DashboardActions.finishRegisterCurUserProfile({
                                userId: userId,
                                profileUrl: profile[0].url,
                            }),
                        ]
                    })
                )
            ),
            catchError((err: string) => of(DashboardActions.error({ error: err })))
        )
    )
}
