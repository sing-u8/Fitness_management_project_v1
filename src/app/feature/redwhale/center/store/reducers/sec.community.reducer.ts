import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import _ from 'lodash'

import * as CommunitydActions from '../actions/sec.community.actions'

// schema
import { ChatRoom } from '@schemas/chat-room'
import { ChatRoomMessage } from '@schemas/chat-room-message'
import { ChatRoomUser } from '@schemas/chat-room-user'
import { Loading } from '@schemas/store/loading'

export type spot = 'main' | 'drawer'

export interface State {
    // common
    curCenterId: string
    isLoading: Loading
    error: string

    // main
    chatRoomList: Array<ChatRoom>

    // main - screen = main
    mainCurChatRoom: ChatRoom
    mainChatRoomMsgs: Array<ChatRoomMessage>
    mainChatRoomUserList: Array<ChatRoomUser>
    // main - drawer
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
    mainCurChatRoom: undefined,
    mainChatRoomMsgs: [],
    mainChatRoomUserList: [],
    // main - drawer
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
        } else {
            state.drawerCurChatRoom = chatRoom
        }
        state.chatRoomList.push(chatRoom)
        return state
    }),
    on(CommunitydActions.finishGetChatRooms, (state, { chatRooms }) => {
        state.chatRoomList = chatRooms
        return state
    }),
    on(CommunitydActions.startJoinChatRoom, (state, { chatRoom, spot }) => {
        // if (spot == 'main') {
        //     state.mainCurChatRoom = chatRoom
        // } else {
        //     state.drawerCurChatRoom = chatRoom
        // }
        return state
    }),
    on(CommunitydActions.finishJoinChatRoom, (state, { chatRoom, chatRoomMesgs, chatRoomUsers, spot }) => {
        // !! 추후에 추가 수정 필요
        if (spot == 'main') {
            state.mainCurChatRoom = chatRoom
            state.mainChatRoomMsgs = chatRoomMesgs
            state.mainChatRoomUserList = chatRoomUsers
        } else {
            state.drawerCurChatRoom = chatRoom
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

// main
export const selectChatRoomList = (state: State) => state.chatRoomList
// main - screen = main
export const selectMainCurChatRoom = (state: State) => state.mainCurChatRoom
export const selectMainChatRoomMsgs = (state: State) => state.mainChatRoomMsgs
export const selectMainChatRoomUserList = (state: State) => state.mainChatRoomUserList
// main - drawer
export const selectDrawerCurChatRoom = (state: State) => state.drawerCurChatRoom
export const selectDrawerChatRoomMsgs = (state: State) => state.drawerChatRoomMsgs
export const selectDrawerChatRoomUserList = (state: State) => state.drawerChatRoomUserList

// common
export const selectCurCenterId = (state: State) => state.curCenterId
export const selectIsLoading = (state: State) => state.isLoading
export const selectError = (state: State) => state.error
