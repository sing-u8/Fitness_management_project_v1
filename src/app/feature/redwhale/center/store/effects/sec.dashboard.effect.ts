import { Injectable } from '@angular/core'
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { EMPTY, forkJoin, from, of } from 'rxjs'
import { catchError, map, switchMap, tap } from 'rxjs/operators'

import _ from 'lodash'
import dayjs from 'dayjs'

import * as DashboardActions from '../actions/sec.dashboard.actions'
import * as DashboardReducer from '../reducers/sec.dashboard.reducer'
import * as DashboardSelector from '../selectors/sec.dashboard.selector'

import { showToast } from '@appStore/actions/toast.action'

import { CenterUsersService } from '@services/center-users.service'
import { FileService } from '@services/file.service'
import { CenterUsersLockerService } from '@services/center-users-locker.service.service'
import { CenterUsersMembershipService } from '@services/center-users-membership.service'
import { CenterUsersPaymentService } from '@services/center-users-payment.service'
import { CenterUsersBookingService } from '@services/center-users-booking.service'
import { CenterService } from '@services/center.service'
import { CenterHoldingService } from '@services/center-holding.service'
import { CenterContractService } from '@services/center-users-contract.service'

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
        private centerService: CenterService,
        private centerHoldingApi: CenterHoldingService,
        private centerContractApi: CenterContractService
    ) {}

    public setCurCenterUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DashboardActions.startSetUserInCenter),
            switchMap(({ centerId, user }) => {
                return this.centerUsersApi.getUserList(centerId).pipe(
                    switchMap((centerUsers) => {
                        const centerUser = _.find(centerUsers, (v) => v.id == user.id)
                        return [DashboardActions.finishSetUserInCenter({ centerUser })]
                    })
                )
            })
        )
    )

    public loadMemberList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DashboardActions.startLoadMemberList),
            switchMap(({ centerId, cb }) =>
                this.centerUsersApi.getUserList(centerId, 'all').pipe(
                    map((memberlist) => {
                        const userListValue: DashboardReducer.UsersListValue = memberlist.map((v) => ({
                            user: v,
                            holdSelected: false,
                        }))
                        // usersSelectCateg.member.userSize = usersList['member'].length
                        cb ? cb(memberlist[0]) : null
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
                        return DashboardActions.finishGetUsersByCategory({ userSelectCateg })
                    })
                )
            )
        )
    )

    getUserList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DashboardActions.startGetUserList),
            concatLatestFrom(() => [this.store.select(DashboardSelector.usersLists)]),
            switchMap(([{ centerId, categ_type }, usersLists]) =>
                this.centerUsersApi.getUserList(centerId, DashboardReducer.matchMemberSelectCategTo(categ_type)).pipe(
                    map((memberlist) => {
                        const userListValue: DashboardReducer.UsersListValue = memberlist.map((v) => {
                            const user = usersLists[categ_type].find((ud) => ud.user.id == v.id)
                            return {
                                user: v,
                                holdSelected: user != undefined ? user.holdSelected : false,
                            }
                        })
                        // usersSelectCateg.member.userSize = usersList['member'].length
                        return DashboardActions.finishGetUserList({
                            centerId,
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
                forkJoin([
                    this.centerUsersApi
                        .getUserList(centerId, DashboardReducer.matchMemberSelectCategTo(userListSelect.key))
                        .pipe(map((users) => _.find(users, (user) => user.id == centerUser.id))),
                    this.centerUsersApi
                        .getUserList(centerId, '', centerUser.center_user_name)
                        .pipe(map((users) => _.find(users, (user) => user.id == centerUser.id))),
                ]).pipe(
                    switchMap(([userInCategory, userInAll]) => {
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
                                            DashboardActions.finishDirectRegisterMember({ createdUser, centerId }),
                                        ]
                                    })
                                )
                        } else {
                            callback ? callback() : null
                            return [
                                showToast({ text: '회원 등록이 완료되었습니다.' }),
                                DashboardActions.finishDirectRegisterMember({ createdUser, centerId }),
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
                forkJoin([
                    this.centerUsersLockerApi.getLockerTickets(centerId, centerUser.id),
                    this.centerUsersMembershipApi.getMembershipTickets(centerId, centerUser.id),
                    this.centerUsersPaymentApi.getPayments(centerId, centerUser.id),
                    this.centerUsersBookingService.getBookings(centerId, centerUser.id),
                    this.centerContractApi.getContract(centerId, centerUser.id),
                ]).pipe(
                    switchMap(([lockers, memberships, payments, reservations, contracts]) => {
                        return [
                            DashboardActions.finishGetUserData({
                                memberships,
                                lockers,
                                payments,
                                reservations,
                                contracts,
                            }),
                        ]
                    })
                )
            ),
            catchError((err: string) =>
                of(
                    DashboardActions.error({ error: err }),
                    DashboardActions.finishGetUserData({
                        memberships: [],
                        lockers: [],
                        payments: [],
                        reservations: [],
                        contracts: [],
                    })
                )
            )
        )
    )

    public setCurUserMemo = createEffect(
        () =>
            this.actions$.pipe(
                ofType(DashboardActions.startSetCurUserData),
                switchMap(({ centerId, reqBody, userId, callback, blockEffect }) => {
                    if (blockEffect) {
                        callback ? callback() : null
                        return [EMPTY]
                    } else {
                        return this.centerUsersApi.updateUser(centerId, userId, reqBody).pipe(
                            tap(() => {
                                callback ? callback() : null
                            })
                        )
                    }
                }),
                catchError((err: string) => of(DashboardActions.error({ error: err })))
            ),
        { dispatch: false }
    )

    public delegate$ = createEffect(
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

    public exportMember$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(DashboardActions.startExportMember),
                switchMap(({ centerId, userId, callback }) =>
                    this.centerUsersApi.exportUser(centerId, userId).pipe(
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
                        this.fileApi
                            .getFile({
                                type_code: 'file_type_center_user_picture',
                                center_id: centerId,
                                center_user_id: userId,
                            })
                            .pipe(
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

    public centerHolding$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(DashboardActions.startCenterHolding),
                concatLatestFrom(() => [
                    this.store.select(DashboardSelector.usersLists),
                    this.store.select(DashboardSelector.curUserListSelect),
                    this.store.select(DashboardSelector.curUserData),
                ]),
                switchMap(([{ centerId, cb, reqBody }, userLists, curUserListSelect, curUserData]) => {
                    const user_ids = userLists[curUserListSelect.key]
                        .filter((v) => v.holdSelected)
                        .map((v) => v.user.id)
                    return this.centerHoldingApi
                        .centerHolding(centerId, {
                            ...reqBody,
                            user_ids,
                        })
                        .pipe(
                            switchMap((profile) => {
                                cb ? cb() : null
                                let toastText =
                                    `${user_ids.length}명의 회원권` +
                                    (reqBody.user_locker_included ? '/ 락커' : '') +
                                    ' 홀딩이 '
                                toastText =
                                    toastText +
                                    (dayjs().isBefore(reqBody.start_date) ? '예약되었습니다.' : '완료되었습니다.')
                                return [
                                    DashboardActions.startGetUserData({ centerId, centerUser: curUserData.user }),
                                    showToast({ text: toastText }),
                                ]
                            })
                        )
                }),
                catchError((err: string) => of(DashboardActions.error({ error: err })))
            )
        // { dispatch: false }
    )

    // api가 이상해서 임의로 짠 코드  -- 수정 필요
    public signContract$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DashboardActions.startContractSign),
            switchMap(({ centerId, centerContractId, centerUserId, signUrl, cb }) =>
                from(this.fileApi.urlToFileList(signUrl, 'signData')).pipe(
                    switchMap((fileList) => {
                        return this.fileApi
                            .createFile(
                                {
                                    type_code: 'file_type_center_contract',
                                    center_id: centerId,
                                    center_user_id: centerUserId,
                                    center_contract_id: centerContractId,
                                },
                                fileList
                            )
                            .pipe(
                                switchMap((files) => {
                                    cb ? cb() : null
                                    return [DashboardActions.finishContractSign({ file: files[0], centerContractId })]
                                })
                            )
                    })
                )
            ),
            catchError((err: string) => of(DashboardActions.error({ error: err })))
        )
    )

    // synchronize dashboard data
    // // by locker
    public startSynchronizeUserLocker$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DashboardActions.startSynchronizeUserLocker),
            concatLatestFrom(() => [
                this.store.select(DashboardSelector.curCenterId),
                this.store.select(DashboardSelector.curUserData),
            ]),
            switchMap(([{ centerId, userId }, curCenterId, curUserData]) => {
                if (
                    !_.isEmpty(curCenterId) &&
                    !_.isEmpty(curUserData) &&
                    centerId == curCenterId &&
                    userId == curUserData.user.id
                ) {
                    return forkJoin([
                        this.centerUsersLockerApi.getLockerTickets(centerId, curUserData.user.id),
                        this.centerUsersPaymentApi.getPayments(centerId, curUserData.user.id),
                        this.centerContractApi.getContract(centerId, curUserData.user.id),
                    ]).pipe(
                        switchMap(([lockers, payments, contracts]) => {
                            return [
                                DashboardActions.finishSynchronizeUserLocker({
                                    success: true,
                                    lockers,
                                    payments,
                                    contracts,
                                }),
                            ]
                        })
                    )
                } else {
                    return [DashboardActions.finishSynchronizeUserLocker({ success: false })]
                }
            }),
            catchError((err: string) => of(DashboardActions.error({ error: err })))
        )
    )

    // // // -- drawer
    getDrawerUsersByCategory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DashboardActions.startGetDrawerUsersByCategory),
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
                        return DashboardActions.finishGetDrawerUsersByCategory({ userSelectCateg })
                    })
                )
            )
        )
    )

    getDrawerUserList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DashboardActions.startGetDrawerUserList),
            concatLatestFrom(() => [this.store.select(DashboardSelector.drawerUsersLists)]),
            switchMap(([{ centerId, categ_type }, usersLists]) =>
                this.centerUsersApi.getUserList(centerId, DashboardReducer.matchMemberSelectCategTo(categ_type)).pipe(
                    map((memberlist) => {
                        const userListValue: DashboardReducer.UsersListValue = memberlist.map((v) => {
                            const user = usersLists[categ_type].find((ud) => ud.user.id == v.id)
                            return {
                                user: v,
                                holdSelected: user != undefined ? user.holdSelected : false,
                            }
                        })
                        // usersSelectCateg.member.userSize = usersList['member'].length
                        return DashboardActions.finishGetDrawerUserList({
                            centerId,
                            categ_type: categ_type,
                            userListValue,
                        })
                    }),
                    catchError((err: string) => of(DashboardActions.error({ error: err })))
                )
            )
        )
    )

    public drawerCenterHolding$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DashboardActions.startDrawerCenterHolding),
            concatLatestFrom(() => [
                this.store.select(DashboardSelector.drawerUsersLists),
                this.store.select(DashboardSelector.drawerCurUserListSelect),
            ]),
            switchMap(([{ centerId, cb, reqBody }, userLists, curUserListSelect]) => {
                const user_ids = userLists[curUserListSelect.key].filter((v) => v.holdSelected).map((v) => v.user.id)
                return this.centerHoldingApi
                    .centerHolding(centerId, {
                        ...reqBody,
                        user_ids,
                    })
                    .pipe(
                        switchMap(() => {
                            cb ? cb() : null
                            let toastText =
                                `${user_ids.length}명의 회원권` +
                                (reqBody.user_locker_included ? '/ 락커' : '') +
                                ' 홀딩이 '
                            toastText =
                                toastText +
                                (dayjs().isBefore(reqBody.start_date) ? '예약되었습니다.' : '완료되었습니다.')
                            return [showToast({ text: toastText })]
                        })
                    )
            }),
            catchError((err: string) => of(DashboardActions.error({ error: err })))
        )
    )

    public setDrawerCurUserMemo = createEffect(
        () =>
            this.actions$.pipe(
                ofType(DashboardActions.startSetDrawerCurUserData),
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

    public refreshDrawerCenterUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DashboardActions.startRefreshDrawerCenterUser),
            concatLatestFrom(() => [this.store.select(DashboardSelector.drawerCurUserListSelect)]),
            switchMap(([{ centerId, centerUser }, userListSelect]) =>
                forkJoin([
                    this.centerUsersApi
                        .getUserList(centerId, DashboardReducer.matchMemberSelectCategTo(userListSelect.key))
                        .pipe(map((users) => _.find(users, (user) => user.id == centerUser.id))),
                    this.centerUsersApi
                        .getUserList(centerId, '', centerUser.center_user_name)
                        .pipe(map((users) => _.find(users, (user) => user.id == centerUser.id))),
                ]).pipe(
                    switchMap(([userInCategory, userInAll]) => {
                        return [
                            DashboardActions.finishRefreshDrawerCenterUser({
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
}

/*

.pipe(
                        switchMap(
                            (_) => {
                                cb ? cb() : null
                                return [DashboardActions.startGetUserData({ centerId, centerUser })]
                            }
                            // this.fileApi
                            //     .getFile({
                            //         type_code: 'file_type_center_contract',
                            //         center_id: centerId,
                            //         center_user_id: centerUserId,
                            //         center_contract_id: centerContractId,
                            //     })
                            //     .pipe(
                            //         map((files) => {
                            //             cb ? cb() : null
                            //             return DashboardActions.finishContractSign({ file: files[0], centerContractId })
                            //         })
                            //     )
                        )
                    )
 */
