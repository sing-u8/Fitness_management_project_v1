import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'

import _ from 'lodash'
import dayjs from 'dayjs'

import { UpdateMode } from '@services/center-calendar.service'

// schemas
import { Loading } from '@schemas/store/loading'
import { Calendar } from '@schemas/calendar'
import { CalendarTask } from '@schemas/calendar-task'
import { CalendarOptions } from '@fullcalendar/angular'
import { CenterUser } from '@schemas/center-user'

import * as ScheduleActions from '../actions/sec.schedule.actions'
import { setModifyGeneralOption } from '../actions/sec.schedule.actions'

export type FilterType = 'onetoone' | 'group' | 'general'
export type FilterTypeName = '1:1 수업' | '그룹 수업' | '기타 일정'
export type LectureFilter = {
    calendar_task_type_onetoone: { selected: boolean; filterName: FilterTypeName }
    calendar_task_type_group: { selected: boolean; filterName: FilterTypeName }
    calendar_task_type_normal: { selected: boolean; filterName: FilterTypeName }
}
export const LectureFilterInit: LectureFilter = {
    calendar_task_type_onetoone: { selected: true, filterName: '1:1 수업' },
    calendar_task_type_group: { selected: true, filterName: '그룹 수업' },
    calendar_task_type_normal: { selected: true, filterName: '기타 일정' },
}

export type InstructorType = {
    selected: boolean
    instructor: CenterUser
}

export type CalendarViewType = 'resourceTimeGridDay' | 'timeGridWeek' | 'dayGridMonth'
export type CalendarConfigInfo = {
    startDate: string
    endDate: string
    viewType: CalendarViewType
}
export const CalendarConfigInfoInit: CalendarConfigInfo = {
    startDate: null,
    endDate: null,
    viewType: 'timeGridWeek',
}

export type CenterOperatingHour = { start: string; end: string }
export const CenterOperationHourInit = { start: undefined, end: undefined }

export type ViewType = 'resourceTimeGridDay' | 'timeGridWeek' | 'dayGridMonth'
export type SelectedDate = { startDate: Date; endDate: Date; viewType: ViewType }
const SelectedDateInit = {
    startDate: undefined,
    endDate: undefined,
    viewType: undefined,
}

export type ModifyLessonOption = UpdateMode

// init states
export const InstructorListInit: InstructorType[] = []
export const TaskListInit: CalendarTask[] = []

export interface State {
    // common
    curCenterId: string
    curCenterCalender: Calendar
    isLoading: Loading
    error: string
    doLessonsExist: boolean

    // datepick
    datePick: string
    weekPick: {
        startDate: string
        endDate: string
    }

    // main
    calendarOptions: CalendarOptions
    taskList: CalendarTask[]
    instructorList: InstructorType[]
    calendarConfig: CalendarConfigInfo
    operatingHour: CenterOperatingHour
    lectureFilter: LectureFilter
    selectedDate: SelectedDate
    schedulingInstructors: CenterUser[]
    isScheduleEventChanged: boolean
    taskTitleTime: string // string type -> MM/DD (dd) a hh:mm

    modifyGeneralEvent: CalendarTask
    modifyGeneralOption: ModifyLessonOption
    modifyLessonEvent: CalendarTask
    modifyLessonOption: ModifyLessonOption

    // lessonTaskReservState
}

export const initialState: State = {
    // common
    curCenterId: undefined,
    curCenterCalender: undefined,
    isLoading: 'idle',
    error: '',
    doLessonsExist: true,

    // datepick
    datePick: '',
    weekPick: {
        startDate: '',
        endDate: '',
    },
    // main
    calendarOptions: undefined,
    taskList: [],
    instructorList: [],
    calendarConfig: CalendarConfigInfoInit,
    operatingHour: CenterOperationHourInit,
    lectureFilter: LectureFilterInit,
    selectedDate: SelectedDateInit,
    schedulingInstructors: [],
    isScheduleEventChanged: false,
    taskTitleTime: '',

    modifyGeneralEvent: undefined,
    modifyGeneralOption: 'one',
    modifyLessonEvent: undefined,
    modifyLessonOption: 'one',
}

