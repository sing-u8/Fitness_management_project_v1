import { createAction, props } from '@ngrx/store'
import {
    MemberSelectCateg,
    MemberManageCategory,
    UsersSelectCateg,
    UserListSelect,
    UsersLists,
    CurUseData,
} from '../reducers/sec.dashboard.reducer'

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
