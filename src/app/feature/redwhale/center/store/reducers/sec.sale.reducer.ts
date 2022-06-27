import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import _ from 'lodash'
import dayjs from 'dayjs'

// schemas
import { Loading } from '@schemas/store/loading'
import { StatsSales } from '@schemas/stats-sales'

import * as SaleActions from '../actions/sec.sale.actions'

export type Filters = 'member' | 'membershipLocker' | 'personInCharge' | 'type' | 'product'
const isFilteredInit = { member: false, membershipLocker: false, personInCharge: false, type: false, product: false }
export type IsFiltered = Record<Filters, boolean>

export type TypeCheckString = 'payment' | 'refund' | 'transfer'
export type TypeCheck = Record<TypeCheckString, boolean>
const typeCheckInit = { payment: true, refund: true, transfer: true }

export type ProductCheckString = 'membership' | 'locker'
export type ProductCheck = Record<ProductCheckString, boolean>
const ProductCheckInit = { membership: true, locker: true }

export type InputString = 'member' | 'membershipLocker' | 'personInCharge'
export type Inputs = Record<InputString, string>
const inputsInit = { member: '', membershipLocker: '', personInCharge: '' }

export type SaleStatistics = { total: number; cash: number; card: number; trans: number; unpaid: number }
export const SaleStatisticsInit = {
    total: 0,
    cash: 0,
    card: 0,
    trans: 0,
    unpaid: 0,
}

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
    productCheck: ProductCheck
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
    productCheck: ProductCheckInit,
    inputs: inputsInit,
    selectedDate: dayjs().format('YYYY.MM'),
}

export const saleReducer = createImmerReducer(
    initialState,

    // main
    // - // async
    on(SaleActions.startGetSaleData, (state) => {
        return state
    }),
    on(SaleActions.finishGetSaleData, (state, { saleData }) => {
        state.saleData = saleData
        return state
    }),

    // sync
    on(SaleActions.setIsFiltered, (state, { newState }) => {
        state.isFiltered = { ...state.isFiltered, ...newState }
        return state
    }),
    on(SaleActions.setTypeCheck, (state, { newState }) => {
        state.typeCheck = { ...state.typeCheck, ...newState }
        return state
    }),
    on(SaleActions.resetTypeCheck, (state) => {
        state.typeCheck = typeCheckInit
        return state
    }),
    on(SaleActions.setProductCheck, (state, { newState }) => {
        state.productCheck = { ...state.productCheck, ...newState }
        return state
    }),
    on(SaleActions.resetProductCheck, (state) => {
        state.productCheck = ProductCheckInit
        return state
    }),
    on(SaleActions.setInputs, (state, { newState }) => {
        state.inputs = { ...state.inputs, ...newState }
        return state
    }),
    on(SaleActions.resetInputs, (state) => {
        state.inputs = inputsInit
        return state
    }),
    on(SaleActions.setSelectedDate, (state, { selectedDate }) => {
        state.selectedDate = selectedDate
        return state
    }),
    on(SaleActions.setSaleData, (state, { saleData }) => {
        state.saleData = saleData
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
export const selectProductCheck = (state: State) => state.productCheck
export const selectInputs = (state: State) => state.inputs
export const selectSelectedDate = (state: State) => state.selectedDate
export const selectSaleData = (state: State) => state.saleData
export const selectSaleStatistics = (state: State) => {
    return _.reduce(
        state.saleData,
        (acc, cur) => {
            acc.card = cur.type_code == 'payment_type_refund' ? acc.card - cur.card : acc.card + cur.card
            acc.cash = cur.type_code == 'payment_type_refund' ? acc.cash - cur.cash : acc.cash + cur.cash
            acc.trans = cur.type_code == 'payment_type_refund' ? acc.trans - cur.trans : acc.trans + cur.trans
            acc.unpaid = cur.type_code == 'payment_type_refund' ? acc.unpaid - cur.unpaid : acc.unpaid + cur.unpaid
            acc.total =
                cur.type_code == 'payment_type_refund'
                    ? acc.total - (cur.card + cur.cash + cur.trans + cur.unpaid)
                    : acc.total + cur.card + cur.cash + cur.trans + cur.unpaid
            return acc
        },
        _.cloneDeep(SaleStatisticsInit)
    )
}
