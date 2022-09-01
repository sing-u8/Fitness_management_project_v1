import { createSelector, createFeatureSelector } from '@ngrx/store'
import { GymFeature, GymState } from './sec.selector'
import * as FromDashboard from '@centerStore/reducers/sec.dashboard.reducer'

export const FeatureKey = 'Center/Dashboard'
export const DashboardFeature = createSelector(GymFeature, (state: GymState) => state[FeatureKey])

// common
export const curCenterId = createSelector(DashboardFeature, FromDashboard.selectCurCenterId)
export const isLoading = createSelector(DashboardFeature, FromDashboard.selectIsLoading)
export const error = createSelector(DashboardFeature, FromDashboard.selectError)
export const searchInput = createSelector(DashboardFeature, FromDashboard.selectSearchInput)
export const userDeatilTag = createSelector(DashboardFeature, FromDashboard.selectUserDetailTag)
export const isUserDetailLoading = createSelector(DashboardFeature, FromDashboard.selectIsUserDetailLoading)

// main
export const usersSelectCategs = createSelector(DashboardFeature, FromDashboard.selectUsersSelectCategs)
export const usersLists = createSelector(DashboardFeature, FromDashboard.selectUsersLists)
export const searchedUsersLists = createSelector(DashboardFeature, FromDashboard.selectSearchedUsersLists)
export const curMemberManageCateg = createSelector(DashboardFeature, FromDashboard.selectCurMemberManageCateg)
export const curUserListSelect = createSelector(DashboardFeature, FromDashboard.selectCurUserListSelect)
export const curUserData = createSelector(DashboardFeature, FromDashboard.selectCurUserData)

export const selectedUserListsHolding = createSelector(DashboardFeature, FromDashboard.selectedUserListsHolding)

export const curUserMembershipData = createSelector(DashboardFeature, FromDashboard.selectCurUserMemberhsipData)
export const curUserLockerData = createSelector(DashboardFeature, FromDashboard.selectCurUserLockerData)
export const curUserReservationData = createSelector(DashboardFeature, FromDashboard.selectCurUserReservationData)
export const curUserPaymentData = createSelector(DashboardFeature, FromDashboard.selectCurUserPaymentData)

export const employeeRoleObj = createSelector(DashboardFeature, FromDashboard.selectEmployeeRoleObj)

// drawer
export const drawerCurCenterId = createSelector(DashboardFeature, FromDashboard.selectDrawerCurCenterId)
export const drawerSearchInput = createSelector(DashboardFeature, FromDashboard.selectDrawerSearchInput)
export const drawerIsLoading = createSelector(DashboardFeature, FromDashboard.selectDrawerIsLoading)
export const drawerUsersSelectCategs = createSelector(DashboardFeature, FromDashboard.selectDrawerUsersSelectCategs)
export const drawerUsersLists = createSelector(DashboardFeature, FromDashboard.selectDrawerUsersLists)
export const drawerCurMemberManageCateg = createSelector(
    DashboardFeature,
    FromDashboard.selectDrawerCurMemberManageCateg
)
export const drawerCurUserListSelect = createSelector(DashboardFeature, FromDashboard.selectDrawerCurUserListSelect)
export const drawerCurUserData = createSelector(DashboardFeature, FromDashboard.selectDrawerCurUserData)
export const drawerSearchedUsersLists = createSelector(DashboardFeature, FromDashboard.selectDrawerSearchedUsersLists)
export const drawerSelectedUserListsHolding = createSelector(
    DashboardFeature,
    FromDashboard.selectedDrawerUserListsHolding
)
export const drawerEmployeeRoleObj = createSelector(DashboardFeature, FromDashboard.selectDrawerEmployeeRoleObj)
