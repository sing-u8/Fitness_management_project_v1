import { createSelector } from '@ngrx/store'
import { GymFeature, GymState } from './sec.selector'
import * as FromLocker from '@centerStore/reducers/sec.locker.reducer'

import _ from 'lodash'

export const FeatureKey = 'Center/Locker'

export const GymLockerFeatrue = createSelector(GymFeature, (state: GymState) => state[FeatureKey])

export const LockerCategEntities = createSelector(GymLockerFeatrue, FromLocker.selectLockerCategEntities)
export const AllLockerState = createSelector(GymLockerFeatrue, FromLocker.selectLockerStateAll)

export const curLockerCateg = createSelector(GymLockerFeatrue, FromLocker.selectCurLockerCateg)
export const curLockerItem = createSelector(GymLockerFeatrue, FromLocker.selectCurLockerItem)
export const curLockerItemList = createSelector(GymLockerFeatrue, FromLocker.selectCurLockerItemList)
export const willBeMovedLockerItem = createSelector(GymLockerFeatrue, FromLocker.selectWillBeMovedLockerItem)
export const LockerGlobalMode = createSelector(GymLockerFeatrue, FromLocker.selectLockerGlobalMode)
export const curCenterId = createSelector(GymLockerFeatrue, FromLocker.selectCurCenterId)
export const isLoading = createSelector(GymLockerFeatrue, FromLocker.selectIsLoading)
export const error = createSelector(GymLockerFeatrue, FromLocker.selectError)
