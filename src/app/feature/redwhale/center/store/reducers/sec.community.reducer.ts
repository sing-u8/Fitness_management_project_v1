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
    ChatRoomList: Array<ChatRoom>
    // main - screen = main
    mainCurChatRoom: ChatRoom
    // main - drawer
    drawerCurChatRoom: ChatRoom
}

export const initialState: State = {
    // common
    curCenterId: undefined,
    isLoading: 'idle',
    error: '',

    // main
    ChatRoomList: [],
    // main - screen = main
    mainCurChatRoom: undefined,
    // main - drawer
    drawerCurChatRoom: undefined,
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
        state.ChatRoomList.push(chatRoom)
        return state
    }),
    on(CommunitydActions.finishGetChatRooms, (state, { chatRooms }) => {
        state.ChatRoomList = chatRooms
        return state
    }),
    // sync
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
export const selectMainCurChatRoom = (state: State) => state.mainCurChatRoom
export const selectDrawerCurChatRoom = (state: State) => state.drawerCurChatRoom

// common
export const selectCurCenterId = (state: State) => state.curCenterId
export const selectIsLoading = (state: State) => state.isLoading
export const selectError = (state: State) => state.error
