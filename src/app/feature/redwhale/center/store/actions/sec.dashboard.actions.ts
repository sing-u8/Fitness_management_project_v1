import { createAction, props } from '@ngrx/store'
import {
    MemberSelectCateg,
    MemberManageCategory,
    UsersSelectCateg,
    UserListSelect,
    UsersLists,
    CurUseData,
} from '../reducers/sec.dashboard.reducer'

import { CreateUserRequestBody, UpdateUserRequestBody } from '@services/center-users.service'
import { CreateFileRequestBody } from '@services/file.service'

import { ImageFile } from '@services/helper/picture-management.service'

import { CenterUser } from '@schemas/center-user'
import { UserLocker } from '@schemas/user-locker'
import { UserMembership } from '@schemas/user-membership'
import { Payment } from '@schemas/payment'

const FeatureKey = 'Center/Dashboard'

// async
export const startLoadMemberList = createAction(
    `[${FeatureKey}] Start Loading Member List`,
    props<{ centerId: string }>()
)

export const finishLoadMemberList = createAction(
    `[${FeatureKey}] Finish Loading Member List`,
    props<{ usersList: UsersLists; usersSelectCateg: UsersSelectCateg }>()
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
    props<{ lockers: UserLocker[]; memberships: UserMembership[]; payments: Payment[]; reservations?: any[] }>()
)

export const startSetCurUserData = createAction(
    `[${FeatureKey}] Start Set Current User Data Memo`,
    props<{ centerId: string; userId: string; reqBody: UpdateUserRequestBody; callback?: () => void }>()
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
    props<{ userId: string; profile: FileList; reqBody: CreateFileRequestBody; callback?: () => void }>()
)
export const finishRegisterCurUserProfile = createAction(
    `[${FeatureKey}] Finish Register Current User Profile`,
    props<{ userId: string; profileUrl: string }>()
)

// sync
// usersSelectcateg
export const setUsersSelectCateg = createAction(
    `[${FeatureKey}] Set UsersSelect Categ`,
    props<{ usersSelectCateg: UsersSelectCateg }>()
)

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
export const resetAll = createAction(`[${FeatureKey}] Reset Dashboard All State`)
export const error = createAction(`[${FeatureKey}] Dashboard State Error`, props<{ error: string }>())
