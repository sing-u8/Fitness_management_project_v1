import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import _ from 'lodash'

import { Center } from '@schemas/center'
import { CenterUser } from '@schemas/center-user'

import * as CenterCommonActions from '../actions/center.common.actions'

export const intialState: State = {
    curCenter: null,
    instructors: [],
}

export interface State {
    curCenter: Center
    instructors: Array<CenterUser>
}

export const centerCommonReducer = createImmerReducer(
    intialState,
    // sync
    on(CenterCommonActions.setCurCenter, (state, { center }) => {
        return state
    }),
    // async
    on(CenterCommonActions.finishGetInstructors, (state, {}) => {
        return state
    })
)

export const selectCurCenter = (state: State) => state.curCenter
export const selectInstructors = (state: State) => state.instructors
