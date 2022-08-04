import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import _ from 'lodash'

import { Center } from '@schemas/center'
import { CenterUser } from '@schemas/center-user'

import * as CenterCommonActions from '../actions/center.common.actions'
import * as CommunitydActions from '@centerStore/actions/sec.community.actions'

export const intialState: State = {
    curCenter: null,
    members: [],
    instructors: [],
}

export interface State {
    curCenter: Center
    members: Array<CenterUser>
    instructors: Array<CenterUser>
}

export const centerCommonReducer = createImmerReducer(
    intialState,
    // sync
    on(CenterCommonActions.setCurCenter, (state, { center }) => {
        state.curCenter = center
        return state
    }),
    // async
    on(CenterCommonActions.finishGetInstructors, (state, { instructors }) => {
        state.instructors = instructors
        return state
    }),
    on(CenterCommonActions.finishGetMembers, (state, { members }) => {
        state.members = members
        return state
    }),

    // common
    on(CenterCommonActions.error, (state, { err }) => {
        return state
    })
)

export const selectCurCenter = (state: State) => state.curCenter
export const selectInstructors = (state: State) => state.instructors
export const selectMembers = (state: State) => state.members
