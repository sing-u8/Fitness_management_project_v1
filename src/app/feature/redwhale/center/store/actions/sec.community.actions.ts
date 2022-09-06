import { createAction, props } from '@ngrx/store'

import * as FromCommunity from '@centerStore/reducers/sec.community.reducer'

import { ChatRoom } from '@schemas/chat-room'
import { ChatRoomMessage, ChatRoomLoadingMessage } from '@schemas/chat-room-message'
import { ChatRoomUser } from '@schemas/chat-room-user'
import { CenterUser } from '@schemas/center-user'
import { ChatFile } from '@schemas/center/community/chat-file'
import { Center } from '@schemas/center'
import * as WS from '@schemas/web-socket/web-socket'

import * as ChatRoomApi from '@services/center-chat-room.service'
import { User } from '@schemas/user'

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
    props<{ chatRooms: Array<ChatRoom>; spot: FromCommunity.spot }>()
)

export const startJoinChatRoom = createAction(
    `[${FeatureKey}] Start Join Chat Room`,
    props<{ chatRoom: ChatRoom; centerId: string; spot: FromCommunity.spot }>()
)
export const finishJoinChatRoom = createAction(
    `[${FeatureKey}] Finish Join Chat Room`,
    props<{
        centerId: string
        chatRoom: ChatRoom
        chatRoomMesgs: Array<ChatRoomMessage>
        chatRoomUsers: Array<ChatRoomUser>
        spot: FromCommunity.spot
        isSameRoom: boolean
    }>()
)

export const startGetMoreChatRoomMsgs = createAction(
    `[${FeatureKey}] Start Get Chat Room Messages`,
    props<{ centerId: string; spot: FromCommunity.spot }>()
)
export const finishGetMoreChatRoomMsgs = createAction(
    `[${FeatureKey}] Finish Get Chat Room Messages`,
    props<{ chatRoomMsgs: Array<ChatRoomMessage>; spot: FromCommunity.spot; chatRoomMsgEnd: boolean }>()
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

export const startSendMessageWithFile = createAction(
    `[${FeatureKey}] Start Send Message With File to ChatRoom`,
    props<{
        centerId: string
        user: User
        text: string
        fileList: Array<ChatFile>
        spot: FromCommunity.spot
    }>()
)
// export const finishSendMessageWithFile = createAction(
//     `[${FeatureKey}] Finish Send Message With File to ChatRoom`,
//     props<{
//         chatRoomMessage: ChatRoomMessage
//         spot: FromCommunity.spot
//     }>()
// )

// - // -- // async for temp room
export const startSendMessageToTempRoom = createAction(
    `[${FeatureKey}] Start Send Message to TempChatRoom`,
    props<{
        centerId: string
        reqBody: {
            createRoom: ChatRoomApi.CreateChatRoomReqBody
            sendMsg: ChatRoomApi.SendMessageReqBody
        }
        spot: FromCommunity.spot
    }>()
)
export const finishSendMessageToTempRoom = createAction(
    `[${FeatureKey}] Finish Send Message to TempChatRoom`,
    props<{
        chatRoom: ChatRoom
        chatRoomMessage: ChatRoomMessage
        spot: FromCommunity.spot
    }>()
)

export const startSendMessageWithFileToTempRoom = createAction(
    `[${FeatureKey}] Start Send Message With File to TempChatRoom`,
    props<{
        centerId: string
        user: User
        user_ids: Array<string>
        text: string
        fileList: Array<ChatFile>
        spot: FromCommunity.spot
    }>()
)

// - // sync
export const joinTempChatRoom = createAction(
    `[${FeatureKey}] Join Temp Chat Room`,
    props<{ chatRoom: ChatRoom; spot: FromCommunity.spot }>()
)
export const createTempChatRoom = createAction(
    `[${FeatureKey}] Create Temp Chat Room`,
    props<{ center: Center; members: Array<CenterUser>; curUser: CenterUser; spot: FromCommunity.spot }>()
)
export const leaveTempChatRoom = createAction(
    `[${FeatureKey}] Leave Temp Chat Room`,
    props<{ spot: FromCommunity.spot }>()
)

export const addChatRoomLoadingMsgs = createAction(
    `[${FeatureKey}] Add Chat Room Loading Messages`,
    props<{ msg: ChatRoomLoadingMessage; spot: FromCommunity.spot }>()
)
export const updateChatRoomLoadingMsg = createAction(
    `[${FeatureKey}] Update Chat Room Loading Messages`,
    props<{ msgId: string; spot: FromCommunity.spot; gauge: number }>()
)
export const removeChatRoomLoadingMsgs = createAction(
    `[${FeatureKey}] remove Chat Room Loading Messages`,
    props<{ loadingMsgId: string; spot: FromCommunity.spot }>()
)

// for web socket
export const createChatRoomByWS = createAction(
    `[${FeatureKey}] Create Chat Room By Web Socket`,
    props<{ ws_data: WS.CreateChatRoom }>()
)
export const updateChatRoomByWS = createAction(
    `[${FeatureKey}] Update Chat Room By Web Socket`,
    props<{ ws_data: WS.UpdateChatRoom }>()
)
export const readChatRoomByWS = createAction(
    `[${FeatureKey}] Read Chat Room By Web Socket`,
    props<{ ws_data: WS.ReadChatRoom }>()
)

export const createChatRoomUserByWS = createAction(
    `[${FeatureKey}] Create Chat Room User By Web Socket`,
    props<{ ws_data: WS.CreateChatRoomUser }>()
)
export const deleteChatRoomUserByWS = createAction(
    `[${FeatureKey}] Delete Chat Room User By Web Socket`,
    props<{ ws_data: WS.DeleteChatRoomUser }>()
)

export const startCreateChatRoomMsgByWS = createAction(
    `[${FeatureKey}] Start Create Chat Room Message By Web Socket`,
    props<{ ws_data: WS.CreateChatRoomMessage }>()
)
export const finishCreateChatRoomMsgByWS = createAction(
    `[${FeatureKey}] Finish Create Chat Room Message By Web Socket`,
    props<{ ws_data: WS.CreateChatRoomMessage; chatRoomIdx: number; chatRoomList: Array<ChatRoom> }>()
)

export const deleteChatRoomMsgByWS = createAction(
    `[${FeatureKey}] Delete Chat Room Message By Web Socket`,
    props<{ ws_data: WS.DeleteChatRoomMessage }>()
)
