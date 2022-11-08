import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import { EntityState, EntityAdapter, createEntityAdapter, Dictionary } from '@ngrx/entity'
import _ from 'lodash'

import * as LessonActions from '../actions/sec.lesson.actions'

import { ClassCategory, FE_ClassCategory } from '@schemas/class-category'
import { ClassItem } from '@schemas/class-item'
import { Loading } from '@schemas/store/loading'
import { CenterUser } from '@schemas/center-user'
import { MembershipItem } from '@schemas/membership-item'
import { startMoveLessonItem } from '../actions/sec.lesson.actions'

export interface SelectedLesson {
    lessonData: ClassItem
    categId: string
    categName: string
    centerId: string
    linkedMembershipItems?: Array<MembershipItem>
    linkableMembershipItems?: Array<MembershipItem>
    isLoading?: Loading
    willBeLinkedMembershipItemRecord?: Record<string, MembershipItem> // Array<MembershipItem>
}
export const initialSelectedLesson: SelectedLesson = {
    lessonData: undefined,
    categId: undefined,
    categName: undefined,
    centerId: undefined,
    linkedMembershipItems: [],
    linkableMembershipItems: [],
    isLoading: 'idle',
    willBeLinkedMembershipItemRecord: undefined,
}

export interface LessonCategoryState extends FE_ClassCategory {
    isCategOpen: boolean
    initialInputOn: boolean
    isCategPending: Loading
}

export interface TrainerFilter {
    name: string
    value: CenterUser
}
export const initialTrainerFilter: TrainerFilter = {
    name: '강사 전체보기',
    value: undefined,
}
export const initialTrainerFilterList: Array<TrainerFilter> = [
    {
        name: '강사 전체보기',
        value: undefined,
    },
]

export type currentCenter = string

export interface State extends EntityState<LessonCategoryState> {
    selectedLesson: SelectedLesson
    currentCenter: currentCenter
    isLoading: Loading
    error: string

    selectedTrainerFilter: TrainerFilter
    trainerFilterList: Array<TrainerFilter>
}

