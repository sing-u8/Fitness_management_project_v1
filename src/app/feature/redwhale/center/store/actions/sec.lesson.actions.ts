import { createAction, props } from '@ngrx/store'

import { TrainerFilter, SelectedLesson, LessonCategoryState } from '../reducers/sec.lesson.reducer'

import { ClassCategory } from '@schemas/class-category'
import { UpdateItemRequestBody } from '@services/center-lesson.service'
import { ClassItem } from '@schemas/class-item'

const FeatureKey = 'Gym/Lesson'

// start, finish로 나눠져있거나, action 설명에 to server가 적혀있으면 effect와 연관이 있는 actions

// lesson category
export const startLoadLessonCategs = createAction(
    `[${FeatureKey}] Start Loading Lesson Categories`,
    props<{ centerId: string }>()
)
export const finishLoadLessonCategs = createAction(
    `[${FeatureKey}] Finish Loading Lesson Categories`,
    props<{ lessonCategState: Array<LessonCategoryState> }>()
)
export const updateLessonCategs = createAction(
    `[${FeatureKey}] update Lesson Categories`,
    props<{ lessonCategState: Array<LessonCategoryState> }>()
)
export const resetLessonCategs = createAction(`[${FeatureKey}] Reset Lesson Categories`)
export const startAddLessonCateg = createAction(
    `[${FeatureKey}] Start Add Lesson Category`,
    props<{ centerId: string; categName: string }>()
)
export const FinishAddLessonCateg = createAction(
    `[${FeatureKey}] Finish Adding Lesson Category`,
    props<{ lessonCateg: ClassCategory }>()
)
export const removeLessonCateg = createAction(
    `[${FeatureKey}] Remove Lesson Category to server`,
    props<{ id: string; centerId: string }>()
)

// categ data
export const changeLessonCategName = createAction(
    `[${FeatureKey}] Change Lesson Category Name to Server`,
    props<{ centerId: string; id: string; categName: string }>()
)
export const startAddLessonToCateg = createAction(
    `[${FeatureKey}] Start Add New Lesson to Lesson Category to server`,
    props<{
        centerId: string
        categId: string
        categName: string
        reqBody: { name: string; sequence_number: number }
    }>()
)
export const finishiAddLessonToCateg = createAction(
    `[${FeatureKey}] Finishi Adding New Lesson to Lesson Category to server`,
    props<{
        categId: string
        newLessonData: ClassItem
    }>()
)

export const setCategIsOpen = createAction(
    `[${FeatureKey}] Set Category Status`,
    props<{ id: string; isOpen: boolean }>()
)

// trainer Filter
export const setTrainerFilter = createAction(
    `[${FeatureKey}] Set Trainer Filter`,
    props<{ trainerFilter: TrainerFilter }>()
)
export const resetTrainerFilter = createAction(`[${FeatureKey}] Reset Trainer Filter`)
// trainer filter list
export const startGetTrainerFilterList = createAction(
    `[${FeatureKey}] Start Get TrainerFilterList`,
    props<{ centerId: string }>()
)
export const finishGetTrainerFilterList = createAction(
    `[${FeatureKey}] Finish Getting TrainerFilterList`,
    props<{ trainerFilterList: Array<TrainerFilter> }>()
)
export const resetTrainerFilterList = createAction(`[${FeatureKey} Reset Trainer Filter List]`)

// current gym
export const setCurrentGym = createAction(`[${FeatureKey}] Set Current Gym`, props<{ currentCenter: string }>())
export const resetCurrentGym = createAction(`[${FeatureKey}] Set Reset CurrentGym`)

// selected lesson
export const setSelectedLesson = createAction(
    `[${FeatureKey}] Set Selected Lesson`,
    props<{ selectedLesson: SelectedLesson }>()
)

export type UpdateType = undefined | 'RemoveReservationMembership'
export const updateSelectedLesson = createAction(
    `[${FeatureKey} Update Selected Lesson to Server]`,
    props<{ selectedLesson: SelectedLesson; reqBody: UpdateItemRequestBody; updateType: UpdateType }>()
)
export const removeSelectedLesson = createAction(
    `[${FeatureKey} remove Selected Lesson to Server]`,
    props<{ selectedLesson: SelectedLesson }>()
)
export const refreshSelectedLesson = createAction(
    `[${FeatureKey}] Refresh Selected Lesson`
    // props<{ selectedLesson: SelectedLesson }>()
)
export const resetSelectedLesson = createAction(`[${FeatureKey}] Reset Selected Lesson`)

//
export const resetAll = createAction(`[${FeatureKey}] Reset All`)
export const error = createAction(`[${FeatureKey}] Lesson Category State Error`, props<{ error: string }>())

// actions from membership
export const startUpsertState = createAction(
    `[${FeatureKey}] Start Upsert State called by membership screen`,
    props<{ centerId: string }>()
)
export const finishUpsertState = createAction(
    `[${FeatureKey}] Finish Upsert State called by membership screen`,
    props<{ lessonCategState: Array<LessonCategoryState> }>()
)

// initial input
export const disableInitInput = createAction(
    `[${FeatureKey}] disable InitInput of lesson category`,
    props<{ categId: string }>()
)
