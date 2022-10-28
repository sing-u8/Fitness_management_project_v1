import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import _ from 'lodash'

import { Center } from '@schemas/center'
import { CenterUser } from '@schemas/center-user'
import { PermissionCategory } from '@schemas/permission-category'

import * as CenterCommonActions from '../actions/center.common.actions'

export interface Permission {
    administrator: Array<PermissionCategory>
    instructor: Array<PermissionCategory>
}
export interface PermissionObj extends Permission {
    visible: boolean
}

export const intialState: State = {
    curCenterRefreshed: false,
    curCenter: null,
    members: [],
    instructors: [],
    permissionObj: {
        visible: false,
        administrator: [],
        instructor: [],
    },
}

export interface State {
    curCenterRefreshed: boolean
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
    on(CenterCommonActions.finishGetCenterPermission, (state, { permissionObj }) => {
        _.forEach(_.keys(permissionObj), (key) => {
            state.permissionObj[key] = permissionObj[key]
        })
        return state
    }),
    on(CenterCommonActions.startUpdateCenterPermission, (state, { permitObj }) => {
        state.permissionObj.instructor = permitObj.instructor
        state.permissionObj.administrator = permitObj.administrator
        return state
    }),
    on(CenterCommonActions.finishGetCurCenter, (state, { center }) => {
        state.curCenter = center
        state.curCenterRefreshed = true
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
export const selectCenterPermission = (state: State) => state.permissionObj
export const selectCurCenterRefreshed = (state: State) => state.curCenterRefreshed

export const selectCurCenterAndPermission = (state: State) => ({
    curCenter: state.curCenter,
    centerPermission: state.permissionObj,
})
