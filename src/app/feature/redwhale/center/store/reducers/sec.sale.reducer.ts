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

export type SaleType = 'day' | 'month'
export type SaleSummary = {
    prev: { cash: number; card: number; trans: number; unpaid: number }
    cur: { cash: number; card: number; trans: number; unpaid: number }
}
export type TotalSummary = {
    prev: number
    cur: number
}

export const SaleSummaryInit = {
    prev: { cash: 0, card: 0, trans: 0, unpaid: 0 },
    cur: { cash: 0, card: 0, trans: 0, unpaid: 0 },
}
export const TotalSummaryInit = {
    prev: 0,
    cur: 0,
}

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

    isSaleSummaryLoading: Loading
    // day summary
    saleSummary: Record<SaleType, SaleSummary>
    saleTotal: Record<SaleType, TotalSummary>
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

    isSaleSummaryLoading: 'idle',
    saleSummary: {
        day: SaleSummaryInit,
        month: SaleSummaryInit,
    },
    saleTotal: {
        day: TotalSummaryInit,
        month: TotalSummaryInit,
    },
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

    on(SaleActions.startGetSaleSummary, (state) => {
        state.isSaleSummaryLoading = 'pending'
        return state
    }),
    on(SaleActions.finishGetSaleSummary, (state, { saleSummary }) => {
        state.isSaleSummaryLoading = 'done'
        state.saleSummary.day = {
            prev: {
                cash: Number(saleSummary.yesterday.cash),
                trans: Number(saleSummary.yesterday.trans),
                card: Number(saleSummary.yesterday.card),
                unpaid: Number(saleSummary.yesterday.unpaid),
            },
            cur: {
                cash: Number(saleSummary.today.cash),
                trans: Number(saleSummary.today.trans),
                card: Number(saleSummary.today.card),
                unpaid: Number(saleSummary.today.unpaid),
            },
        }
        state.saleTotal.day.prev = _.reduce(_.values(saleSummary.yesterday), (acc, cur) => acc + Number(cur), 0)
        state.saleTotal.day.cur = _.reduce(_.values(saleSummary.today), (acc, cur) => acc + Number(cur), 0)

        state.saleSummary.month = {
            prev: {
                cash: Number(saleSummary.last_month.cash),
                trans: Number(saleSummary.last_month.trans),
                card: Number(saleSummary.last_month.card),
                unpaid: Number(saleSummary.last_month.unpaid),
            },
            cur: {
                cash: Number(saleSummary.this_month.cash),
                trans: Number(saleSummary.this_month.trans),
                card: Number(saleSummary.this_month.card),
                unpaid: Number(saleSummary.this_month.unpaid),
            },
        }
        state.saleTotal.month.prev = _.reduce(_.values(saleSummary.last_month), (acc, cur) => acc + Number(cur), 0)
        state.saleTotal.month.cur = _.reduce(_.values(saleSummary.this_month), (acc, cur) => acc + Number(cur), 0)

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
    on(SaleActions.resetInput, (state, { inputType }) => {
        state.inputs = {
            ...state.inputs,
            ...{
                [inputType]: '',
            },
        }
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
export const selectSaleData = (state: State) => excludeZeroSale(state.saleData)

export const selectSaleStatistics = (state: State) => {
    return _.reduce(
        excludeZeroSale(state.saleData),
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
// sale summary
export const selectSummaryData = (state: State) => ({
    saleSummary: state.saleSummary,
    totalSummary: state.saleTotal,
})
export const selectSaleSummaryLoading = (state: State) => state.isSaleSummaryLoading

// helper
function excludeZeroSale(sales: StatsSales[]) {
    return sales.filter((v) => !(v.card == 0 && v.cash == 0 && v.trans == 0 && v.unpaid == 0))
}
