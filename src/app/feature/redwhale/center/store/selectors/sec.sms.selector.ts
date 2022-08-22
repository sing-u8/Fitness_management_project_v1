import { createSelector, createFeatureSelector } from '@ngrx/store'
import { GymFeature, GymState } from './sec.selector'
import * as FromSMS from '@centerStore/reducers/sec.sms.reducer'

export const FeatureKey = 'Center/SMS'
export const SMSFeature = createSelector(GymFeature, (state: GymState) => state[FeatureKey])
