import { createSelector, createFeatureSelector } from '@ngrx/store'
import { GymFeature, GymState } from './sec.selector'
import * as FromSMS from '@centerStore/reducers/sec.sms.reducer'
import { selectGeneralTransmissionTime } from '@centerStore/reducers/sec.sms.reducer'

export const FeatureKey = 'Center/SMS'
export const SMSFeature = createSelector(GymFeature, (state: GymState) => state[FeatureKey])

// common
export const curCenterId = createSelector(SMSFeature, FromSMS.selectCurCenterId)
export const isLoading = createSelector(SMSFeature, FromSMS.selectIsLoading)
export const error = createSelector(SMSFeature, FromSMS.selectError)
export const searchInput = createSelector(SMSFeature, FromSMS.selectSearchInput)
export const smsPoint = createSelector(SMSFeature, FromSMS.selectSMSPoint)
// main
// // general
export const smsType = createSelector(SMSFeature, FromSMS.selectSMSType)
export const usersSelectCategs = createSelector(SMSFeature, FromSMS.selectUsersSelectCategs)
export const usersLists = createSelector(SMSFeature, FromSMS.selectUsersLists)
export const searchedUsersLists = createSelector(SMSFeature, FromSMS.selectSearchedUsersLists)
export const curUserListSelect = createSelector(SMSFeature, FromSMS.selectCurUserListSelect)
export const userListIds = createSelector(SMSFeature, FromSMS.selectedUserListIds)
export const callerList = createSelector(SMSFeature, FromSMS.selectCallerList)
export const generalText = createSelector(SMSFeature, FromSMS.selectGeneralText)
export const bookTime = createSelector(SMSFeature, FromSMS.selectBookTime)
export const bookDate = createSelector(SMSFeature, FromSMS.selectBookDate)
export const generalTransmissionTime = createSelector(SMSFeature, FromSMS.selectGeneralTransmissionTime)
export const generalCaller = createSelector(SMSFeature, FromSMS.selectGeneralCaller)
export const generalIsAdSet = createSelector(SMSFeature, FromSMS.selectIsAd)
// // auto transmission
export const membershipAutoSendSetting = createSelector(SMSFeature, FromSMS.selectMembershipAutoSend)
export const lockerAutoSendSetting = createSelector(SMSFeature, FromSMS.selectLockerAutoSend)
export const lockerCaller = createSelector(SMSFeature, FromSMS.selectLockerCaller)
export const membershipCaller = createSelector(SMSFeature, FromSMS.selectMembershipCaller)

// // history
export const historyGroupLoading = createSelector(SMSFeature, FromSMS.selectHistoryGroupLoading)
export const historyLoading = createSelector(SMSFeature, FromSMS.selectHistoryLoading)
export const curHistoryGroup = createSelector(SMSFeature, FromSMS.selectCurHistoryGroup)
export const smsHistoryGroupList = createSelector(SMSFeature, FromSMS.selectSMSHistoryGroupList)
export const smsHistoryList = createSelector(SMSFeature, FromSMS.selectSMSHistoryList)
export const historyDateRange = createSelector(SMSFeature, FromSMS.selectHistoryDateRange)

export const selectedUserListsSelected = createSelector(SMSFeature, FromSMS.selectedUserListsSelected)
