import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import _ from 'lodash'

// schema
import { SMSCaller } from '@schemas/sms-caller'
import { SMSPoint } from '@schemas/sms-point'
import { SMSHistory } from '@schemas/sms-history'
import { SMSHistoryGroup } from '@schemas/sms-history-group'
import { SMSAutoSend } from '@schemas/sms-auto-send'
import { Loading } from '@schemas/store/loading'
import { CenterUser } from '@schemas/center-user'
import { CenterUsersCategory } from '@schemas/center/community/center-users-by-category'

import * as SMSActions from '../actions/sec.sms.actions'

export type MemberSelectCateg = 'member' | 'valid' | 'unpaid' | 'imminent' | 'expired' | 'employee' //  | 'attendance'
export type UsersListValue = Array<{ user: CenterUser; selected: boolean }>
export type UsersSelectCateg = Record<MemberSelectCateg, { name: string; userSize: number }>
export type UserListSelect = { key: MemberSelectCateg; value: { name: string; userSize: number } }
export type UsersLists = Record<MemberSelectCateg, UsersListValue>
export type SMSType = 'general' | 'auto-transmission' | 'history'
export type CurHistoryData = {
    isLoading: Loading
    data: SMSHistory
}

export interface State {
    // common
    curCenterId: string
    isLoading: Loading
    curSearchInput: string
    smsType: SMSType
    smsPoint: number
    error: string
    // main
    // general
    usersSelectCategs: UsersSelectCateg
    usersLists: UsersLists
    curUserListSelect: UserListSelect
    // auto transmission
    lockerAutoSendSetting: SMSAutoSend
    membershipAutoSendSetting: SMSAutoSend
    // history
    smsHistoryGroupList: Array<SMSHistoryGroup>
    curHistoryData: CurHistoryData
}

export const UsersSelectCategInit: UsersSelectCateg = {
    member: { name: '전체 회원', userSize: 0 },
    // attendance: { name: '오늘 출석한 회원', userSize: 0 },
    valid: { name: '유효한 회원', userSize: 0 },
    unpaid: { name: '미수금이 있는 회원', userSize: 0 },
    imminent: { name: '만료 예정인 회원', userSize: 0 },
    expired: { name: '만료된 회원', userSize: 0 },
    employee: { name: '센터 직원', userSize: 0 },
}
export const UserListSelectInit: UserListSelect = {
    key: 'member',
    value: { name: '전체 회원', userSize: 0 },
}
export const UsersListInit: UsersLists = {
    member: [],
    // attendance: [],
    valid: [],
    unpaid: [],
    imminent: [],
    expired: [],
    employee: [],
}
export const CurSearchInputInit = ''
export const SMSTypeInit: SMSType = 'general'
export const SMSAutoSendInit: SMSAutoSend = {
    phone_number: '',
    text: '',
    auto_send_yn: false,
    days: 7,
    time: '10:00:00',
}
export const SMSHistoryGroupListInit = []
export const CurHistoryDataInit: CurHistoryData = {
    isLoading: 'idle',
    data: undefined,
}

export const initialState: State = {
    // common
    curCenterId: undefined,
    isLoading: 'idle',
    curSearchInput: CurSearchInputInit,
    smsType: 'general',
    smsPoint: 0,
    error: '',
    // main
    // general
    usersSelectCategs: UsersSelectCategInit,
    usersLists: UsersListInit,
    curUserListSelect: UserListSelectInit,
    // auto transmission
    lockerAutoSendSetting: SMSAutoSendInit,
    membershipAutoSendSetting: SMSAutoSendInit,
    // history
    smsHistoryGroupList: SMSHistoryGroupListInit,
    curHistoryData: CurHistoryDataInit,
}

