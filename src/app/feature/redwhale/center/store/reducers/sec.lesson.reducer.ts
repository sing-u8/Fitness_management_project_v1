import { Action, createReducer, on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity'
import * as _ from 'lodash'

import * as LessonActions from '../actions/sec.lesson.actions'

import { ClassCategory } from '@schemas/class-category'
import { ClassItem } from '@schemas/class-item'
import { CenterUser } from '@schemas/center-user'
import { Loading } from '@schemas/store/loading'

export interface SelectedLesson {
    lessonData: ClassItem
    categId: string
    categName: string
    centerId: string
}
export const initialSelectedLesson: SelectedLesson = {
    lessonData: undefined,
    categId: undefined,
    categName: undefined,
    centerId: undefined,
}

export interface LessonCategoryState extends ClassCategory {
    isCategOpen: boolean
}

export interface TrainerFilter {
    name: string
    value: CenterUser
}
export const initialTrainerFilter: TrainerFilter = {
    name: '강사 전체',
    value: undefined,
}
export const initialTrainerFilterList: Array<TrainerFilter> = [
    {
        name: '강사 전체',
        value: undefined,
    },
]

export type currentCenter = string

export interface State extends EntityState<LessonCategoryState> {
    selectedLesson: SelectedLesson
    selectedTrainerFilter: TrainerFilter
    trainerFilterList: Array<TrainerFilter>
    currentCenter: currentCenter
    isLoading: Loading
    error: string
}

export function selectCategoryId(categ: ClassCategory): string {
    return categ.id
}
export const adapter: EntityAdapter<LessonCategoryState> = createEntityAdapter<LessonCategoryState>({
    selectId: selectCategoryId,
    sortComparer: (a, b) => Number(a.id) - Number(b.id),
})
export const initialState: State = adapter.getInitialState({
    selectedLesson: initialSelectedLesson,
    selectedTrainerFilter: initialTrainerFilter,
    trainerFilterList: initialTrainerFilterList,
    currentCenter: '',
    isLoading: 'idle',
    error: '',
})

export const lessonReducer = createImmerReducer(
    initialState,
    // lesson category
    on(LessonActions.startLoadLessonCategs, (state): State => {
        state.isLoading = 'pending'
        return state
    }),
    on(LessonActions.finishLoadLessonCategs, (state, { lessonCategState }): State => {
        const newState: State = { ...state, ...{ isLoading: 'done' } }
        console.log('finishi load lesson categs')
        return adapter.setMany(lessonCategState, newState)
    }),
    on(LessonActions.updateLessonCategs, (state, { lessonCategState }): State => {
        console.log('LessonActions.updateLessonCategs')
        const copyState: State = adapter.upsertMany(lessonCategState, _.cloneDeep(state))
        copyState.selectedLesson.lessonData = copyState.entities[copyState.selectedLesson.categId].items.find(
            (membership) => membership.id == copyState.selectedLesson.lessonData.id
        )
        return copyState
    }),
    on(LessonActions.resetLessonCategs, (state) => {
        return adapter.removeAll({ ...state })
    }),
    on(LessonActions.startAddLessonCateg, (state) => state),
    on(LessonActions.FinishAddLessonCateg, (state, { lessonCateg }) => {
        const newOneLesCategState: LessonCategoryState = { ...lessonCateg, isCategOpen: true }
        return adapter.addOne(newOneLesCategState, state)
    }),
    on(LessonActions.removeLessonCateg, (state, { id }) => {
        return adapter.removeOne(id, state)
    }),
    // categ data
    on(LessonActions.changeLessonCategName, (state, { id, categName }) => {
        const copyState = _.cloneDeep(state)
        _.forEach(copyState.entities[id].items, (item, idx) => {
            copyState.entities[id].items[idx].category_name = categName
        })

        const copyOneLesCategState = state.entities[id]
        return adapter.updateOne(
            { id: id, changes: { ...copyOneLesCategState, name: categName, items: copyState.entities[id].items } },
            state
        )
    }),
    on(LessonActions.finishiAddLessonToCateg, (state, { categId, newLessonData }) => {
        const copyOneLesCategState = state.entities[categId]
        const copyCategItems = _.cloneDeep(state.entities[categId].items)
        copyCategItems.push(newLessonData)
        return adapter.updateOne({ id: categId, changes: { ...copyOneLesCategState, items: copyCategItems } }, state)
    }),
    on(LessonActions.setCategIsOpen, (state, { id, isOpen }) => {
        const copyOneLesCategState = state.entities[id]
        return adapter.updateOne({ id: id, changes: { ...copyOneLesCategState, isCategOpen: isOpen } }, state)
    }),
    // trainer filter
    on(LessonActions.setTrainerFilter, (state, { trainerFilter }) => {
        state.selectedTrainerFilter = trainerFilter
        return state
    }),
    on(LessonActions.resetTrainerFilter, (state) => {
        state.selectedTrainerFilter = initialTrainerFilter
        return state
    }),
    // trainer filter list
    on(LessonActions.finishGetTrainerFilterList, (state, { trainerFilterList }) => {
        state.trainerFilterList = trainerFilterList
        return state
    }),
    on(LessonActions.resetTrainerFilterList, (state) => {
        state.trainerFilterList = initialTrainerFilterList
        return state
    }),
    // current center
    on(LessonActions.setCurrentGym, (state, { currentCenter }) => {
        state.currentCenter = currentCenter
        return state
    }),
    on(LessonActions.resetCurrentGym, (state) => {
        state.currentCenter = ''
        return state
    }),

    // selected lesson
    on(LessonActions.setSelectedLesson, (state, { selectedLesson }) => {
        state.selectedLesson = selectedLesson
        return state
    }),
    on(LessonActions.removeSelectedLesson, (state, { selectedLesson }) => {
        // need to update categ list -- finish v1
        const categId = selectedLesson.categId
        state.entities[categId].items = _.filter(
            state.entities[categId].items,
            (item) => item.id != selectedLesson.lessonData.id
        )
        state.selectedLesson = initialSelectedLesson
        return state
    }),
    on(LessonActions.resetSelectedLesson, (state) => {
        state.selectedLesson = initialSelectedLesson
        return state
    }),

    // common
    on(LessonActions.resetAll, (state) => {
        return adapter.removeAll({
            ...state,
            selectedLesson: initialSelectedLesson,
            trainerFilter: initialTrainerFilter,
            currentCenter: '',
            isLoading: 'idle',
            error: '',
        })
    }),
    on(LessonActions.error, (state, { error }) => {
        console.log('Gym/Lesson error: ', error)
        return state
    }),

    // actions from membership
    on(LessonActions.finishUpsertState, (state, { lessonCategState }): State => {
        console.log('LessonActions.finishUpserState : ', lessonCategState)
        const newState: State = adapter.upsertMany(lessonCategState, _.cloneDeep(state))
        const preSelLesson = newState.selectedLesson
        if (preSelLesson.lessonData != undefined) {
            newState.selectedLesson.lessonData = newState.entities[preSelLesson.categId].items.find(
                (categItem) => categItem.id == preSelLesson.lessonData.id
            )
        }
        return newState
    })
)

// selecting fucntion from reducer  **this is not selector of NgRx!
const { selectEntities, selectAll } = adapter.getSelectors()
export const selectLessonCategEntities = selectEntities
export const selectLessonAll = selectAll

export const getSelectedLesson = (state: State) => state.selectedLesson
export const selectTrainerFilter = (state: State) => state.selectedTrainerFilter
export const selectTrainerFilterList = (state: State) => state.trainerFilterList
export const selectCurrentGym = (state: State) => state.currentCenter
export const selectIsLoading = (state: State) => state.isLoading
export const selectError = (state: State) => state.error
