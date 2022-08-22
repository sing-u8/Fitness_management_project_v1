import { createAction, props } from '@ngrx/store'
import {
    MemberSelectCateg,
    UsersSelectCateg,
    UserListSelect,
    UsersLists,
    UsersListValue,
    SMSType,
} from '../reducers/sec.sms.reducer'

const FeatureKey = 'Center/SMS'

// async
export const startLoadMemberList = createAction(
    `[${FeatureKey}] Start Loading Member List`,
    props<{ centerId: string }>()
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
    props<{ centerId: string; categ_type: MemberSelectCateg; userListSelect: UserListSelect }>()
)
export const finishGetUserList = createAction(
    `[${FeatureKey}] Finish Get User List By Type`,
    props<{ centerId: string; categ_type: MemberSelectCateg; userListValue: UsersListValue }>()
)

export const startGetSMSPoint = createAction(`[${FeatureKey}] Strat Get SMS Point`, props<{ centerId: string }>())
export const finishGetSMSPoint = createAction(`[${FeatureKey}] Finish Get SMS Point`, props<{ smsPoint: number }>())

// sync
export const setSMSType = createAction(`[${FeatureKey}] Set SMS Type`, props<{ smsType: SMSType }>())

// userListSelect
export const setUserListSelect = createAction(
    `[${FeatureKey}] Set UserList Select`,
    props<{ userListSelect: UserListSelect }>()
)

// userLists
export const setUsersLists = createAction(`[${FeatureKey}] Set Users Lists`, props<{ usersLists: UsersLists }>())
export const setUsersListsSelected = createAction(
    `[${FeatureKey}] Set UsersLists Selected`,
    props<{ memberSelectCateg: MemberSelectCateg; index: number; selected: boolean }>()
)
export const setAllUserListSelected = createAction(
    `[${FeatureKey}] Set All UsersLists selected`,
    props<{ memberSelectCateg: MemberSelectCateg; selected: boolean }>()
)
export const resetUsersListsSelected = createAction(
    `[${FeatureKey}] Reset UsersLists Selected`,
    props<{ memberSelectCateg: MemberSelectCateg }>()
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
