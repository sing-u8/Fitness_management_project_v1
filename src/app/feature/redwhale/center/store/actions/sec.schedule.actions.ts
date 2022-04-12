import { createAction, props } from '@ngrx/store'

// schemas
import { CenterUser } from '@schemas/center-user'
import { Calendar } from '@schemas/calendar'
import { CalendarTask } from '@schemas/calendar-task'
import { CalendarTaskClass } from '@schemas/calendar-task-class'
import { CreateCalendarReqBody } from '@services/center-calendar.service'

import * as FromSchReducer from '@centerStore/reducers/sec.schedule.reducer'

const FeatureKey = 'Center/Schedule'

// main
// - // async
export const startLoadScheduleState = createAction(
    `[${FeatureKey}] Start Load Schedule State`
    // props<{ calendarList: Calendar[] }>()
)
export const finishLoadScheduleState = createAction(
    `[${FeatureKey}] Finish Load Schedule State`,
    props<{ instructorList: FromSchReducer.InstructorType[] }>()
)

export const startCreateInstructor = createAction(
    `[${FeatureKey}] Start Create Instructor`,
    props<{ centerId: string; reqBody: CreateCalendarReqBody }>()
)
export const finishCreateInstructor = createAction(
    `[${FeatureKey}] Finish Create Instructor`,
    props<{ createdInstructor: FromSchReducer.InstructorType; instructorList?: FromSchReducer.InstructorType[] }>()
)

// - // sync
export const setTaskList = createAction(`[${FeatureKey}] Set Task List`, props<{ taskList: CalendarTask[] }>())
export const setInstructorList = createAction(
    `[${FeatureKey}] Set Instructor List`,
    props<{ instructorList: FromSchReducer.InstructorType[] }>()
)
export const setCalendarConfig = createAction(
    `[${FeatureKey}] Set Calendar Configuration Infomation`,
    props<{ calendarConfig: FromSchReducer.CalendarConfigInfo }>()
)
export const setOperatingHour = createAction(
    `[${FeatureKey}] Set Operating Hour`,
    props<{ operatingHour: FromSchReducer.CenterOperatingHour }>()
)
export const setLectureFilter = createAction(
    `[${FeatureKey}] Set Lecture Filter`,
    props<{ lectureFilter: FromSchReducer.LectureFilter }>()
)
export const setSelectedDate = createAction(
    `[${FeatureKey}] Set Selected Date`,
    props<{ selectedDate: FromSchReducer.SelectedDate }>()
)
export const setSchedulingInstructor = createAction(
    `[${FeatureKey}] Set Scheduling Instructor`,
    props<{ schedulingInstructor: Calendar }>()
)
export const setIsScheduleEventChanged = createAction(
    `[${FeatureKey}] Set IsScheduleEventChanged`,
    props<{ isScheduleEventChanged: boolean }>()
)

export const setModifyGeneralEvent = createAction(
    `[${FeatureKey}] Set ModifyGeneralEvent`,
    props<{ event: CalendarTask }>()
)
export const setModifyLessonEvent = createAction(
    `[${FeatureKey}] Set ModifyLessonEvent`,
    props<{ event: CalendarTask }>()
)
export const setModifyLessonOption = createAction(
    `[${FeatureKey}] Set ModifyLessonOption`,
    props<{ option: FromSchReducer.ModifyLessonOption }>()
)

// common
export const resetAll = createAction(`[${FeatureKey}] Reset All Schedule States`)
export const setCurCenterId = createAction(`[${FeatureKey}] Set Current Center Id`, props<{ centerId: string }>())
export const setError = createAction(`[${FeatureKey}] Set Schedule Error Message`, props<{ error: string }>())
