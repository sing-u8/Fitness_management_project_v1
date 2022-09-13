import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Subject } from 'rxjs'
import { take, takeUntil } from 'rxjs/operators'
import dayjs from 'dayjs'
import _ from 'lodash'

import { StorageService } from '@services/storage.service'
import { CenterCalendarService, UpdateCalendarTaskReqBody } from '@services/center-calendar.service'

import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { CalendarTask } from '@schemas/calendar-task'

// ngrx
import { select, Store } from '@ngrx/store'
import { concatLatestFrom } from '@ngrx/effects'
import * as ScheduleReducer from '@centerStore/reducers/sec.schedule.reducer'
import * as ScheduleSelector from '@centerStore/selectors/sec.schedule.selector'
import * as CenterCommonSelector from '@centerStore/selectors/center.common.selector'
import { closeDrawer } from '@appStore/actions/drawer.action'
import { showToast } from '@appStore/actions/toast.action'

@Component({
    selector: 'modify-general-schedule',
    templateUrl: './modify-general-schedule.component.html',
    styleUrls: ['./modify-general-schedule.component.scss'],
})
export class ModifyGeneralScheduleComponent implements OnInit, AfterViewInit, OnDestroy {
    public center: Center

    public generalEvent: CalendarTask

    public gymOperatingTime: ScheduleReducer.CenterOperatingHour = { start: null, end: null }

    public titleTime: string

    public staffSelect_list: Array<{ name: string; value: CenterUser }> = []
    public instructorList: Array<ScheduleReducer.InstructorType> = []

    public StaffSelectValue: { name: string; value: CenterUser } = { name: undefined, value: undefined }

    public planTexts = {
        planTitle: '',
        planDetail: '',
    }

    public doShowDatepick = false
    public datepick: { date: string } = { date: '' }
    @ViewChild('datepicker') datepicker: ElementRef
    checkClickDatePickOutside(event) {
        _.some(event.path, this.datepicker.nativeElement) ? null : (this.doShowDatepick = !this.doShowDatepick)
    }

    public timepick: { startTime: string; endTime: string } = { startTime: '', endTime: '' }

    // --------------------------------------------------------------------------------
    cancelModifyGeneralSchedule() {
        this.closeDrawer()
    }
    // --------------------------------------------------------------------------------

    public unsubscribe$ = new Subject<void>()

    constructor(
        private storageService: StorageService,
        private centerCalendarService: CenterCalendarService,
        private nxStore: Store
    ) {}

    ngOnInit(): void {
        this.center = this.storageService.getCenter()
        this.titleTime = dayjs().format('M/D (dd) A hh시 mm분')
        this.nxStore
            .pipe(
                select(ScheduleSelector.modifyGeneralEvent),
                concatLatestFrom(() => [this.nxStore.select(ScheduleSelector.instructorList)]),
                takeUntil(this.unsubscribe$)
            )
            .subscribe(([event, instructors]) => {
                this.instructorList = instructors
                this.generalEvent = event
                this.planTexts = {
                    planTitle: event.name,
                    planDetail: event.memo,
                }
                // !! 날짜 확인하기
                this.timepick.startTime = dayjs(event.start).format('HH:mm:ss')
                this.timepick.endTime = dayjs(event.end).format('HH:mm:ss')
                this.datepick.date = dayjs(event.start).format('YYYY-MM-DD')

                this.initStaffList(instructors)

                this.StaffSelectValue = {
                    name: event.responsibility.center_user_name ?? event.responsibility.name,
                    value: event.responsibility,
                }
            })

        this.nxStore
            .pipe(select(ScheduleSelector.operatingHour), takeUntil(this.unsubscribe$))
            .subscribe((operatingTime) => {
                this.gymOperatingTime = operatingTime
            })
    }
    ngAfterViewInit(): void {}
    ngOnDestroy(): void {
        this.unsubscribe$.next()
        this.unsubscribe$.complete()
    }

    onTimeClick(time: { key: string; name: string }, type: 'start' | 'end') {
        if (type == 'start') {
            this.timepick.startTime = time.key
        } else if (type == 'end') {
            this.timepick.endTime = time.key
        }
    }

    modifyPlan(fn?: () => void) {
        const reqBody: UpdateCalendarTaskReqBody = {
            responsibility_user_id: this.StaffSelectValue.value.id,
            name: this.planTexts.planTitle,
            start_date: dayjs(this.datepick.date).format('YYYY-MM-DD'),
            start_time: this.timepick.startTime.slice(0, 5),
            end_time: this.timepick.endTime.slice(0, 5),
            memo: this.planTexts.planDetail,
        }
        const calId = this.instructorList.find((v) => v.instructor.calendar_user.id == this.StaffSelectValue.value.id)
            .instructor.id
        this.centerCalendarService
            .updateCalendarTask(this.center.id, calId, this.generalEvent.id, reqBody, 'one')
            .subscribe({
                next: (_) => {
                    fn ? fn() : null
                    // this.nxStore.dispatch(ScheduleActions.setIsScheduleEventChanged({ isScheduleEventChanged: true }))
                    this.closeDrawer()
                    this.nxStore.dispatch(
                        showToast({ text: `'${this.planTexts.planTitle}' 기타 일정이 수정되었습니다.` })
                    )
                },
                error: (err) => {
                    console.log('gymCalendarService.createTask err: ', err)
                },
            })
    }

    closeDrawer() {
        this.nxStore.dispatch(closeDrawer())
    }

    initStaffList(instructorList: ScheduleReducer.InstructorType[]) {
        this.nxStore
            .select(CenterCommonSelector.instructors)
            .pipe(take(1))
            .subscribe((instructors) => {
                const centerInstructorList = _.cloneDeep(instructors)
                this.staffSelect_list = centerInstructorList
                    .filter((ci) => -1 != instructorList.findIndex((v) => ci.id == v.instructor.calendar_user.id))
                    .map((value) => ({
                        name: value.center_user_name,
                        value: value,
                    }))
            })
    }
}
