import { createAction, props } from '@ngrx/store'
import {
    MemberSelectCateg,
    UsersSelectCateg,
    UserListSelect,
    UsersLists,
    UsersListValue,
    CurUseData,
    UserDetailTag,
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

const FeatureKey = 'Center/Dashboard'

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
    props<{ createdUser: CenterUser }>()
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
        reservations?: any[]
        contracts: Contract[]
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
    props<{ centerId: string; userId: string; reqBody: UpdateUserRequestBody; callback?: () => void }>()
)

export const startDelegate = createAction(
    `[${FeatureKey}] Start Delegate Owner To Another Member`,
    props<{ centerId: string; reqBody: DelegateRequestBody; callback?: () => void }>()
)
// export const finishDelegate = createAction(
//     `[${FeatureKey}] Finish Delegate Owner To Another Member`,
//     props<{ userId: string; profile: FileList; reqBody: CreateFileRequestBody; callback?: () => void }>()
// )

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
    props<{ userId: string; profile: FileList; reqBody: CreateFileRequestBody; callback?: () => void }>()
)
export const finishRegisterCurUserProfile = createAction(
    `[${FeatureKey}] Finish Register Current User Profile`,
    props<{ userId: string; profileUrl: string }>()
)

export const startCenterHolding = createAction(
    `[${FeatureKey}] Start Center Hold`,
    props<{ centerId: string; reqBody: Omit<CenterHoldingReqBody, 'user_ids'>; cb?: () => void }>()
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
    props<{ curUserData: Partial<CurUseData> }>()
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
export const error = createAction(`[${FeatureKey}] Dashboard State Error`, props<{ error: string }>())
