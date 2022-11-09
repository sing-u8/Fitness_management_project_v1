import { createSelector } from '@ngrx/store'
import { GymFeature, GymState } from './sec.selector'
import * as FromSchedule from '@centerStore/reducers/sec.schedule.reducer'
import { selectCurCenterCalender } from '@centerStore/reducers/sec.schedule.reducer'

export const FeatureKey = 'Center/Schedule'

export const GymScheduleFeature = createSelector(GymFeature, (state: GymState) => state[FeatureKey])

// common
export const isLoading = createSelector(GymScheduleFeature, FromSchedule.selectIsLoading)
export const error = createSelector(GymScheduleFeature, FromSchedule.selectError)
export const curCenterId = createSelector(GymScheduleFeature, FromSchedule.selectCurCenterId)
export const doLessonsExist = createSelector(GymScheduleFeature, FromSchedule.selectDoLessonsExist)
export const curCenterCalendar = createSelector(GymScheduleFeature, FromSchedule.selectCurCenterCalender)

// date pick
export const datePick = createSelector(GymScheduleFeature, FromSchedule.selectDatePick)
export const weekPick = createSelector(GymScheduleFeature, FromSchedule.selectWeekPick)

// main
export const calendarOptions = createSelector(GymScheduleFeature, FromSchedule.selectCalendarOptions)
export const taskList = createSelector(GymScheduleFeature, FromSchedule.selectTaskList)
export const instructorList = createSelector(GymScheduleFeature, FromSchedule.selectInstructorList)
export const calendarConfig = createSelector(GymScheduleFeature, FromSchedule.selectCalendarConfigInfo)
export const operatingHour = createSelector(GymScheduleFeature, FromSchedule.selectOperatingHour)
export const lectureFilter = createSelector(GymScheduleFeature, FromSchedule.selectLectureFilter)
export const selectedDate = createSelector(GymScheduleFeature, FromSchedule.selectSelectedDate)
export const schedulingInstructors = createSelector(GymScheduleFeature, FromSchedule.selectSchedulingInstructors)
export const isScheduleEventChanged = createSelector(GymScheduleFeature, FromSchedule.selectIsScheduleEventChanged)
export const modifyGeneralEvent = createSelector(GymScheduleFeature, FromSchedule.selectModifyGeneralEvent)
export const modifyGeneralOption = createSelector(GymScheduleFeature, FromSchedule.selectModifyGeneralOption)
export const modifyLessonEvent = createSelector(GymScheduleFeature, FromSchedule.selectModifyLessonEvent)
export const modifyLessonOption = createSelector(GymScheduleFeature, FromSchedule.selectModifyLessonOption)
export const taskTitleTime = createSelector(GymScheduleFeature, FromSchedule.selectTaskTitleTime)
