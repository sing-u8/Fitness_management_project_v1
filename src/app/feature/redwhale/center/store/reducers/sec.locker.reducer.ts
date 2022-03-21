import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import _ from 'lodash'

import * as LockerActions from '../actions/sec.locker.actions'

import { LockerCategory } from '@schemas/locker-category'
import { LockerItem } from '@schemas/locker-item'
import { Loading } from '@schemas/store/loading'

export const initialLockerState: {
    curLockerCateg: LockerCategory
    curLockerItemList: Array<LockerItem>
    curLockerItem: LockerItem
    willBeMovedLockerItem: LockerItem
    lockerGlobalMode: LockerGlobalMode
    curCenterId: string
    isLoading: Loading
    error: string
} = {
    curLockerCateg: undefined,
    curLockerItemList: [],
    curLockerItem: undefined,
    willBeMovedLockerItem: undefined,
    lockerGlobalMode: 'normal',
    curCenterId: '',
    isLoading: 'idle',
    error: '',
}
export type LockerGlobalMode = 'normal' | 'moveLockerTicket'

export interface State extends EntityState<LockerCategory> {
    curLockerCateg: LockerCategory
    curLockerItemList: Array<LockerItem>
    curLockerItem: LockerItem
    willBeMovedLockerItem: LockerItem
    lockerGlobalMode: LockerGlobalMode
    curCenterId: string
    isLoading: Loading
    error: string
}

export const adapter: EntityAdapter<LockerCategory> = createEntityAdapter<LockerCategory>({})

export const initialState: State = adapter.getInitialState({
    ...initialLockerState,
})

export const lockerReducer = createImmerReducer(
    initialState,
    // async
    on(LockerActions.startLoadLockerCategs, (state): State => {
        state.isLoading = 'pending'
        return state
    }),
    on(LockerActions.finishLoadLockerCategs, (state, { lockerCategList }): State => {
        const newState: State = { ...state, ...{ isLoading: 'done' } }
        return adapter.setMany(lockerCategList, newState)
    }),
    // 아직 미구현 ----------------------------
    // - // locker category
    on(LockerActions.finishCreateLockerCateg, (state) => {
        return state
    }),
    on(LockerActions.startDeleteLockerCategory, (state) => {
        return state
    }),
    on(LockerActions.finishDeleteLockerCategory, (state) => {
        return state
    }),
    on(LockerActions.startUpdateLockerCategory, (state) => {
        return state
    }),
    on(LockerActions.finishUpdateLockerCategory, (state) => {
        return state
    }),
    // -- // locker item
    on(LockerActions.finishGetLockerItemList, (state) => {
        return state
    }),
    on(LockerActions.finishCreateLockerItem, (state) => {
        return state
    }),

    on(LockerActions.startUpdateLockerItem, (state) => {
        return state
    }),
    on(LockerActions.finishUpdateLockerItem, (state) => {
        return state
    }),

    on(LockerActions.startDeleteLockerItem, (state) => {
        return state
    }),
    on(LockerActions.finishDeleteLockerItem, (state) => {
        return state
    }),

    // ---------------------------- 아직 미구현

    // sync
    // - // cur Locker Categ
    on(LockerActions.setCurLockerCateg, (state, { lockerCateg }) => {
        state.curLockerCateg = lockerCateg
        return state
    }),
    on(LockerActions.resetCurLockerCateg, (state) => {
        state.curLockerCateg = initialLockerState.curLockerCateg
        return state
    }),
    // cur Locker ItemList
    on(LockerActions.setCurLockerItemList, (state, { lockerItemList }) => {
        state.curLockerItemList = lockerItemList
        return state
    }),
    on(LockerActions.resetCurLockerItemList, (state) => {
        state.curLockerItemList = initialLockerState.curLockerItemList
        return state
    }),
    // - // cur Locker Item
    on(LockerActions.setCurLockerItem, (state, { lockerItem }) => {
        state.curLockerItem = lockerItem
        return state
    }),
    on(LockerActions.resetCurLockerItem, (state) => {
        state.curLockerItem = initialLockerState.curLockerItem
        return state
    }),
    // - // will be moved lockerItem
    on(LockerActions.setWillBeMovedLockerItem, (state, { lockerItem }) => {
        state.willBeMovedLockerItem = lockerItem
        return state
    }),
    on(LockerActions.resetWillBeMovedLockerItem, (state) => {
        state.willBeMovedLockerItem = initialLockerState.willBeMovedLockerItem
        return state
    }),
    // - // LockerGlobalMode
    on(LockerActions.setLockerGlobalMode, (state, { lockerMode }) => {
        state.lockerGlobalMode = lockerMode
        return state
    }),
    on(LockerActions.resetLockerGlobalMode, (state) => {
        state.lockerGlobalMode = initialLockerState.lockerGlobalMode
        return state
    }),
    // - //curCenterId
    on(LockerActions.setCurCenterId, (state, { centerId }) => {
        state.curCenterId = centerId
        return state
    }),
    on(LockerActions.resetCurCenterId, (state) => {
        state.curCenterId = initialLockerState.curCenterId
        return state
    }),

    // common
    on(LockerActions.resetAll, (state) =>
        adapter.removeAll({
            ...state,
            curLockerCateg: undefined,
            curLockerItemList: [],
            curLockerItem: undefined,
            willBeMovedLockerItem: undefined,
            lockerGlobalMode: 'normal',
            curCenterId: '',
            isLoading: 'idle',
            error: '',
        })
    ),
    on(LockerActions.error, (state, { error }) => {
        console.log('Center/Locker error: ', error)
        return state
    })
)

// selecting fucntion from reducer
const { selectEntities, selectAll } = adapter.getSelectors()
export const selectLockerCategEntities = selectEntities
export const selectLockerStateAll = selectAll

export const selectCurLockerCateg = (state: State) => state.curLockerCateg
export const selectCurLockerItem = (state: State) => state.curLockerItem
export const selectCurLockerItemList = (state: State) => state.curLockerItemList
export const selectWillBeMovedLockerItem = (state: State) => state.willBeMovedLockerItem
export const selectLockerGlobalMode = (state: State) => state.lockerGlobalMode
export const selectCurCenterId = (state: State) => state.curCenterId
export const selectIsLoading = (state: State) => state.isLoading
export const selectError = (state: State) => state.error
