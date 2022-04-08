import { createSelector } from '@ngrx/store'
import { GymFeature, GymState } from './sec.selector'
import * as FromSchedule from '@centerStore/reducers/sec.schedule.reducer'

import _ from 'lodash'

export const FeatureKey = 'Center/Schedule'

export const GymScheduleFeature = createSelector(GymFeature, (state: GymState) => state[FeatureKey])
