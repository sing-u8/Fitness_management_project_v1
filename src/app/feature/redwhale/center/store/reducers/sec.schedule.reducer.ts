import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import _ from 'lodash'

// schemas
import { Loading } from '@schemas/store/loading'
import { CenterUser } from '@schemas/center-user'
import { Calendar } from '@schemas/calendar'
import { CalendarTask } from '@schemas/calendar-task'
import { CalendarTaskClass } from '@schemas/calendar-task-class'

import * as ScheduleActions from '../actions/sec.schedule.actions'

export type FilterType = 'onetoone' | 'group' | 'general'
export type FilterTypeName = '1:1 수업' | '그룹 수업' | '기타 일정'
export type LectureFilter = {
    onetoone: { selected: boolean; filterName: FilterTypeName }
    group: { selected: boolean; filterName: FilterTypeName }
    general: { selected: boolean; filterName: FilterTypeName }
}
export const LectureFilterInit: LectureFilter = {
    onetoone: { selected: true, filterName: '1:1 수업' },
    group: { selected: true, filterName: '그룹 수업' },
    general: { selected: true, filterName: '기타 일정' },
}

export type InstructorType = {
    selected: boolean
    instructor: Calendar
}

export type CalendarViewType = 'resourceTimeGridDay' | 'timeGridWeek' | 'dayGridMonth'
export type CalendarConfigInfo = {
    startDate: Date
    endDate: Date
    viewType: CalendarViewType
}
export const CalendarConfigInfoInit: CalendarConfigInfo = {
    startDate: undefined,
    endDate: undefined,
    viewType: undefined,
}

export type CenterOperatingHour = { start: string; end: string }
export const CenterOperationHourInit = { start: undefined, end: undefined }

// init states
export const InstructorListInit: InstructorType[] = []
export const TaskListInit: CalendarTask[] = []

export interface State {
    // common
    curCenterId: string
    isLoading: Loading
    error: string

    // main
    taskList: CalendarTask[]
    instructorList: InstructorType[]
    calendarConfig: CalendarConfigInfo
    operatingHour: CenterOperatingHour
    lectureFilter: LectureFilter
}

export const initialState: State = {
    // common
    curCenterId: undefined,
    isLoading: 'idle',
    error: '',
    // main
    taskList: [],
    instructorList: [],
    calendarConfig: CalendarConfigInfoInit,
    operatingHour: CenterOperationHourInit,
    lectureFilter: LectureFilterInit,
}

export const scheduleReducer = createImmerReducer(
    initialState,

    // main
    // - // async
    on(ScheduleActions.startLoadScheduleState, (state): State => {
        state.isLoading = 'pending'
        return state
    }),
    on(ScheduleActions.finishLoadScheduleState, (state, { instructorList }): State => {
        state.isLoading = 'done'
        state.instructorList = instructorList
        return state
    }),

    on(ScheduleActions.startCreateInstructor, (state): State => {
        return state
    }),
    on(ScheduleActions.finishCreateInstructor, (state, { createdInstructor }): State => {
        state.instructorList.push(createdInstructor)
        return state
    }),

    // - // sync
    on(ScheduleActions.setTaskList, (state, { taskList }) => {
        state.taskList = taskList
        return state
    }),
    on(ScheduleActions.setInstructorList, (state, { instructorList }) => {
        state.instructorList = instructorList
        return state
    }),
    on(ScheduleActions.setCalendarConfig, (state, { calendarConfig }) => {
        state.calendarConfig = calendarConfig
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
    })
)

// common
export const selectCurCenterId = (state: State) => state.curCenterId
export const selectError = (state: State) => state.error
export const selectIsLoading = (state: State) => state.isLoading

// main
export const selectTaskList = (state: State) => state.taskList
export const selectInstructorList = (state: State) => state.instructorList
export const selectCalendarConfigInfo = (state: State) => state.calendarConfig
export const selectOperatingHour = (state: State) => state.operatingHour
export const selectLectureFilter = (state: State) => state.lectureFilter
