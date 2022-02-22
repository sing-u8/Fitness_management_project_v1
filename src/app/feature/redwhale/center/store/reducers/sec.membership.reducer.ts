import { Action, on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity'
import * as _ from 'lodash'

import * as MembershipActions from '../actions/sec.membership.actions'

import { MembershipCategory } from '@schemas/membership-category'
import { MembershipItem } from '@schemas/membership-item'
import { Loading } from '@schemas/store/loading'

export interface SelectedMembership {
    membershipData: MembershipItem
    categId: string
    categName: string
    centerId: string
}
export const initialSelectedMembership: SelectedMembership = {
    membershipData: undefined,
    categId: undefined,
    categName: undefined,
    centerId: undefined,
}

export interface MembershipCategoryState extends MembershipCategory {
    isCategOpen: boolean
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
    selectId: selectCategoryId,
    sortComparer: (a, b) => Number(a.id) - Number(b.id),
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
    on(MembershipActions.startAddMembershipCateg, (state) => state),
    on(MembershipActions.FinishAddMembershipCateg, (state, { membershipCateg }) => {
        const newOneLesCategState: MembershipCategoryState = { ...membershipCateg, isCategOpen: true }
        return adapter.addOne(newOneLesCategState, state)
    }),
    on(MembershipActions.removeMembershipCateg, (state, { id }) => {
        return adapter.removeOne(id, state)
    }),
    // categ data
    on(MembershipActions.changeMembershipCategName, (state, { id, categName }) => {
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
    on(MembershipActions.finishiAddMembershipToCateg, (state, { categId, newMembershipData }) => {
        const copyOneLesCategState = state.entities[categId]
        const copyCategItems = _.cloneDeep(state.entities[categId].items)
        copyCategItems.push(newMembershipData)
        return adapter.updateOne({ id: categId, changes: { ...copyOneLesCategState, items: copyCategItems } }, state)
    }),
    on(MembershipActions.setCategIsOpen, (state, { id, isOpen }) => {
        const copyOneLesCategState = state.entities[id]
        return adapter.updateOne({ id: id, changes: { ...copyOneLesCategState, isCategOpen: isOpen } }, state)
    }),

    // current gym
    on(MembershipActions.setCurrentGym, (state, { currentCenter }) => {
        state.currentCenter = currentCenter
        return state
    }),
    on(MembershipActions.resetCurrentGym, (state) => {
        state.currentCenter = ''
        return state
    }),

    // selected membership
    on(MembershipActions.setSelectedMembership, (state, { selectedMembership }) => {
        state.selectedMembership = selectedMembership
        return state
    }),
    on(MembershipActions.removeSelectedMembership, (state, { selectedMembership }) => {
        // need to update categ list -- finish v1
        const categId = selectedMembership.categId
        state.entities[categId].items = _.filter(
            state.entities[categId].items,
            (item) => item.id != selectedMembership.membershipData.id
        )
        state.selectedMembership = initialSelectedMembership
        return state
    }),
    on(MembershipActions.resetSelectedMembership, (state) => {
        state.selectedMembership = initialSelectedMembership
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

    // actions from lesson
    on(MembershipActions.finishUpsertState, (state, { membershipCategState }): State => {
        const newState: State = adapter.upsertMany(membershipCategState, _.cloneDeep(state))
        const preSelMembership = newState.selectedMembership
        if (preSelMembership.membershipData != undefined) {
            newState.selectedMembership.membershipData = newState.entities[preSelMembership.categId].items.find(
                (categItem) => categItem.id == preSelMembership.membershipData.id
            )
        }
        return newState
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
