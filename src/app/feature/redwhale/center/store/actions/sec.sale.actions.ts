import { createAction, props } from '@ngrx/store'

import * as FromSaleReducer from '@centerStore/reducers/sec.sale.reducer'

import { StatsSales } from '@schemas/stats-sales'

import { getStatsSaleOption } from '@services/center-stats.service'

const FeatureKey = 'Center/Sale'

// main
// - // async
export const startGetSaleData = createAction(
    `[${FeatureKey}] Start Get Sale Data`,
    props<{ centerId: string; date: string; option?: getStatsSaleOption }>()
)
export const finishGetSaleData = createAction(
    `[${FeatureKey}] Finish Get Sale Data`,
    props<{ saleData: Array<StatsSales> }>()
)

// sync
export const setIsFiltered = createAction(
    `[${FeatureKey}] Set isFiltered state`,
    props<{ newState: Partial<FromSaleReducer.IsFiltered> }>()
)
export const setTypeCheck = createAction(
    `[${FeatureKey}] Set TypeCheck state`,
    props<{ newState: Partial<FromSaleReducer.TypeCheck> }>()
)
export const resetTypeCheck = createAction(`[${FeatureKey}] reset TypeCheck state`)
export const setInputs = createAction(
    `[${FeatureKey}] Set Inputs`,
    props<{ newState: Partial<FromSaleReducer.Inputs> }>()
)
export const resetInputs = createAction(`[${FeatureKey}] Reset isFiltered state`)
export const setSelectedDate = createAction(
    `${[FeatureKey]} Set Selected Date`,
    props<{ selectedDate: FromSaleReducer.SelectedDate }>()
)
export const setSaleData = createAction(`${[FeatureKey]} Set Sale Data`, props<{ saleData: Array<StatsSales> }>())

// common
export const resetAll = createAction(`[${FeatureKey}] Reset All Schedule States`)
export const setCurCenterId = createAction(`[${FeatureKey}] Set Current Center Id`, props<{ centerId: string }>())
export const setError = createAction(`[${FeatureKey}] Set Schedule Error Message`, props<{ error: string }>())
