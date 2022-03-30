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
