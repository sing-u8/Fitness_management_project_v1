import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, EMPTY, iif } from 'rxjs'
import { catchError, switchMap, tap, map, exhaustMap, mapTo } from 'rxjs/operators'

import { showToast } from '@appStore/actions/toast.action'

import * as LockerActions from '../actions/sec.locker.actions'
import * as LockerSelector from '../selectors/sec.locker.selector'

import { LockerCategory } from '@schemas/locker-category'
import { LockerItem } from '@schemas/locker-item'

import { CenterLockerService } from '@services/center-locker.service'
import { UsersLockerService } from '@services/users-locker.service'
import { CenterUsersLockerService } from '@services/center-users-locker.service.service'
import { StorageService } from '@services/storage.service'

import _ from 'lodash'

@Injectable()
export class LockerEffect {
    constructor(
        private actions$: Actions,
        private store: Store,
        private centerLokcerApi: CenterLockerService,
        private usersLockerApi: UsersLockerService,
        private centerUsersLockerApi: CenterUsersLockerService,
        private storageService: StorageService
    ) {}

    // locker state entity
    public loadLockerCategs$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LockerActions.startLoadLockerCategs),
            switchMap(({ centerId }) =>
                this.centerLokcerApi.getCategoryList(centerId).pipe(
                    map((categs) => {
                        return LockerActions.finishLoadLockerCategs({ lockerCategList: categs })
                    }),
                    catchError((err: string) => of(LockerActions.error({ error: err })))
                )
            )
        )
    )

    // locker category
    public createLockerCateg = createEffect(() =>
        this.actions$.pipe(
            ofType(LockerActions.startCreateLockerCateg),
            switchMap(({ centerId, categName }) =>
                this.centerLokcerApi.createCategory(centerId, { name: categName }).pipe(
                    switchMap((categ) => {
                        return [
                            LockerActions.finishCreateLockerCateg({ lockerCateg: categ }),
                            LockerActions.startGetLockerItemList({ centerId: centerId, categoryId: categ.id }),
                        ]
                    }),
                    catchError((err: string) => of(LockerActions.error({ error: err })))
                )
            )
        )
    )

    public deleteLockerCateg = createEffect(() =>
        this.actions$.pipe(
            ofType(LockerActions.startDeleteLockerCategory),
            switchMap(({ centerId, categoryId }) =>
                this.centerLokcerApi.deleteCategory(centerId, categoryId).pipe(
                    switchMap((_) => {
                        return [
                            LockerActions.finishDeleteLockerCategory({ deletedCategId: categoryId }),
                            showToast({ text: '카테고리가 삭제되었습니다.' }),
                        ]
                    }),
                    catchError((err: string) => of(LockerActions.error({ error: err })))
                )
            )
        )
    )

    public updateLockerCateg = createEffect(() =>
        this.actions$.pipe(
            ofType(LockerActions.startUpdateLockerCategory),
            switchMap(({ centerId, categoryId, updateName }) =>
                this.centerLokcerApi.updateCategory(centerId, categoryId, { name: updateName }).pipe(
                    map((_) => {
                        return LockerActions.finishUpdateLockerCategory()
                    }),
                    catchError((err: string) => of(LockerActions.error({ error: err })))
                )
            )
        )
    )

    // locker item
    public getLockerItemList = createEffect(() =>
        this.actions$.pipe(
            ofType(LockerActions.startGetLockerItemList),
            switchMap(({ centerId, categoryId }) =>
                this.centerLokcerApi.getItemList(centerId, categoryId).pipe(
                    map((lockerItems) => {
                        return LockerActions.finishGetLockerItemList({ lockerItems: lockerItems })
                    }),
                    catchError((err: string) => of(LockerActions.error({ error: err })))
                )
            )
        )
    )

    // !! replaced with locker component method
    // public createLockerItem = createEffect(
    //     () =>
    //         this.actions$.pipe(
    //             ofType(LockerActions.startCreateLockerItem),
    //             exhaustMap(({ centerId, categoryId, reqBody, cbFn }) => {
    //                 console.log('startCreateLockerItem in EFFECT!!!!')
    //                 return this.centerLokcerApi.createItem(centerId, categoryId, reqBody).pipe(
    //                     tap((lockerItem) => {
    //                         console.log('startCreateLockerItem AND After createItem API in EFFECT!!!!')
    //                         cbFn(lockerItem)
    //                     }),
    //                     catchError((err: string) => of(LockerActions.error({ error: err })))
    //                 )
    //             })
    //         ),
    //     { dispatch: false }
    // )

    public updateLockerItem = createEffect(
        () =>
            this.actions$.pipe(
                ofType(LockerActions.startUpdateLockerItem),
                switchMap(({ centerId, categoryId, itemId, reqBody }) =>
                    this.centerLokcerApi
                        .updateItem(centerId, categoryId, itemId, reqBody)
                        .pipe(catchError((err: string) => of(LockerActions.error({ error: err }))))
                )
            ),
        {
            dispatch: false,
        }
    )

    public deleteLockerItem = createEffect(() =>
        this.actions$.pipe(
            ofType(LockerActions.startDeleteLockerItem),
            switchMap(({ centerId, categoryId, item }) =>
                this.centerLokcerApi.deleteItem(centerId, categoryId, item.id).pipe(
                    switchMap((_) => {
                        return [showToast({ text: `[락커${item.name}] 삭제되었습니다.` })]
                    }),
                    catchError((err: string) => of(LockerActions.error({ error: err })))
                )
            )
        )
    )

    public stopLockerItem = createEffect(
        () =>
            this.actions$.pipe(
                ofType(LockerActions.startStopItem),
                switchMap(({ centerId, categoryId, selectedItem }) =>
                    this.centerLokcerApi
                        .updateItem(centerId, categoryId, selectedItem.id, {
                            state_code: 'locker_item_state_stop_using',
                        })
                        .pipe(catchError((err: string) => of(LockerActions.error({ error: err }))))
                )
            ),
        { dispatch: false }
    )

    public resumeLockerItem = createEffect(
        () =>
            this.actions$.pipe(
                ofType(LockerActions.startResumeItem),
                switchMap(({ centerId, categoryId, selectedItem }) =>
                    this.centerLokcerApi
                        .updateItem(centerId, categoryId, selectedItem.id, {
                            state_code: 'locker_item_state_empty',
                        })
                        .pipe(catchError((err: string) => of(LockerActions.error({ error: err }))))
                )
            ),
        { dispatch: false }
    )

    // locker ticket
    public createLockerTicket = createEffect(() =>
        this.actions$.pipe(
            ofType(LockerActions.startCreateLockerTicket),
            switchMap(({ centerId, registerMemberId, createLockerTicketReqBody }) =>
                this.centerUsersLockerApi
                    .createLockerTicket(centerId, registerMemberId, createLockerTicketReqBody)
                    .pipe(
                        concatLatestFrom(() => this.store.select(LockerSelector.curLockerCateg)),
                        switchMap(([resUserLocker, curLockerCateg]) =>
                            this.centerLokcerApi.getItemList(centerId, curLockerCateg.id).pipe(
                                switchMap((lockerItems) => {
                                    const updatedLockerItem = _.find(
                                        lockerItems,
                                        (item) => item.id == resUserLocker.locker_item_id
                                    )

                                    return [
                                        LockerActions.finishCreateLockerTicket({
                                            lockerItems,
                                            lockerItem: updatedLockerItem,
                                        }),
                                        showToast({
                                            text: `[락커 ${updatedLockerItem.name}]에 회원이 등록되었습니다.`,
                                        }),
                                    ]
                                })
                            )
                        ),

                        catchError((err: string) => of(LockerActions.error({ error: err })))
                    )
            )
        )
    )

    public refundLocketTicket = createEffect(() =>
        this.actions$.pipe(
            ofType(LockerActions.startRefundLockerTicket),
            switchMap(({ centerId, userId, lockerTicketId, reqBody }) =>
                this.centerUsersLockerApi.refundLockerTicket(centerId, userId, lockerTicketId, reqBody).pipe(
                    concatLatestFrom(() => [
                        this.store.select(LockerSelector.curLockerCateg),
                        this.store.select(LockerSelector.curLockerItem),
                    ]),
                    switchMap(([__, curLockerCateg, curLockerItem]) => {
                        return this.centerLokcerApi.getItemList(centerId, curLockerCateg.id).pipe(
                            switchMap((lockerItems) => {
                                const updatedLockerItem = _.find(lockerItems, (item) => item.id == curLockerItem.id)
                                return [
                                    LockerActions.finishRefundLockerTicket({
                                        lockerItems,
                                        lockerItem: updatedLockerItem,
                                    }),
                                    LockerActions.setCurLockerItem({ lockerItem: updatedLockerItem }),
                                    showToast({
                                        text: `[락커 ${updatedLockerItem.name}] 락커 비우기가 완료되었습니다.`,
                                    }),
                                ]
                            })
                        )
                    }),
                    catchError((err: string) => of(LockerActions.error({ error: err })))
                )
            )
        )
    )

    // public expireLockerTicket = createEffect(() => this.actions$.pipe(ofType(LockerActions.startExpireLockerTicket)))

    public moveLockerTicket = createEffect(() =>
        this.actions$.pipe(
            ofType(LockerActions.startMoveLockerTicket),
            switchMap(({ centerId, userId, lockerTicketId, startLockerReqBody }) =>
                this.centerUsersLockerApi.stopLockerTicket(centerId, userId, lockerTicketId).pipe(
                    switchMap((__) =>
                        this.centerUsersLockerApi
                            .startLockerTicket(centerId, userId, lockerTicketId, startLockerReqBody)
                            .pipe(
                                concatLatestFrom(() => [
                                    this.store.select(LockerSelector.curLockerCateg),
                                    this.store.select(LockerSelector.curLockerItem),
                                ]),
                                switchMap(([__, curLockerCateg, curLockerItem]) =>
                                    this.centerLokcerApi.getItemList(centerId, curLockerCateg.id).pipe(
                                        switchMap((lockerItems) => {
                                            const movedLockerItem = _.find(
                                                lockerItems,
                                                (item) => item.id == startLockerReqBody.locker_item_id
                                            )

                                            return [
                                                LockerActions.finishMoveLockerTicket({ lockerItems, movedLockerItem }),
                                                LockerActions.resetWillBeMovedLockerItem(),
                                                LockerActions.setLockerGlobalMode({ lockerMode: 'normal' }),
                                                showToast({
                                                    text: `${curLockerItem.user_locker.user.name}님의 자리가 [락커 ${movedLockerItem.name}]으로 이동되었습니다.`,
                                                }),
                                            ]
                                        })
                                    )
                                )
                            )
                    ),
                    catchError((err: string) => of(LockerActions.error({ error: err })))
                )
            )
        )
    )

    // !! 로그아웃 시에 모든 상태 초기화 시키기
    public moveLockerTicketInDashboard = createEffect(() =>
        this.actions$.pipe(
            ofType(LockerActions.startMoveLockerTicketInDashboard),
            switchMap(({ centerId, userId, lockerTicketId, startLockerReqBody, callback }) =>
                this.centerUsersLockerApi.stopLockerTicket(centerId, userId, lockerTicketId).pipe(
                    switchMap((__) =>
                        this.centerUsersLockerApi
                            .startLockerTicket(centerId, userId, lockerTicketId, startLockerReqBody)
                            .pipe(
                                concatLatestFrom(() => [
                                    this.store.select(LockerSelector.isLoading),
                                    this.store.select(LockerSelector.curLockerCateg),
                                    this.store.select(LockerSelector.curCenterId),
                                ]),
                                switchMap(([__, isLoading, curLockerCateg, curCenterId]) => {
                                    callback()
                                    if (isLoading == 'idle' || curCenterId != centerId) {
                                        return [LockerActions.startLoadLockerCategs({ centerId: centerId })]
                                    } else if (!_.isEmpty(curLockerCateg)) {
                                        return [
                                            LockerActions.startGetLockerItemList({
                                                centerId: centerId,
                                                categoryId: curLockerCateg.id,
                                            }),
                                        ]
                                    } else {
                                        return [LockerActions.resetAll()]
                                    }
                                })
                            )
                    ),
                    catchError((err: string) => of(LockerActions.error({ error: err })))
                )
            )
        )
    )

    public afterRegisterLockerInDashboard = createEffect(() =>
        this.actions$.pipe(
            ofType(LockerActions.startUpdateStateAfterRegisterLockerInDashboard),
            switchMap(() => {
                const center = this.storageService.getCenter()
                return [LockerActions.resetAll(), LockerActions.startLoadLockerCategs({ centerId: center.id })]
            })
        )
    )
    // createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(LockerActions.startUpdateStateAfterRegisterLockerInDashboard),
    //         concatLatestFrom(() => [
    //             this.store.select(LockerSelector.curLockerCateg),
    //             this.store.select(LockerSelector.curLockerItem),
    //             this.store.select(LockerSelector.curCenterId),
    //         ]),
    //         switchMap(([curLocerCateg,  curLockerItem, curCenterId]) =>
    //             iif(
    //                 () => createLockerTicketUnpaidReqBody.amount > 0,
    //                 this.centerUsersLockerApi
    //                     .createLockerTicketUnpaid(
    //                         centerId,
    //                         registerMemberId,
    //                         resUserLocker.id,
    //                         createLockerTicketUnpaidReqBody
    //                     )
    //                     .pipe(map(() => 'nothing')),
    //                 of('nothing')
    //             ).pipe(
    //                 switchMap((__) => {
    //                 }),
    //                 catchError((err: string) => of(LockerActions.error({ error: err })))
    //             )
    //         )
    //     )
    // )
}
