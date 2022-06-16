import { createAction, props } from '@ngrx/store'

import * as FromCommunity from '@centerStore/reducers/sec.community.reducer'

import { ChatRoom } from '@schemas/chat-room'
import { ChatRoomMessage } from '@schemas/chat-room-message'
import { ChatRoomUser } from '@schemas/chat-room-user'
import { CenterUser } from '@schemas/center-user'

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

export const startGetChatRooms = createAction(
    `[${FeatureKey}] Start Get Chat Rooms`,
    props<{ centerId: string; curUserId: string; spot: FromCommunity.spot }>()
)
export const finishGetChatRooms = createAction(
    `[${FeatureKey}] Finish Get Chat Rooms`,
    props<{ chatRooms: Array<ChatRoom> }>()
)

export const startJoinChatRoom = createAction(
    `[${FeatureKey}] Start Join Chat Room`,
    props<{ chatRoom: ChatRoom; centerId: string; spot: FromCommunity.spot }>()
)
export const finishJoinChatRoom = createAction(
    `[${FeatureKey}] Finish Join Chat Room`,
    props<{
        chatRoom: ChatRoom
        chatRoomMesgs: Array<ChatRoomMessage>
        chatRoomUsers: Array<ChatRoomUser>
        spot: FromCommunity.spot
        isSameRoom: boolean
    }>()
)

export const startGetChatRoomMsgs = createAction(
    `[${FeatureKey}] Start Get Chat Room Messages`,
    props<{ centerId: string; chatRoomId: string }>()
)
export const finishGetChatRoomMsgs = createAction(
    `[${FeatureKey}] Finish Get Chat Room Messages`,
    props<{ chatRoomMsgs: Array<ChatRoomMessage> }>()
)

export const startUpdateChatRoomName = createAction(
    `[${FeatureKey}] Start Change Chat Room Name`,
    props<{ centerId: string; reqBody: ChatRoomApi.UpdateCenterRoomReqBody; spot: FromCommunity.spot }>()
)
export const finishUpdateChatRoomName = createAction(
    `[${FeatureKey}] Finish Change Chat Room Name`,
    props<{ chatRoom: ChatRoom; spot: FromCommunity.spot }>()
)

export const startLeaveChatRoom = createAction(
    `[${FeatureKey}] Start Leave Chat Room`,
    props<{ centerId: string; spot: FromCommunity.spot }>()
)
export const finishLeaveChatRoom = createAction(
    `[${FeatureKey}] Finish Leave Chat Room`,
    props<{ spot: FromCommunity.spot }>()
)

export const startInviteMembers = createAction(
    `[${FeatureKey}] Start Invite Members to ChatRoom`,
    props<{
        centerId: string
        invitedMembers: Array<CenterUser>
        spot: FromCommunity.spot
    }>()
)
export const finishiInviteMembers = createAction(
    `[${FeatureKey}] Finish Invite Members to ChatRoom`,
    props<{ chatRoom: ChatRoom; spot: FromCommunity.spot }>()
)

export const startSendMessage = createAction(
    `[${FeatureKey}] Start Send Message to ChatRoom`,
    props<{
        centerId: string
        reqBody: ChatRoomApi.SendMessageReqBody
        spot: FromCommunity.spot
    }>()
)
export const finishSendMessage = createAction(
    `[${FeatureKey}] Finish Send Message to ChatRoom`,
    props<{
        chatRoomMessage: ChatRoomMessage
        spot: FromCommunity.spot
    }>()
)

// - // sync
export const updateChatRooms = createAction(`[${FeatureKey}] Update Chat Room`, props<{ chatRoom: ChatRoom }>())
export const updateChatRoomMsgs = createAction(
    `[${FeatureKey}] Update Chat Room Messages`,
    props<{ chatRoomMsg: ChatRoomMessage }>()
)
