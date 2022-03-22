import { createAction, props } from '@ngrx/store'

import { LockerGlobalMode } from '@centerStore/reducers/sec.locker.reducer'

import { LockerCategory } from '@schemas/locker-category'
import { LockerItem } from '@schemas/locker-item'

import { CreateItemRequestBody, UpdateItemRequestBody } from '@services/center-locker.service'

const FeatureKey = 'Center/Locker'

// start, finish로 나눠져있거나, action 설명에 to server가 적혀있으면 effect와 연관이 있는 actions

// locker category
// -- // async
export const startLoadLockerCategs = createAction(
    `[${FeatureKey}] Start Loading Locker Categories`,
    props<{ centerId: string }>()
)
export const finishLoadLockerCategs = createAction(
    `[${FeatureKey}] Finish Loading Lesson Categories`,
    props<{ lockerCategList: Array<LockerCategory> }>()
)

export const startCreateLockerCateg = createAction(
    `[${FeatureKey}] Start Create Locker Category`,
    props<{ centerId: string; categName: string }>()
)
export const finishCreateLockerCateg = createAction(
    `[${FeatureKey}] Finish Create Locker Category`,
    props<{ lockerCateg: LockerCategory }>()
)

export const startDeleteLockerCategory = createAction(
    `[${FeatureKey}] Start Delete Locker Category`,
    props<{ centerId: string; categoryId: string }>()
)
export const finishDeleteLockerCategory = createAction(
    `[${FeatureKey}] Finish Delete Locker Category`,
    props<{ deletedCategId: string }>()
)

export const startUpdateLockerCategory = createAction(
    `[${FeatureKey}] Start Update Locker Category`,
    props<{ centerId: string; categoryId: string; updateName: string }>()
)
export const finishUpdateLockerCategory = createAction(`[${FeatureKey}] finish Update Locker Category`)

// locker item
// async
export const startGetLockerItemList = createAction(
    `[${FeatureKey}] Start Get Locker item list`,
    props<{ centerId: string; categoryId: string }>()
)
export const finishGetLockerItemList = createAction(
    `[${FeatureKey}] finish Get Locker item list`,
    props<{ lockerItems?: Array<LockerItem> }>()
)

export const startCreateLockerItem = createAction(
    `[${FeatureKey}] Start Create Locker item`,
    props<{ centerId: string; categoryId: string; reqBody: CreateItemRequestBody }>()
)
export const finishCreateLockerItem = createAction(
    `[${FeatureKey}] finish Create Locker item`,
    props<{ lockerItems?: Array<LockerItem> }>()
)

export const startUpdateLockerItem = createAction(
    `[${FeatureKey}] Start Update Locker item`,
    props<{ centerId: string; categoryId: string; itemId: string; reqBody: UpdateItemRequestBody }>()
)
export const finishUpdateLockerItem = createAction(
    `[${FeatureKey}] finish Update Locker item`,
    props<{ lockerItem?: LockerItem }>()
)

export const startDeleteLockerItem = createAction(
    `[${FeatureKey}] Start Delete Locker item`,
    props<{ centerId: string; categoryId: string; itemId: string; itemName: string }>()
)
export const finishDeleteLockerItem = createAction(`[${FeatureKey}] finish Delete Locker item`)

// -------------------------------------------------------------------------------------------------------------- //
// cur Locker Categ
export const setCurLockerCateg = createAction(
    `[${FeatureKey}] Set Current Locker Category`,
    props<{ lockerCateg: LockerCategory }>()
)
export const resetCurLockerCateg = createAction(`[${FeatureKey}] Reset Current Locker Category`)

// cur Locker ItemList
export const setCurLockerItemList = createAction(
    `[${FeatureKey}] Set Current Locker Item List`,
    props<{ lockerItemList: Array<LockerItem> }>()
)
export const resetCurLockerItemList = createAction(`[${FeatureKey}] Reset Current Locker Item List`)

// cur Locker Item
export const setCurLockerItem = createAction(
    `[${FeatureKey}] Set Current Locker Item`,
    props<{ lockerItem: LockerItem }>()
)
export const resetCurLockerItem = createAction(`[${FeatureKey}] Reset Current Locker Item`)

// will be moved lockerItem
export const setWillBeMovedLockerItem = createAction(
    `[${FeatureKey}] Set Will Be Moved Locker Item`,
    props<{ lockerItem: LockerItem }>()
)
export const resetWillBeMovedLockerItem = createAction(`[${FeatureKey}] Reset Will Be Moved Locker Item`)

// LockerGlobalMode
export const setLockerGlobalMode = createAction(
    `[${FeatureKey}] Set Locker Global Mode`,
    props<{ lockerMode: LockerGlobalMode }>()
)
export const resetLockerGlobalMode = createAction(`[${FeatureKey}] Reset Locker Global Mode`)

// curCenterId
export const setCurCenterId = createAction(`[${FeatureKey}] Set Current Center Id`, props<{ centerId: string }>())
export const resetCurCenterId = createAction(`[${FeatureKey}] Reset Current Center Id`)

// common
export const resetAll = createAction(`[${FeatureKey}] Reset Locker All State`)
export const error = createAction(`[${FeatureKey}] Locker State Error`, props<{ error: string }>())
