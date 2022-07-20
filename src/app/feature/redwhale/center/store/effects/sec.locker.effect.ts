import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { forkJoin, of } from 'rxjs'
import { catchError, switchMap, map, exhaustMap, tap, mergeMap } from 'rxjs/operators'

import { showToast } from '@appStore/actions/toast.action'

import * as LockerActions from '../actions/sec.locker.actions'
import * as LockerSelector from '../selectors/sec.locker.selector'

import { CenterLockerService } from '@services/center-locker.service'
import { CenterUsersLockerService } from '@services/center-users-locker.service.service'
import { StorageService } from '@services/storage.service'

import _ from 'lodash'

@Injectable()
export class LockerEffect {
    constructor(
        private actions$: Actions,
        private store: Store,
        private centerLokcerApi: CenterLockerService,
        private centerUsersLockerApi: CenterUsersLockerService,
        private storageService: StorageService
    ) {}

    // locker state entity
    public loadLockerCategs$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LockerActions.startLoadLockerCategs),
            switchMap(({ centerId }) =>
                this.centerLokcerApi.getCategoryList(centerId).pipe(
                    switchMap((categs) => {
                        if (categs.length > 0) {
                            return [
                                LockerActions.finishLoadLockerCategs({ lockerCategList: categs }),
                                LockerActions.setCurLockerCateg({ lockerCateg: categs[0] }),
                                LockerActions.startGetLockerItemList({ centerId, categoryId: categs[0].id }),
                            ]
                        } else {
                            return [LockerActions.finishLoadLockerCategs({ lockerCategList: categs })]
                        }
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
    public getLockerItemList$ = createEffect(() =>
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

    public getItemUserLocker$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LockerActions.startSetCurLockerItem),
            concatLatestFrom(() => [
                this.store.select(LockerSelector.curCenterId),
                this.store.select(LockerSelector.curLockerCateg),
            ]),
            switchMap(([{ lockerItem }, centerId, lockerCateg]) => {
                if (_.isEmpty(lockerItem.user_locker_center_user_name)) {
                    return [LockerActions.finishSetCurLockerItem({ userLocker: undefined })]
                } else {
                    return this.centerLokcerApi
                        .getItemUserLocker(centerId, lockerCateg.id, lockerItem.id)
                        .pipe(switchMap((userLocker) => [LockerActions.finishSetCurLockerItem({ userLocker })]))
                }
            })
        )
    )

    // !! replaced with locker component method --> modifying
    public createLockerItem$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(LockerActions.startCreateLockerItem),
                mergeMap(({ centerId, categoryId, reqBody, cbFn }) => {
                    return this.centerLokcerApi.createItem(centerId, categoryId, reqBody).pipe(
                        switchMap((lockerItem) => {
                            return [LockerActions.finishCreateLockerItem({ lockerItem })]
                        }),
                        catchError((err: string) => of(LockerActions.error({ error: err })))
                    )
                })
            )
        // { dispatch: false }
    )

    public updateLockerItem = createEffect(
        () =>
            this.actions$.pipe(
                ofType(LockerActions.startUpdateLockerItem),
                map(({ centerId, categoryId, itemId, reqBody }) => {
                    console.log('LockerActions.startUpdateLockerItem in effect : ', itemId, ' -- ', reqBody)
                    this.centerLokcerApi
                        .updateItem(centerId, categoryId, itemId, reqBody)
                        .pipe(catchError((err: string) => of(LockerActions.error({ error: err }))))
                        .subscribe()
                })
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
            switchMap(({ centerId, registerMemberId, createLockerTicketReqBody, cb }) =>
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
                                    cb ? cb() : null
                                    return [
                                        LockerActions.finishCreateLockerTicket({
                                            lockerItems,
                                            lockerItem: updatedLockerItem,
                                            userLocker: resUserLocker,
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
            switchMap(({ centerId, userId, lockerTicketId, reqBody, cb }) =>
                this.centerUsersLockerApi.refundLockerTicket(centerId, userId, lockerTicketId, reqBody).pipe(
                    concatLatestFrom(() => [
                        this.store.select(LockerSelector.curLockerCateg),
                        this.store.select(LockerSelector.curLockerItem),
                    ]),
                    switchMap(([__, curLockerCateg, curLockerItem]) => {
                        return this.centerLokcerApi.getItemList(centerId, curLockerCateg.id).pipe(
                            switchMap((lockerItems) => {
                                const updatedLockerItem = _.find(lockerItems, (item) => item.id == curLockerItem.id)
                                cb ? cb() : null
                                return [
                                    LockerActions.finishRefundLockerTicket({
                                        lockerItems,
                                        lockerItem: updatedLockerItem,
                                    }),
                                    LockerActions.startSetCurLockerItem({ lockerItem: updatedLockerItem }),
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

    public expireLockerTicket = createEffect(() =>
        this.actions$.pipe(
            ofType(LockerActions.startExpireLockerTicket),
            switchMap(({ centerId, userId, lockerTicketId, reqBody, cb }) =>
                this.centerUsersLockerApi.expireLockerTicket(centerId, userId, lockerTicketId, reqBody).pipe(
                    concatLatestFrom(() => [
                        this.store.select(LockerSelector.curLockerCateg),
                        this.store.select(LockerSelector.curLockerItem),
                    ]),
                    switchMap(([__, curLockerCateg, curLockerItem]) => {
                        return this.centerLokcerApi.getItemList(centerId, curLockerCateg.id).pipe(
                            switchMap((lockerItems) => {
                                const updatedLockerItem = _.find(lockerItems, (item) => item.id == curLockerItem.id)
                                cb ? cb() : null
                                return [
                                    LockerActions.finishExpireLockerTicket({
                                        lockerItems,
                                        lockerItem: updatedLockerItem,
                                    }),
                                    LockerActions.startSetCurLockerItem({ lockerItem: updatedLockerItem }),
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

    public extendLockerTicket = createEffect(() =>
        this.actions$.pipe(
            ofType(LockerActions.startExtendLockerTicket),
            switchMap(({ centerId, userId, lockerTicketId, reqBody, cb }) =>
                this.centerUsersLockerApi.extendLockerTicket(centerId, userId, lockerTicketId, reqBody).pipe(
                    concatLatestFrom(() => [
                        this.store.select(LockerSelector.curLockerCateg),
                        this.store.select(LockerSelector.curLockerItem),
                    ]),
                    switchMap(([extendedUserLocker, curLockerCateg, curLockerItem]) => {
                        return this.centerLokcerApi.getItemList(centerId, curLockerCateg.id).pipe(
                            switchMap((lockerItems) => {
                                const extendLockerItem = _.find(lockerItems, (item) => item.id == curLockerItem.id)
                                cb ? cb() : null
                                return [
                                    LockerActions.finishExtendLockerTicket({
                                        lockerItems,
                                        lockerItem: extendLockerItem,
                                        extendedUserLocker,
                                    }),
                                    showToast({
                                        text: `[락커 ${extendLockerItem.name}] 만료일이 변경되었습니다.`,
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
                                                    text: `${curLockerItem.user_locker_center_user_name}님의 자리가 '[락커 ${movedLockerItem.name}]'으로 이동되었습니다.`,
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
