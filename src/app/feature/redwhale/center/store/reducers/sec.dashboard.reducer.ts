import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import _ from 'lodash'

// schema
import { CenterUser } from '@schemas/center-user'
import { UserLocker } from '@schemas/user-locker'
import { UserMembership } from '@schemas/user-membership'
import { Payment } from '@schemas/payment'
import { Loading } from '@schemas/store/loading'
import { Booking } from '@schemas/booking'
import { CenterUsersCategory } from '@schemas/center/community/center-users-by-category'
import { Contract } from '@schemas/contract'

import * as DashboardActions from '../actions/sec.dashboard.actions'
import { finishSynchronizeUserLocker } from '../actions/sec.dashboard.actions'

export type MemberSelectCateg = 'member' | 'valid' | 'unpaid' | 'imminent' | 'expired' | 'employee' //  | 'attendance'
export type MemberManageCategory = 'membershipLocker' | 'reservation' | 'payment'
export type UserListValueItem = { user: CenterUser; holdSelected: boolean }
export type UsersListValue = Array<UserListValueItem>
// !! export type Manager
export type UsersSelectCateg = Record<MemberSelectCateg, { name: string; userSize: number }>
export type UserListSelect = { key: MemberSelectCateg; value: { name: string; userSize: number } }
export type UsersLists = Record<MemberSelectCateg, UsersListValue>
// export type ManagersLists = Record<any, Array<{ user: CenterUser; holdSelected: boolean }>>
export type CurUseData = {
    user: CenterUser
    lockers: UserLocker[]
    memberships: UserMembership[]
    payments: Payment[]
    reservations: Booking[]
    contracts: Contract[] // !!
}

export type UserDetailTag = 'membership' | 'locker' | 'reservation' | 'payment' | 'contract'
export const UserDetailTagInit: UserDetailTag = 'membership'

export const MemberManageCategoryInit = 'membershipLocker'
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
export const CurUseDataInit: CurUseData = {
    user: undefined,
    lockers: [],
    memberships: [],
    payments: [],
    reservations: [],
    contracts: [],
}
export const CurSearchInputInit = ''

export interface State {
    // common
    curCenterId: string
    curSearchInput: string
    userDetailTag: UserDetailTag
    isLoading: Loading
    isUserDeatilLoading: Loading
    error: string

    // main
    usersSelectCategs: UsersSelectCateg
    usersLists: UsersLists
    curMemberManageCateg: MemberManageCategory
    curUserListSelect: UserListSelect
    curUserData: CurUseData
}

