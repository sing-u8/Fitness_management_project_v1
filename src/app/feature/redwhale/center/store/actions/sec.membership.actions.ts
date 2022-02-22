import { createAction, props } from '@ngrx/store'

import { SelectedMembership, MembershipCategoryState } from '../reducers/sec.membership.reducer'

import { MembershipCategory } from '@schemas/membership-category'
import { MembershipItem } from '@schemas/membership-item'
import { UpdateItemRequestBody } from '@services/gym-membership.service'

const FeatureKey = 'Gym/Membership'

// start, finish로 나눠져있거나, action 설명에 to server가 적혀있으면 effect와 연관이 있는 actions

// Membership category
export const startLoadMembershipCategs = createAction(
    `[${FeatureKey}] Start Loading Membership Categories`,
    props<{ centerId: string }>()
)
export const finishLoadMembershipCategs = createAction(
    `[${FeatureKey}] Finish Loading Membership Categories`,
    props<{ membershipCategState: Array<MembershipCategoryState> }>()
)
export const updateMembershipCategs = createAction(
    `[${FeatureKey}] update Membership Categories`,
    props<{ membershipCategState: Array<MembershipCategoryState> }>()
)
export const resetMembershipCategs = createAction(`[${FeatureKey}] Reset Membership Categories`)
export const startAddMembershipCateg = createAction(
    `[${FeatureKey}] Start Add Membership Category`,
    props<{ centerId: string; categName: string }>()
)
export const FinishAddMembershipCateg = createAction(
    `[${FeatureKey}] Finish Adding Membership Category`,
    props<{ membershipCateg: MembershipCategory }>()
)
export const removeMembershipCateg = createAction(
    `[${FeatureKey}] Remove Membership Category to server`,
    props<{ id: string; centerId: string }>()
)

// categ data
export const changeMembershipCategName = createAction(
    `[${FeatureKey}] Change Membership Category Name to Server`,
    props<{ centerId: string; id: string; categName: string }>()
)
export const startAddMembershipToCateg = createAction(
    `[${FeatureKey}] Start Add New Membership to Membership Category to server`,
    props<{
        centerId: string
        categId: string
        categName: string
        reqBody: { name: string; sequence_number: number }
    }>()
)
export const finishiAddMembershipToCateg = createAction(
    `[${FeatureKey}] Finishi Adding New Membership to Membership Category to server`,
    props<{
        categId: string
        newMembershipData: MembershipItem
    }>()
)

export const setCategIsOpen = createAction(
    `[${FeatureKey}] Set Category Status`,
    props<{ id: string; isOpen: boolean }>()
)

// current gym
export const setCurrentGym = createAction(`[${FeatureKey}] Set Current Gym`, props<{ currentCenter: string }>())
export const resetCurrentGym = createAction(`[${FeatureKey}] Set Reset CurrentGym`)

// selected membership
export const setSelectedMembership = createAction(
    `[${FeatureKey}] Set Selected Membership`,
    props<{ selectedMembership: SelectedMembership }>()
)
export const updateSelectedMembership = createAction(
    `[${FeatureKey} Update Selected Membership to Server]`,
    props<{ selectedMembership: SelectedMembership; reqBody: UpdateItemRequestBody }>()
)
export const removeSelectedMembership = createAction(
    `[${FeatureKey} remove Selected Membership to Server]`,
    props<{ selectedMembership: SelectedMembership }>()
)
export const refreshSelectedMembership = createAction(
    `[${FeatureKey}] Refresh Selected Membership`
    // props<{ selectedMembership: SelectedMembership }>()
)
export const resetSelectedMembership = createAction(`[${FeatureKey}] Reset Selected Membership`)

//
export const resetAll = createAction(`[${FeatureKey}] Reset All`)
export const error = createAction(`[${FeatureKey}] Membership Category State Error`, props<{ error: string }>())

// actions from lesson
export const startUpsertState = createAction(
    `[${FeatureKey}] Start Upsert State called by lesson screen`,
    props<{ centerId: string }>()
)
export const finishUpsertState = createAction(
    `[${FeatureKey}] Finish Upsert State called by lesson screen`,
    props<{ membershipCategState: Array<MembershipCategoryState> }>()
)
