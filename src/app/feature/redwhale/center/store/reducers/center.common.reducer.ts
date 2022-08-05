import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import _ from 'lodash'

import { Center } from '@schemas/center'
import { CenterUser } from '@schemas/center-user'
import { PermissionCategory } from '@schemas/permission-category'

import * as CenterCommonActions from '../actions/center.common.actions'
import * as CommunitydActions from '@centerStore/actions/sec.community.actions'

export interface PermissionObj {
    visible: boolean
    instructor: Array<PermissionCategory>
}

export const intialState: State = {
    curCenter: null,
    members: [],
    instructors: [],
    permissionObj: {
        visible: false,
        instructor: [],
    },
}

export interface State {
    curCenter: Center
    members: Array<CenterUser>
    instructors: Array<CenterUser>
    permissionObj: PermissionObj
}

export const centerCommonReducer = createImmerReducer(
    intialState,
    // sync
    on(CenterCommonActions.setCurCenter, (state, { center }) => {
        state.curCenter = center
        return state
    }),
    on(CenterCommonActions.setCenterPermissionModal, (state, { visible }) => {
        state.permissionObj.visible = visible
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
    on(CenterCommonActions.finishGetCenterPermission, (state, { roleCode, permissionCategoryList }) => {
        state.permissionObj[roleCode] = permissionCategoryList
        return state
    }),
    on(CenterCommonActions.startUpdateCenterPermission, (state, { roleCode, permissionCategoryList }) => {
        state.permissionObj[roleCode] = permissionCategoryList
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
export const selectCenterPemission = (state: State) => state.permissionObj
