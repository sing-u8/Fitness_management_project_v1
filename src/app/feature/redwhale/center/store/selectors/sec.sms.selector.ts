import { createSelector, createFeatureSelector } from '@ngrx/store'
import { GymFeature, GymState } from './sec.selector'
import * as FromSMS from '@centerStore/reducers/sec.sms.reducer'

export const FeatureKey = 'Center/SMS'
export const SMSFeature = createSelector(GymFeature, (state: GymState) => state[FeatureKey])

// common
export const curCenterId = createSelector(SMSFeature, FromSMS.selectCurCenterId)
export const isLoading = createSelector(SMSFeature, FromSMS.selectIsLoading)
export const error = createSelector(SMSFeature, FromSMS.selectError)
export const searchInput = createSelector(SMSFeature, FromSMS.selectSearchInput)
// main
export const usersSelectCategs = createSelector(SMSFeature, FromSMS.selectUsersSelectCategs)
export const usersLists = createSelector(SMSFeature, FromSMS.selectUsersLists)
export const searchedUsersLists = createSelector(SMSFeature, FromSMS.selectSearchedUsersLists)
export const curUserListSelect = createSelector(SMSFeature, FromSMS.selectCurUserListSelect)

export const selectedUserListsHolding = createSelector(SMSFeature, FromSMS.selectedUserListsSelected)
