import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, forkJoin, iif } from 'rxjs'
import { catchError, switchMap, mergeMap, map, filter, tap, debounceTime } from 'rxjs/operators'

import * as LessonActions from '../actions/sec.lesson.actions'
import {
    LessonCategoryState,
    SelectedLesson,
    TrainerFilter,
    initialTrainerFilterList,
} from '../reducers/sec.lesson.reducer'
import * as LessonSelector from '../selectors/sec.lesson.selector'
import * as MembershipActions from '../actions/sec.membership.actions'

import { CenterLessonService } from '@services/center-lesson.service'
import { CenterMembershipService } from '@services/center-membership.service'
import { CenterUsersService } from '@services/center-users.service'

import _ from 'lodash'

import { ClassItem } from '@schemas/class-item'

@Injectable()
export class LessonEffect {
    constructor(
        private actions$: Actions,
        private centerLessonApi: CenterLessonService,
        private centerMembershipApi: CenterMembershipService,
        private centerUserApi: CenterUsersService,
        private store: Store
    ) {}

    // lesson category
    public loadLessonCategs$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LessonActions.startLoadLessonCategs),
            switchMap(({ centerId }) =>
                this.centerLessonApi.getCategoryList(centerId).pipe(
                    map((categs) => {
                        const categState = _.map(categs, (categ) => {
                            // categ.items = _.reverse(categ.items)
                            const _categState: LessonCategoryState = {
                                ...categ,
                                isCategPending: 'done',
                                items: [],
                                isCategOpen: false,
                                initialInputOn: false,
                            }
                            return _categState
                        })
                        return LessonActions.finishLoadLessonCategs({ lessonCategState: categState })
                    }),
                    catchError((err: string) => of(LessonActions.error({ error: err })))
                )
            )
        )
    )

    public addLessonCateg = createEffect(() =>
        this.actions$.pipe(
            ofType(LessonActions.startAddLessonCateg),
            concatLatestFrom(() => [this.store.select(LessonSelector.LessonCategEntities)]),
            switchMap(([{ centerId, categName }, lcEn]) => {
                const categLength = _.values(lcEn).length
                return this.centerLessonApi
                    .createCategory(centerId, { name: categName, sequence_number: categLength + 1 })
                    .pipe(
                        map((categ) => LessonActions.FinishAddLessonCateg({ lessonCateg: categ })),
                        catchError((err: string) => of(LessonActions.error({ error: err })))
                    )
            })
        )
    )

    public removeLessonCateg = createEffect(
        () =>
            this.actions$.pipe(
                ofType(LessonActions.removeLessonCateg),
                switchMap(({ id, centerId }) =>
                    this.centerLessonApi.deleteCategory(centerId, id).pipe(
                        map(() => MembershipActions.startUpsertState()),
                        catchError((err: string) => of(LessonActions.error({ error: err })))
                    )
                )
            )
        // { dispatch: false }
    )

    public changeLessonCategName = createEffect(
        () =>
            this.actions$.pipe(
                ofType(LessonActions.changeLessonCategName),
                switchMap(({ centerId, id, categName }) =>
                    this.centerLessonApi.updateCategory(centerId, id, { name: categName }).pipe(
                        map(() => MembershipActions.startUpsertState()),
                        catchError((err: string) => of(LessonActions.error({ error: err })))
                    )
                )
            )
        // { dispatch: false }
    )

    // categ data
    public getCategItemsWhenOpen$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LessonActions.startSetCategIsOpen),
            concatLatestFrom(() => this.store.select(LessonSelector.currentCenter)),
            mergeMap(([{ id, isOpen }, curCenterId]) => {
                if (isOpen) {
                    return this.centerLessonApi.getItems(curCenterId, id).pipe(
                        switchMap((items) => [
                            LessonActions.finishSetCategIsOpen({
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

    public updateCategLesson = createEffect(() =>
        this.actions$.pipe(
            ofType(LessonActions.startAddLessonToCateg),
            switchMap(({ centerId, categId, categName, reqBody }) =>
                this.centerLessonApi.createItem(centerId, categId, reqBody).pipe(
                    switchMap((newItem) => [
                        LessonActions.finishAddLessonToCateg({ categId: categId, newLessonData: newItem }),
                        LessonActions.startSetSelectedLesson({
                            selectedLesson: {
                                centerId: centerId,
                                categId: categId,
                                categName: categName,
                                lessonData: newItem,
                            },
                        }),
                        MembershipActions.refreshSelectedMembership(),
                    ]),
                    catchError((err: string) => of(LessonActions.error({ error: err })))
                )
            )
        )
    )

    // trainer filter list
    public getTrainerFilterList = createEffect(() =>
        this.actions$.pipe(
            ofType(LessonActions.startGetTrainerFilterList),
            switchMap(({ centerId }) => {
                return this.centerUserApi.getUserList(centerId, 'employee', '').pipe(
                    map((managers) => {
                        const newTrainerFilterList: Array<TrainerFilter> = _.cloneDeep(initialTrainerFilterList)

                        managers.forEach((v) => {
                            newTrainerFilterList.push({
                                name: v.name,
                                value: v,
                            })
                        })

                        return LessonActions.finishGetTrainerFilterList({ trainerFilterList: newTrainerFilterList })
                    }),
                    catchError((err: string) => of(LessonActions.error({ error: err })))
                )
            })
        )
    )

    // selected lesson
    public updateSelectedLessonInstructor = createEffect(() =>
        this.actions$.pipe(
            ofType(LessonActions.startUpdateSelectedLessonInstructor),
            debounceTime(300),
            switchMap(({ instructor, selectedLesson }) => {
                console.log('startUpdateSelectedLessonInstructor 0 ', instructor, selectedLesson)
                return iif(
                    () => instructor.checked,
                    this.centerLessonApi.addInstructor(
                        selectedLesson.centerId,
                        selectedLesson.categId,
                        selectedLesson.lessonData.id,
                        { instructor_center_user_id: instructor.value.id }
                    ),
                    this.centerLessonApi.removeInstructor(
                        selectedLesson.centerId,
                        selectedLesson.categId,
                        selectedLesson.lessonData.id,
                        instructor.value.id
                    )
                ).pipe(switchMap((res) => [MembershipActions.startUpsertState()]))
            })
        )
    )

    public updateSelectedLesson$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LessonActions.updateSelectedLesson),
            switchMap(({ selectedLesson, reqBody }) => {
                return this.centerLessonApi
                    .updateItem(selectedLesson.centerId, selectedLesson.categId, selectedLesson.lessonData.id, reqBody)
                    .pipe(
                        catchError((err: string) =>
                            of(LessonActions.error({ error: 'update selectedLesson err :' + err }))
                        ),
                        concatLatestFrom(() => this.store.select(LessonSelector.LessonCategEntities)),
                        switchMap(([action, lesCategEn]) =>
                            this.centerLessonApi.getCategoryList(selectedLesson.centerId).pipe(
                                map((categs) => {
                                    const categState = _.map(categs, (categ) => {
                                        const _categState: LessonCategoryState = {
                                            ...lesCategEn[categ.id],
                                            ...categ,
                                            isCategOpen: lesCategEn[categ.id].isCategOpen,
                                            initialInputOn: false,
                                        }
                                        return _categState
                                    })
                                    return categState
                                }),
                                concatLatestFrom(() => this.store.select(LessonSelector.currentCenter)),
                                switchMap(([lesCategState, curGym]) => {
                                    return [
                                        LessonActions.updateLessonCategs({
                                            lessonCategState: lesCategState,
                                        }),
                                        MembershipActions.startUpsertState(),
                                    ]
                                })
                            )
                        )
                    )
            })
        )
    )

    public removeSelectedLesson$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LessonActions.removeSelectedLesson),
            switchMap(({ selectedLesson }) =>
                this.centerLessonApi
                    .deleteItem(selectedLesson.centerId, selectedLesson.categId, selectedLesson.lessonData.id)
                    .pipe(
                        catchError((err: string) => of(LessonActions.error({ error: err }))),
                        map(() => MembershipActions.startUpsertState())
                    )
            )
        )
    )

    public refreshSelectedLesson$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LessonActions.refreshSelectedLesson),
            concatLatestFrom(() => this.store.select(LessonSelector.selectedLesson)),
            filter(([action, selectedLesson]) => selectedLesson.lessonData != undefined),
            switchMap(([action, selectedLesson]) =>
                this.centerLessonApi.getItems(selectedLesson.centerId, selectedLesson.categId).pipe(
                    map((lessonItems) => {
                        const lessonItem: ClassItem = _.find(lessonItems, (v) => v.id == selectedLesson.lessonData.id)
                        const newSelectedLesson: SelectedLesson = { ...selectedLesson, lessonData: lessonItem }
                        return LessonActions.startSetSelectedLesson({
                            selectedLesson: newSelectedLesson,
                        })
                    }),
                    catchError((err: string) => of(LessonActions.error({ error: err })))
                )
            )
        )
    )

    public moveLessonItem = createEffect(
        () =>
            this.actions$.pipe(
                ofType(LessonActions.startMoveLessonItem),
                mergeMap(({ apiData, cb }) =>
                    this.centerLessonApi
                        .moveItem(apiData.centerId, apiData.categoryId, apiData.itemId, apiData.requestBody)
                        .pipe(
                            tap(() => {
                                cb ? cb() : null
                            }),
                            catchError((err: string) => of(LessonActions.error({ error: err })))
                        )
                )
            ),
        { dispatch: false }
    )

    public moveLessonCategory = createEffect(
        () =>
            this.actions$.pipe(
                ofType(LessonActions.startMoveLessonCategory),
                mergeMap(({ apiData }) =>
                    this.centerLessonApi.moveCategory(apiData.centerId, apiData.categoryId, apiData.requestBody).pipe(
                        tap(() => {}),
                        catchError((err: string) => of(MembershipActions.error({ error: err })))
                    )
                )
            ),
        { dispatch: false }
    )

    // linked class item

    public getLinkedMemberships$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LessonActions.startSetSelectedLesson),
            switchMap(({ selectedLesson }) =>
                forkJoin({
                    linkedMembershipItems: this.centerLessonApi.getLinkedMemberships(
                        selectedLesson.centerId,
                        selectedLesson.categId,
                        selectedLesson.lessonData.id
                    ),
                    allMembershipItems: this.centerMembershipApi.getAllMemberships(selectedLesson.centerId),
                }).pipe(
                    switchMap(({ linkedMembershipItems, allMembershipItems }) => {
                        const linkableMembershipItems = _.differenceBy(allMembershipItems, linkedMembershipItems, 'id')
                        return [
                            LessonActions.finishSetSelectedLesson({ linkedMembershipItems, linkableMembershipItems }),
                        ]
                    })
                )
            )
        )
    )

    public linkMembership$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LessonActions.startLinkMemberships),
            concatLatestFrom(() => [this.store.select(LessonSelector.selectedLesson)]),
            switchMap(([action, curSelecteLesson]) =>
                this.centerLessonApi
                    .linkMembership(
                        curSelecteLesson.centerId,
                        curSelecteLesson.categId,
                        curSelecteLesson.lessonData.id,
                        {
                            membership_item_ids: _.values(curSelecteLesson.willBeLinkedMembershipItemRecord).map(
                                (v) => v.id
                            ),
                        }
                    )
                    .pipe(
                        switchMap(() => [
                            MembershipActions.startUpsertState(),
                            LessonActions.resetWillBeLinkedMembershipItem(),
                        ])
                    )
            )
        )
    )

    public unlinkMembership$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LessonActions.startUnlinkMembership),
            concatLatestFrom(() => [this.store.select(LessonSelector.selectedLesson)]),
            switchMap(([{ unlinkMembership }, curSelecteLesson]) =>
                this.centerLessonApi
                    .removeLinkedMembership(
                        curSelecteLesson.centerId,
                        curSelecteLesson.categId,
                        curSelecteLesson.lessonData.id,
                        unlinkMembership.id
                    )
                    .pipe(switchMap(() => [MembershipActions.startUpsertState()]))
            )
        )
    )

    // actions from lesson
    public upsertState$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LessonActions.startUpsertState),
            concatLatestFrom(() => [
                this.store.select(LessonSelector.LessonCategEntities),
                this.store.select(LessonSelector.selectedLesson),
            ]),
            switchMap(([action, lesCategEn, selectedLesson]) => {
                if (!_.isEmpty(selectedLesson.lessonData)) {
                    return [LessonActions.startSetSelectedLesson({ selectedLesson })]
                } else {
                    return []
                }
            })
        )
    )
}
