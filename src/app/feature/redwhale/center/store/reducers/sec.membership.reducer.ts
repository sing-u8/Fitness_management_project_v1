import { Action, on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity'
import _ from 'lodash'

import * as MembershipActions from '../actions/sec.membership.actions'

import { MembershipCategory, FE_MembershipCategory } from '@schemas/membership-category'
import { MembershipItem } from '@schemas/membership-item'
import { Loading } from '@schemas/store/loading'
import { ClassItem } from '@schemas/class-item'
import * as LessonActions from '@centerStore/actions/sec.lesson.actions'
import { finishRefreshLinkedLessons, startRefreshLinkedLessons } from '../actions/sec.membership.actions'

export interface SelectedMembership {
    membershipData: MembershipItem
    categId: string
    categName: string
    centerId: string
    linkedClassItems?: Array<ClassItem>
    linkableClassItems?: Array<ClassItem>
    isLoading?: Loading
    willBeLinkedClassItemRecord?: Record<string, ClassItem>
}
export const initialSelectedMembership: SelectedMembership = {
    membershipData: undefined,
    categId: undefined,
    categName: undefined,
    centerId: undefined,
    linkedClassItems: [],
    linkableClassItems: [],
    isLoading: 'idle',
    willBeLinkedClassItemRecord: undefined,
}

export interface MembershipCategoryState extends FE_MembershipCategory {
    isCategOpen: boolean
    initialInputOn: boolean
    isCategPending: Loading
}

export type currentCenter = string

export interface State extends EntityState<MembershipCategoryState> {
    selectedMembership: SelectedMembership
    currentCenter: currentCenter
    isLoading: Loading
    error: string
}

export function selectCategoryId(categ: MembershipCategory): string {
    return categ.id
}
export const adapter: EntityAdapter<MembershipCategoryState> = createEntityAdapter<MembershipCategoryState>({
    // selectId: selectCategoryId,
    // sortComparer: false, // (a, b) => Number(a.id) - Number(b.id),
})
export const initialState: State = adapter.getInitialState({
    selectedMembership: initialSelectedMembership,
    currentCenter: '',
    isLoading: 'idle',
    error: '',
})

export const membershipReducer = createImmerReducer(
    initialState,
    // Membership category
    on(MembershipActions.startLoadMembershipCategs, (state): State => {
        state.isLoading = 'pending'
        return state
    }),
    on(MembershipActions.finishLoadMembershipCategs, (state, { membershipCategState }): State => {
        const newState: State = { ...state, ...{ isLoading: 'done' } }
        return adapter.setMany(membershipCategState, newState)
    }),
    on(MembershipActions.updateMembershipCategs, (state, { membershipCategState }): State => {
        const copyState: State = adapter.upsertMany(membershipCategState, _.cloneDeep(state))
        copyState.selectedMembership.membershipData = copyState.entities[
            copyState.selectedMembership.categId
        ].items.find((membership) => membership.id == copyState.selectedMembership.membershipData.id)

        return copyState
    }),
    on(MembershipActions.resetMembershipCategs, (state) => {
        return adapter.removeAll({ ...state })
    }),
    on(MembershipActions.FinishAddMembershipCateg, (state, { membershipCateg }) => {
        const newOneLesCategState: MembershipCategoryState = {
            ...membershipCateg,
            isCategPending: 'done',
            items: [],
            isCategOpen: true,
            initialInputOn: true,
        }
        return adapter.addOne(newOneLesCategState, state)
    }),
    on(MembershipActions.removeMembershipCateg, (state, { id }) => {
        return adapter.removeOne(id, state)
    }),
    // categ data
    on(MembershipActions.changeMembershipCategName, (state, { id, categName }) => {
        state.entities[id].name = categName
        _.forEach(state.entities[id].items, (item, idx) => {
            state.entities[id].items[idx].category_name = categName
        })

        return state
    }),
    on(MembershipActions.finishAddMembershipToCateg, (state, { categId, newMembershipData }) => {
        const copyOneLesCategState = state.entities[categId]
        const copyCategItems = _.cloneDeep(state.entities[categId].items)
        copyCategItems.push(newMembershipData)
        return adapter.updateOne(
            {
                id: categId,
                changes: { ...copyOneLesCategState, items: copyCategItems, item_count: copyCategItems.length },
            },
            state
        )
    }),
    on(MembershipActions.startSetCategIsOpen, (state, { id, isOpen }) => {
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
    on(MembershipActions.finishSetCategIsOpen, (state, { id, items }) => {
        const copyOneLesCategState = state.entities[id]
        return adapter.updateOne({ id: id, changes: { ...copyOneLesCategState, items, isCategPending: 'done' } }, state)
    }),

    // current center
    on(MembershipActions.setCurrentGym, (state, { currentCenter }) => {
        state.currentCenter = currentCenter
        return state
    }),
    on(MembershipActions.resetCurrentGym, (state) => {
        state.currentCenter = ''
        return state
    }),

    // selected membership
    on(MembershipActions.startMoveMembershipCategory, (state, action) => {
        const updates = action.targetItems.map((v) => ({
            id: v.id,
            changes: v,
        }))
        return adapter.updateMany(updates, state)
    }),
    on(MembershipActions.startMoveMembershipItem, (state, action) => {
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
        if (state.selectedMembership.membershipData?.id == action.targetItem.id) {
            state.selectedMembership.categId = targetCategory.id
            state.selectedMembership.membershipData.category_id = targetCategory.id
            state.selectedMembership.membershipData.category_name = targetCategory.name
        }
        return state
    }),

    on(MembershipActions.startSetSelectedMembership, (state, { selectedMembership }) => {
        state.selectedMembership = _.assign(state.selectedMembership, {
            ...state.selectedMembership,
            ...selectedMembership,
            isLoading: 'pending',
        })
        return state
    }),
    on(MembershipActions.finishSetSelectedMembership, (state, { linkedClassItems, linkableClassItems }) => {
        state.selectedMembership.linkedClassItems = linkedClassItems
        state.selectedMembership.linkableClassItems = linkableClassItems
        state.selectedMembership.isLoading = 'done'
        return state
    }),
    on(MembershipActions.startRefreshLinkedLessons, (state) => {
        state.selectedMembership = _.assign(state.selectedMembership, {
            ...state.selectedMembership,
            isLoading: 'pending',
        })
        return state
    }),
    on(MembershipActions.finishRefreshLinkedLessons, (state, { linkedClassItems, linkableClassItems }) => {
        state.selectedMembership.linkedClassItems = linkedClassItems
        state.selectedMembership.linkableClassItems = linkableClassItems
        state.selectedMembership.isLoading = 'done'
        return state
    }),
    on(MembershipActions.updateSelectedMembership, (state, { selectedMembership, reqBody }) => {
        state.selectedMembership.membershipData = {
            ...state.selectedMembership.membershipData,
            ...reqBody,
        }
        const itemIdx = _.findIndex(
            state.entities[selectedMembership.categId].items,
            (v) => v.id == selectedMembership.membershipData.id
        )
        _.assign(state.entities[selectedMembership.categId].items[itemIdx], reqBody)
        return state
    }),
    on(MembershipActions.removeSelectedMembership, (state, { selectedMembership }) => {
        const categId = selectedMembership.categId
        state.entities[categId].items = _.filter(
            state.entities[categId].items,
            (item) => item.id != selectedMembership.membershipData.id
        )
        state.selectedMembership = initialSelectedMembership
        state.entities[selectedMembership.categId].item_count -= 1
        return state
    }),
    on(MembershipActions.resetSelectedMembership, (state) => {
        state.selectedMembership = initialSelectedMembership
        return state
    }),
    on(MembershipActions.updateWillBeLinkedClassItem, (state, { classItem }) => {
        if (_.isEmpty(state.selectedMembership.willBeLinkedClassItemRecord)) {
            state.selectedMembership.willBeLinkedClassItemRecord = {
                [classItem.id]: classItem,
            }
        } else {
            if (_.has(state.selectedMembership.willBeLinkedClassItemRecord, classItem.id)) {
                state.selectedMembership.willBeLinkedClassItemRecord = _.omit(
                    state.selectedMembership.willBeLinkedClassItemRecord,
                    classItem.id
                )
            } else {
                _.assign(state.selectedMembership.willBeLinkedClassItemRecord, { [classItem.id]: classItem })
            }
        }
        return state
    }),
    on(MembershipActions.resetWillBeLinkedClassItem, (state) => {
        state.selectedMembership.willBeLinkedClassItemRecord = undefined
        return state
    }),

    // common
    on(MembershipActions.resetAll, (state) => {
        return adapter.removeAll({
            ...state,
            currentCenter: '',
            isLoading: 'idle',
            error: '',
        })
    }),
    on(MembershipActions.error, (state, { error }) => {
        console.log('Gym/Membership error: ', error)
        return state
    }),

    // linked lesson
    on(MembershipActions.startLinkClass, (state) => {
        _.values(state.selectedMembership.willBeLinkedClassItemRecord).forEach((mv) => {
            state.selectedMembership.linkedClassItems.push(mv)
            _.remove(state.selectedMembership.linkableClassItems, (v) => v.id == mv.id)
        })
        return state
    }),
    on(MembershipActions.startUnlinkClass, (state, { unlinkClass }) => {
        state.selectedMembership.linkableClassItems.push(unlinkClass)
        state.selectedMembership.linkableClassItems = _.sortBy(
            state.selectedMembership.linkableClassItems,
            (v) => v.category_id
        )
        _.remove(state.selectedMembership.linkedClassItems, (v) => v.id == unlinkClass.id)
        return state
    }),
    // inital input
    on(MembershipActions.disableInitInput, (state, { categId }): State => {
        return adapter.updateOne({ id: categId, changes: { initialInputOn: false } }, state)
    })
)

// selecting fucntion from reducer  **this is not selector of NgRx!
const { selectEntities, selectAll } = adapter.getSelectors()
export const selectMembershipCategEntities = selectEntities
export const selectMembershipAll = selectAll

export const getSelectedMembership = (state: State) => state.selectedMembership

export const selectCurrentGym = (state: State) => state.currentCenter
export const selectIsLoading = (state: State) => state.isLoading
export const selectError = (state: State) => state.error
