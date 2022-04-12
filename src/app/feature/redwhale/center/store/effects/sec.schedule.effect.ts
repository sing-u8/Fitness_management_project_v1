import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, EMPTY, iif, forkJoin } from 'rxjs'
import { catchError, switchMap, tap, map, filter, find, mergeMap } from 'rxjs/operators'

import { StorageService } from '@services/storage.service'
import { CenterCalendarService } from '@services/center-calendar.service'
import { CenterUsersService } from '@services/center-users.service'

import * as ScheduleActions from '../actions/sec.schedule.actions'
import * as ScheduleSelector from '../selectors/sec.schedule.selector'
import * as ScheduleReducer from '../reducers/sec.schedule.reducer'

import { showToast } from '@appStore/actions/toast.action'

import _ from 'lodash'

@Injectable()
export class ScheduleEffect {
    constructor(
        private actions$: Actions,
        private store: Store,
        private storageService: StorageService,
        private centerCalendarApi: CenterCalendarService,
        private centerUsersApi: CenterUsersService
    ) {}

    public loadScheduleState = createEffect(() => {
        const center = this.storageService.getCenter()
        const user = this.storageService.getUser()
        return this.actions$.pipe(
            ofType(ScheduleActions.startLoadScheduleState),
            switchMap(() => {
                return forkJoin({
                    centerUsers: this.centerUsersApi.getUserList(center.id),
                    calendars: this.centerCalendarApi.getCalendars(center.id, {
                        typeCode: 'calendar_type_user_calendar',
                    }),
                }).pipe(
                    map(({ centerUsers, calendars }) => {
                        const curCenterUser = _.find(centerUsers, (centerUser) => centerUser.id == user.id)
                        const curCalendar = _.find(calendars, (cal) => cal.calendar_user.id == curCenterUser.id)
                        return { curCenterUser, curCalendar, calendars }
                    }),
                    switchMap((value) => {
                        const instructorList: ScheduleReducer.InstructorType[] = value.calendars.map((calendar) => ({
                            selected: true,
                            instructor: calendar,
                        }))
                        if (value.curCalendar == undefined && value.curCenterUser.role_code == 'owner') {
                            return [
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
                            return [ScheduleActions.finishLoadScheduleState({ instructorList })]
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
