import { Injectable } from '@angular/core'
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects'
import { forkJoin, of } from 'rxjs'
import { catchError, map, switchMap, tap } from 'rxjs/operators'

import { StorageService } from '@services/storage.service'
import { CenterCalendarService } from '@services/center-calendar.service'
import { CenterUsersService } from '@services/center-users.service'
import { CenterLessonService } from '@services/center-lesson.service'
import { WordService } from '@services/helper/word.service'

import * as ScheduleActions from '../actions/sec.schedule.actions'
import * as ScheduleReducer from '../reducers/sec.schedule.reducer'
import * as ScheduleSelector from '../selectors/sec.schedule.selector'

import _ from 'lodash'
import { showToast } from '@appStore/actions/toast.action'
import { Store } from '@ngrx/store'
import { curCenterCalendar } from '../selectors/sec.schedule.selector'

@Injectable()
export class ScheduleEffect {
    constructor(
        private actions$: Actions,
        private storageService: StorageService,
        private centerCalendarApi: CenterCalendarService,
        private centerUsersApi: CenterUsersService,
        private centerLessonApi: CenterLessonService,
        private wordService: WordService,
        private nxStore: Store
    ) {}

    public loadScheduleState$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ScheduleActions.startLoadScheduleState),
            switchMap(() => {
                const center = this.storageService.getCenter()
                const user = this.storageService.getUser()
                return this.centerCalendarApi
                    .getCalendars(center.id, {
                        typeCode: 'calendar_type_center_calendar',
                    })
                    .pipe(
                        switchMap((calendars) => {
                            return forkJoin([
                                this.centerUsersApi.getUserList(center.id),
                                this.centerCalendarApi.getFilterInstructor(center.id, calendars[0].id),
                                this.centerLessonApi.getCategoryList(center.id),
                            ]).pipe(
                                map(([centerUsers, instructorFilter, lessonCategs]) => {
                                    const curCenterUser = _.find(centerUsers, (centerUser) => centerUser.id == user.id)
                                    const centerCalendar = calendars[0]
                                    const doLessonsExist =
                                        lessonCategs.length > 0 &&
                                        lessonCategs.reduce((acc, curCateg) => acc + curCateg.item_count, 0) > 0
                                    return { curCenterUser, centerCalendar, doLessonsExist, instructorFilter }
                                }),
                                switchMap((value) => {
                                    const instructorList: ScheduleReducer.InstructorType[] = value.instructorFilter.map(
                                        (centerUser) => ({
                                            selected: true,
                                            instructor: centerUser,
                                        })
                                    )
                                    if (!value.doLessonsExist) {
                                        return [
                                            ScheduleActions.setCurCenterId({ centerId: center.id }),
                                            ScheduleActions.setDoLessonsExist({ doExist: false }),
                                            ScheduleActions.finishLoadScheduleState({
                                                instructorList,
                                                curCenterCalendar: value.centerCalendar,
                                            }),
                                        ]
                                    } else if (instructorList.length == 0 && value.curCenterUser.role_code == 'owner') {
                                        return [
                                            ScheduleActions.setCurCenterId({ centerId: center.id }),
                                            ScheduleActions.startCreateInstructorFilter({
                                                centerId: center.id,
                                                centerCalendarId: value.centerCalendar.id,
                                                reqBody: {
                                                    instructor_user_id: user.id,
                                                },
                                            }),
                                            ScheduleActions.finishLoadScheduleState({
                                                instructorList,
                                                curCenterCalendar: value.centerCalendar,
                                            }),
                                        ]
                                    } else {
                                        return [
                                            ScheduleActions.setCurCenterId({ centerId: center.id }),
                                            ScheduleActions.finishLoadScheduleState({
                                                instructorList,
                                                curCenterCalendar: value.centerCalendar,
                                            }),
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
        )
    })

    public createInstructor$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ScheduleActions.startCreateInstructorFilter),
            switchMap(({ centerId, centerCalendarId, reqBody }) => {
                return this.centerCalendarApi.addFilterInstructor(centerId, centerCalendarId, reqBody).pipe(
                    switchMap((newInstructor) => {
                        return [
                            ScheduleActions.finishCreateInstructorFilter({
                                createdInstructor: {
                                    selected: true,
                                    instructor: newInstructor,
                                },
                            }),
                            showToast({
                                text: `'${this.wordService.ellipsis(
                                    newInstructor.center_user_name,
                                    6
                                )}' 강사가 추가되었습니다.`,
                            }),
                        ]
                    }),
                    catchError((err: string) => of(ScheduleActions.setError({ error: 'createInstructor err :' + err })))
                )
            })
        )
    })

    public removeInstructor$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ScheduleActions.startRemoveInstructor),
            concatLatestFrom(() => [this.nxStore.select(ScheduleSelector.curCenterCalendar)]),
            switchMap(([{ centerId, instructor }, centerCalendar]) => {
                return this.centerCalendarApi.deleteFilterInstructor(centerId, centerCalendar.id, instructor.id).pipe(
                    switchMap((res) => {
                        return [
                            showToast({
                                text: `강사별 보기 목록에서 ${this.wordService.ellipsis(
                                    instructor.center_user_name,
                                    6
                                )}님이 삭제되었습니다.`,
                            }),
                        ]
                    }),
                    catchError((err: string) => of(ScheduleActions.setError({ error: 'removeInstructor err :' + err })))
                )
            })
        )
    })

    public updateCalendarTask$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(ScheduleActions.startUpdateCalendarTask),
                switchMap(({ centerId, calendarId, taskId, reqBody, mode, cb }) =>
                    this.centerCalendarApi.updateCalendarTask(centerId, calendarId, taskId, reqBody, mode).pipe(
                        tap(() => {
                            cb ? cb() : null
                        })
                    )
                ),
                catchError((err: string) =>
                    of(ScheduleActions.setError({ error: 'startUpdateCalendarTask err :' + err }))
                )
            ),
        { dispatch: false }
    )

    public getTaskList$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ScheduleActions.startGetAllCalendarTask),
            concatLatestFrom(() => [
                this.nxStore.select(ScheduleSelector.calendarConfig),
                this.nxStore.select(ScheduleSelector.curCenterCalendar),
            ]),
            switchMap(([{ centerId, cb }, calConfig, curCenterCalendar]) => {
                // console.log('ScheduleActions.startGetAllCalendarTask -- ', reqBody, ' -- ', calConfig)
                return this.centerCalendarApi
                    .getCalendarTasks(centerId, curCenterCalendar.id, calConfig.startDate, calConfig.endDate)
                    .pipe(
                        switchMap((taskList) => {
                            cb ? cb(taskList) : null
                            return [
                                ScheduleActions.finishGetAllCalendarTask({
                                    taskList,
                                }),
                            ]
                        }),
                        catchError((err: string) =>
                            of(ScheduleActions.setError({ error: 'createInstructor err :' + err }))
                        )
                    )
            })
        )
    })

    // synchronize

    public synchronizeInstructorList = createEffect(() =>
        this.actions$.pipe(
            ofType(ScheduleActions.startSynchronizeInstructorList),
            switchMap(({ centerId, centerUser }) =>
                forkJoin([
                    this.centerCalendarApi.getCalendars(centerId, { typeCode: 'calendar_type_user_calendar' }),
                ]).pipe(
                    map(([calendars]) => {
                        const calendar = _.find(calendars, (v) => v.calendar_user.id == centerUser.id)
                        return { existCal: calendar }
                    }),
                    switchMap(({ existCal }) => {
                        if (!_.isEmpty(existCal)) {
                            return this.centerCalendarApi
                                .updateCalendar(centerId, existCal.id, {
                                    name: centerUser.center_user_name,
                                })
                                .pipe(
                                    switchMap((calendar) => [
                                        // ScheduleActions.finishSynchronizeInstructorList({ calendar }),
                                    ])
                                )
                        } else {
                            return []
                        }
                    })
                )
            )
        )
    )
}