export const initialState: State = {
    // main
    curCenterId: undefined,
    curSearchInput: CurSearchInputInit,
    userDetailTag: UserDetailTagInit,
    isLoading: 'idle',
    isUserDeatilLoading: 'idle',
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
    on(DashboardActions.startLoadMemberList, (state) => {
        state = { ...state, ...initialState }
        state.isLoading = 'pending'
        return state
    }),
    on(DashboardActions.finishLoadMemberList, (state, { categ_type, userListValue }) => {
        state.usersLists[categ_type] = userListValue
        state.isLoading = 'done'
        return state
    }),
    on(DashboardActions.finishGetUsersByCategory, (state, { userSelectCateg }) => {
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
    on(DashboardActions.startGetUserList, (state, { categ_type }) => {
        state.curUserListSelect = { key: categ_type, value: state.usersSelectCategs[categ_type] }
        state.isLoading = 'pending'
        return state
    }),
    on(DashboardActions.finishGetUserList, (state, { categ_type, userListValue }) => {
        state.usersLists[categ_type] = userListValue
        state.isLoading = 'done'
        return state
    }),
    on(DashboardActions.finishDirectRegisterMember, (state, { createdUser }) => {
        // !! 필요 시에 API에서 새 유저 받아오기 !!
        state.usersLists.member.unshift({ user: createdUser, holdSelected: false })
        state.usersSelectCategs.member.userSize++
        return state
    }),
    on(DashboardActions.startGetUserData, (state, { centerUser }) => {
        state.curUserData = {
            user: centerUser,
            lockers: [],
            memberships: [],
            reservations: [],
            payments: [],
            contracts: [],
        }
        state.isUserDeatilLoading = 'pending'
        return state
    }),
    on(DashboardActions.finishGetUserData, (state, { memberships, lockers, payments, reservations, contracts }) => {
        state.curUserData = {
            ...state.curUserData,
            reservations,
            payments,
            lockers,
            memberships,
            contracts,
        }
        state.isUserDeatilLoading = 'done'
        return state
    }),
    on(DashboardActions.finishRefreshCenterUser, (state, { categ_type, refreshCenterUser, isUserInCurCateg }) => {
        if (isUserInCurCateg) {
            const refreshUserIdx = _.findIndex(state.usersLists[categ_type], (v) => v.user.id == refreshCenterUser.id)
            state.usersLists[categ_type][refreshUserIdx].user = refreshCenterUser
        } else {
            _.remove(state.usersLists[categ_type], (v) => v.user.id == refreshCenterUser.id)
        }
        state.curUserData.user = _.assign(state.curUserData.user, refreshCenterUser)
        return state
    }),
    on(DashboardActions.finishRefreshMyCenterUser, (state, { categ_type, refreshCenterUser, isUserInCurCateg }) => {
        if (isUserInCurCateg) {
            const refreshUserIdx = _.findIndex(state.usersLists[categ_type], (v) => v.user.id == refreshCenterUser.id)
            state.usersLists[categ_type][refreshUserIdx].user = refreshCenterUser
        } else {
            _.remove(state.usersLists[categ_type], (v) => v.user.id == refreshCenterUser.id)
        }
        if (state.curUserData?.user?.id == refreshCenterUser.id) {
            state.curUserData.user = _.assign(state.curUserData.user, refreshCenterUser)
        }
        return state
    }),
    on(DashboardActions.startSetCurUserData, (state, { userId, reqBody }) => {
        // const { role_code, center_user_name, center_user_memo } = reqBody

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

    on(DashboardActions.startDelegate, (state, { centerId, reqBody }) => {
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
    on(DashboardActions.finishContractSign, (state, { file, centerContractId }) => {
        console.log('finishContractSign : ', file)
        const contractIdx = state.curUserData.contracts.findIndex((v) => v.id == centerContractId)
        state.curUserData.contracts[contractIdx].user_sign = file.url
        return state
    }),
    // on(DashboardActions.finishRefreshUserList, (state, ) => {
    //     return state
    // }),
    // sync
    on(DashboardActions.setUserSearchInput, (state, { searchInput }) => {
        state.curSearchInput = searchInput
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
    on(DashboardActions.setAllUserListHold, (state, { memberSelectCateg, holdFlag }) => {
        state.usersLists[memberSelectCateg].forEach((v) => {
            v.holdSelected = holdFlag
        })
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
    on(DashboardActions.setUserDetailTag, (state, { tag }) => {
        state.userDetailTag = tag
        return state
    }),
    on(DashboardActions.error, (state, { error }) => {
        state.error = error
        return state
    }),
    on(DashboardActions.resetAll, (state) => {
        state = initialState // { ...state, ...initialState }
        return state
    }),
    // synchronize dashboard data
    // // by locker
    on(DashboardActions.finishSynchronizeUserLocker, (state, { success, lockers }) => {
        if (success) {
            state.curUserData.lockers = lockers
        }
        return state
    })
)

// common
export const selectCurCenterId = (state: State) => state.curCenterId
export const selectIsLoading = (state: State) => state.isLoading
export const selectError = (state: State) => state.error
export const selectSearchInput = (state: State) => state.curSearchInput
export const selectUserDetailTag = (state: State) => state.userDetailTag
export const selectIsUserDeatilLoading = (state: State) => state.isUserDeatilLoading

// main
export const selectUsersSelectCategs = (state: State) => state.usersSelectCategs
export const selectUsersLists = (state: State) => state.usersLists
export const selectCurMemberManageCateg = (state: State) => state.curMemberManageCateg
export const selectCurUserListSelect = (state: State) => state.curUserListSelect
export const selectCurUserData = (state: State) => state.curUserData

export const selectCurUserMemberhsipData = (state: State) => state.curUserData.memberships
export const selectCurUserLockerData = (state: State) => state.curUserData.lockers
export const selectCurUserPaymentData = (state: State) => state.curUserData.payments
export const selectCurUserReservationData = (state: State) => state.curUserData.reservations

export const selectedUserListsHolding = (state: State) =>
    state.usersLists[state.curUserListSelect.key].filter((v) => v.holdSelected).length
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
export const selectEmployeeRoleObj = (state: State) => {
    return state.usersLists[state.curUserListSelect.key].length > 0
        ? _.reduce(
              state.usersLists[state.curUserListSelect.key],
              (acc, val) => {
                  if (_.isEmpty(acc[val.user.role_code])) {
                      acc[val.user.role_code] = [val]
                  } else {
                      acc[val.user.role_code].push(val)
                  }
                  return acc
              },
              {}
          )
        : undefined
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
