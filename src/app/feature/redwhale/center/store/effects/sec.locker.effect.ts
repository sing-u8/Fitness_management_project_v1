import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, EMPTY } from 'rxjs'
import { catchError, switchMap, tap, map, filter } from 'rxjs/operators'

import * as LockerActions from '../actions/sec.locker.actions'
import * as LockerSelector from '../selectors/sec.locker.selector'

import { LockerCategory } from '@schemas/locker-category'
import { LockerItem } from '@schemas/locker-item'

import { CenterLockerService } from '@services/center-locker.service'
import { UsersLockerService } from '@services/users-locker.service'
import { CenterUsersLockerService } from '@services/center-users-locker.service.service'

import _ from 'lodash'

@Injectable()
export class LockerEffect {
    constructor(
        private actions$: Actions,
        private store: Store,
        private centerLokcerApi: CenterLockerService,
        private usersLockerApi: UsersLockerService,
        private centerUsersLockerApi: CenterUsersLockerService
    ) {}

    // locker state entity
    public loadLockerCategs$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LockerActions.startLoadLockerCategs),
            switchMap(({ centerId }) =>
                this.centerLokcerApi.getCategoryList(centerId).pipe(
                    map((categs) => LockerActions.finishLoadLockerCategs({ lockerCategList: categs })),
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
                    map((categ) => {
                        // this.setLockerCategList([...this.lockerCategList, newCateg])
                        // this.setLockerCateg(newCateg)
                        // this.getItemList(this.gymId.value, newCateg.id)
                        return LockerActions.finishCreateLockerCateg({ lockerCateg: categ })
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
                    map((_) => {
                        // const filteredCategList = this.lockerCategList.filter((v) => v.id != categoryId)
                        // this.setLockerCategList([...filteredCategList])
                        return LockerActions.finishDeleteLockerCategory()
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
                        // const updateCategList = this.lockerCategList.map((v) => {
                        //     if (v.id != categoryId) {
                        //         return v
                        //     } else {
                        //         return { ...v, name: updateName }
                        //     }
                        // })
                        // this.setLockerCategList([...updateCategList])
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
                        // this.setLockerItemList(list)
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
            switchMap(({ centerId, categoryId, reqBody }) =>
                this.centerLokcerApi.createItem(centerId, categoryId, reqBody).pipe(
                    switchMap((lockerItem) => {
                        return this.centerLokcerApi.getItemList(centerId, categoryId).pipe(
                            map((lockerItems) => {
                                return LockerActions.finishCreateLockerItem({ lockerItems: lockerItems })
                            }),
                            catchError((err: string) => of(LockerActions.error({ error: err })))
                        )
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
            switchMap(({ centerId, categoryId, itemId }) =>
                this.centerLokcerApi.deleteItem(centerId, categoryId, itemId).pipe(
                    map((lockerItem) => {
                        // this.setLockerItemList(list)
                        return LockerActions.finishDeleteLockerItem()
                    }),
                    catchError((err: string) => of(LockerActions.error({ error: err })))
                )
            )
        )
    )
}
