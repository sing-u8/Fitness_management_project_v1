import { createAction, props } from '@ngrx/store'

import { TrainerFilter, SelectedLesson, LessonCategoryState } from '../reducers/sec.lesson.reducer'

import { ClassCategory } from '@schemas/class-category'
import { UpdateItemRequestBody } from '@services/center-lesson.service'
import { ClassItem } from '@schemas/class-item'
import { MembershipItem } from '@schemas/membership-item'
import { CenterUser } from '@schemas/center-user'

const FeatureKey = 'Center/Lesson'

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
export const finishAddLessonToCateg = createAction(
    `[${FeatureKey}] Finish Adding New Lesson to Lesson Category to server`,
    props<{
        categId: string
        newLessonData: ClassItem
    }>()
)

export const startSetCategIsOpen = createAction(
    `[${FeatureKey}] Start Set Category Status`,
    props<{ id: string; isOpen: boolean }>()
)
export const finishSetCategIsOpen = createAction(
    `[${FeatureKey}] Finish Set Category Status`,
    props<{ id: string; items: Array<ClassItem> }>()
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
export const startSetSelectedLesson = createAction(
    `[${FeatureKey}] Start Set Selected Lesson`,
    props<{ selectedLesson: SelectedLesson }>()
)
export const finishSetSelectedLesson = createAction(
    `[${FeatureKey}] Finish Set Selected Lesson`,
    props<{ linkedMembershipItems: Array<MembershipItem>; linkableMembershipItems: Array<MembershipItem> }>()
)

export const updateSelectedLessonInstructor = createAction(
    `[${FeatureKey} Update Selected Lesson Instructor to Server]`,
    props<{ instructor: { prev: CenterUser; cur: CenterUser }; selectedLesson: SelectedLesson }>()
)
export const updateSelectedLesson = createAction(
    `[${FeatureKey} Update Selected Lesson to Server]`,
    props<{ selectedLesson: SelectedLesson; reqBody: UpdateItemRequestBody }>()
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

// linked membership
export const startLinkMembership = createAction(
    `[${FeatureKey}] Start Link Membership To Class`,
    props<{ linkMembership: MembershipItem }>()
)
// export const finishLinkClass = createAction(`[${FeatureKey}] Start Link Class To Membership`, props<{}>())

export const startUnlinkMembership = createAction(
    `[${FeatureKey}] Start Unlink Membership To Class`,
    props<{ unlinkMembership: MembershipItem }>()
)
// export const finishUnlinkClass = createAction(`[${FeatureKey}] Start Link Class To Membership`, props<{}>())

// actions from membership
export const startUpsertState = createAction(`[${FeatureKey}] Start Upsert State called by membership screen`)

// initial input
export const disableInitInput = createAction(
    `[${FeatureKey}] disable InitInput of lesson category`,
    props<{ categId: string }>()
)
