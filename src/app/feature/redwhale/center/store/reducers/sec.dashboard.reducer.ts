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
import dayjs from 'dayjs'

export type MemberSelectCateg = 'member' | 'valid' | 'unpaid' | 'imminent' | 'expired' | 'employee' | 'attendance'
export type MemberManageCategory = 'membershipLocker' | 'reservation' | 'payment'
export type UserListValueItem = { user: CenterUser; holdSelected: boolean }
export type UsersListValue = Array<UserListValueItem>
// !! export type Manager
export type UsersSelectCateg = Record<MemberSelectCateg, { name: string; userSize: number }>
export type UserListSelect = { key: MemberSelectCateg; value: { name: string; userSize: number } }
export type UsersLists = Record<MemberSelectCateg, UsersListValue>
export type CurUserData = {
    user: CenterUser
    lockers: UserLocker[]
    memberships: UserMembership[]
    payments: Payment[]
    reservations: Booking[]
    contracts: Contract[] // !!
}
export type AttendanceToast = {
    visible: boolean
    centerUser: CenterUser
}

export type UserDetailTag = 'membership' | 'locker' | 'reservation' | 'payment' | 'contract'
export const UserDetailTagInit: UserDetailTag = 'membership'

export const MemberManageCategoryInit = 'membershipLocker'
export const UsersSelectCategInit: UsersSelectCateg = {
    member: { name: '전체 회원', userSize: 0 },
    attendance: { name: '오늘 출석한 회원', userSize: 0 },
    valid: { name: '회원권 사용중인 회원', userSize: 0 },
    unpaid: { name: '미수금이 있는 회원', userSize: 0 },
    imminent: { name: '7일 내 만료 예정인 회원', userSize: 0 },
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
export const CurUserDataInit: CurUserData = {
    user: undefined,
    lockers: [],
    memberships: [],
    payments: [],
    reservations: [],
    contracts: [],
}
export const CurSearchInputInit = ''
export const AttendanceToastInit = {
    visible: false,
    centerUser: undefined,
}

export interface State {
    // common
    curCenterId: string
    curSearchInput: string
    userDetailTag: UserDetailTag
    isLoading: Loading
    isUserDetailLoading: Loading
    error: string
    // main
    usersSelectCategs: UsersSelectCateg
    usersLists: UsersLists
    curMemberManageCateg: MemberManageCategory
    curUserListSelect: UserListSelect
    curUserData: CurUserData

    // drawer
    drawerCurCenterId: string
    drawerIsLoading: Loading
    drawerCurSearchInput: string
    drawerUsersSelectCategs: UsersSelectCateg
    drawerUsersLists: UsersLists
    drawerCurMemberManageCateg: MemberManageCategory
    drawerCurUserListSelect: UserListSelect
    drawerCurUserData: CurUserData
    // attendance toast
    attendanceToast: AttendanceToast
}

export const initialState: State = {
    // main
    curCenterId: undefined,
    userDetailTag: UserDetailTagInit,
    isLoading: 'idle',
    isUserDetailLoading: 'idle',
    error: '',
    // main
    curSearchInput: CurSearchInputInit,
    usersSelectCategs: UsersSelectCategInit,
    usersLists: UsersListInit,
    curMemberManageCateg: MemberManageCategoryInit,
    curUserListSelect: UserListSelectInit,
    curUserData: CurUserDataInit,

    // drawer
    drawerCurCenterId: undefined,
    drawerIsLoading: 'idle',
    drawerCurSearchInput: CurSearchInputInit,
    drawerUsersSelectCategs: UsersSelectCategInit,
    drawerUsersLists: UsersListInit,
    drawerCurMemberManageCateg: MemberManageCategoryInit,
    drawerCurUserListSelect: UserListSelectInit,
    drawerCurUserData: CurUserDataInit,

    // attendance toast
    attendanceToast: AttendanceToastInit,
}
export const MainDashboardInitialState = {
    // main
    curCenterId: undefined,
    userDetailTag: UserDetailTagInit,
    isLoading: 'idle',
    isUserDetailLoading: 'idle',
    error: '',
    // main
    curSearchInput: CurSearchInputInit,
    usersSelectCategs: UsersSelectCategInit,
    usersLists: UsersListInit,
    curMemberManageCateg: MemberManageCategoryInit,
    curUserListSelect: UserListSelectInit,
    curUserData: CurUserDataInit,
}
export const DrawerDashboardInitialState = {
    // drawer
    drawerCurCenterId: undefined,
    drawerIsLoading: 'idle',
    drawerCurSearchInput: CurSearchInputInit,
    drawerUsersSelectCategs: UsersSelectCategInit,
    drawerUsersLists: UsersListInit,
    drawerCurMemberManageCateg: MemberManageCategoryInit,
    drawerCurUserListSelect: UserListSelectInit,
    drawerCurUserData: CurUserDataInit,
}

export const dashboardReducer = createImmerReducer(
    initialState,
    // attendance toast
    on(DashboardActions.showAttendanceToast, (state, { visible, centerUser }) => {
        state.attendanceToast = {
            visible,
            centerUser,
        }
        return state
    }),
    // async
    on(DashboardActions.startLoadMemberList, (state) => {
        state = { ...state, ...MainDashboardInitialState } as State
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
    on(DashboardActions.finishDirectRegisterMember, (state, { createdUser, centerId }) => {
        // !! 필요 시에 API에서 새 유저 받아오기 !!
        if (state.curCenterId == centerId) {
            state.usersLists.member.unshift({ user: createdUser, holdSelected: false })
            state.usersSelectCategs.member.userSize++
        }
        if (state.drawerCurCenterId == centerId) {
            state.drawerUsersLists.member.unshift({ user: createdUser, holdSelected: false })
            state.drawerUsersSelectCategs.member.userSize++
        }
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
        state.isUserDetailLoading = 'pending'
        return state
    }),
    on(
        DashboardActions.finishGetUserData,
        (state, { memberships, lockers, payments, reservations, contracts, centerUser }) => {
            state.curUserData = {
                ...state.curUserData,
                reservations,
                payments,
                lockers,
                memberships,
                contracts,
            }
            if (centerUser) {
                state.curUserData = {
                    ...state.curUserData,
                    user: centerUser,
                }
            }
            state.isUserDetailLoading = 'done'
            return state
        }
    ),
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
    on(DashboardActions.startSetCurUserData, (state, { userId, reqBody, centerId }) => {
        if (state.curCenterId == centerId) {
            if (!_.isEmpty(state.curUserData.user) && state.curUserData.user.id == userId) {
                state.curUserData.user = _.assign(state.curUserData.user, reqBody)
            }

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
        }
        if (state.drawerCurCenterId == centerId) {
            if (!_.isEmpty(state.drawerCurUserData.user) && state.drawerCurUserData.user.id == userId) {
                state.drawerCurUserData.user = _.assign(state.drawerCurUserData.user, reqBody)
                console.log('startSetCurUserData in dw : ', state.drawerCurUserData.user.memo)
            }

            const userListsKeys = _.keys(state.drawerUsersLists) as MemberSelectCateg[]
            userListsKeys.forEach((key) => {
                state.drawerUsersLists[key].find((v, i) => {
                    if (v.user.id == userId) {
                        state.drawerUsersLists[key][i].user = _.assign(state.drawerUsersLists[key][i].user, reqBody)
                        return true
                    }
                    return false
                })
            })
        }
        return state
    }),
    on(DashboardActions.setCurUserData, (state, { userId, reqBody, centerId }) => {
        if (state.curCenterId == centerId) {
            if (!_.isEmpty(state.curUserData.user) && state.curUserData.user.id == userId)
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
        }
        if (state.drawerCurCenterId == centerId) {
            if (!_.isEmpty(state.drawerCurUserData.user) && state.drawerCurUserData.user.id == userId)
                state.drawerCurUserData.user = _.assign(state.drawerCurUserData.user, reqBody)

            const userListsKeys = _.keys(state.drawerUsersLists) as MemberSelectCateg[]
            userListsKeys.forEach((key) => {
                state.drawerUsersLists[key].find((v, i) => {
                    if (v.user.id == userId) {
                        state.drawerUsersLists[key][i].user = _.assign(state.drawerUsersLists[key][i].user, reqBody)
                        return true
                    }
                    return false
                })
            })
        }
        return state
    }),

    on(DashboardActions.startDelegate, (state, { centerId, reqBody }) => {
        return state
    }),

    on(DashboardActions.startExportMember, (state, { userId }) => {
        const keys = _.keys(state.usersLists) as MemberSelectCateg[]
        keys.forEach((v) => {
            // main
            const removedUser = _.remove(state.usersLists[v], (uv) => uv.user.id == userId)
            if (!_.isEmpty(removedUser)) {
                state.usersSelectCategs[v].userSize -= 1
            }
            // drawer
            const removeUserDrawer = _.remove(state.drawerUsersLists[v], (uv) => uv.user.id == userId)
            if (!_.isEmpty(removeUserDrawer)) {
                state.drawerUsersSelectCategs[v].userSize -= 1
            }
        })

        state.curUserListSelect.value.userSize = state.usersSelectCategs[state.curUserListSelect.key].userSize
        state.curUserData = CurUserDataInit

        state.drawerCurUserListSelect.value.userSize =
            state.drawerUsersSelectCategs[state.drawerCurUserListSelect.key].userSize
        if (state.drawerCurUserData?.user?.id == userId) state.drawerCurUserData = CurUserDataInit

        return state
    }),

    on(DashboardActions.finishRemoveCurUserProfile, (state, { userId, profileUrl }) => {
        if (!_.isEmpty(state.curUserData.user)) {
            state.curUserData.user.picture = profileUrl
            const userListsKeys = _.keys(state.usersLists) as MemberSelectCateg[]
            userListsKeys.forEach((key) => {
                state.usersLists[key].find((v, i) => {
                    if (v.user.id == userId) {
                        state.usersLists[key][i].user.picture = profileUrl
                        return true
                    }
                    return false
                })
            })
        }
        if (!_.isEmpty(state.drawerCurUserData.user)) {
            state.drawerCurUserData.user.picture = profileUrl
            const userListsKeys = _.keys(state.drawerUsersLists) as MemberSelectCateg[]
            userListsKeys.forEach((key) => {
                state.drawerUsersLists[key].find((v, i) => {
                    if (v.user.id == userId) {
                        state.drawerUsersLists[key][i].user.picture = profileUrl
                        return true
                    }
                    return false
                })
            })
        }

        return state
    }),

    on(DashboardActions.finishRegisterCurUserProfile, (state, { userId, profileUrl }) => {
        if (!_.isEmpty(state.curUserData.user)) {
            state.curUserData.user.picture = profileUrl
            const userListsKeys = _.keys(state.usersLists) as MemberSelectCateg[]
            userListsKeys.forEach((key) => {
                state.usersLists[key].find((v, i) => {
                    if (v.user.id == userId) {
                        state.usersLists[key][i].user.picture = profileUrl
                        return true
                    }
                    return false
                })
            })
        }
        if (!_.isEmpty(state.drawerCurUserData.user)) {
            state.drawerCurUserData.user.picture = profileUrl
            const userListsKeys = _.keys(state.drawerUsersLists) as MemberSelectCateg[]
            userListsKeys.forEach((key) => {
                state.drawerUsersLists[key].find((v, i) => {
                    if (v.user.id == userId) {
                        state.drawerUsersLists[key][i].user.picture = profileUrl
                        return true
                    }
                    return false
                })
            })
        }

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
    on(DashboardActions.resetMainDashboardSstate, (state) => {
        state = { ...state, ...MainDashboardInitialState } as State
        return state
    }),
    on(DashboardActions.resetDrawerDashboardSstate, (state) => {
        state = { ...state, ...DrawerDashboardInitialState } as State
        return state
    }),
    // synchronize dashboard data
    // // by locker
    on(DashboardActions.finishSynchronizeUserLocker, (state, { success, lockers }) => {
        if (success) {
            state.curUserData.lockers = lockers
        }
        return state
    }),
    // // by check in
    on(DashboardActions.synchronizeCheckIn, (state, { centerUser, centerId }) => {
        let curCategCenterUser: CenterUser = undefined
        const centerUserCopy: CenterUser = _.cloneDeep(centerUser)
        centerUserCopy.last_check_in = dayjs().format('YYYY-MM-DD HH:mm:ss')
        if (!_.isEmpty(state.curCenterId) && centerId == state.curCenterId) {
            curCategCenterUser = state.usersLists[state.curUserListSelect.key].find((v, i) => {
                if (v.user.id == centerUserCopy.id) {
                    state.usersLists[state.curUserListSelect.key][i].user = centerUserCopy
                    return true
                }
                return false
            })?.user
            if (_.isEmpty(curCategCenterUser) && state.curUserListSelect.key == 'attendance') {
                state.usersLists[state.curUserListSelect.key].unshift({
                    user: centerUserCopy,
                    holdSelected: false,
                })
            }
            if (!_.isEmpty(state.curUserData.user) && state.curUserData.user.id == centerUserCopy.id) {
                state.curUserData.user = centerUserCopy
            }
        }
        return state
    }),
    on(DashboardActions.synchronizeCheckInDrawer, (state, { centerUser, centerId }) => {
        let curCategCenterUser: CenterUser = undefined
        const centerUserCopy: CenterUser = _.cloneDeep(centerUser)
        centerUserCopy.last_check_in = dayjs().format('YYYY-MM-DD HH:mm:ss')
        if (!_.isEmpty(state.drawerCurCenterId) && centerId == state.drawerCurCenterId) {
            curCategCenterUser = state.drawerUsersLists[state.drawerCurUserListSelect.key].find((v, i) => {
                if (v.user.id == centerUserCopy.id) {
                    state.drawerUsersLists[state.drawerCurUserListSelect.key][i].user = centerUserCopy
                    return true
                }
                return false
            })?.user
            if (_.isEmpty(curCategCenterUser) && state.drawerCurUserListSelect.key == 'attendance') {
                state.drawerUsersLists[state.drawerCurUserListSelect.key].unshift({
                    user: centerUserCopy,
                    holdSelected: false,
                })
            }
            if (!_.isEmpty(state.drawerCurUserData.user) && state.drawerCurUserData.user.id == centerUserCopy.id) {
                state.drawerCurUserData.user = centerUserCopy
            }
        }
        return state
    }),
    on(DashboardActions.synchronizeRemoveCheckIn, (state, { centerUser, centerId }) => {
        let curCategCenterUser: CenterUser = undefined
        const centerUserCopy: CenterUser = _.cloneDeep(centerUser)
        centerUserCopy.last_check_in = null
        let curCategUserIdx = undefined
        if (!_.isEmpty(state.curCenterId) && centerId == state.curCenterId) {
            curCategCenterUser = state.usersLists[state.curUserListSelect.key].find((v, i) => {
                if (v.user.id == centerUserCopy.id) {
                    state.usersLists[state.curUserListSelect.key][i].user = centerUserCopy
                    curCategUserIdx = i
                    return true
                }
                return false
            })?.user
            if (
                !_.isEmpty(curCategCenterUser) &&
                _.isInteger(curCategUserIdx) &&
                state.curUserListSelect.key == 'attendance'
            ) {
                state.usersLists[state.curUserListSelect.key].splice(curCategUserIdx, 1)
            }
            if (!_.isEmpty(state.curUserData.user) && state.curUserData.user.id == centerUserCopy.id) {
                state.curUserData.user = centerUserCopy
            }
        }
        return state
    }),
    on(DashboardActions.synchronizeRemoveCheckInDrawer, (state, { centerUser, centerId }) => {
        let curCategCenterUser: CenterUser = undefined
        const centerUserCopy: CenterUser = _.cloneDeep(centerUser)
        centerUserCopy.last_check_in = null
        let curCategUserIdx = undefined
        if (!_.isEmpty(state.drawerCurCenterId) && centerId == state.drawerCurCenterId) {
            curCategCenterUser = state.drawerUsersLists[state.drawerCurUserListSelect.key].find((v, i) => {
                if (v.user.id == centerUserCopy.id) {
                    state.drawerUsersLists[state.drawerCurUserListSelect.key][i].user = centerUserCopy
                    curCategUserIdx = i
                    return true
                }
                return false
            })?.user
            if (
                !_.isEmpty(curCategCenterUser) &&
                _.isInteger(curCategUserIdx) &&
                state.drawerCurUserListSelect.key == 'attendance'
            ) {
                state.drawerUsersLists[state.drawerCurUserListSelect.key].splice(curCategUserIdx, 1)
            }
            if (!_.isEmpty(state.drawerCurUserData.user) && state.drawerCurUserData.user.id == centerUserCopy.id) {
                state.drawerCurUserData.user = centerUserCopy
            }
        }
        return state
    }),
    // // drawer
    // async
    on(DashboardActions.finishGetDrawerUsersByCategory, (state, { userSelectCateg }) => {
        state.drawerUsersSelectCategs = _.assign(state.drawerUsersSelectCategs, userSelectCateg)
        state.drawerCurUserListSelect = {
            key: state.drawerCurUserListSelect.key,
            value: {
                name: state.drawerUsersSelectCategs[state.drawerCurUserListSelect.key].name,
                userSize: state.drawerUsersSelectCategs[state.drawerCurUserListSelect.key].userSize,
            },
        }
        return state
    }),
    on(DashboardActions.startGetDrawerUserList, (state, { categ_type }) => {
        state.drawerCurUserListSelect = { key: categ_type, value: state.drawerUsersSelectCategs[categ_type] }
        state.drawerIsLoading = 'pending'
        return state
    }),
    on(DashboardActions.finishGetDrawerUserList, (state, { categ_type, userListValue }) => {
        state.drawerUsersLists[categ_type] = userListValue
        state.drawerIsLoading = 'done'
        return state
    }),
    on(DashboardActions.startSetDrawerCurUserData, (state, { userId, reqBody }) => {
        state.drawerCurUserData.user = _.assign(state.drawerCurUserData.user, reqBody)

        const userListsKeys = _.keys(state.drawerUsersLists) as MemberSelectCateg[]
        userListsKeys.forEach((key) => {
            state.drawerUsersLists[key].find((v, i) => {
                if (v.user.id == userId) {
                    state.drawerUsersLists[key][i].user = _.assign(state.drawerUsersLists[key][i].user, reqBody)
                    return true
                }
                return false
            })
        })

        return state
    }),
    on(DashboardActions.finishRefreshDrawerCenterUser, (state, { categ_type, refreshCenterUser, isUserInCurCateg }) => {
        if (isUserInCurCateg) {
            const refreshUserIdx = _.findIndex(
                state.drawerUsersLists[categ_type],
                (v) => v.user.id == refreshCenterUser.id
            )
            state.drawerUsersLists[categ_type][refreshUserIdx].user = refreshCenterUser
        } else {
            _.remove(state.drawerUsersLists[categ_type], (v) => v.user.id == refreshCenterUser.id)
        }
        state.drawerCurUserData.user = _.assign(state.drawerCurUserData.user, refreshCenterUser)
        return state
    }),
    // sync
    on(DashboardActions.setDrawerUsersListsHoldSelected, (state, { memberSelectCateg, index, holdFlag }) => {
        state.drawerUsersLists[memberSelectCateg][index].holdSelected = holdFlag
        return state
    }),
    on(DashboardActions.setDrawerAllUserListHold, (state, { memberSelectCateg, holdFlag }) => {
        state.drawerUsersLists[memberSelectCateg].forEach((v) => {
            v.holdSelected = holdFlag
        })
        return state
    }),
    on(DashboardActions.resetDrawerUsersListsHoldSelected, (state, { memberSelectCateg }) => {
        const usersLists = state.drawerUsersLists
        usersLists[memberSelectCateg].forEach((item, index) => {
            state.drawerUsersLists[memberSelectCateg][index].holdSelected = false
        })
        return state
    }),
    on(DashboardActions.setDrawerCurUser, (state, { centerUser }) => {
        state.drawerCurUserData.user = _.assign(state.drawerCurUserData.user, centerUser)
        return state
    }),
    on(DashboardActions.refreshDrawerCurUser, (state, { centerUser }) => {
        if (!_.isEmpty(state.drawerCurUserData.user) && state.drawerCurUserData.user.id == centerUser.id) {
            state.drawerCurUserData.user = _.assign(state.drawerCurUserData.user, centerUser)
        }
        return state
    }),
    on(DashboardActions.setDrawerUserSearchInput, (state, { searchInput }) => {
        state.drawerCurSearchInput = searchInput
        return state
    }),
    on(DashboardActions.setDrawerCurCenterId, (state, { centerId }) => {
        state.drawerCurCenterId = centerId
        return state
    })
)

// attendance toast
export const selectAttendanceToast = (state: State) => state.attendanceToast
// common
export const selectCurCenterId = (state: State) => state.curCenterId
export const selectIsLoading = (state: State) => state.isLoading
export const selectError = (state: State) => state.error
export const selectSearchInput = (state: State) => state.curSearchInput
export const selectUserDetailTag = (state: State) => state.userDetailTag
export const selectIsUserDetailLoading = (state: State) => state.isUserDetailLoading

// main
export const selectUsersSelectCategs = (state: State) => state.usersSelectCategs
export const selectUsersLists = (state: State) => state.usersLists
export const selectCurMemberManageCateg = (state: State) => state.curMemberManageCateg
export const selectCurUserListSelect = (state: State) => state.curUserListSelect
export const selectCurUserData = (state: State) => {
    const curUserDataCopy = _.cloneDeep(state.curUserData)
    curUserDataCopy.payments = getPaymentsWithoutTotalZero(state.curUserData.payments)
    return curUserDataCopy
}

export const selectCurUserMemberhsipData = (state: State) => state.curUserData.memberships
export const selectCurUserLockerData = (state: State) => state.curUserData.lockers
export const selectCurUserPaymentData = (state: State) => getPaymentsWithoutTotalZero(state.curUserData.payments)
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
            return _.includes(item.user.name, searchInput) || _.includes(item.user.phone_number, searchInput)
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

// drawer
export const selectDrawerCurCenterId = (state: State) => state.drawerCurCenterId
export const selectDrawerSearchInput = (state: State) => state.drawerCurSearchInput
export const selectDrawerIsLoading = (state: State) => state.drawerIsLoading
export const selectDrawerUsersSelectCategs = (state: State) => state.drawerUsersSelectCategs
export const selectDrawerUsersLists = (state: State) => state.drawerUsersLists
export const selectDrawerCurMemberManageCateg = (state: State) => state.drawerCurMemberManageCateg
export const selectDrawerCurUserListSelect = (state: State) => state.drawerCurUserListSelect
export const selectDrawerCurUserData = (state: State) => state.drawerCurUserData
export const selectedDrawerUserListsHolding = (state: State) =>
    state.drawerUsersLists[state.drawerCurUserListSelect.key].filter((v) => v.holdSelected).length
export const selectDrawerSearchedUsersLists = (state: State) => {
    const searchUserList: UsersLists = _.cloneDeep(UsersListInit)
    const searchInput = state.drawerCurSearchInput
    const usersLists = state.drawerUsersLists
    _.forEach(_.keys(usersLists), (typeKey) => {
        searchUserList[typeKey] = _.filter(usersLists[typeKey], (item) => {
            return _.includes(item.user.name, searchInput) || _.includes(item.user.phone_number, searchInput)
        })
    })
    return searchUserList
}
export const selectDrawerEmployeeRoleObj = (state: State) => {
    return state.drawerUsersLists[state.drawerCurUserListSelect.key].length > 0
        ? _.reduce(
              state.drawerUsersLists[state.drawerCurUserListSelect.key],
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
        case 'member':
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
        case 'check_in':
            return 'attendance'
    }
}
export const matchMemberSelectCategTo = (categType: MemberSelectCateg): CenterUsersCategory => {
    switch (categType) {
        case 'member':
            return 'member'
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
        case 'attendance':
            return 'check_in'
    }
}

export const getPaymentsWithoutTotalZero = (payments: Payment[]): Payment[] => {
    return _.filter(payments, (v) => v.card + v.trans + v.cash + v.unpaid != 0)
}
