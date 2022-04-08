import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'

import { Response } from '@schemas/response'
import { Calendar } from '@schemas/calendar'
import { CalendarTask } from '@schemas/calendar-task'

@Injectable({
    providedIn: 'root',
})
export class CenterCalendarService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/center`

    private options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    }

    constructor(private http: HttpClient) {}

    // 캘린더 생성
    createCalendar(centerId: string, reqBody: CreateCalendarReqBody): Observable<Calendar> {
        const url = this.SERVER + `/${centerId}/calendar`

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // 캘린더 조회
    getCalendars(centerId: string, querys: GetCalendarQuery): Observable<Array<Calendar>> {
        const url =
            this.SERVER +
            `/${centerId}/calendar?typeCode=${querys.typeCode}&page=${querys.page}&pageSize=${querys.pageSize}`

        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    // 캘린더 수정
    updateCalendar(centerId: string, calendarId: string, reqBody: UpdateCalendarReqBody): Observable<Calendar> {
        const url = this.SERVER + `/${centerId}/calendar/${calendarId}`

        return this.http.put<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // 캘린더 삭제
    deleteCalendar(centerId: string, calendarId: string): Observable<Response> {
        const url = this.SERVER + `/${centerId}/calendar/${calendarId}`

        return this.http.delete<Response>(url, this.options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    // 테스크 생성
    createCalendarTask(centerId: string, calendarId: string, reqBody: CreateCalendarTaskReqBody): Observable<Response> {
        const url = this.SERVER + `/${centerId}/calendar/${calendarId}/task`

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // 테스크 조회
    getCalendarTasks(
        centerId: string,
        calendarId: string,
        start_date: string,
        end_date: string
    ): Observable<Array<CalendarTask>> {
        const url =
            this.SERVER + `/${centerId}/calendar/${calendarId}/task?start_date=${start_date}&end_date=${end_date}`

        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    // 테스크 수정
    updateCalendarTask(
        centerId: string,
        calendarId: string,
        taskId: string,
        reqBody: UpdateCalendarTaskReqBody,
        mode?: 'one' | 'after' | 'all'
    ): Observable<Response> {
        const url = this.SERVER + `/${centerId}/calendar/${calendarId}/task/${taskId}?mode=${mode}`

        return this.http.put<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    // 테스크 삭제
    deleteCalendarTask(
        centerId: string,
        calendarId: string,
        taskId: string,
        mode?: 'one' | 'after' | 'all'
    ): Observable<Response> {
        const url = this.SERVER + `/${centerId}/calendar/${calendarId}/task/${taskId}?mode=${mode}`

        return this.http.delete<Response>(url, this.options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }
}

export interface CreateCalendarReqBody {
    user_id: string
    type_code: 'calendar_type_user_calendar' | 'calendar_type_center_calendar'
    name: string
}

export interface GetCalendarQuery {
    typeCode?: 'calendar_type_user_calendar' | 'calendar_type_center_calendar'
    page?: number
    pageSize?: number
}

export interface UpdateCalendarReqBody {
    name: string
}

export interface CreateCalendarTaskReqBody {
    type_code: 'calendar_task_type_normal' | 'calendar_task_type_class'
    name: string
    start_date: string
    end_date: string
    all_day: string
    start_time?: string
    end_time?: string
    color?: string
    memo?: string
    repeat: boolean
    repeat_cycle?: number
    repeat_cycle_unit_code?:
        | 'calendar_task_group_repeat_cycle_unit_day'
        | 'calendar_task_group_repeat_cycle_unit_week'
        | 'calendar_task_group_repeat_cycle_unit_month'
    repeat_day_of_the_week?: Array<number> // 0 일요일 ~ 6 토요일
    repeat_termination_type_code?:
        | 'calendar_task_group_repeat_termination_type_none'
        | 'calendar_task_group_repeat_termination_type_count'
        | 'calendar_task_group_repeat_termination_type_date'
    repeat_count?: number
    repeat_end_date?: string
    class: ClassForCU
}

export interface UpdateCalendarTaskReqBody {
    type_code?: 'calendar_task_type_normal' | 'calendar_task_type_class'
    name?: string
    start_date?: string
    end_date?: string
    all_day?: boolean
    start_time?: string
    end_time?: string
    color?: string
    memo?: string
    repeat?: boolean
    repeat_cycle?: number
    repeat_cycle_unit_code?:
        | 'calendar_task_group_repeat_cycle_unit_day'
        | 'calendar_task_group_repeat_cycle_unit_week'
        | 'calendar_task_group_repeat_cycle_unit_month'
    repeat_day_of_the_week?: Array<number> // 0 일요일 ~ 6 토요일
    repeat_termination_type_code?:
        | 'calendar_task_group_repeat_termination_type_none'
        | 'calendar_task_group_repeat_termination_type_count'
        | 'calendar_task_group_repeat_termination_type_date'
    repeat_count?: number
    repeat_end_date?: string
    class: ClassForCU
}

export interface ClassForCU {
    class_item_id: string
    type_code: string
    state_code: string
    duration: string
    capacity: string
    start_booking: string
    end_booking: string
    cancel_booking: string
    instructor_user_ids: string[]
}
