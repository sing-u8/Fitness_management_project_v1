import { createFeatureSelector } from '@ngrx/store'

import * as FromLesson from '@centerStore/reducers/sec.lesson.reducer'
import * as FromMembership from '@centerStore/reducers/sec.membership.reducer'
import * as FromLocker from '@centerStore/reducers/sec.locker.reducer'
import * as FromDashboard from '@centerStore/reducers/sec.dashboard.reducer'

export interface GymState {
    'Center/Lesson': FromLesson.State
    'Center/Membership': FromMembership.State
    'Center/Locker': FromLocker.State
    'Center/Dashboard': FromDashboard.State
}

export const FeatureKey = 'Center'

export const GymFeature = createFeatureSelector<GymState>(FeatureKey)
