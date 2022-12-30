import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, forkJoin } from 'rxjs'
import { catchError, switchMap, map, filter, mergeMap, tap } from 'rxjs/operators'
import * as MembershipActions from '../actions/sec.membership.actions'
import { MembershipCategoryState, SelectedMembership } from '../reducers/sec.membership.reducer'
import * as MembershipSelector from '../selectors/sec.membership.selector'

import * as LessonActions from '../actions/sec.lesson.actions'
import { showToast } from '@appStore/actions/toast.action'

import { CenterMembershipService } from '@services/center-membership.service'
import { CenterLessonService } from '@services/center-lesson.service'

import _ from 'lodash'

import { MembershipItem } from '@schemas/membership-item'

@Injectable()
export class MembershipEffect {
    constructor(
        private actions$: Actions,
        private centerMembershipApi: CenterMembershipService,
        private centerLessonApi: CenterLessonService,
        private store: Store
    ) {}

    // membership category
    public loadMembershipCategs$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MembershipActions.startLoadMembershipCategs),
            switchMap(({ centerId }) =>
                this.centerMembershipApi.getCategoryList(centerId).pipe(
                    map((categs) => {
                        const categState = _.map(categs, (categ) => {
                            // categ.items = _.reverse(categ.items)
                            const _categState: MembershipCategoryState = {
                                ...categ,
                                isCategPending: 'done',
                                items: [],
                                isCategOpen: false,
                                initialInputOn: false,
                            }
                            return _categState
                        })
                        return MembershipActions.finishLoadMembershipCategs({ membershipCategState: categState })
                    }),
                    catchError((err: string) => of(MembershipActions.error({ error: err })))
                )
            )
        )
    )

    public addMembershipCateg = createEffect(() =>
        this.actions$.pipe(
            ofType(MembershipActions.startAddMembershipCateg),
            concatLatestFrom(() => [this.store.select(MembershipSelector.membershipCategEntities)]),
            switchMap(([{ centerId, categName }, mcEn]) => {
                const categLength = _.values(mcEn).length
                return this.centerMembershipApi
                    .createCategory(centerId, { name: categName, sequence_number: categLength + 1 })
                    .pipe(
                        map((categ) => MembershipActions.FinishAddMembershipCateg({ membershipCateg: categ })),
                        catchError((err: string) => of(MembershipActions.error({ error: err })))
                    )
            })
        )
    )

    public removeMembershipCateg = createEffect(
        () =>
            this.actions$.pipe(
                ofType(MembershipActions.removeMembershipCateg),
                switchMap(({ id, centerId }) =>
                    this.centerMembershipApi.deleteCategory(centerId, id).pipe(
                        map(() => LessonActions.startUpsertState()),
                        catchError((err: string) => of(MembershipActions.error({ error: err })))
                    )
                )
            )
        // { dispatch: false }
    )

    public changeMembershipCategName = createEffect(
        () =>
            this.actions$.pipe(
                ofType(MembershipActions.changeMembershipCategName),
                switchMap(({ centerId, id, categName }) =>
                    this.centerMembershipApi.updateCategory(centerId, id, { name: categName }).pipe(
                        map(() => LessonActions.startUpsertState()),
                        catchError((err: string) => of(MembershipActions.error({ error: err })))
                    )
                )
            )
        // { dispatch: false }
    )

    // categ data

    public getCategItemsWhenOpen$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MembershipActions.startSetCategIsOpen),
            concatLatestFrom(() => this.store.select(MembershipSelector.currentCenter)),
            mergeMap(([{ id, isOpen }, curCenterId]) => {
                if (isOpen) {
                    return this.centerMembershipApi.getItems(curCenterId, id).pipe(
                        switchMap((items) => [
                            MembershipActions.finishSetCategIsOpen({
                                id,
                                items,
                            }),
                        ])
                    )
                } else {
                    return []
                }
            })
        )
    )

    public updateCategMembership = createEffect(() =>
        this.actions$.pipe(
            ofType(MembershipActions.startAddMembershipToCateg),
            switchMap(({ centerId, categId, categName, reqBody }) =>
                this.centerMembershipApi.createItem(centerId, categId, reqBody).pipe(
                    switchMap((newItem) => [
                        MembershipActions.finishAddMembershipToCateg({
                            categId: categId,
                            newMembershipData: newItem,
                        }),
                        MembershipActions.startSetSelectedMembership({
                            selectedMembership: {
                                centerId: centerId,
                                categId: categId,
                                categName: categName,
                                membershipData: newItem,
                            },
                        }),
                        LessonActions.refreshSelectedLesson(),
                    ]),
                    catchError((err: string) => of(MembershipActions.error({ error: err })))
                )
            )
        )
    )

    // selected membership
    public updateSelectedMembership$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MembershipActions.updateSelectedMembership),
            switchMap(({ selectedMembership, reqBody }) => {
                return this.centerMembershipApi
                    .updateItem(
                        selectedMembership.centerId,
                        selectedMembership.categId,
                        selectedMembership.membershipData.id,
                        reqBody
                    )
                    .pipe(
                        catchError((err: string) =>
                            of(MembershipActions.error({ error: 'update selectedMembership err : ' + err }))
                        ),
                        concatLatestFrom(() => this.store.select(MembershipSelector.membershipCategEntities)),
                        switchMap(([action, memCategEn]) =>
                            this.centerMembershipApi.getCategoryList(selectedMembership.centerId).pipe(
                                map((categs) => {
                                    const categState = _.map(categs, (categ) => {
                                        const _categState: MembershipCategoryState = {
                                            ...memCategEn[categ.id],
                                            ...categ,
                                            isCategOpen: memCategEn[categ.id].isCategOpen,
                                            initialInputOn: false,
                                        }
                                        return _categState
                                    })
                                    return categState
                                }),
                                concatLatestFrom(() => this.store.select(MembershipSelector.currentCenter)),
                                switchMap(([memCategState, curGym]) => {
                                    return [
                                        MembershipActions.updateMembershipCategs({
                                            membershipCategState: memCategState,
                                        }),
                                        LessonActions.startUpsertState(),
                                    ]
                                })
                            )
                        )
                    )
            })
        )
    )

    public removeSelectedMembership$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MembershipActions.removeSelectedMembership),
            switchMap(({ selectedMembership }) =>
                this.centerMembershipApi
                    .deleteItem(
                        selectedMembership.centerId,
                        selectedMembership.categId,
                        selectedMembership.membershipData.id
                    )
                    .pipe(
                        catchError((err: string) => of(MembershipActions.error({ error: err }))),
                        map(() => LessonActions.startUpsertState())
                    )
            )
        )
    )

    public refreshSelectedMembership$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MembershipActions.refreshSelectedMembership),
            concatLatestFrom(() => this.store.select(MembershipSelector.selectedMembership)),
            filter(([action, selectedMembership]) => selectedMembership.membershipData != undefined),
            switchMap(([action, selectedMembership]) => {
                return this.centerMembershipApi.getItems(selectedMembership.centerId, selectedMembership.categId).pipe(
                    map((membershipItems) => {
                        const membershipItem: MembershipItem = _.find(
                            membershipItems,
                            (v) => v.id == selectedMembership.membershipData.id
                        )
                        const newSelectedMembership: SelectedMembership = {
                            ...selectedMembership,
                            membershipData: membershipItem,
                        }
                        return MembershipActions.startSetSelectedMembership({
                            selectedMembership: newSelectedMembership,
                        })
                    }),
                    catchError((err: string) => of(MembershipActions.error({ error: err })))
                )
            })
        )
    )

    public moveMembershipItem$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(MembershipActions.startMoveMembershipItem),
                mergeMap(({ apiData, cb }) =>
                    this.centerMembershipApi
                        .moveItem(apiData.centerId, apiData.categoryId, apiData.itemId, apiData.requestBody)
                        .pipe(
                            tap(() => {
                                cb ? cb() : null
                            }),
                            catchError((err: string) => of(MembershipActions.error({ error: err })))
                        )
                )
            ),
        { dispatch: false }
    )

    public moveMembershipCategory = createEffect(
        () =>
            this.actions$.pipe(
                ofType(MembershipActions.startMoveMembershipCategory),
                mergeMap(({ apiData, cb }) =>
                    this.centerMembershipApi
                        .moveCategory(apiData.centerId, apiData.categoryId, apiData.requestBody)
                        .pipe(
                            tap(() => {
                                cb ? cb() : null
                            }),
                            catchError((err: string) => of(MembershipActions.error({ error: err })))
                        )
                )
            ),
        { dispatch: false }
    )

    // linked class item
    public getLinkedClasses$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MembershipActions.startSetSelectedMembership),
            switchMap(({ selectedMembership }) =>
                forkJoin({
                    linkedClassItems: this.centerMembershipApi.getLinkedClass(
                        selectedMembership.centerId,
                        selectedMembership.categId,
                        selectedMembership.membershipData.id
                    ),
                    allClassItems: this.centerLessonApi.getAllClasses(selectedMembership.centerId),
                }).pipe(
                    switchMap(({ linkedClassItems, allClassItems }) => {
                        const linkableClassItems = _.differenceBy(allClassItems, linkedClassItems, 'id')
                        return [MembershipActions.finishSetSelectedMembership({ linkedClassItems, linkableClassItems })]
                    })
                )
            )
        )
    )

    public refreshLinkedLessons$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MembershipActions.startRefreshLinkedLessons),
            concatLatestFrom(() => [this.store.select(MembershipSelector.selectedMembership)]),
            switchMap(([action, selectedMembership]) => {
                if (!_.isEmpty(selectedMembership.membershipData)) {
                    return forkJoin([
                        this.centerMembershipApi.getLinkedClass(
                            selectedMembership.centerId,
                            selectedMembership.categId,
                            selectedMembership.membershipData.id
                        ),
                        this.centerLessonApi.getAllClasses(selectedMembership.centerId),
                    ]).pipe(
                        switchMap(([linkedClassItems, allClassItems]) => {
                            const linkableClassItems = _.differenceBy(allClassItems, linkedClassItems, 'id')
                            return [
                                MembershipActions.finishSetSelectedMembership({ linkedClassItems, linkableClassItems }),
                            ]
                        })
                    )
                } else {
                    return []
                }
            })
        )
    )

    public linkClass$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MembershipActions.startLinkClass),
            concatLatestFrom(() => [this.store.select(MembershipSelector.selectedMembership)]),
            switchMap(([action, curSelectedMembership]) =>
                this.centerMembershipApi
                    .linkClass(
                        curSelectedMembership.centerId,
                        curSelectedMembership.categId,
                        curSelectedMembership.membershipData.id,
                        {
                            class_item_ids: _.values(curSelectedMembership.willBeLinkedClassItemRecord).map(
                                (v) => v.id
                            ),
                        }
                    )
                    .pipe(
                        switchMap(() => [
                            LessonActions.startUpsertState(),
                            MembershipActions.resetWillBeLinkedClassItem(),
                        ])
                    )
            )
        )
    )

    public unlinkClass$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MembershipActions.startUnlinkClass),
            concatLatestFrom(() => [this.store.select(MembershipSelector.selectedMembership)]),
            switchMap(([{ unlinkClass }, curSelectedMembership]) =>
                this.centerMembershipApi
                    .removeLinkedClass(
                        curSelectedMembership.centerId,
                        curSelectedMembership.categId,
                        curSelectedMembership.membershipData.id,
                        unlinkClass.id
                    )
                    .pipe(
                        switchMap(() => [
                            LessonActions.startUpsertState(),
                            showToast({ text: '예약 가능한 수업 1개가 삭제되었습니다.' }),
                        ])
                    )
            )
        )
    )

    // actions from lesson
    public upsertState$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MembershipActions.startUpsertState),
            concatLatestFrom(() => [
                this.store.select(MembershipSelector.membershipCategEntities),
                this.store.select(MembershipSelector.selectedMembership),
            ]),
            switchMap(([action, memCategEn, selectedMembership]) => {
                if (!_.isEmpty(selectedMembership.membershipData)) {
                    return [MembershipActions.startSetSelectedMembership({ selectedMembership })]
                } else {
                    return []
                }
            })
        )
    )
}
