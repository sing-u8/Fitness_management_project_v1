import { createSelector } from '@ngrx/store'
import { GymFeature, GymState } from './sec.selector'
import * as FromLocker from '@centerStore/reducers/sec.locker.reducer'

export const FeatureKey = 'Center/Locker'

export const GymLockerFeature = createSelector(GymFeature, (state: GymState) => state[FeatureKey])

export const LockerCategEntities = createSelector(GymLockerFeature, FromLocker.selectLockerCategEntities)
export const LockerCategList = createSelector(GymLockerFeature, FromLocker.selectLockerCategList)

export const lockerCategLength = createSelector(GymLockerFeature, FromLocker.selectLockerCategLength)

export const curLockerCateg = createSelector(GymLockerFeature, FromLocker.selectCurLockerCateg)
export const curLockerItem = createSelector(GymLockerFeature, FromLocker.selectCurLockerItem)
export const curLockerItemList = createSelector(GymLockerFeature, FromLocker.selectCurLockerItemList)
export const willBeMovedLockerItem = createSelector(GymLockerFeature, FromLocker.selectWillBeMovedLockerItem)
export const LockerGlobalMode = createSelector(GymLockerFeature, FromLocker.selectLockerGlobalMode)
export const curCenterId = createSelector(GymLockerFeature, FromLocker.selectCurCenterId)
export const isLoading = createSelector(GymLockerFeature, FromLocker.selectIsLoading)
export const error = createSelector(GymLockerFeature, FromLocker.selectError)
