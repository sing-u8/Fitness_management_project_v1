import { createSelector, createFeatureSelector } from '@ngrx/store'
import { GymFeature, GymState } from './sec.selector'
import * as FromCommunity from '@centerStore/reducers/sec.community.reducer'
import _ from 'lodash'

export const FeatureKey = 'Center/Community'
export const CommunityFeature = createSelector(GymFeature, (state: GymState) => state[FeatureKey])

// common
export const curCenterId = createSelector(CommunityFeature, FromCommunity.selectCurCenterId)
export const isLoading = createSelector(CommunityFeature, FromCommunity.selectIsLoading)
export const error = createSelector(CommunityFeature, FromCommunity.selectError)
