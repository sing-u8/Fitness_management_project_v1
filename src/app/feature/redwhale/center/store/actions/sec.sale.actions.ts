import { createAction, props } from '@ngrx/store'

import * as FromSaleReducer from '@centerStore/reducers/sec.sale.reducer'

const FeatureKey = 'Center/Sale'

// main
// - // async

// sync
export const setIsFiltered = createAction(`[${FeatureKey}] Set isFiltered state`)
export const setTypeCheck = createAction(`[${FeatureKey}] Set TypeCheck state`)
export const setInputs = createAction(`[${FeatureKey}] Set Inputs`)
export const resetInputs = createAction(`[${FeatureKey}] Reset isFiltered state`)

// common
export const resetAll = createAction(`[${FeatureKey}] Reset All Schedule States`)
export const setCurCenterId = createAction(`[${FeatureKey}] Set Current Center Id`, props<{ centerId: string }>())
export const setError = createAction(`[${FeatureKey}] Set Schedule Error Message`, props<{ error: string }>())
