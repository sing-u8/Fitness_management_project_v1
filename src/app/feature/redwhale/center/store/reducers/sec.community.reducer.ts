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
    mainCurChatRoom: ChatRoom
    drawerCurChatRoom: ChatRoom
}

export const initialState: State = {
    // common
    curCenterId: undefined,
    isLoading: 'idle',
    error: '',

    // main
    // main - screen = main
    mainCurChatRoom: undefined,
    // main - drawer
    drawerCurChatRoom: undefined,
}

export const communityReducer = createImmerReducer(
    initialState,
    // async
    on(CommunitydActions.startCreateChatRoom, (state, { centerId, reqBody, spot }) => {
        console.log('startCreateChatRoom --', centerId, reqBody, spot)
        return state
    }),
    on(CommunitydActions.finishCreateChatRoom, (state, { chatRoom, spot }) => {
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

// common
export const selectCurCenterId = (state: State) => state.curCenterId
export const selectIsLoading = (state: State) => state.isLoading
export const selectError = (state: State) => state.error
