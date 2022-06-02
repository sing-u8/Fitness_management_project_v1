import { createSelector } from '@ngrx/store'
import { GymFeature, GymState } from './sec.selector'
import * as FromSale from '@centerStore/reducers/sec.sale.reducer'

import _ from 'lodash'
import { Dictionary } from '@ngrx/entity'

export const FeatureKey = 'Center/Sale'

export const GymSaleFeature = createSelector(GymFeature, (state: GymState) => state[FeatureKey])

export const isFiltered = createSelector(GymSaleFeature, FromSale.selectIsFiltered)
export const typeCheck = createSelector(GymSaleFeature, FromSale.selectTypeCheck)
export const inputs = createSelector(GymSaleFeature, FromSale.selectInputs)
export const selectedDate = createSelector(GymSaleFeature, FromSale.selectSelectedDate)
