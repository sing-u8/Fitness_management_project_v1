import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import _ from 'lodash'

import * as CommunitydActions from '../actions/sec.community.actions'

// schema
import { ChatRoom } from '@schemas/chat-room'
import { ChatRoomMessage } from '@schemas/chat-room-message'
import { ChatRoomUser } from '@schemas/chat-room-user'
import { Loading } from '@schemas/store/loading'

export interface State {
    // common
    curCenterId: string
    isLoading: Loading
    error: string

    // main
}

export const initialState: State = {
    // common
    curCenterId: undefined,
    isLoading: 'idle',
    error: '',

    // main
}

export const communityReducer = createImmerReducer(
    initialState,
    on(CommunitydActions.setCurCenterId, (state, { centerId }) => {
        state.curCenterId = centerId
        return state
    })
)

// common
export const selectCurCenterId = (state: State) => state.curCenterId
export const selectIsLoading = (state: State) => state.isLoading
export const selectError = (state: State) => state.error
