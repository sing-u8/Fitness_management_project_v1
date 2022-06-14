import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType } from '@ngrx/effects'
import { of, forkJoin } from 'rxjs'
import { catchError, switchMap, map } from 'rxjs/operators'

import { StorageService } from '@services/storage.service'
import { CenterCalendarService } from '@services/center-calendar.service'
import { CenterUsersService } from '@services/center-users.service'
import { CenterLessonService } from '@services/center-lesson.service'

import * as ScheduleActions from '../actions/sec.schedule.actions'
import * as ScheduleReducer from '../reducers/sec.schedule.reducer'

import _ from 'lodash'

@Injectable()
export class ScheduleEffect {
    constructor(
        private actions$: Actions,
        private storageService: StorageService,
        private centerCalendarApi: CenterCalendarService,
        private centerUsersApi: CenterUsersService,
        private centerLessonApi: CenterLessonService
    ) {}

    public loadScheduleState = createEffect(() => {
        return this.actions$.pipe(
            ofType(ScheduleActions.startLoadScheduleState),
            switchMap(() => {
                const center = this.storageService.getCenter()
                const user = this.storageService.getUser()
                return forkJoin({
                    centerUsers: this.centerUsersApi.getUserList(center.id),
                    calendars: this.centerCalendarApi.getCalendars(center.id, {
                        typeCode: 'calendar_type_user_calendar',
                    }),
                    lessonCategs: this.centerLessonApi.getCategoryList(center.id),
                }).pipe(
                    map(({ centerUsers, calendars, lessonCategs }) => {
                        const curCenterUser = _.find(centerUsers, (centerUser) => centerUser.id == user.id)
                        const curCalendar = _.find(calendars, (cal) => cal.calendar_user.id == curCenterUser.id)
                        const doLessonsExist =
                            lessonCategs.length > 0 &&
                            lessonCategs.reduce((acc, curCateg) => [...acc, curCateg.items], []).length > 0
                                ? true
                                : false
                        return { curCenterUser, curCalendar, calendars, doLessonsExist }
                    }),
                    switchMap((value) => {
                        const instructorList: ScheduleReducer.InstructorType[] = value.calendars.map((calendar) => ({
                            selected: true,
                            instructor: calendar,
                        }))
                        if (!value.doLessonsExist) {
                            return [
                                ScheduleActions.setDoLessonsExist({ doExist: false }),
                                ScheduleActions.finishLoadScheduleState({ instructorList }),
                            ]
                        } else if (value.curCalendar == undefined && value.curCenterUser.role_code == 'owner') {
                            return [
                                ScheduleActions.setCurCenterId({ centerId: center.id }),
                                ScheduleActions.startCreateInstructor({
                                    centerId: center.id,
                                    reqBody: {
                                        calendar_user_id: user.id,
                                        type_code: 'calendar_type_user_calendar',
                                        name: value.curCenterUser.center_user_name,
                                    },
                                }),
                                ScheduleActions.finishLoadScheduleState({ instructorList }),
                            ]
                        } else {
                            return [
                                ScheduleActions.setCurCenterId({ centerId: center.id }),
                                ScheduleActions.finishLoadScheduleState({ instructorList }),
                            ]
                        }
                    }),
                    catchError((err: string) =>
                        of(ScheduleActions.setError({ error: 'load schedule state err :' + err }))
                    )
                )
            })
        )
    })

    public createInstructor = createEffect(() => {
        return this.actions$.pipe(
            ofType(ScheduleActions.startCreateInstructor),
            switchMap(({ centerId, reqBody }) => {
                return this.centerCalendarApi.createCalendar(centerId, reqBody).pipe(
                    map((newInstructor) => {
                        return ScheduleActions.finishCreateInstructor({
                            createdInstructor: {
                                selected: true,
                                instructor: newInstructor,
                            },
                        })
                    }),
                    catchError((err: string) => of(ScheduleActions.setError({ error: 'createInstructor err :' + err })))
                )
            })
        )
    })
}
