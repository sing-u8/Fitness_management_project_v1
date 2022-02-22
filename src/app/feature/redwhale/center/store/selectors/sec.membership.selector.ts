import { createSelector } from '@ngrx/store'
import { GymFeature, GymState } from './sec.selector'
import * as FromMembership from '@centerStore/reducers/sec.membership.reducer'

import * as _ from 'lodash'

export const FeatureKey = 'Gym/Membership'

export const GymMembershipFature = createSelector(GymFeature, (state: GymState) => state[FeatureKey])

export const membershipCategEntities = createSelector(GymMembershipFature, FromMembership.selectMembershipCategEntities)

export const membershipAll = createSelector(GymMembershipFature, FromMembership.selectMembershipAll)

export const selectedMembership = createSelector(GymMembershipFature, FromMembership.getSelectedMembership)

export const currentCenter = createSelector(GymMembershipFature, FromMembership.selectCurrentGym)
export const isLoading = createSelector(GymMembershipFature, FromMembership.selectIsLoading)
export const error = createSelector(GymMembershipFature, FromMembership.selectError)
