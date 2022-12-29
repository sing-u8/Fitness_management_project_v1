import { createAction, props } from '@ngrx/store'
import {
    CurUserData,
    MemberSelectCateg,
    UserDetailTag,
    UserListSelect,
    UsersLists,
    UsersListValue,
    UsersSelectCateg,
} from '../reducers/sec.dashboard.reducer'

import { CreateUserRequestBody, UpdateUserRequestBody } from '@services/center-users.service'
import { CreateFileRequestBody } from '@services/file.service'
import { DelegateRequestBody } from '@services/center.service'
import { CenterHoldingReqBody } from '@services/center-holding.service'
import { ImageFile } from '@services/helper/picture-management.service'

import { CenterUser } from '@schemas/center-user'
import { UserLocker } from '@schemas/user-locker'
import { UserMembership } from '@schemas/user-membership'
import { Payment } from '@schemas/payment'
import { User } from '@schemas/user'
import { Contract } from '@schemas/contract'
import { File } from '@schemas/file'
import { Booking } from '@schemas/booking'

const FeatureKey = 'Center/Dashboard'

// attendance toast
export const showAttendanceToast = createAction(
    `[${FeatureKey}] showAttendanceToast`,
    props<{ visible: boolean; centerUser: CenterUser }>()
)

// async
export const startLoadMemberList = createAction(
    `[${FeatureKey}] Start Loading Member List`,
    props<{ centerId: string; cb?: (cu: CenterUser) => void }>()
)
export const finishLoadMemberList = createAction(
    `[${FeatureKey}] Finish Loading Member List`,
    props<{ categ_type: MemberSelectCateg; userListValue: UsersListValue }>()
)

export const startGetUsersByCategory = createAction(
    `[${FeatureKey}] Start Get Users By Category`,
    props<{ centerId: string }>()
)
export const finishGetUsersByCategory = createAction(
    `[${FeatureKey}] Finish Get Users By Category`,
    props<{ userSelectCateg: UsersSelectCateg }>()
)

export const startGetUserList = createAction(
    `[${FeatureKey}] Start Get User List By Type`,
    props<{ centerId: string; categ_type: MemberSelectCateg }>()
)
export const finishGetUserList = createAction(
    `[${FeatureKey}] Finish Get User List By Type`,
    props<{ centerId: string; categ_type: MemberSelectCateg; userListValue: UsersListValue }>()
)

export const startDirectRegisterMember = createAction(
    `[${FeatureKey}] Start Direct Register Member`,
    props<{ centerId: string; reqBody: CreateUserRequestBody; imageFile: ImageFile; callback?: () => void }>()
)
export const finishDirectRegisterMember = createAction(
    `[${FeatureKey}] Finish Direct Register Member`,
    props<{ createdUser: CenterUser; centerId: string }>()
)

export const startGetUserData = createAction(
    `[${FeatureKey}] Start Get User Data`,
    props<{ centerId: string; centerUser: CenterUser }>()
)
export const finishGetUserData = createAction(
    `[${FeatureKey}] Finish Get User Data`,
    props<{
        lockers: UserLocker[]
        memberships: UserMembership[]
        payments: Payment[]
        reservations: Booking[]
        contracts: Contract[]
        centerUser?: CenterUser
    }>()
)

export const startRefreshCenterUser = createAction(
    `[${FeatureKey}] Start Refresh Center User`,
    props<{ centerId: string; centerUser: CenterUser }>()
)
export const finishRefreshCenterUser = createAction(
    `[${FeatureKey}] Finish Refresh Center User`,
    props<{ categ_type: MemberSelectCateg; refreshCenterUser: CenterUser; isUserInCurCateg: boolean }>()
)

export const startRefreshMyCenterUser = createAction(
    `[${FeatureKey}] Start Refresh My Center User`,
    props<{ centerId: string; user: User }>()
)
export const finishRefreshMyCenterUser = createAction(
    `[${FeatureKey}] Finish Refresh My Center User`,
    props<{ categ_type: MemberSelectCateg; refreshCenterUser: CenterUser; isUserInCurCateg: boolean }>()
)

export const startSetCurUserData = createAction(
    `[${FeatureKey}] Start Set Current User Data`,
    props<{
        centerId: string
        userId: string
        reqBody: UpdateUserRequestBody
        callback?: () => void
        blockEffect?: boolean
    }>()
)

