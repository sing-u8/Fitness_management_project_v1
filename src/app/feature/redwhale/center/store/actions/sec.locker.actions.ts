import { createAction, props } from '@ngrx/store'

import { LockerGlobalMode } from '@centerStore/reducers/sec.locker.reducer'

import { LockerCategory } from '@schemas/locker-category'
import { LockerItem } from '@schemas/locker-item'

import { CreateItemRequestBody, UpdateItemRequestBody } from '@services/center-locker.service'
import {
    CreateLockerTicketReqBody,
    ExpireLockerTicketReqBody,
    RefundLockerTicketReqBody,
    StartLockerTicketReqBody,
    ExtendLockerTicketReqBody,
} from '@services/center-users-locker.service.service'
import { UserLocker } from '@schemas/user-locker'
import { LockerItemHistory } from '@schemas/locker-item-history'

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
    props<{ centerId: string; categoryId: string; updateName: string; cb?:() => void }>()
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

// !! replaced with locker component method --> (modifying)
export const startCreateLockerItem = createAction(
    `[${FeatureKey}] Start Create Locker item`,
    props<{
        centerId: string
        categoryId: string
        reqBody: CreateItemRequestBody
        cbFn?: (newItem: LockerItem) => void
    }>()
)
export const finishCreateLockerItem = createAction(
    `[${FeatureKey}] Finish Create Locker item`,
    props<{ lockerItem?: LockerItem }>()
)

export const addLockerItemToList = createAction(
    `[${FeatureKey}] Add Current Locker Item to CurLocker List`,
    props<{ lockerItem: LockerItem }>()
)

export const startUpdateLockerItem = createAction(
    `[${FeatureKey}] Start Update Locker item`,
    props<{
        centerId: string
        categoryId: string
        itemId: string
        reqBody: UpdateItemRequestBody
        curLockerItems: LockerItem[]
        cb?: () => void
    }>()
)

export const startDeleteLockerItem = createAction(
    `[${FeatureKey}] Start Delete Locker item`,
    props<{ centerId: string; categoryId: string; item: LockerItem; curItemList: LockerItem[] }>()
)

export const startStopItem = createAction(
    `[${FeatureKey}] Start Stop Locker item`,
    props<{
        centerId: string
        categoryId: string
        selectedItem: LockerItem
        curItemList: LockerItem[]
    }>()
)
export const startResumeItem = createAction(
    `[${FeatureKey}] Start Resume Locker item`,
    props<{
        centerId: string
        categoryId: string
        selectedItem: LockerItem
        curItemList: LockerItem[]
    }>()
)

// locker ticket 락커 이용권
export const startCreateLockerTicket = createAction(
    `[${FeatureKey}] Start Create Locker Ticket`,
    props<{
        centerId: string
        registerMemberId: string
        createLockerTicketReqBody: CreateLockerTicketReqBody
        cb?: () => void
    }>()
)
export const finishCreateLockerTicket = createAction(
    `[${FeatureKey}] finish Create Locker Ticket`,
    props<{ lockerItems: LockerItem[]; lockerItem: LockerItem; userLocker: UserLocker }>()
)

export const startExpireLockerTicket = createAction(
    `[${FeatureKey}] Start Expire Locker Ticket`,
    props<{
        centerId: string
        userId: string
        lockerTicketId: string
        reqBody: ExpireLockerTicketReqBody
        cb?: () => void
    }>()
)
export const finishExpireLockerTicket = createAction(
    `[${FeatureKey}] Finish Expire Locker Ticket`,
    props<{ lockerItems: LockerItem[]; lockerItem: LockerItem }>()
)

export const startRefundLockerTicket = createAction(
    `[${FeatureKey}] Start Refund Locker Ticket`,
    props<{
        centerId: string
        userId: string
        lockerTicketId: string
        reqBody: RefundLockerTicketReqBody
        cb?: () => void
    }>()
)
export const finishRefundLockerTicket = createAction(
    `[${FeatureKey}] Finish Refund Locker Ticket`,
    props<{ lockerItems: LockerItem[]; lockerItem: LockerItem }>()
)

export const startExtendLockerTicket = createAction(
    `[${FeatureKey}] Start Extend Locker Ticket`,
    props<{
        centerId: string
        userId: string
        lockerTicketId: string
        reqBody: ExtendLockerTicketReqBody
        cb?: () => void
    }>()
)
export const finishExtendLockerTicket = createAction(
    `[${FeatureKey}] Finish Extend Locker Ticket`,
    props<{ extendedUserLocker: UserLocker; lockerItems: LockerItem[]; lockerItem: LockerItem }>()
)

export const startMoveLockerTicket = createAction(
    `[${FeatureKey}] Start Move Locker Ticket`,
    props<{
        centerId: string
        userId: string
        lockerTicketId: string
        startLockerReqBody: StartLockerTicketReqBody
        cb?: () => void
    }>()
)
export const finishMoveLockerTicket = createAction(
    `[${FeatureKey}] Finish Refund Locker Ticket`,
    props<{ lockerItems: LockerItem[]; movedLockerItem: LockerItem }>()
)

export const startMoveLockerTicketInDashboard = createAction(
    `[${FeatureKey}] Start Move Locker Ticket In Dashboard`,
    props<{
        centerId: string
        userId: string
        lockerTicketId: string
        startLockerReqBody: StartLockerTicketReqBody
        callback: () => void
    }>()
)

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
export const updateCurLockerItemList = createAction(
    `[${FeatureKey} Update Current Locker Item List]`,
    props<{ lockerItemList: Array<LockerItem> }>()
)
export const resetCurLockerItemList = createAction(`[${FeatureKey}] Reset Current Locker Item List`)

// cur Locker Item
export const startSetCurLockerItem = createAction(
    `[${FeatureKey}] Start Set Current Locker Item`,
    props<{ lockerItem: LockerItem }>()
)
export const finishSetCurLockerItem = createAction(
    `[${FeatureKey}] Finish Set Current Locker Item`,
    props<{ userLocker: UserLocker }>()
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

// synchronize
// // by dashboard
export const startUpdateStateAfterRegisterLockerInDashboard = createAction(
    `[${FeatureKey}] Start Update State After Register Locker In Dashboard`
)

export const startSynchronizeLockerItemList = createAction(
    `[${FeatureKey}] Start Synchronize Locker Item List`,
    props<{ centerId: string; cb?: () => void }>()
)
export const finishSynchronizeLockerItemList = createAction(
    `[${FeatureKey}] Finish Synchronize Locker Item List`,
    props<{ success: boolean; lockerItems?: Array<LockerItem> }>()
)

export const startSynchronizeCurLockerItem = createAction(
    `[${FeatureKey}] Start Synchronize Cur Locker Item`,
    props<{ centerId: string; userId: string }>()
)
export const finishSynchronizeCurLockerItem = createAction(
    `[${FeatureKey}] Finish Synchronize Cur Locker Item`,
    props<{ success: boolean }>()
)