export const scheduleReducer = createImmerReducer(
    initialState,

    // main
    // - // async
    on(ScheduleActions.startLoadScheduleState, (state): State => {
        state.isLoading = 'pending'
        return state
    }),
    on(ScheduleActions.finishLoadScheduleState, (state, { instructorList, curCenterCalendar }): State => {
        state.isLoading = 'done'
        state.instructorList = instructorList
        state.curCenterCalender = curCenterCalendar
        return state
    }),

    on(ScheduleActions.finishCreateInstructorFilter, (state, { createdInstructor }): State => {
        state.instructorList.push(createdInstructor)
        return state
    }),

    on(ScheduleActions.startRemoveInstructor, (state, { instructor }): State => {
        state.instructorList = _.filter(state.instructorList, (v) => v.instructor.id != instructor.id)
        return state
    }),

    on(ScheduleActions.finishGetAllCalendarTask, (state, { taskList }) => {
        state.taskList = taskList // _.unionBy(state.taskList, taskList, 'id')
        return state
    }),

    // - // sync
    on(ScheduleActions.setCalendarOptions, (state, { calendarOptions }) => {
        state.calendarOptions = calendarOptions
        return state
    }),
    on(ScheduleActions.setTaskList, (state, { taskList }) => {
        state.taskList = taskList // _.unionBy(taskList, state.taskList, 'id')
        return state
    }),
    on(ScheduleActions.updatetask, (state, { task }) => {
        const taskIdx = state.taskList.findIndex((v) => v.id == task.id)
        state.taskList[taskIdx] = task
        return state
    }),
    on(ScheduleActions.setInstructorList, (state, { instructorList }) => {
        state.instructorList = instructorList
        return state
    }),
    on(ScheduleActions.setCalendarConfig, (state, { calendarConfig }) => {
        state.calendarConfig = _.assign(state.calendarConfig, calendarConfig)
        return state
    }),
    on(ScheduleActions.setOperatingHour, (state, { operatingHour }) => {
        state.operatingHour = operatingHour
        return state
    }),
    on(ScheduleActions.setLectureFilter, (state, { lectureFilter }) => {
        state.lectureFilter = lectureFilter
        return state
    }),
    on(ScheduleActions.setSelectedDate, (state, { selectedDate }) => {
        state.selectedDate = selectedDate
        return state
    }),
    on(ScheduleActions.setIsScheduleEventChanged, (state, { isScheduleEventChanged }) => {
        state.isScheduleEventChanged = isScheduleEventChanged
        return state
    }),
    on(ScheduleActions.setSchedulingInstructors, (state, { schedulingInstructors }) => {
        state.schedulingInstructors = schedulingInstructors
        return state
    }),

    on(ScheduleActions.setModifyGeneralEvent, (state, { event }) => {
        state.modifyGeneralEvent = event
        return state
    }),
    on(ScheduleActions.setModifyGeneralOption, (state, { option }) => {
        state.modifyGeneralOption = option
        return state
    }),
    on(ScheduleActions.setModifyLessonEvent, (state, { event }) => {
        state.modifyLessonEvent = event
        return state
    }),
    on(ScheduleActions.setModifyLessonOption, (state, { option }) => {
        state.modifyLessonOption = option
        return state
    }),
    on(ScheduleActions.setTaskTitleTime, (state, { taskTitleTime }) => {
        state.taskTitleTime = dayjs(taskTitleTime).format('MM/DD (dd) a hh시 mm분')
        return state
    }),
    // date pick
    on(ScheduleActions.setDatePick, (state, { date }) => {
        state.datePick = date
        return state
    }),
    on(ScheduleActions.setWeekPick, (state, { startDate, endDate }) => {
        state.weekPick.startDate = startDate
        state.weekPick.endDate = endDate
        return state
    }),

    // common
    on(ScheduleActions.resetAll, (state) => {
        state = { ...state, ...initialState }
        return state
    }),
    on(ScheduleActions.setCurCenterId, (state, { centerId }) => {
        state.curCenterId = centerId
        return state
    }),
    on(ScheduleActions.setError, (state, { error }) => {
        state.error = error
        return state
    }),
    on(ScheduleActions.setDoLessonsExist, (state, { doExist }) => {
        state.doLessonsExist = doExist
        return state
    }),
    // synchronize
    on(ScheduleActions.finishSynchronizeInstructorList, (state, { instructor }) => {
        if (state.isLoading == 'done') {
            const instructorIdx = _.findIndex(state.instructorList, (v) => v.instructor.id == instructor.id)
            state.instructorList[instructorIdx].instructor = instructor
        }
        return state
    })
)

// common
export const selectCurCenterId = (state: State) => state.curCenterId
export const selectError = (state: State) => state.error
export const selectIsLoading = (state: State) => state.isLoading
export const selectDoLessonsExist = (state: State) => state.doLessonsExist
export const selectCurCenterCalender = (state: State) => state.curCenterCalender

// date pick
export const selectDatePick = (state: State) => state.datePick
export const selectWeekPick = (state: State) => state.weekPick

// main
export const selectCalendarOptions = (state: State) => state.calendarOptions
export const selectTaskList = (state: State) => state.taskList
export const selectInstructorList = (state: State) => state.instructorList
export const selectCalendarConfigInfo = (state: State) => state.calendarConfig
export const selectOperatingHour = (state: State) => state.operatingHour
export const selectLectureFilter = (state: State) => state.lectureFilter
export const selectSelectedDate = (state: State) => state.selectedDate
export const selectSchedulingInstructors = (state: State) => state.schedulingInstructors
export const selectIsScheduleEventChanged = (state: State) => state.isScheduleEventChanged
export const selectModifyGeneralEvent = (state: State) => state.modifyGeneralEvent
export const selectModifyGeneralOption = (state: State) => state.modifyGeneralOption
export const selectModifyLessonEvent = (state: State) => state.modifyLessonEvent
export const selectModifyLessonOption = (state: State) => state.modifyLessonOption
export const selectTaskTitleTime = (state: State) => state.taskTitleTime