export const smsReducer = createImmerReducer(
    initialState,
    // async
    on(SMSActions.startLoadMemberList, (state) => {
        state = { ...state, ...initialState }
        state.isLoading = 'pending'
        return state
    }),
    on(SMSActions.finishLoadMemberList, (state, { categ_type, userListValue }) => {
        state.usersLists[categ_type] = userListValue
        state.isLoading = 'done'
        return state
    }),
    on(SMSActions.finishGetUsersByCategory, (state, { userSelectCateg }) => {
        state.usersSelectCategs = _.assign(state.usersSelectCategs, userSelectCateg)
        state.curUserListSelect = {
            key: state.curUserListSelect.key,
            value: {
                name: state.usersSelectCategs[state.curUserListSelect.key].name,
                userSize: state.usersSelectCategs[state.curUserListSelect.key].userSize,
            },
        }
        return state
    }),
    on(SMSActions.startGetUserList, (state, { userListSelect }) => {
        state.curUserListSelect = userListSelect
        state.isLoading = 'pending'
        return state
    }),
    on(SMSActions.finishGetUserList, (state, { categ_type, userListValue }) => {
        state.usersLists[categ_type] = userListValue
        state.isLoading = 'done'
        return state
    }),
    on(SMSActions.finishGetSMSPoint, (state, { smsPoint }) => {
        state.smsPoint = smsPoint
        return state
    }),

    // sync
    on(SMSActions.setSMSType, (state, { smsType }) => {
        state.smsType = smsType
        return state
    }),
    on(SMSActions.setUserSearchInput, (state, { searchInput }) => {
        state.curSearchInput = searchInput
        return state
    }),
    on(SMSActions.setUserListSelect, (state, { userListSelect }) => {
        state.curUserListSelect = userListSelect
        return state
    }),
    on(SMSActions.setUsersLists, (state, { usersLists }) => {
        state.usersLists = usersLists
        return state
    }),
    on(SMSActions.setUsersListsSelected, (state, { memberSelectCateg, index, selected }) => {
        state.usersLists[memberSelectCateg][index].selected = selected
        return state
    }),
    on(SMSActions.setAllUserListSelected, (state, { memberSelectCateg, selected }) => {
        state.usersLists[memberSelectCateg].forEach((v) => {
            v.selected = selected
        })
        return state
    }),
    on(SMSActions.resetUsersListsSelected, (state, { memberSelectCateg }) => {
        const usersLists = state.usersLists
        usersLists[memberSelectCateg].forEach((item, index) => {
            state.usersLists[memberSelectCateg][index].selected = false
        })

        return state
    }),
    // - //curCenterId
    on(SMSActions.setCurCenterId, (state, { centerId }) => {
        state.curCenterId = centerId
        return state
    }),
    on(SMSActions.resetCurCenterId, (state) => {
        state.curCenterId = undefined
        return state
    }),
    // common
    on(SMSActions.error, (state, { error }) => {
        state.error = error
        return state
    }),
    on(SMSActions.resetAll, (state) => {
        state = initialState // { ...state, ...initialState }
        return state
    })
)

// common
export const selectCurCenterId = (state: State) => state.curCenterId
export const selectIsLoading = (state: State) => state.isLoading
export const selectError = (state: State) => state.error
export const selectSearchInput = (state: State) => state.curSearchInput
export const selectSMSPoint = (state: State) => state.smsPoint

// main
export const selectSMSType = (state: State) => state.smsType
export const selectUsersSelectCategs = (state: State) => state.usersSelectCategs
export const selectUsersLists = (state: State) => state.usersLists
export const selectCurUserListSelect = (state: State) => state.curUserListSelect
export const selectedUserListsSelected = (state: State) =>
    state.usersLists[state.curUserListSelect.key].filter((v) => v.selected).length
// additional
export const selectSearchedUsersLists = (state: State) => {
    const searchUserList: UsersLists = _.cloneDeep(UsersListInit)
    const searchInput = state.curSearchInput
    const usersLists = state.usersLists
    _.forEach(_.keys(usersLists), (typeKey) => {
        searchUserList[typeKey] = _.filter(usersLists[typeKey], (item) => {
            return item.user.center_user_name.includes(searchInput) || item.user.phone_number.includes(searchInput)
        })
    })
    return searchUserList
}

// helper functions
export const matchUsersCategoryTo = (categType: CenterUsersCategory): MemberSelectCateg => {
    switch (categType) {
        case 'all':
            return 'member'
        case 'valid':
            return 'valid'
        case 'unpaid':
            return 'unpaid'
        case 'to_expire':
            return 'imminent'
        case 'expired':
            return 'expired'
        case 'employee':
            return 'employee'
    }
}
export const matchMemberSelectCategTo = (categType: MemberSelectCateg): CenterUsersCategory => {
    switch (categType) {
        case 'member':
            return 'all'
        case 'valid':
            return 'valid'
        case 'unpaid':
            return 'unpaid'
        case 'imminent':
            return 'to_expire'
        case 'expired':
            return 'expired'
        case 'employee':
            return 'employee'
    }
}
