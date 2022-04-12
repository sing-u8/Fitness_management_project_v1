import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import dayjs from 'dayjs'
import _ from 'lodash'

import { StorageService } from '@services/storage.service'
import { CenterUsersService } from '@services/center-users.service'
import { CenterCalendarService, UpdateCalendarTaskReqBody } from '@services/center-calendar.service'

import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { CalendarTask } from '@schemas/calendar-task'

// ngrx
import { Store, select } from '@ngrx/store'
import { concatLatestFrom } from '@ngrx/effects'
import * as ScheduleActions from '@centerStore/actions/sec.schedule.actions'
import * as ScheduleReducer from '@centerStore/reducers/sec.schedule.reducer'
import * as ScheduleSelector from '@centerStore/selectors/sec.schedule.selector'

import { scheduleIsResetSelector, drawerSelector } from '@appStore/selectors'
import { setScheduleDrawerIsReset, closeDrawer } from '@appStore/actions/drawer.action'
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
        private centerUsersService: CenterUsersService,
        private storageService: StorageService,
        private centerCalendarService: CenterCalendarService,
        private nxStore: Store
    ) {}

    ngOnInit(): void {
        this.titleTime = dayjs().format('M/D (dd) A hh시 mm분')
        this.selectGeneralEvent()

        this.selectInstructors()

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
        const selectedStaff = _.find(this.instructorList, (item) => {
            return this.StaffSelectValue.value.id == item.instructor.calendar_user.id
        })
        const reqBody: UpdateCalendarTaskReqBody = {
            // option: 'this',
            // trainer_id: selectedStaff.instructor.user_id,
            name: this.planTexts.planTitle,
            start_date: dayjs(this.datepick.date).format('YYYY-MM-DD'),
            // end_date: dayjs(this.datepick.date).format('YYYY-MM-DD'),
            start_time: this.timepick.startTime,
            end_time: this.timepick.endTime,
            memo: this.planTexts.planDetail,
        }
        // console.log('modify schedule reqbody: ', reqBody, this.generalEvent)
        this.centerCalendarService
            .updateCalendarTask(this.center.id, this.generalEvent.id, String(this.generalEvent.id), reqBody)
            .subscribe({
                next: (_) => {
                    fn ? fn() : null
                    this.nxStore.dispatch(ScheduleActions.setIsScheduleEventChanged({ isScheduleEventChanged: true }))
                    this.closeDrawer()
                    this.nxStore.dispatch(
                        showToast({ text: `${this.planTexts.planTitle} 기타 일정이 수정되었습니다.` })
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

    // ---------------------------------- select funcs -----------------------------------------------------

    selectInstructors() {
        this.nxStore
            .pipe(select(ScheduleSelector.instructorList), takeUntil(this.unsubscribe$))
            .subscribe((instructors) => {
                this.instructorList = instructors
            })
    }

    selectGeneralEvent() {
        this.nxStore
            .pipe(select(ScheduleSelector.modifyGeneralEvent), takeUntil(this.unsubscribe$))
            .subscribe((event) => {
                this.generalEvent = event
                this.planTexts = {
                    planTitle: event.name,
                    planDetail: event.memo,
                }
                // !! 날짜 확인하기
                this.timepick.startTime = dayjs(event.start).format('HH:mm:ss')
                this.timepick.endTime = dayjs(event.end).format('HH:mm:ss')
                this.datepick.date = dayjs(event.start).format('YYYY-MM-DD')
                this.setSelectedStaff(event.id)
            })
    }

    setSelectedStaff(calId: string) {
        this.center = this.storageService.getCenter()
        // this.centerCalendarService.getCalendarList(this.center.id).subscribe((calendarList) => {
        //     const calendar_user = _.find(calendarList, (calendar) => {
        //         return calendar.id == String(calId)
        //     })
        this.centerUsersService.getUserList(this.center.id, '', '').subscribe((users) => {
            const managers = _.filter(users, (user) => user.role_code != 'member')
            managers.forEach((v) => {
                this.staffSelect_list.push({
                    name: v.center_user_name ?? v.name,
                    value: v,
                })
                // calendar_user.user_id == v.id
                //     ? (this.StaffSelectValue = { name:  v.center_user_name ?? v.name, value: v })
                //     : null
            })
        })
        // })
    }
}