export function selectCategoryId(categ: ClassCategory): string {
    return categ.id
}
export const adapter: EntityAdapter<LessonCategoryState> = createEntityAdapter<LessonCategoryState>({
    // selectId: selectCategoryId,
    // sortComparer: false, // (a, b) => Number(a.id) - Number(b.id),
})
export const initialState: State = adapter.getInitialState({
    selectedLesson: initialSelectedLesson,
    currentCenter: '',
    isLoading: 'idle',
    error: '',
    selectedTrainerFilter: initialTrainerFilter,
    trainerFilterList: initialTrainerFilterList,
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
        return adapter.setMany(lessonCategState, newState)
    }),
    on(LessonActions.updateLessonCategs, (state, { lessonCategState }): State => {
        const copyState: State = adapter.upsertMany(lessonCategState, _.cloneDeep(state))
        copyState.selectedLesson.lessonData = copyState.entities[copyState.selectedLesson.categId].items.find(
            (membership) => membership.id == copyState.selectedLesson.lessonData.id
        )
        return copyState
    }),
    on(LessonActions.resetLessonCategs, (state) => {
        return adapter.removeAll({ ...state })
    }),
    on(LessonActions.FinishAddLessonCateg, (state, { lessonCateg }) => {
        const newOneLesCategState: LessonCategoryState = {
            ...lessonCateg,
            isCategPending: 'done',
            items: [],
            isCategOpen: true,
            initialInputOn: true,
        }
        return adapter.addOne(newOneLesCategState, state)
    }),
    on(LessonActions.removeLessonCateg, (state, { id }) => {
        return adapter.removeOne(id, state)
    }),
    // categ data
    on(LessonActions.changeLessonCategName, (state, { id, categName }) => {
        state.entities[id].name = categName
        _.forEach(state.entities[id].items, (item, idx) => {
            state.entities[id].items[idx].category_name = categName
        })

        return state
    }),
    on(LessonActions.finishAddLessonToCateg, (state, { categId, newLessonData }) => {
        const copyOneLesCategState = state.entities[categId]
        const copyCategItems = _.cloneDeep(state.entities[categId].items)
        copyCategItems.push(newLessonData)
        return adapter.updateOne(
            {
                id: categId,
                changes: { ...copyOneLesCategState, items: copyCategItems, item_count: copyCategItems.length },
            },
            state
        )
    }),
    on(LessonActions.startSetCategIsOpen, (state, { id, isOpen }) => {
        const copyOneLesCategState = state.entities[id]
        return adapter.updateOne(
            {
                id: id,
                changes: {
                    ...copyOneLesCategState,
                    isCategOpen: isOpen,
                    initialInputOn: false,
                    isCategPending: 'pending',
                },
            },
            state
        )
    }),
    on(LessonActions.finishSetCategIsOpen, (state, { id, items }) => {
        const copyOneLesCategState = state.entities[id]
        return adapter.updateOne({ id: id, changes: { ...copyOneLesCategState, items, isCategPending: 'done' } }, state)
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
    on(LessonActions.startMoveLessonItem, (state, action) => {
        const targetCategory = state.entities[action.targetCategId]
        state.entities[action.targetCategId].items = action.targetItems.map((v) => ({
            ...v,
            category_id: targetCategory.id,
            category_name: targetCategory.name,
        }))
        state.entities[action.targetCategId].item_count = action.targetItems.length
        if (action.targetCategId != action.sourceCategId) {
            state.entities[action.sourceCategId].items = state.entities[action.sourceCategId].items.filter(
                (v) => v.id != action.targetItem.id
            )
            state.entities[action.sourceCategId].item_count -= 1
        }
        if (state.selectedLesson.lessonData?.id == action.targetItem.id) {
            state.selectedLesson.categId = targetCategory.id
            state.selectedLesson.lessonData.category_id = targetCategory.id
            state.selectedLesson.lessonData.category_name = targetCategory.name
        }
        return state
    }),
    on(LessonActions.startMoveLessonCategory, (state, action) => {
        const updates = action.targetItems.map((v) => ({
            id: v.id,
            changes: v,
        }))
        return adapter.updateMany(updates, state)
    }),
    on(LessonActions.startSetSelectedLesson, (state, { selectedLesson }) => {
        state.selectedLesson = _.assign(state.selectedLesson, {
            ...state.selectedLesson,
            ...selectedLesson,
            isLoading: 'pending',
        })
        return state
    }),
    on(LessonActions.finishSetSelectedLesson, (state, { linkedMembershipItems, linkableMembershipItems }) => {
        state.selectedLesson.linkedMembershipItems = linkedMembershipItems
        state.selectedLesson.linkableMembershipItems = linkableMembershipItems
        state.selectedLesson.isLoading = 'done'
        return state
    }),
    on(LessonActions.startUpdateSelectedLessonInstructor, (state, { selectedLesson, instructorItems }) => {
        state.selectedLesson.lessonData.instructors = instructorItems.filter((v) => v.checked).map((v) => v.value)
        const itemIdx = _.findIndex(
            state.entities[selectedLesson.categId].items,
            (v) => v.id == selectedLesson.lessonData.id
        )
        state.entities[selectedLesson.categId].items[itemIdx].instructors = state.selectedLesson.lessonData.instructors
        return state
    }),
    on(LessonActions.updateSelectedLesson, (state, { selectedLesson, reqBody }) => {
        state.selectedLesson.lessonData = {
            ...state.selectedLesson.lessonData,
            ...reqBody,
        }
        const itemIdx = _.findIndex(
            state.entities[selectedLesson.categId].items,
            (v) => v.id == selectedLesson.lessonData.id
        )
        _.assign(state.entities[selectedLesson.categId].items[itemIdx], reqBody)
        return state
    }),
    on(LessonActions.removeSelectedLesson, (state, { selectedLesson }) => {
        const categId = selectedLesson.categId
        state.entities[categId].items = _.filter(
            state.entities[categId].items,
            (item) => item.id != selectedLesson.lessonData.id
        )
        state.selectedLesson = initialSelectedLesson
        state.entities[selectedLesson.categId].item_count -= 1
        return state
    }),
    on(LessonActions.resetSelectedLesson, (state) => {
        state.selectedLesson = initialSelectedLesson
        return state
    }),
    on(LessonActions.updateWillBeLinkedMembershipItem, (state, { membershipItem }) => {
        if (_.isEmpty(state.selectedLesson.willBeLinkedMembershipItemRecord)) {
            state.selectedLesson.willBeLinkedMembershipItemRecord = {
                [membershipItem.id]: membershipItem,
            }
        } else {
            if (_.has(state.selectedLesson.willBeLinkedMembershipItemRecord, membershipItem.id)) {
                state.selectedLesson.willBeLinkedMembershipItemRecord = _.omit(
                    state.selectedLesson.willBeLinkedMembershipItemRecord,
                    membershipItem.id
                )
            } else {
                _.assign(state.selectedLesson.willBeLinkedMembershipItemRecord, { [membershipItem.id]: membershipItem })
            }
        }
        return state
    }),
    on(LessonActions.resetWillBeLinkedMembershipItem, (state) => {
        state.selectedLesson.willBeLinkedMembershipItemRecord = undefined
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
        console.log('Center/Lesson error: ', error)
        return state
    }),

    // linked Membership
    on(LessonActions.startLinkMemberships, (state) => {
        _.values(state.selectedLesson.willBeLinkedMembershipItemRecord).forEach((mv) => {
            state.selectedLesson.linkedMembershipItems.push(mv)
            _.remove(state.selectedLesson.linkableMembershipItems, (v) => v.id == mv.id)
        })
        return state
    }),
    on(LessonActions.startUnlinkMembership, (state, { unlinkMembership }) => {
        state.selectedLesson.linkableMembershipItems.push(unlinkMembership)
        state.selectedLesson.linkableMembershipItems = _.sortBy(
            state.selectedLesson.linkableMembershipItems,
            (v) => v.category_id
        )
        _.remove(state.selectedLesson.linkedMembershipItems, (v) => v.id == unlinkMembership.id)
        return state
    }),

    // inital input
    on(LessonActions.disableInitInput, (state, { categId }): State => {
        return adapter.updateOne({ id: categId, changes: { initialInputOn: false } }, state)
    })
)

// selecting fucntion from reducer  **this is not selector of NgRx!
const { selectEntities, selectAll } = adapter.getSelectors()
export const selectLessonCategEntities = selectEntities
export const selectLessonAll = selectAll

export const getLessonLength = (state: State) => {
    let lessonLength = 0
    state.ids.forEach((id) => {
        lessonLength += state.entities[id].items.length
    })
    return lessonLength
}

export const getSelectedLesson = (state: State) => state.selectedLesson
export const selectTrainerFilter = (state: State) => state.selectedTrainerFilter
export const selectTrainerFilterList = (state: State) => state.trainerFilterList
export const selectCurrentGym = (state: State) => state.currentCenter
export const selectIsLoading = (state: State) => state.isLoading
export const selectError = (state: State) => state.error
