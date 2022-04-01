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

// main
export const usersSelectCategs = createSelector(DashboardFeature, FromDashboard.selectUsersSelectCategs)
export const usersLists = createSelector(DashboardFeature, FromDashboard.selectUsersLists)
export const curMemberManageCateg = createSelector(DashboardFeature, FromDashboard.selectCurMemberManageCateg)
export const curUserListSelect = createSelector(DashboardFeature, FromDashboard.selectCurUserListSelect)
export const curUserData = createSelector(DashboardFeature, FromDashboard.selectCurUserData)
