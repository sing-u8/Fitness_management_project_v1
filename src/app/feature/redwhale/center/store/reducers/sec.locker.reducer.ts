import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import _ from 'lodash'

import * as LockerActions from '../actions/sec.locker.actions'

import { LockerCategory } from '@schemas/locker-category'
import { LockerItem } from '@schemas/locker-item'
import { Loading } from '@schemas/store/loading'
import { UserLocker } from '@schemas/user-locker'
import { finishSynchronizeCurLockerItem } from '../actions/sec.locker.actions'

export const initialLockerState: {
    curLockerCateg: LockerCategory
    curLockerItemList: Array<LockerItem>
    curLockerItemsListIsLoading: Loading
    curLockerItem: LockerItem
    curUserLocker: UserLocker
    curUserLockerIsLoading: Loading
    willBeMovedLockerItem: LockerItem
    lockerGlobalMode: LockerGlobalMode
    curCenterId: string
    isLoading: Loading
    error: string
} = {
    curLockerCateg: undefined,
    curLockerItemList: [],
    curLockerItemsListIsLoading: 'idle',
    curLockerItem: undefined,
    curUserLocker: undefined,
    curUserLockerIsLoading: 'idle',
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
    curLockerItemsListIsLoading: Loading
    curLockerItem: LockerItem
    curUserLocker: UserLocker
    curUserLockerIsLoading: Loading
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
    // - // locker category
    on(LockerActions.finishCreateLockerCateg, (state, { lockerCateg }) => {
        const copyState = adapter.addOne(lockerCateg, state)
        copyState.curLockerCateg = lockerCateg
        return copyState
    }),
    on(LockerActions.startDeleteLockerCategory, (state, { categoryId }) => {
        const stateCopy = adapter.removeOne(categoryId, state)
        stateCopy.curLockerItemList = initialLockerState.curLockerItemList
        return stateCopy
    }),
    on(LockerActions.finishDeleteLockerCategory, (state, { deletedCategId }) => {
        const newState = adapter.removeOne(deletedCategId, state)
        newState.curLockerCateg = initialLockerState.curLockerCateg
        return newState
    }),
    on(LockerActions.startUpdateLockerCategory, (state, { categoryId, updateName }) => {
        // const copyOneCateg = _.cloneDeep(state.entities[categoryId])
        return adapter.updateOne({ id: categoryId, changes: { name: updateName } }, state)
    }),
    on(LockerActions.finishUpdateLockerCategory, (state) => {
        return state
    }),
    // -- // locker item
    on(LockerActions.startGetLockerItemList, (state, { categoryId, centerId }) => {
        state.curLockerItemsListIsLoading = 'pending'
        return state
    }),
    on(LockerActions.finishGetLockerItemList, (state, { lockerItems }) => {
        state.curLockerItemsListIsLoading = 'done'
        state.curLockerItemList = lockerItems
        return state
    }),
    // !! modifying
    on(LockerActions.startCreateLockerItem, (state, { centerId, categoryId, reqBody }) => {
        state.curLockerItemList.push({
            ...reqBody,
        } as LockerItem)
        return state
    }),
    on(LockerActions.finishCreateLockerItem, (state, { lockerItem }) => {
        const newItemIdx = _.findIndex(state.curLockerItemList, (item) => {
            return lockerItem.x == item.x && lockerItem.y == item.y
        })
        state.curLockerItemList[newItemIdx] = lockerItem
        return state
    }),

    on(LockerActions.startUpdateLockerItem, (state, { itemId, reqBody, curLockerItems }) => {
        let newItem: LockerItem = undefined
        let newItemId: number = undefined
        const curLockerItems_copy = _.cloneDeep(curLockerItems)
        _.find(curLockerItems, (item, idx) => {
            if (item.id == itemId) {
                curLockerItems_copy[idx] = { ...curLockerItems_copy[idx], ...reqBody }
                newItem = curLockerItems_copy[idx]
                newItemId = idx
                return true
            }
            return false
        })
        state.curLockerItemList[newItemId] = newItem
        return state
    }),

    on(LockerActions.startDeleteLockerItem, (state, { item, curItemList }) => {
        state.curLockerItemList = _.filter(state.curLockerItemList, (lockerItem) => lockerItem.id != item.id) // _.cloneDeep(curItemList) // _.filter(curItemList, (lockerItem) => lockerItem.id != item.id)
        if (state.curLockerItem?.id == item.id) {
            state.curLockerItem = initialLockerState.curLockerItem
        }
        return state
    }),

    on(LockerActions.startStopItem, (state, { selectedItem, curItemList }) => {
        state.curLockerItemList = _.map(curItemList, (lockerItem) => {
            if (lockerItem.id == selectedItem.id) {
                return {
                    ...lockerItem,
                    state_code: 'locker_item_state_stop_using',
                    state_code_name: '사용중지',
                }
            }
            return lockerItem
        })
        state.curLockerItem.state_code = 'locker_item_state_stop_using'
        state.curLockerItem.state_code_name = '사용중지'
        return state
    }),
    on(LockerActions.startResumeItem, (state, { selectedItem, curItemList }) => {
        state.curLockerItemList = _.map(curItemList, (lockerItem) => {
            if (lockerItem.id == selectedItem.id) {
                return {
                    ...lockerItem,
                    state_code: 'locker_item_state_empty',
                    state_code_name: '비어있음',
                }
            }
            return lockerItem
        })
        state.curLockerItem.state_code = 'locker_item_state_empty'
        state.curLockerItem.state_code_name = '비어있음'
        return state
    }),

    // - // locker ticket
    on(LockerActions.finishCreateLockerTicket, (state, { lockerItems, lockerItem, userLocker }) => {
        state.curLockerItemList = lockerItems
        state.curLockerItem = lockerItem
        state.curUserLocker = userLocker
        return state
    }),

    on(LockerActions.finishRefundLockerTicket, (state, { lockerItem, lockerItems }) => {
        state.curLockerItemList = lockerItems
        return state
    }),
    on(LockerActions.finishExpireLockerTicket, (state, { lockerItem, lockerItems }) => {
        state.curLockerItemList = lockerItems
        return state
    }),
    on(LockerActions.finishExtendLockerTicket, (state, { extendedUserLocker, lockerItems, lockerItem }) => {
        state.curLockerItem = lockerItem
        state.curLockerItemList = lockerItems
        state.curUserLocker = extendedUserLocker
        return state
    }),

    on(LockerActions.finishMoveLockerTicket, (state, { movedLockerItem, lockerItems }) => {
        state.curLockerItemList = lockerItems
        state.curLockerItem = movedLockerItem
        return state
    }),
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
    on(LockerActions.addLockerItemToList, (state, { lockerItem }) => {
        state.curLockerItemList.push(lockerItem)
        return state
    }),
    on(LockerActions.startSetCurLockerItem, (state, { lockerItem }) => {
        state.curLockerItem = lockerItem
        state.curUserLockerIsLoading = 'pending'
        return state
    }),
    on(LockerActions.finishSetCurLockerItem, (state, { userLocker }) => {
        state.curUserLocker = userLocker
        state.curUserLockerIsLoading = 'done'
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
    }),

    // reducer called outside
    on(LockerActions.finishSynchronizeLockerItemList, (state, { success, lockerItems }) => {
        if (success) {
            state.curLockerItemList = lockerItems
        }
        return state
    }),
    on(LockerActions.finishSynchronizeCurLockerItem, (state, { success }) => {
        return state
    })

    //
)

// selecting fucntion from reducer
const { selectEntities, selectAll } = adapter.getSelectors()
export const selectLockerCategEntities = selectEntities
export const selectLockerCategList = selectAll

export const selectLockerCategLength = (state: State) => {
    return state.ids.length
}

export const selectCurLockerCateg = (state: State) => state.curLockerCateg
export const selectCurLockerItem = (state: State) => state.curLockerItem
export const selectCurUserLocker = (state: State) => state.curUserLocker
export const selectCurUserLockerLoading = (state: State) => state.curUserLockerIsLoading
export const selectCurLockerItemList = (state: State) => state.curLockerItemList
export const selectCurLockerItemListIsLoading = (state: State) => state.curLockerItemsListIsLoading
export const selectWillBeMovedLockerItem = (state: State) => state.willBeMovedLockerItem
export const selectLockerGlobalMode = (state: State) => state.lockerGlobalMode
export const selectCurCenterId = (state: State) => state.curCenterId
export const selectIsLoading = (state: State) => state.isLoading
export const selectError = (state: State) => state.error
