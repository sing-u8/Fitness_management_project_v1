import { createFeatureSelector } from '@ngrx/store'
import * as FromLesson from '@gymStore/reducers/sec.lesson.reducer'

import * as FromMembership from '@gymStore/reducers/sec.membership.reducer'

export interface GymState {
    'Gym/Lesson': FromLesson.State
    'Gym/Membership': FromMembership.State
}

export const FeatureKey = 'Gym'

export const GymFeature = createFeatureSelector<GymState>(FeatureKey)
