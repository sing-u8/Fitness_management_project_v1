import { createAction, props } from '@ngrx/store'
import {
    HistoryDateRange,
    MemberSelectCateg,
    SMSType,
    UserListSelect,
    UsersLists,
    UsersListValue,
    UsersSelectCateg,
} from '../reducers/sec.sms.reducer'
import { SMSAutoSend } from '@schemas/sms-auto-send'
import { SMSHistory } from '@schemas/sms-history'
import { SMSHistoryGroup } from '@schemas/sms-history-group'

import { UpdateMLAutoSendReqBody } from '@services/center-sms.service'
import { SMSCaller } from '@schemas/sms-caller'

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

export const startRefreshMemberList = createAction(
    `[${FeatureKey}] Start Refresh Member List`,
    props<{ centerId: string }>()
)
export const finishRefreshMemberList = createAction(
    `[${FeatureKey}] Finish Refresh Member List`,
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

export const startGetSMSPoint = createAction(`[${FeatureKey}] Start Get SMS Point`, props<{ centerId: string }>())
export const finishGetSMSPoint = createAction(`[${FeatureKey}] Finish Get SMS Point`, props<{ smsPoint: number }>())

export const startChargeSMSPoint = createAction(
    `[${FeatureKey}] Start Charge SMS Point`,
    props<{ centerId: string; smsPoint: number; cb?: () => void }>()
)
export const finishChargeSMSPoint = createAction(
    `[${FeatureKey}] Finish Charge SMS Point`,
    props<{ smsPoint: number }>()
)

export const startSendGeneralMessage = createAction(
    `[${FeatureKey}] Start Send General Message`,
    props<{ centerId: string; cb?: () => void }>()
)
export const finishSendGeneralMessage = createAction(
    `[${FeatureKey}] Finish Send General Message`,
    props<{ smsPoint: number }>()
)

export const startGetMembershipAutoSend = createAction(
    `[${FeatureKey}] Start Get Membership Auto Send`,
    props<{ centerId: string }>()
)
export const finishGetMembershipAutoSend = createAction(
    `[${FeatureKey}] Finish Get Membership Auto Send`,
    props<{ smsAutoSend: SMSAutoSend }>()
)
export const startGetLockerAutoSend = createAction(
    `[${FeatureKey}] Start Get Locker Auto Send`,
    props<{ centerId: string }>()
)
export const finishGetLockerAutoSend = createAction(
    `[${FeatureKey}] Finish Get Locker Auto Send`,
    props<{ smsAutoSend: SMSAutoSend }>()
)
export const startGetCallerList = createAction(`[${FeatureKey}] Start Get Caller List`, props<{ centerId: string }>())
export const finishGetCallerList = createAction(
    `[${FeatureKey}] Finish Get Caller List`,
    props<{ callerList: SMSCaller[] }>()
)

export const startUpdateMembershipAutoSend = createAction(
    `[${FeatureKey}] Start Update Membership Auto Send`,
    props<{ centerId: string; reqBody: UpdateMLAutoSendReqBody }>()
)
export const startUpdateLockerAutoSend = createAction(
    `[${FeatureKey}] Start Update Locker Auto Send`,
    props<{ centerId: string; reqBody: UpdateMLAutoSendReqBody }>()
)

export const startGetHistoryGroup = createAction(
    `[${FeatureKey}] Start Get History Group`,
    props<{ centerId: string; start_date: string; end_date: string; cb?: () => void }>()
)
export const finishGetHistoryGroup = createAction(
    `[${FeatureKey}] Finish Get History Group`,
    props<{ smsHistoryGroupList: SMSHistoryGroup[] }>()
)

export const startGetHistoryGroupDetail = createAction(
    `[${FeatureKey}] Start Get History Group Detail`,
    props<{ centerId: string; historyGroupId: string }>()
)
export const finishGetHistoryGroupDetail = createAction(
    `[${FeatureKey}] Finish Get History Group Detail`,
    props<{ smsHistoryList: SMSHistory[] }>()
)

// sync
export const setSMSType = createAction(`[${FeatureKey}] Set SMS Type`, props<{ smsType: SMSType }>())

// // general
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
// text vars
export const setGeneralText = createAction(`[${FeatureKey}] Set General texts`, props<{ text: string }>())

export const setBookTime = createAction(`[${FeatureKey}] Set Book Time`, props<{ bookTime: string }>())
export const setBookDate = createAction(`[${FeatureKey}] Set Book Date`, props<{ bookDate: { date: string } }>())
export const setGeneralTransmissionTime = createAction(
    `[${FeatureKey}] Set General Transmission Time`,
    props<{
        generalTransmissionTime: {
            immediate: boolean
            book: boolean
        }
    }>()
)

export const setGeneralCaller = createAction(`[${FeatureKey}] Set General Caller`, props<{ caller: SMSCaller }>())
export const setLockerCaller = createAction(`[${FeatureKey}] Set Locker Caller`, props<{ caller: SMSCaller }>())
export const setMembershipCaller = createAction(`[${FeatureKey}] Set Membership Caller`, props<{ caller: SMSCaller }>())

export const setHistoryDateRange = createAction(
    `[${FeatureKey}] Set History Date Range`,
    props<{ historyDateRange: HistoryDateRange }>()
)

export const setSMSHistoryGroup = createAction(
    `[${FeatureKey}] Set SMS History Group`,
    props<{ smsHistoryGroup: SMSHistoryGroup }>()
)

// common
// cur center id
export const setCurCenterId = createAction(`[${FeatureKey}] Set Current Center Id`, props<{ centerId: string }>())
export const resetCurCenterId = createAction(`[${FeatureKey}] Reset Current Center Id`)

export const resetAll = createAction(`[${FeatureKey}] Reset Dashboard All State`)
export const error = createAction(`[${FeatureKey}] Dashboard State Error`, props<{ error: string }>())
