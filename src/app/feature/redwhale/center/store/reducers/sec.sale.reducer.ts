import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import _ from 'lodash'
import dayjs from 'dayjs'

// schemas
import { Loading } from '@schemas/store/loading'
import { StatsSales } from '@schemas/stats-sales'

import * as SaleActions from '../actions/sec.sale.actions'

export type Filters = 'member' | 'membershipLocker' | 'personInCharge' | 'type'
const isFilteredInit = { member: false, membershipLocker: false, personInCharge: false, type: false }
export type IsFiltered = Record<Filters, boolean>

export type TypeCheckString = 'membership' | 'locker'
export type TypeCheck = Record<TypeCheckString, boolean>
const typeCheckInit = { membership: true, locker: true }

export type InputString = 'member' | 'membershipLocker' | 'personInCharge'
export type Inputs = Record<InputString, string>
const inputsInit = { member: '', membershipLocker: '', personInCharge: '' }

export type SelectedDate = string | [string, string]
export type DateType = string
export const DateTypeInit = undefined
export type DateRange = [string, string]
export const DateRangeInit = [undefined, undefined]

export interface State {
    // common
    curCenterId: string
    isLoading: Loading
    error: string

    // main
    saleData: Array<StatsSales>
    isFiltered: IsFiltered
    typeCheck: TypeCheck
    inputs: Inputs
    selectedDate: SelectedDate
}

export const initialState: State = {
    // common
    curCenterId: undefined,
    isLoading: 'idle',
    error: '',

    // main
    saleData: [],
    isFiltered: isFilteredInit,
    typeCheck: typeCheckInit,
    inputs: inputsInit,
    selectedDate: dayjs().format('YYYY.MM'),
}

export const saleReducer = createImmerReducer(
    initialState,

    // main
    // - // async

    // sync
    on(SaleActions.setSaleData, (state) => {
        return state
    }),

    // common
    on(SaleActions.resetAll, (state) => {
        state = { ...state, ...initialState }
        return state
    }),
    on(SaleActions.setCurCenterId, (state, { centerId }) => {
        state.curCenterId = centerId
        return state
    }),
    on(SaleActions.setError, (state, { error }) => {
        state.error = error
        return state
    })
)

// common
export const selectCurCenterId = (state: State) => state.curCenterId
export const selectError = (state: State) => state.error
export const selectIsLoading = (state: State) => state.isLoading

// main
export const selectIsFiltered = (state: State) => state.isFiltered
export const selectTypeCheck = (state: State) => state.typeCheck
export const selectInputs = (state: State) => state.inputs
export const selectSelectedDate = (state: State) => state.selectedDate
export const selectSaleData = (state: State) => state.saleData
