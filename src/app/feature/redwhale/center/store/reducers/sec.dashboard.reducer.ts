import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import _ from 'lodash'

// schema
import { CenterUser } from '@schemas/center-user'
import { UserLocker } from '@schemas/user-locker'
import { UserMembership } from '@schemas/user-membership'
import { Loading } from '@schemas/store/loading'
import { Payment } from '@schemas/payment'

import * as DashboardActions from '../actions/sec.dashboard.actions'

export type MemberSelectCateg = 'member' | 'attendance' | 'valid' | 'unpaid' | 'imminent' | 'expired' | 'employee'
export type MemberManageCategory = 'membershipLocker' | 'reservation' | 'payment'
// !! export type Manager
export type UsersSelectCateg = Record<MemberSelectCateg, { name: string; userSize: number }>
export type UserListSelect = { key: MemberSelectCateg; value: { name: string; userSize: number } }
export type UsersLists = Record<MemberSelectCateg, Array<{ user: CenterUser; holdSelected: boolean }>>
// export type ManagersLists = Record<any, Array<{ user: CenterUser; holdSelected: boolean }>>
export type CurUseData = {
    user: CenterUser
    lockers: UserLocker[]
    memberships: UserMembership[]
    payments: any[] // !! user paymnet
    reservations: any[] // !! user reservation
}

const MemberManageCategoryInit = 'membershipLocker'
const UsersSelectCategInit = {
    member: { name: '전체 회원', userSize: 0 },
    attendance: { name: '오늘 출석한 회원', userSize: 0 },
    valid: { name: '유효한 회원', userSize: 0 },
    unpaid: { name: '미수금이 있는 회원', userSize: 0 },
    imminent: { name: '만료 예정인 회원', userSize: 0 },
    expired: { name: '만료된 회원', userSize: 0 },
    employee: { name: '센터 직원', userSize: 0 },
}
const UserListSelectInit: UserListSelect = {
    key: 'member',
    value: { name: '전체 회원', userSize: 0 },
}
export const UsersListInit: UsersLists = {
    member: [],
    attendance: [],
    valid: [],
    unpaid: [],
    imminent: [],
    expired: [],
    employee: [],
}
export const CurUseDataInit: CurUseData = {
    user: undefined,
    lockers: [],
    memberships: [],
    payments: [], // !! user paymnet
    reservations: [], // !! user reservation
}
export const CurSearchInputInit = ''

export interface State {
    // common
    curCenterId: string
    curSearchInput: string
    isLoading: Loading
    error: string

    // main
    usersSelectCategs: UsersSelectCateg
    usersLists: UsersLists
    // managersLists: ManagersLists
    curMemberManageCateg: MemberManageCategory
    curUserListSelect: UserListSelect
    curUserData: CurUseData
}

export const initialState: State = {
    // main
    curCenterId: undefined,
    curSearchInput: CurSearchInputInit,
    isLoading: 'idle',
    error: '',
    // main
    usersSelectCategs: UsersSelectCategInit,
    usersLists: UsersListInit,
    curMemberManageCateg: MemberManageCategoryInit,
    curUserListSelect: UserListSelectInit,
    curUserData: CurUseDataInit,
}

export const dashboardReducer = createImmerReducer(
    initialState,
    // async
    // on()
    // sync
    on(DashboardActions.setUsersSelectCateg, (state, { usersSelectCateg }) => {
        state.usersSelectCategs = usersSelectCateg
        return state
    }),
    on(DashboardActions.setUserListSelect, (state, { userListSelect }) => {
        state.curUserListSelect = userListSelect
        return state
    }),
    on(DashboardActions.setUsersLists, (state, { usersLists }) => {
        state.usersLists = usersLists
        return state
    }),
    on(DashboardActions.setCurUesrData, (state, { curUserData }) => {
        // state.curUserData =
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
export const selectUsersLists = (state: State) => state.curSearchInput
export const selectCurMemberManageCateg = (state: State) => state.curSearchInput
export const selectCurUserListSelect = (state: State) => state.curSearchInput
export const selectCurUserData = (state: State) => state.curSearchInput
