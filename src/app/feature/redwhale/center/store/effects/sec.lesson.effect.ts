import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of } from 'rxjs'
import { catchError, switchMap, tap, map, filter } from 'rxjs/operators'
import * as LessonActions from '../actions/sec.lesson.actions'
import {
    LessonCategoryState,
    SelectedLesson,
    TrainerFilter,
    initialTrainerFilterList,
} from '../reducers/sec.lesson.reducer'
import * as LessonSelector from '../selectors/sec.lesson.selector'
import * as MembershipActions from '../actions/sec.membership.actions'

import { GymLessonService } from '@services/gym-lesson.service'
import { GymUsersService } from '@services/gym-user.service'

import * as _ from 'lodash'

@Injectable()
export class LessongEffect {
    constructor(
        private actions$: Actions,
        private gymLessonApi: GymLessonService,
        private gymUserApi: GymUsersService,
        private store: Store
    ) {}

    // lesson category
    public loadLessonCategs$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LessonActions.startLoadLessonCategs),
            switchMap(({ centerId }) =>
                this.gymLessonApi.getCategoryList(centerId).pipe(
                    map((categs) => {
                        const categState = _.map(categs, (categ) => {
                            const _categState: LessonCategoryState = { ...categ, isCategOpen: false }
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
            switchMap(({ centerId, categName }) =>
                this.gymLessonApi.createCategory(centerId, { name: categName }).pipe(
                    map((categ) => LessonActions.FinishAddLessonCateg({ lessonCateg: categ })),
                    catchError((err: string) => of(LessonActions.error({ error: err })))
                )
            )
        )
    )

    public removeLessonCateg = createEffect(
        () =>
            this.actions$.pipe(
                ofType(LessonActions.removeLessonCateg),
                switchMap(({ id, centerId }) =>
                    this.gymLessonApi
                        .deleteCategory(centerId, id)
                        .pipe(catchError((err: string) => of(LessonActions.error({ error: err }))))
                )
            ),
        { dispatch: false }
    )

    public changeLessonCategName = createEffect(
        () =>
            this.actions$.pipe(
                ofType(LessonActions.changeLessonCategName),
                switchMap(({ centerId, id, categName }) =>
                    this.gymLessonApi.updateCategory(centerId, id, { name: categName }).pipe(
                        tap(),
                        catchError((err: string) => of(LessonActions.error({ error: err })))
                    )
                )
            ),
        { dispatch: false }
    )

    // categ data

    public updateCategLesson = createEffect(() =>
        this.actions$.pipe(
            ofType(LessonActions.startAddLessonToCateg),
            switchMap(({ centerId, categId, categName, reqBody }) =>
                this.gymLessonApi.createItem(centerId, categId, reqBody).pipe(
                    map((newItem) =>
                        LessonActions.finishiAddLessonToCateg({ categId: categId, newLessonData: newItem })
                    ),
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
                return this.gymUserApi.getUserList(centerId, '', 'administrator, manager, staff').pipe(
                    map((managers) => {
                        const newTrainerFilterList: Array<TrainerFilter> = _.cloneDeep(initialTrainerFilterList)
                        managers.forEach((v) => {
                            newTrainerFilterList.push({
                                name: v.center_user_name ?? v.name,
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
    public updateSelectedLesson$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LessonActions.updateSelectedLesson),
            switchMap(({ selectedLesson, reqBody }) => {
                console.log('update selected lesson - reqBody : ', reqBody)
                return this.gymLessonApi
                    .updateItem(selectedLesson.centerId, selectedLesson.categId, selectedLesson.lessonData.id, reqBody)
                    .pipe(
                        catchError((err: string) =>
                            of(LessonActions.error({ error: 'update selectedLesson err :' + err }))
                        ),
                        concatLatestFrom(() => this.store.select(LessonSelector.LessonCategEntities)),
                        switchMap(([action, lesCategEn]) =>
                            this.gymLessonApi.getCategoryList(selectedLesson.centerId).pipe(
                                map((categs) => {
                                    const categState = _.map(categs, (categ) => {
                                        const _categState: LessonCategoryState = {
                                            ...categ,
                                            isCategOpen: lesCategEn[categ.id].isCategOpen,
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
                                        MembershipActions.startUpsertState({ centerId: curGym }),
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
                this.gymLessonApi
                    .deleteItem(selectedLesson.centerId, selectedLesson.categId, selectedLesson.lessonData.id)
                    .pipe(
                        catchError((err: string) => of(LessonActions.error({ error: err }))),
                        map(() => MembershipActions.startUpsertState({ centerId: selectedLesson.centerId }))
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
                this.gymLessonApi
                    .getItem(selectedLesson.centerId, selectedLesson.categId, selectedLesson.lessonData.id)
                    .pipe(
                        map((lessonItem) => {
                            const newSelectedLesson: SelectedLesson = { ...selectedLesson, lessonData: lessonItem }
                            return LessonActions.setSelectedLesson({
                                selectedLesson: newSelectedLesson,
                            })
                        }),
                        catchError((err: string) => of(LessonActions.error({ error: err })))
                    )
            )
        )
    )

    // actions from lesson
    public upsertState$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LessonActions.startUpsertState),
            concatLatestFrom(() => this.store.select(LessonSelector.LessonCategEntities)),
            switchMap(([action, lesCategEn]) =>
                this.gymLessonApi.getCategoryList(action.centerId).pipe(
                    map((categs) => {
                        const categState = _.map(categs, (categ) => {
                            const _categState: LessonCategoryState = {
                                ...categ,
                                isCategOpen: lesCategEn[categ.id].isCategOpen,
                            }
                            return _categState
                        })
                        return LessonActions.finishUpsertState({ lessonCategState: categState })
                    }),
                    catchError((err: string) => of(LessonActions.error({ error: err })))
                )
            )
        )
    )
}
