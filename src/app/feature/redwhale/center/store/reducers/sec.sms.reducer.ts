import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import _ from 'lodash'

// schema
import { SMSCaller } from '@schemas/sms-caller'
import { SMSPoint } from '@schemas/sms-point'
import { SMSHistory } from '@schemas/sms-history'
import { SMSHistoryGroup } from '@schemas/sms-history-group'
import { Loading } from '@schemas/store/loading'
import { CenterUser } from '@schemas/center-user'
import { CenterUsersCategory } from '@schemas/center/community/center-users-by-category'

import * as SMSActions from '../actions/sec.sms.actions'

export type MemberSelectCateg = 'member' | 'valid' | 'unpaid' | 'imminent' | 'expired' | 'employee' //  | 'attendance'
export type UsersListValue = Array<{ user: CenterUser; selected: boolean }>
export type UsersSelectCateg = Record<MemberSelectCateg, { name: string; userSize: number }>
export type UserListSelect = { key: MemberSelectCateg; value: { name: string; userSize: number } }
export type UsersLists = Record<MemberSelectCateg, UsersListValue>

export interface State {
    // common
    curCenterId: string
    isLoading: Loading
    curSearchInput: string
    error: string

    // main
    usersSelectCategs: UsersSelectCateg
    usersLists: UsersLists
    curUserListSelect: UserListSelect
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

export const initialState: State = {
    // main
    curCenterId: undefined,
    isLoading: 'idle',
    curSearchInput: CurSearchInputInit,
    error: '',
    // main
    usersSelectCategs: UsersSelectCategInit,
    usersLists: UsersListInit,
    curUserListSelect: UserListSelectInit,
}

export const smsReducer = createImmerReducer(
    initialState,
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
    })
)

// common
export const selectCurCenterId = (state: State) => state.curCenterId
export const selectIsLoading = (state: State) => state.isLoading
export const selectError = (state: State) => state.error
export const selectSearchInput = (state: State) => state.curSearchInput

// main
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
