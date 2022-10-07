import { createAction, props } from '@ngrx/store'

// schemas
import { Calendar } from '@schemas/calendar'
import { CalendarTask } from '@schemas/calendar-task'
import { CenterUser } from '@schemas/center-user'
import { CalendarOptions } from '@fullcalendar/angular'

import { CreateCalendarReqBody, UpdateCalendarMode, UpdateCalendarTaskReqBody } from '@services/center-calendar.service'

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

export const startUpdateCalendarTask = createAction(
    `[${FeatureKey}] Start Update Calendar Task`,
    props<{
        centerId: string
        calendarId: string
        taskId: string
        reqBody: UpdateCalendarTaskReqBody
        mode: UpdateCalendarMode
        cb?: () => void
    }>()
)

export const startGetAllCalendarTask = createAction(
    `[${FeatureKey}] Start Get All Calendar Task`,
    props<{
        centerId: string
        calendar_ids: string[]
        cb?: (taskList: CalendarTask[]) => void
    }>()
)
export const finishGetAllCalendarTask = createAction(
    `[${FeatureKey}] Finish Get All Calendar Task`,
    props<{
        taskList: CalendarTask[]
    }>()
)

// - // sync
export const setCalendarOptions = createAction(
    `[${FeatureKey}] Set Calendar Options`,
    props<{ calendarOptions: CalendarOptions }>()
)
export const setTaskList = createAction(`[${FeatureKey}] Set Task List`, props<{ taskList: CalendarTask[] }>())
export const updatetask = createAction(`[${FeatureKey}] Update Task`, props<{ task: CalendarTask }>())
export const setInstructorList = createAction(
    `[${FeatureKey}] Set Instructor List`,
    props<{ instructorList: FromSchReducer.InstructorType[] }>()
)
export const setCalendarConfig = createAction(
    `[${FeatureKey}] Set Calendar Configuration Infomation`,
    props<{ calendarConfig: Partial<FromSchReducer.CalendarConfigInfo> }>()
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
export const setModifyGeneralOption = createAction(
    `[${FeatureKey}] Set ModifyGeneralOption`,
    props<{ option: FromSchReducer.ModifyLessonOption }>()
)
export const setModifyLessonEvent = createAction(
    `[${FeatureKey}] Set ModifyLessonEvent`,
    props<{ event: CalendarTask }>()
)
export const setModifyLessonOption = createAction(
    `[${FeatureKey}] Set ModifyLessonOption`,
    props<{ option: FromSchReducer.ModifyLessonOption }>()
)

export const setTaskTitleTime = createAction(`[${FeatureKey}] Set TaskTitleTime`, props<{ taskTitleTime: Date }>())

// common
export const resetAll = createAction(`[${FeatureKey}] Reset All Schedule States`)
export const setCurCenterId = createAction(`[${FeatureKey}] Set Current Center Id`, props<{ centerId: string }>())
export const setError = createAction(`[${FeatureKey}] Set Schedule Error Message`, props<{ error: string }>())
export const setDoLessonsExist = createAction(`[${FeatureKey}] Set Do Lessons Exist`, props<{ doExist: boolean }>())

// datepick
export const setDatePick = createAction(`[${FeatureKey}] Set Date Pick`, props<{ date: string }>())
export const setWeekPick = createAction(
    `[${FeatureKey}] Set Week Pick`,
    props<{ startDate: string; endDate: string }>()
)

// synchronize by dashboard
export const startSynchronizeInstructorList = createAction(
    `[${FeatureKey}] Start Synchronize InstructorList`,
    props<{ centerUser: CenterUser; centerId: string }>()
)
export const finishSynchronizeInstructorList = createAction(
    `[${FeatureKey}] Finish Synchronize InstructorList`,
    props<{ calendar: Calendar }>()
)
