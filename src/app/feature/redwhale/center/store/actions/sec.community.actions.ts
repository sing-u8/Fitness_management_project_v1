import { createAction, props } from '@ngrx/store'

const FeatureKey = 'Center/Community'

// cur center id
export const setCurCenterId = createAction(`[${FeatureKey}] Set Current Center Id`, props<{ centerId: string }>())

// common
export const resetAll = createAction(`[${FeatureKey}] Reset Dashboard All State`)
export const error = createAction(`[${FeatureKey}] Dashboard State Error`, props<{ error: string }>())
