import { createSelector } from '@ngrx/store'
import { GymFeature, GymState } from './sec.selector'
import * as FromSchedule from '@centerStore/reducers/sec.schedule.reducer'

import _ from 'lodash'

export const FeatureKey = 'Center/Schedule'

export const GymScheduleFeature = createSelector(GymFeature, (state: GymState) => state[FeatureKey])

// common
export const isLoading = createSelector(GymScheduleFeature, FromSchedule.selectIsLoading)
export const error = createSelector(GymScheduleFeature, FromSchedule.selectError)
export const curCenterId = createSelector(GymScheduleFeature, FromSchedule.selectCurCenterId)
export const doLessonsExist = createSelector(GymScheduleFeature, FromSchedule.selectDoLessonsExist)

// main
export const taskList = createSelector(GymScheduleFeature, FromSchedule.selectTaskList)
export const instructorList = createSelector(GymScheduleFeature, FromSchedule.selectInstructorList)
export const calendarConfig = createSelector(GymScheduleFeature, FromSchedule.selectCalendarConfigInfo)
export const operatingHour = createSelector(GymScheduleFeature, FromSchedule.selectOperatingHour)
export const lectureFilter = createSelector(GymScheduleFeature, FromSchedule.selectLectureFilter)
export const selectedDate = createSelector(GymScheduleFeature, FromSchedule.selectSelectedDate)
export const schedulingInstructor = createSelector(GymScheduleFeature, FromSchedule.selectSchedulingInstructor)
export const isScheduleEventChanged = createSelector(GymScheduleFeature, FromSchedule.selectIsScheduleEventChanged)
export const modifyGeneralEvent = createSelector(GymScheduleFeature, FromSchedule.selectModifyGeneralEvent)
export const modifyLessonEvent = createSelector(GymScheduleFeature, FromSchedule.selectModifyLessonEvent)
export const setModifyLessonOption = createSelector(GymScheduleFeature, FromSchedule.selectModifyLessonOption)
