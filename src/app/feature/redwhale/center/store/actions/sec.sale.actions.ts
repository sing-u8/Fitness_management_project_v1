import { createAction, props } from '@ngrx/store'

import * as FromSaleReducer from '@centerStore/reducers/sec.sale.reducer'

import { StatsSales } from '@schemas/stats-sales'

const FeatureKey = 'Center/Sale'

// main
// - // async

// sync
export const setIsFiltered = createAction(
    `[${FeatureKey}] Set isFiltered state`,
    props<{ newState: Partial<{ [P in FromSaleReducer.Filters]: boolean }> }>()
)
export const setTypeCheck = createAction(`[${FeatureKey}] Set TypeCheck state`)
export const resetTypeCheck = createAction(`[${FeatureKey}] reset TypeCheck state`)
export const setInputs = createAction(`[${FeatureKey}] Set Inputs`)
export const resetInputs = createAction(`[${FeatureKey}] Reset isFiltered state`)
export const setSelectedDate = createAction(`${[FeatureKey]} Set Selected Date`)
export const setSaleData = createAction(`${[FeatureKey]} Set Sale Data`, props<{ saleData: Array<StatsSales> }>())

// common
export const resetAll = createAction(`[${FeatureKey}] Reset All Schedule States`)
export const setCurCenterId = createAction(`[${FeatureKey}] Set Current Center Id`, props<{ centerId: string }>())
export const setError = createAction(`[${FeatureKey}] Set Schedule Error Message`, props<{ error: string }>())
