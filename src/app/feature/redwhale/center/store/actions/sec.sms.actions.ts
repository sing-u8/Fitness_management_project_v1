import { createAction, props } from '@ngrx/store'
import {
    MemberSelectCateg,
    UsersSelectCateg,
    UserListSelect,
    UsersLists,
    UsersListValue,
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

// common
export const resetAll = createAction(`[${FeatureKey}] Reset Dashboard All State`)
export const error = createAction(`[${FeatureKey}] Dashboard State Error`, props<{ error: string }>())
