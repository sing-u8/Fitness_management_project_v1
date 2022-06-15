import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import _ from 'lodash'

import * as CommunitydActions from '../actions/sec.community.actions'

// schema
import { ChatRoom } from '@schemas/chat-room'
import { ChatRoomMessage } from '@schemas/chat-room-message'
import { ChatRoomUser } from '@schemas/chat-room-user'
import { Loading } from '@schemas/store/loading'
import { CenterUser } from '@schemas/center-user'

export type spot = 'main' | 'drawer'

export interface State {
    // common
    curCenterId: string
    isLoading: Loading
    error: string

    // main
    chatRoomList: Array<ChatRoom>

    // main - screen = main
    mainPreChatRoom: ChatRoom
    mainCurChatRoom: ChatRoom
    mainChatRoomMsgs: Array<ChatRoomMessage>
    mainChatRoomUserList: Array<ChatRoomUser>
    // main - drawer
    drawerPreChatRoom: ChatRoom
    drawerCurChatRoom: ChatRoom
    drawerChatRoomMsgs: Array<ChatRoomMessage>
    drawerChatRoomUserList: Array<ChatRoomUser>
}

export const initialState: State = {
    // common
    curCenterId: undefined,
    isLoading: 'idle',
    error: '',

    // main
    chatRoomList: [],

    // main - screen = main
    mainPreChatRoom: undefined,
    mainCurChatRoom: undefined,
    mainChatRoomMsgs: [],
    mainChatRoomUserList: [],
    // main - drawer
    drawerPreChatRoom: undefined,
    drawerCurChatRoom: undefined,
    drawerChatRoomMsgs: [],
    drawerChatRoomUserList: [],
}

