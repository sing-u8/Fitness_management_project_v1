import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import _ from 'lodash'
import dayjs from 'dayjs'

// schema
import { SMSCaller } from '@schemas/sms-caller'
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
export type HistoryDateRange = [string, string]

export interface State {
    // common
    curCenterId: string
    isLoading: Loading
    curSearchInput: string
    smsType: SMSType
    smsPoint: number
    error: string
    callerList: SMSCaller[]
    isCallerListInit: boolean
    // main
    // general
    usersSelectCategs: UsersSelectCateg
    usersLists: UsersLists
    curUserListSelect: UserListSelect
    generalText: string
    bookTime: string // HH:mm:ss
    bookDate: { date: string } // YYYY-MM-DD
    generalTransmissionTime: {
        immediate: boolean
        book: boolean
    }
    generalCaller: SMSCaller
    isGeneralCallerInit: boolean
    // auto transmission
    lockerAutoSendSetting: SMSAutoSend
    membershipAutoSendSetting: SMSAutoSend
    lockerCaller: SMSCaller
    membershipCaller: SMSCaller
    // history
    historyGroupLoading: Loading
    historyLoading: Loading
    curSMSHistoryGroup: SMSHistoryGroup
    smsHistoryGroupList: Array<SMSHistoryGroup>
    smsHistoryList: Array<SMSHistory>
    historyDateRange: HistoryDateRange
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
    time: '',
}
export const SMSHistoryGroupListInit = []
export const SMSHistoryListInit = []

