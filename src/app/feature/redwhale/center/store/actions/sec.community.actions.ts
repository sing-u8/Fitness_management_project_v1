import { createAction, props } from '@ngrx/store'

import * as FromCommunity from '@centerStore/reducers/sec.community.reducer'

import { ChatRoom } from '@schemas/chat-room'

import * as ChatRoomApi from '@services/center-chat-room.service'

const FeatureKey = 'Center/Community'

// cur center id
export const setCurCenterId = createAction(`[${FeatureKey}] Set Current Center Id`, props<{ centerId: string }>())

// common
export const resetAll = createAction(`[${FeatureKey}] Reset Community All State`)
export const error = createAction(`[${FeatureKey}] Community State Error`, props<{ error: string }>())

// main
// - // async
export const startCreateChatRoom = createAction(
    `[${FeatureKey}] Start Create Chat Room`,
    props<{ centerId: string; reqBody: ChatRoomApi.CreateChatRoomReqBody; spot: FromCommunity.spot }>()
)
export const finishCreateChatRoom = createAction(
    `[${FeatureKey}] Finish Create Chat Room`,
    props<{ chatRoom: ChatRoom; spot: FromCommunity.spot }>()
)

// - // sync