export const communityReducer = createImmerReducer(
    initialState,
    // async
    on(CommunitydActions.finishCreateChatRoom, (state, { chatRoom, spot }) => {
        if (spot == 'main') {
            state.mainCurChatRoom = chatRoom
            state.mainChatRoomUserList = chatRoom.chat_room_users
        } else {
            state.drawerCurChatRoom = chatRoom
            state.drawerChatRoomUserList = chatRoom.chat_room_users
        }
        state.chatRoomList.unshift(chatRoom)
        return state
    }),
    on(CommunitydActions.finishGetChatRooms, (state, { chatRooms }) => {
        state.chatRoomList = chatRooms
        return state
    }),
    on(CommunitydActions.startJoinChatRoom, (state, { chatRoom, spot }) => {
        if (spot == 'main') {
            state.mainPreChatRoom = state.mainCurChatRoom
            state.mainCurChatRoom = chatRoom
        } else {
            state.drawerPreChatRoom = state.drawerPreChatRoom
            state.drawerCurChatRoom = chatRoom
        }
        return state
    }),
    on(CommunitydActions.finishJoinChatRoom, (state, { chatRoom, chatRoomMesgs, chatRoomUsers, spot }) => {
        // !! 추후에 추가 수정 필요
        if (spot == 'main') {
            state.mainPreChatRoom = undefined
            state.mainChatRoomMsgs = chatRoomMesgs
            state.mainChatRoomUserList = chatRoomUsers
        } else {
            state.drawerPreChatRoom = undefined
            state.drawerChatRoomMsgs = chatRoomMesgs
            state.drawerChatRoomUserList = chatRoomUsers
        }
        return state
    }),
    on(CommunitydActions.startUpdateChatRoomName, (state, { spot, reqBody }) => {
        if (spot == 'main') {
            state.mainCurChatRoom.name = reqBody.name
            state.chatRoomList.find((v) => v.id == state.mainCurChatRoom.id).name = reqBody.name
        } else {
            state.drawerCurChatRoom.name = reqBody.name
            state.chatRoomList.find((v) => v.id == state.drawerCurChatRoom.id).name = reqBody.name
        }
        return state
    }),
    on(CommunitydActions.finishUpdateChatRoomName, (state, { spot, chatRoom }) => {
        if (spot == 'main') {
            state.mainCurChatRoom = chatRoom
            state.chatRoomList[state.chatRoomList.findIndex((v) => v.id == state.mainCurChatRoom.id)] = chatRoom
        } else {
            state.drawerCurChatRoom = chatRoom
            state.chatRoomList[state.chatRoomList.findIndex((v) => v.id == state.drawerCurChatRoom.id)] = chatRoom
        }
        return state
    }),
    on(CommunitydActions.startLeaveChatRoom, (state, { spot }) => {
        if (spot == 'main') {
            state.mainPreChatRoom = state.mainCurChatRoom
            state.mainCurChatRoom = undefined
            state.chatRoomList = state.chatRoomList.filter((v) => v.id != state.mainPreChatRoom.id)
        } else {
            state.drawerPreChatRoom = state.drawerCurChatRoom
            state.drawerCurChatRoom = undefined
            state.chatRoomList = state.chatRoomList.filter((v) => v.id != state.drawerPreChatRoom.id)
        }
        return state
    }),
    on(CommunitydActions.finishLeaveChatRoom, (state, { spot }) => {
        if (spot == 'main') {
            state.mainPreChatRoom = undefined
        } else {
            state.drawerPreChatRoom = undefined
        }
        return state
    }),
    on(CommunitydActions.startInviteMembers, (state, { invitedMembers, spot }) => {
        const _invitedMembers = CenterUserToChatRoomUser(invitedMembers)

        // !! 채팅방 속성에 인원이 추가되면 인원수도 추가하기
        if (spot == 'main') {
            state.mainCurChatRoom.chat_room_users = [
                ...state.mainCurChatRoom.chat_room_users,
                ..._invitedMembers,
            ].slice(0, 5)

            state.mainCurChatRoom.chat_room_user_count += _invitedMembers.length
            const idx = state.chatRoomList.findIndex((v) => v.id == state.mainCurChatRoom.id)
            state.chatRoomList[idx].chat_room_users = state.mainCurChatRoom.chat_room_users
            state.chatRoomList[idx].chat_room_user_count += _invitedMembers.length

            state.mainChatRoomUserList = [...state.mainChatRoomUserList, ..._invitedMembers]
        } else {
            state.drawerCurChatRoom.chat_room_users = [
                ...state.drawerCurChatRoom.chat_room_users,
                ..._invitedMembers,
            ].slice(0, 5)

            state.drawerCurChatRoom.chat_room_user_count += _invitedMembers.length
            const idx = state.chatRoomList.findIndex((v) => v.id == state.drawerCurChatRoom.id)
            state.chatRoomList[idx].chat_room_users = state.drawerCurChatRoom.chat_room_users
            state.chatRoomList[idx].chat_room_user_count += _invitedMembers.length

            state.drawerChatRoomUserList = [...state.drawerChatRoomUserList, ..._invitedMembers]
        }
        return state
    }),
    on(CommunitydActions.finishiInviteMembers, (state, { spot, chatRoom }) => {
        if (spot == 'main') {
            state.mainCurChatRoom = chatRoom
            state.chatRoomList[state.chatRoomList.findIndex((v) => v.id == state.mainCurChatRoom.id)] =
                state.mainCurChatRoom
        } else {
            state.drawerCurChatRoom = chatRoom
            state.chatRoomList[state.chatRoomList.findIndex((v) => v.id == state.drawerCurChatRoom.id)] =
                state.drawerCurChatRoom
        }
        return state
    }),

    on(CommunitydActions.startSendMessage, (state, { spot }) => {
        if (spot == 'main') {
        } else {
        }
        return state
    }),
    on(CommunitydActions.finishSendMessage, (state, { spot, chatRoomMessage }) => {
        if (spot == 'main') {
            state.mainChatRoomMsgs.unshift(chatRoomMessage)
        } else {
            state.drawerChatRoomMsgs.unshift(chatRoomMessage)
        }
        return state
    }),
    // sync
    on(CommunitydActions.updateChatRooms, (state, { chatRoom }) => {
        return state
    }),
    on(CommunitydActions.updateChatRoomMsgs, (state, { chatRoomMsg }) => {
        return state
    }),
    // common
    on(CommunitydActions.setCurCenterId, (state, { centerId }) => {
        state.curCenterId = centerId
        return state
    }),
    on(CommunitydActions.error, (state, { error }) => {
        state.error = error
        return state
    }),
    on(CommunitydActions.resetAll, (state) => {
        state = { ...state, ...initialState }
        return state
    })
)

// helper
function CenterUserToChatRoomUser(members: Array<CenterUser>): Array<ChatRoomUser> {
    return _.map(members, (v) => ({
        id: v.id,
        name: v.center_user_name,
        permission_code: 'chat_room_user_permission_member',
        permission_code_name: '멤버',
        color: v.color,
        picture: v.center_user_picture,
        background: v.center_user_background,
    }))
}

// main
export const selectChatRoomList = (state: State) => state.chatRoomList
// main - screen = main
export const selectMainPreChatRoom = (state: State) => state.mainPreChatRoom
export const selectMainCurChatRoom = (state: State) => state.mainCurChatRoom
export const selectMainChatRoomMsgs = (state: State) => state.mainChatRoomMsgs
export const selectMainChatRoomUserList = (state: State) => state.mainChatRoomUserList
// main - drawer
export const selectDrawerPreChatRoom = (state: State) => state.drawerPreChatRoom
export const selectDrawerCurChatRoom = (state: State) => state.drawerCurChatRoom
export const selectDrawerChatRoomMsgs = (state: State) => state.drawerChatRoomMsgs
export const selectDrawerChatRoomUserList = (state: State) => state.drawerChatRoomUserList

// common
export const selectCurCenterId = (state: State) => state.curCenterId
export const selectIsLoading = (state: State) => state.isLoading
export const selectError = (state: State) => state.error