export const initialState: State = {
    // common
    curCenterId: undefined,
    isLoading: 'idle',
    curSearchInput: CurSearchInputInit,
    smsType: 'general',
    smsPoint: 0,
    error: '',
    callerList: [],
    isCallerListInit: false,
    // main
    // general
    usersSelectCategs: UsersSelectCategInit,
    usersLists: UsersListInit,
    curUserListSelect: UserListSelectInit,
    generalText: '',
    bookTime: '10:00:00',
    bookDate: { date: dayjs().format('YYYY-MM-DD') },
    generalTransmissionTime: {
        immediate: true,
        book: false,
    },
    generalCaller: undefined,
    isGeneralCallerInit: false,
    // auto transmission
    lockerAutoSendSetting: SMSAutoSendInit,
    membershipAutoSendSetting: SMSAutoSendInit,
    membershipCaller: undefined,
    lockerCaller: undefined,
    // history
    historyGroupLoading: 'idle',
    historyLoading: 'idle',
    curSMSHistoryGroup: undefined,
    smsHistoryGroupList: SMSHistoryGroupListInit,
    smsHistoryList: SMSHistoryListInit,
    historyDateRange: [dayjs().subtract(3, 'month').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
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
    on(SMSActions.startGetUserList, (state, { categ_type }) => {
        state.curUserListSelect = { key: categ_type, value: state.usersSelectCategs[categ_type] }
        state.isLoading = 'pending'
        return state
    }),
    on(SMSActions.finishGetUserList, (state, { categ_type, userListValue }) => {
        state.usersLists[categ_type] = userListValue
        state.isLoading = 'done'
        return state
    }),
    on(SMSActions.startRefreshMemberList, (state) => {
        state.isLoading = 'pending'
        return state
    }),
    on(SMSActions.finishRefreshMemberList, (state, { categ_type, userListValue }) => {
        state.usersLists[categ_type] = userListValue
        state.isLoading = 'done'
        return state
    }),
    on(SMSActions.finishGetSMSPoint, (state, { smsPoint }) => {
        state.smsPoint = smsPoint
        return state
    }),
    on(SMSActions.finishGetCallerList, (state) => {
        state.isCallerListInit = false
        return state
    }),
    on(SMSActions.finishGetCallerList, (state, { callerList }) => {
        state.callerList = callerList.filter((v) => v.verified)
        if (!state.isGeneralCallerInit && state.callerList.length > 0) {
            state.isGeneralCallerInit = true
            state.generalCaller = state.callerList[0]
        }
        state.isCallerListInit = true
        return state
    }),
    on(SMSActions.finishGetMembershipAutoSend, (state, { smsAutoSend }) => {
        state.membershipAutoSendSetting = smsAutoSend
        return state
    }),
    on(SMSActions.finishGetLockerAutoSend, (state, { smsAutoSend }) => {
        state.lockerAutoSendSetting = smsAutoSend
        return state
    }),
    on(SMSActions.startUpdateMembershipAutoSend, (state, { reqBody }) => {
        const reqBodyCopy = _.cloneDeep(reqBody)
        state.membershipAutoSendSetting = _.assign(state.membershipAutoSendSetting, reqBodyCopy)
        return state
    }),
    on(SMSActions.startUpdateLockerAutoSend, (state, { reqBody }) => {
        const reqBodyCopy = _.cloneDeep(reqBody)
        state.lockerAutoSendSetting = _.assign(state.lockerAutoSendSetting, reqBodyCopy)
        return state
    }),
    on(SMSActions.startGetHistoryGroup, (state) => {
        state.historyGroupLoading = 'pending'
        return state
    }),
    on(SMSActions.finishGetHistoryGroup, (state, { smsHistoryGroupList }) => {
        state.historyGroupLoading = 'done'
        state.smsHistoryGroupList = smsHistoryGroupList
        return state
    }),
    on(SMSActions.startGetHistoryGroupDetail, (state) => {
        state.historyLoading = 'pending'
        return state
    }),
    on(SMSActions.finishGetHistoryGroupDetail, (state, { smsHistoryList }) => {
        state.historyLoading = 'done'
        state.smsHistoryList = smsHistoryList
        return state
    }),
    on(SMSActions.finishSendGeneralMessage, (state, { smsPoint }) => {
        state.smsPoint = smsPoint

        // reset cur Caeteg selected userList
        const usersLists = state.usersLists
        usersLists[state.curUserListSelect.key].forEach((item, index) => {
            state.usersLists[state.curUserListSelect.key][index].selected = false
        })
        // reset general text
        state.generalText = ''
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
    on(SMSActions.setGeneralText, (state, { text }) => {
        state.generalText = text
        return state
    }),
    on(SMSActions.setBookTime, (state, { bookTime }) => {
        state.bookTime = bookTime
        return state
    }),
    on(SMSActions.setBookDate, (state, { bookDate }) => {
        state.bookDate = bookDate
        return state
    }),
    on(SMSActions.setGeneralTransmissionTime, (state, { generalTransmissionTime }) => {
        state.generalTransmissionTime = generalTransmissionTime
        return state
    }),
    on(SMSActions.setGeneralCaller, (state, { caller }) => {
        state.generalCaller = caller
        return state
    }),
    on(SMSActions.setLockerCaller, (state, { caller }) => {
        state.lockerCaller = caller
        return state
    }),
    on(SMSActions.setMembershipCaller, (state, { caller }) => {
        state.membershipCaller = caller
        return state
    }),
    on(SMSActions.setHistoryDateRange, (state, { historyDateRange }) => {
        state.historyDateRange = historyDateRange
        return state
    }),
    on(SMSActions.setSMSHistoryGroup, (state, { smsHistoryGroup }) => {
        state.curSMSHistoryGroup = smsHistoryGroup
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
export const selectSearchInput = (state: State) => state.curSearchInput
export const selectSMSType = (state: State) => state.smsType
export const selectSMSPoint = (state: State) => state.smsPoint
export const selectError = (state: State) => state.error
export const selectCallerList = (state: State) => ({
    callerList: state.callerList,
    isCallerListInit: state.isCallerListInit,
})

// main
// // general
export const selectUsersSelectCategs = (state: State) => state.usersSelectCategs
export const selectUsersLists = (state: State) => state.usersLists
export const selectCurUserListSelect = (state: State) => state.curUserListSelect
export const selectedUserListsSelected = (state: State) =>
    state.usersLists[state.curUserListSelect.key].filter((v) => v.selected).length
export const selectedUserListIds = (state: State) =>
    state.usersLists[state.curUserListSelect.key].filter((v) => v.selected).map((v) => v.user.id)
export const selectGeneralText = (state: State) => state.generalText
export const selectBookTime = (state: State) => state.bookTime
export const selectBookDate = (state: State) => state.bookDate
export const selectGeneralTransmissionTime = (state: State) => state.generalTransmissionTime
export const selectGeneralCaller = (state: State) => state.generalCaller
// // auto transmission
export const selectMembershipAutoSend = (state: State) => state.membershipAutoSendSetting
export const selectLockerAutoSend = (state: State) => state.lockerAutoSendSetting
export const selectLockerCaller = (state: State) => state.lockerCaller
export const selectMembershipCaller = (state: State) => state.membershipCaller
// // history
export const selectHistoryGroupLoading = (state: State) => state.historyGroupLoading
export const selectHistoryLoading = (state: State) => state.historyLoading
export const selectCurHistoryGroup = (state: State) => state.curSMSHistoryGroup
export const selectSMSHistoryGroupList = (state: State) => state.smsHistoryGroupList
export const selectSMSHistoryList = (state: State) => state.smsHistoryList
export const selectHistoryDateRange = (state: State) => state.historyDateRange

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
