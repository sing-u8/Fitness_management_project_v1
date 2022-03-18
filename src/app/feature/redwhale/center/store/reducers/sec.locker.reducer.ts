import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import _ from 'lodash'

import * as LockerActions from '../actions/sec.locker.actions'

import { LockerCategory } from '@schemas/locker-category'
import { LockerItem } from '@schemas/locker-item'
import { Loading } from '@schemas/store/loading'

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
    curLockerCateg: undefined,
    curLockerItemList: [],
    curLockerItem: undefined,
    willBeMovedLockerItem: undefined,
    lockerGlobalMode: 'normal',
    curCenterId: '',
    isLoading: 'idle',
    error: '',
})

export const lockerReducer = createImmerReducer(
    initialState,
    on(LockerActions.startLoadLockerCategs, (state): State => {
        state.isLoading = 'pending'
        return state
    }),
    on(LockerActions.finishLoadLockerCategs, (state, { lockerCategList }): State => {
        const newState: State = { ...state, ...{ isLoading: 'done' } }
        return adapter.setMany(lockerCategList, newState)
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
