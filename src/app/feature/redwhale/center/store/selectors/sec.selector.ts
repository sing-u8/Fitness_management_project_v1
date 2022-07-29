import { createFeatureSelector } from '@ngrx/store'

import * as FromLesson from '@centerStore/reducers/sec.lesson.reducer'
import * as FromMembership from '@centerStore/reducers/sec.membership.reducer'
import * as FromLocker from '@centerStore/reducers/sec.locker.reducer'
import * as FromDashboard from '@centerStore/reducers/sec.dashboard.reducer'
import * as FromSchedule from '@centerStore/reducers/sec.schedule.reducer'
import * as FromSale from '@centerStore/reducers/sec.sale.reducer'
import * as FromCommunity from '@centerStore/reducers/sec.community.reducer'
import * as FromCommon from '@centerStore/reducers/center.common.reducer'

export interface GymState {
    'Center/Lesson': FromLesson.State
    'Center/Membership': FromMembership.State
    'Center/Locker': FromLocker.State
    'Center/Dashboard': FromDashboard.State
    'Center/Schedule': FromSchedule.State
    'Center/Sale': FromSale.State
    'Center/Community': FromCommunity.State
    'Center/Common': FromCommon.State
}

export const FeatureKey = 'Center'

export const GymFeature = createFeatureSelector<GymState>(FeatureKey)
