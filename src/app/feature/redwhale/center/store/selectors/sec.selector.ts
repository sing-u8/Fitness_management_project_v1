import { createFeatureSelector } from '@ngrx/store'
import * as FromLesson from '@centerStore/reducers/sec.lesson.reducer'

import * as FromMembership from '@centerStore/reducers/sec.membership.reducer'

export interface GymState {
    'Gym/Lesson': FromLesson.State
    'Gym/Membership': FromMembership.State
}

export const FeatureKey = 'Gym'

export const GymFeature = createFeatureSelector<GymState>(FeatureKey)
