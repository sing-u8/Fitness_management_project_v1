import { createAction, props } from '@ngrx/store'
import { Center } from '@schemas/center'
import { CenterUser } from '@schemas/center-user'

const FeatureKey = 'Center/Common'

// sync

export const setCurCenter = createAction(`[${FeatureKey}] Set Cur Center`, props<{ center: Center }>())

// async

export const startGetInstructors = createAction(`[${FeatureKey}] Start Get Instructors`, props<{ centerId: string }>())
export const finishGetInstructors = createAction(
    `[${FeatureKey}] Start Get Instructors`,
    props<{ instructors: Array<CenterUser> }>()
)