export const setCurUserData = createAction(
    `[${FeatureKey}] Set Current User Data`,
    props<{
        centerId: string
        userId: string
        reqBody: UpdateUserRequestBody
    }>()
)

export const startDelegate = createAction(
    `[${FeatureKey}] Start Delegate Owner To Another Member`,
    props<{ centerId: string; reqBody: DelegateRequestBody; callback?: () => void }>()
)

export const startExportMember = createAction(
    `[${FeatureKey}] Start Export Member`,
    props<{ centerId: string; userId: string; callback?: () => void }>()
)

export const startRemoveCurUserProfile = createAction(
    `[${FeatureKey}] Start Remove Current User Profile`,
    props<{ centerId: string; userId: string; profileUrl: string; callback?: () => void }>()
)
export const finishRemoveCurUserProfile = createAction(
    `[${FeatureKey}] Finish Remove Current User Profile`,
    props<{ userId: string; profileUrl: string }>()
)

export const startRegisterCurUserProfile = createAction(
    `[${FeatureKey}] Start Register Current User Profile`,
    props<{
        userId: string
        profile: FileList
        reqBody: CreateFileRequestBody
        centerUser: CenterUser
        callback?: (cu: CenterUser) => void
    }>()
)
export const finishRegisterCurUserProfile = createAction(
    `[${FeatureKey}] Finish Register Current User Profile`,
    props<{ userId: string; profileUrl: string }>()
)

export const startCenterHolding = createAction(
    `[${FeatureKey}] Start Center Hold`,
    props<{ centerId: string; reqBody: Omit<CenterHoldingReqBody, 'center_user_ids'>; cb?: () => void }>()
)

export const startContractSign = createAction(
    `[${FeatureKey}] Start Contract Sign`,
    props<{ centerId: string; centerUserId: string; centerContractId: string; signUrl: string; cb?: () => void }>()
)
export const finishContractSign = createAction(
    `[${FeatureKey}] Finish Contract Sign`,
    props<{ file: File; centerContractId: string }>()
)

// sync
// usersSelectcateg

// userListSelect
export const setUserListSelect = createAction(
    `[${FeatureKey}] Set UserList Select`,
    props<{ userListSelect: UserListSelect }>()
)

// userLists
export const setUsersLists = createAction(`[${FeatureKey}] Set Users Lists`, props<{ usersLists: UsersLists }>())
export const setUsersListsHoldSelected = createAction(
    `[${FeatureKey}] Set UsersLists HoldSelected`,
    props<{ memberSelectCateg: MemberSelectCateg; index: number; holdFlag: boolean }>()
)
export const setAllUserListHold = createAction(
    `[${FeatureKey}] Set All UsersLists Hold`,
    props<{ memberSelectCateg: MemberSelectCateg; holdFlag: boolean }>()
)
export const resetUsersListsHoldSelected = createAction(
    `[${FeatureKey}] Reset UsersLists HoldSelected`,
    props<{ memberSelectCateg: MemberSelectCateg }>()
)

// managerLists
//

// curUserData
export const setCurUesrData = createAction(
    `[${FeatureKey}] Set Current User Data`,
    props<{ curUserData: Partial<CurUserData> }>()
)

// search user input
export const setUserSearchInput = createAction(
    `[${FeatureKey}] Set User Search Input`,
    props<{ searchInput: string }>()
)

// cur center id
export const setCurCenterId = createAction(`[${FeatureKey}] Set Current Center Id`, props<{ centerId: string }>())
export const resetCurCenterId = createAction(`[${FeatureKey}] Reset Current Center Id`)

// common
export const setUserDetailTag = createAction(`[${FeatureKey}] Set User Detail Tag`, props<{ tag: UserDetailTag }>())
export const resetAll = createAction(`[${FeatureKey}] Reset Dashboard All State`)
export const resetMainDashboardSstate = createAction(`[${FeatureKey}] Reset Main Dashboard All State`)
export const resetDrawerDashboardSstate = createAction(`[${FeatureKey}] Reset Drawer Dashboard All State`)
export const error = createAction(`[${FeatureKey}] Dashboard State Error`, props<{ error: string }>())

export const setUserInCenter = createAction(
    `[${FeatureKey}] Finish Set User In Center`,
    props<{ centerUser: CenterUser }>()
)

