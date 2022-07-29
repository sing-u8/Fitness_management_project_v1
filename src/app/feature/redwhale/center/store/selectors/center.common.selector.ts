import { createSelector, createFeatureSelector } from '@ngrx/store'
import { GymFeature, GymState } from './sec.selector'
import * as FromCommon from '@centerStore/reducers/center.common.reducer'

export const FeatureKey = 'Center/Common'
export const CommonFeature = createSelector(GymFeature, (state: GymState) => state[FeatureKey])

export const curCenter = createSelector(CommonFeature, FromCommon.selectCurCenter)
export const instructors = createSelector(CommonFeature, FromCommon.selectInstructors)
