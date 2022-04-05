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
import { SecLockerStateService } from '@services/state/redwhale/center/sec-locker-state.service'

import _ from 'lodash'

@Injectable()
export class LockerEffect {
    constructor(
        private actions$: Actions,
        private store: Store,
        private centerLokcerApi: CenterLockerService,
        private usersLockerApi: UsersLockerService,
        private centerUsersLockerApi: CenterUsersLockerService,
        private lockerSerState: SecLockerStateService
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

    public createLockerItem = createEffect(() =>
        this.actions$.pipe(
            ofType(LockerActions.startCreateLockerItem),
            exhaustMap(({ centerId, categoryId, reqBody }) =>
                this.centerLokcerApi.createItem(centerId, categoryId, reqBody).pipe(
                    map((lockerItem) => {
                        console.log('new Locker Item : ', lockerItem)
                        return LockerActions.finishCreateLockerItem({ lockerItem: lockerItem })
                    }),
                    catchError((err: string) => of(LockerActions.error({ error: err })))
                )
            )
        )
    )

    public updateLockerItem = createEffect(() =>
        this.actions$.pipe(
            ofType(LockerActions.startUpdateLockerItem),
            switchMap(({ centerId, categoryId, itemId, reqBody }) =>
                this.centerLokcerApi.updateItem(centerId, categoryId, itemId, reqBody).pipe(
                    map((lockerItem) => {
                        // this.setLockerItemList(list)
                        return LockerActions.finishUpdateLockerItem({ lockerItem })
                    }),
                    catchError((err: string) => of(LockerActions.error({ error: err })))
                )
            )
        )
    )

    public deleteLockerItem = createEffect(() =>
        this.actions$.pipe(
            ofType(LockerActions.startDeleteLockerItem),
            switchMap(({ centerId, categoryId, itemId, itemName }) =>
                this.centerLokcerApi.deleteItem(centerId, categoryId, itemId).pipe(
                    switchMap((_) => {
                        return [
                            LockerActions.finishDeleteLockerItem(),
                            showToast({ text: `[락커${itemName}] 삭제되었습니다.` }),
                        ]
                    }),
                    catchError((err: string) => of(LockerActions.error({ error: err })))
                )
            )
        )
    )

    // locker ticket
    public createLockerTicket = createEffect(() =>
        this.actions$.pipe(
            ofType(LockerActions.startCreateLockerTicket),
            switchMap(({ centerId, registerMemberId, createLockerTicketReqBody, createLockerTicketUnpaidReqBody }) =>
                this.centerUsersLockerApi
                    .createLockerTicket(centerId, registerMemberId, createLockerTicketReqBody)
                    .pipe(
                        concatLatestFrom(() => this.store.select(LockerSelector.curLockerCateg)),
                        switchMap(([resUserLocker, curLockerCateg]) =>
                            iif(
                                () => createLockerTicketUnpaidReqBody.amount > 0,
                                this.centerUsersLockerApi
                                    .createLockerTicketUnpaid(
                                        centerId,
                                        registerMemberId,
                                        resUserLocker.id,
                                        createLockerTicketUnpaidReqBody
                                    )
                                    .pipe(map(() => 'nothing')),
                                of('nothing')
                            ).pipe(
                                switchMap((__) => {
                                    return this.centerLokcerApi.getItemList(centerId, curLockerCateg.id).pipe(
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
}
