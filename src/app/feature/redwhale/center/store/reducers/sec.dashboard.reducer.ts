import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import _ from 'lodash'

// schema
import { CenterUser } from '@schemas/center-user'
import { UserLocker } from '@schemas/user-locker'
import { UserMembership } from '@schemas/user-membership'
import { Payment } from '@schemas/payment'
import { Loading } from '@schemas/store/loading'

import * as DashboardActions from '../actions/sec.dashboard.actions'
import { curUserData } from '../selectors/sec.dashoboard.selector'

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
    payments: Payment[] // !! user paymnet
    reservations: any[] // !! user reservation
}

export const MemberManageCategoryInit = 'membershipLocker'
export const UsersSelectCategInit: UsersSelectCateg = {
    member: { name: '전체 회원', userSize: 0 },
    attendance: { name: '오늘 출석한 회원', userSize: 0 },
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
    on(DashboardActions.startLoadMemberList, (state, { centerId }) => {
        state = { ...state, ...initialState }
        state.isLoading = 'pending'
        return state
    }),
    on(DashboardActions.finishLoadMemberList, (state, { usersList, usersSelectCateg }) => {
        state.usersLists = usersList
        state.usersSelectCategs = usersSelectCateg
        state.curUserListSelect = {
            key: state.curUserListSelect.key,
            value: {
                name: usersSelectCateg[state.curUserListSelect.key].name,
                userSize: usersSelectCateg[state.curUserListSelect.key].userSize,
            },
        }
        state.isLoading = 'done'
        return state
    }),
    on(DashboardActions.finishDirectRegisterMember, (state, { createdUser }) => {
        state.usersLists.member.unshift({ user: createdUser, holdSelected: false })
        return state
    }),
    on(DashboardActions.startGetUserData, (state, { centerUser }) => {
        state.curUserData = {
            user: centerUser,
            lockers: [],
            memberships: [],
            reservations: [],
            payments: [],
        }
        return state
    }),
    on(DashboardActions.finishGetUserData, (state, { memberships }) => {
        state.curUserData = {
            ...state.curUserData,
            reservations: [],
            payments: [],
            lockers: [],
            memberships,
        }
        return state
    }),
    on(DashboardActions.startSetCurUserData, (state, { userId, reqBody }) => {
        const { role_code, center_user_name, center_user_memo } = reqBody

        // ! role_code가 포함되었을 때, role_name도 바꿔줘야함
        state.curUserData.user = _.assign(state.curUserData.user, reqBody)

        const userListsKeys = _.keys(state.usersLists) as MemberSelectCateg[]
        userListsKeys.forEach((key) => {
            state.usersLists[key].find((v, i) => {
                if (v.user.id == userId) {
                    state.usersLists[key][i].user = _.assign(state.usersLists[key][i].user, reqBody)
                    return true
                }
                return false
            })
        })

        return state
    }),
    on(DashboardActions.finishRemoveCurUserProfile, (state, { userId, profileUrl }) => {
        state.curUserData.user.center_user_picture = profileUrl

        const userListsKeys = _.keys(state.usersLists) as MemberSelectCateg[]
        userListsKeys.forEach((key) => {
            state.usersLists[key].find((v, i) => {
                if (v.user.id == userId) {
                    state.usersLists[key][i].user.center_user_picture = profileUrl
                    return true
                }
                return false
            })
        })
        return state
    }),
    on(DashboardActions.finishRegisterCurUserProfile, (state, { userId, profileUrl }) => {
        state.curUserData.user.center_user_picture = profileUrl

        const userListsKeys = _.keys(state.usersLists) as MemberSelectCateg[]
        userListsKeys.forEach((key) => {
            state.usersLists[key].find((v, i) => {
                if (v.user.id == userId) {
                    state.usersLists[key][i].user.center_user_picture = profileUrl
                    return true
                }
                return false
            })
        })
        return state
    }),

    // sync
    on(DashboardActions.setUserSearchInput, (state, { searchInput }) => {
        state.curSearchInput = searchInput
        return state
    }),
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
    on(DashboardActions.setUsersListsHoldSelected, (state, { memberSelectCateg, index, holdFlag }) => {
        state.usersLists[memberSelectCateg][index].holdSelected = holdFlag
        return state
    }),
    on(DashboardActions.resetUsersListsHoldSelected, (state, { memberSelectCateg }) => {
        const usersLists = state.usersLists
        usersLists[memberSelectCateg].forEach((item, index) => {
            state.usersLists[memberSelectCateg][index].holdSelected = false
        })

        return state
    }),
    on(DashboardActions.setCurUesrData, (state, { curUserData }) => {
        state.curUserData = _.assign(state.curUserData, curUserData)
        return state
    }),
    // - //curCenterId
    on(DashboardActions.setCurCenterId, (state, { centerId }) => {
        state.curCenterId = centerId
        return state
    }),
    on(DashboardActions.resetCurCenterId, (state) => {
        state.curCenterId = undefined
        return state
    }),
    // common
    on(DashboardActions.error, (state, { error }) => {
        state.error = error
        return state
    }),
    on(DashboardActions.resetAll, (state) => {
        state = { ...state, ...initialState }
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
export const selectCurMemberManageCateg = (state: State) => state.curMemberManageCateg
export const selectCurUserListSelect = (state: State) => state.curUserListSelect
export const selectCurUserData = (state: State) => state.curUserData

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