// synchronize dashboard data
// // by locker
export const startSynchronizeUserLocker = createAction(
    '[${FeatureKey}] Start Synchronize User Data - Locker',
    props<{ centerId: string; userId: string; ignoreUserId?: boolean }>()
)
export const finishSynchronizeUserLocker = createAction(
    '[${FeatureKey}] Finish Synchronize User Data - Locker',
    props<{ success: boolean; lockers?: Array<UserLocker>; payments?: Payment[]; contracts?: Contract[] }>()
)

// // by check in
export const synchronizeCheckIn = createAction(
    '[${FeatureKey}] Synchronize Center User - Check In',
    props<{ centerUser: CenterUser; centerId: string }>()
)
export const synchronizeRemoveCheckIn = createAction(
    '[${FeatureKey}] Synchronize Center User - Remove Check In',
    props<{ centerUser: CenterUser; centerId: string }>()
)

export const synchronizeCheckInDrawer = createAction(
    '[${FeatureKey}] Synchronize Center User Drawer - Check In',
    props<{ centerUser: CenterUser; centerId: string }>()
)
export const synchronizeRemoveCheckInDrawer = createAction(
    '[${FeatureKey}] Synchronize Center User Drawer - Remove Check In',
    props<{ centerUser: CenterUser; centerId: string }>()
)

// // drawer
// async
export const startGetDrawerUsersByCategory = createAction(
    `[${FeatureKey}] Start Get Drawer Users By Category`,
    props<{ centerId: string }>()
)
export const finishGetDrawerUsersByCategory = createAction(
    `[${FeatureKey}] Finish Get Drawer Users By Category`,
    props<{ userSelectCateg: UsersSelectCateg }>()
)

export const startGetDrawerUserList = createAction(
    `[${FeatureKey}] Start Get Drawer User List By Type`,
    props<{ centerId: string; categ_type: MemberSelectCateg }>()
)
export const finishGetDrawerUserList = createAction(
    `[${FeatureKey}] Finish Get Drawer User List By Type`,
    props<{ centerId: string; categ_type: MemberSelectCateg; userListValue: UsersListValue }>()
)

export const startDrawerCenterHolding = createAction(
    `[${FeatureKey}] Start Drawer Center Hold`,
    props<{ centerId: string; reqBody: Omit<CenterHoldingReqBody, 'center_user_ids'>; cb?: () => void }>()
)

export const startSetDrawerCurUserData = createAction(
    `[${FeatureKey}] Start Set Drawer Current User Data`,
    props<{ centerId: string; userId: string; reqBody: UpdateUserRequestBody; callback?: () => void }>()
)

export const startRefreshDrawerCenterUser = createAction(
    `[${FeatureKey}] Start Drawer Refresh Center User`,
    props<{ centerId: string; centerUser: CenterUser }>()
)
export const finishRefreshDrawerCenterUser = createAction(
    `[${FeatureKey}] Finish Drawer Refresh Center User`,
    props<{ categ_type: MemberSelectCateg; refreshCenterUser: CenterUser; isUserInCurCateg: boolean }>()
)

// sync
// userLists
export const setDrawerCurCenterId = createAction(
    `[${FeatureKey}] Set Drawer Current Center Id`,
    props<{ centerId: string }>()
)

export const setDrawerUsersListsHoldSelected = createAction(
    `[${FeatureKey}] Set Drawer UsersLists HoldSelected`,
    props<{ memberSelectCateg: MemberSelectCateg; index: number; holdFlag: boolean }>()
)

export const setDrawerAllUserListHold = createAction(
    `[${FeatureKey}] Set Drawer All UsersLists Hold`,
    props<{ memberSelectCateg: MemberSelectCateg; holdFlag: boolean }>()
)
export const resetDrawerUsersListsHoldSelected = createAction(
    `[${FeatureKey}] Reset Drawer UsersLists HoldSelected`,
    props<{ memberSelectCateg: MemberSelectCateg }>()
)
// curUser
export const setDrawerCurUser = createAction(
    `[${FeatureKey}] Set Drawer Current User Data`,
    props<{ centerUser: CenterUser }>()
)
export const refreshDrawerCurUser = createAction(
    `[${FeatureKey}] Refresh Drawer Current User Data`,
    props<{ centerUser: CenterUser }>()
)

// search user input
export const setDrawerUserSearchInput = createAction(
    `[${FeatureKey}] Set Drawer User Search Input`,
    props<{ searchInput: string }>()
)
