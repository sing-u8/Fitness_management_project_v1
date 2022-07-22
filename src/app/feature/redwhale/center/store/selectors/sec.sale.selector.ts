import { createSelector } from '@ngrx/store'
import { GymFeature, GymState } from './sec.selector'
import * as FromSale from '@centerStore/reducers/sec.sale.reducer'

import _ from 'lodash'

export const FeatureKey = 'Center/Sale'

export const GymSaleFeature = createSelector(GymFeature, (state: GymState) => state[FeatureKey])

export const isFiltered = createSelector(GymSaleFeature, FromSale.selectIsFiltered)
export const typeCheck = createSelector(GymSaleFeature, FromSale.selectTypeCheck)
export const productCheck = createSelector(GymSaleFeature, FromSale.selectProductCheck)
export const inputs = createSelector(GymSaleFeature, FromSale.selectInputs)
export const selectedDate = createSelector(GymSaleFeature, FromSale.selectSelectedDate)
export const saleData = createSelector(GymSaleFeature, FromSale.selectSaleData)
export const saleStatistics = createSelector(GymSaleFeature, FromSale.selectSaleStatistics)

// sale summary
export const saleSummaryData = createSelector(GymSaleFeature, FromSale.selectSummaryData)
export const saleSummaryLoading = createSelector(GymSaleFeature, FromSale.selectSaleSummaryLoading)
