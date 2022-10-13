import { createAction, props } from '@ngrx/store'
import { Center } from '@schemas/center'
import { CenterUser } from '@schemas/center-user'
import { RoleCode, PermissionCategory, PermissionCode, PermissionKeys } from '@schemas/permission-category'

const FeatureKey = 'Center/Common'

// sync

export const setCurCenter = createAction(`[${FeatureKey}] Set Cur Center`, props<{ center: Center }>())
export const setCenterPermissionModal = createAction(
    `[${FeatureKey}]  set Center Permission Modal`,
    props<{ visible: boolean }>()
)

// async

export const startGetInstructors = createAction(`[${FeatureKey}] Start Get Instructors`, props<{ centerId: string }>())
export const finishGetInstructors = createAction(
    `[${FeatureKey}] Finish Get Instructors`,
    props<{ instructors: Array<CenterUser> }>()
)

export const startGetMembers = createAction(`[${FeatureKey}] Start Get Members`, props<{ centerId: string }>())
export const finishGetMembers = createAction(
    `[${FeatureKey}] Finish Get Members`,
    props<{ members: Array<CenterUser> }>()
)

export const startGetCenterPermission = createAction(
    `[${FeatureKey}] Start Get Center Permission`,
    props<{ centerId: string }>()
)
export const finishGetCenterPermission = createAction(
    `[${FeatureKey}] Finish Get Center Permission`,
    props<{ permissionObj: Record<RoleCode, Array<PermissionCategory>> }>()
)

export const startUpdateCenterPermission = createAction(
    `[${FeatureKey}] Start Update Center Permission`,
    props<{
        centerId: string
        permitObj: {
            administrator: Array<PermissionCategory>
            instructor: Array<PermissionCategory>
        }
        cb?: () => void
    }>()
)
// export const finishUpdateCenterPermission = createAction(
//     `[${FeatureKey}] Finish Update Center Permission`,
//     props<{ roleCode: RoleCode; centerId: string }>()
// )

export const error = createAction(`[${FeatureKey}] error`, props<{ err: string }>())
