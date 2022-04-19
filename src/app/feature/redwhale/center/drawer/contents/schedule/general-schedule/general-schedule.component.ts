import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import dayjs from 'dayjs'
import _ from 'lodash'

import { StorageService } from '@services/storage.service'
import { CenterUsersService } from '@services/center-users.service'
import { CenterCalendarService, CreateCalendarTaskReqBody } from '@services/center-calendar.service'

import { User } from '@schemas/user'
import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { Calendar } from '@schemas/calendar'

// rxjs
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

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
    selector: 'general-schedule',
    templateUrl: './general-schedule.component.html',
    styleUrls: ['./general-schedule.component.scss'],
})
export class GeneralScheduleComponent implements OnInit, AfterViewInit, OnDestroy {
    public center: Center
    public user: User

    public centerOperatingTime: ScheduleReducer.CenterOperatingHour = { start: null, end: null }

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

    // public stateDate: SelectedDate = undefined
    public timepick: { startTime: string; endTime: string } = { startTime: '', endTime: '' }

    // --------------------------------------------------------------------------------
    public cancelModalText = {
        text: '일정 등록을 취소하시겠어요?',
        subText: `일정 등록을 취소하실 경우,
                입력하신 정보가 모두 삭제됩니다.`,
        cancelButtonText: '뒤로',
        confirmButtonText: '등록 취소',
    }
    public doShowCancelModal = false
    showCancelModal() {
        this.doShowCancelModal = true
    }
    hideCancelModal() {
        this.doShowCancelModal = false
    }
    onCancelModalConfirm() {
        this.closeDrawer()
    }
    // --------------------------------------------------------------------------------
    public doShowConfirmSaveModal = false
    public confirmModalText = {
        text: '',
        subText: `기타 일정은 운영자 및 직원에게만 보여지며,
                    회원에게는 보여지지 않아요.`,
        cancelButtonText: '취소',
        confirmButtonText: '저장',
    }
    showConfirmSaveModal() {
        const title =
            this.planTexts.planTitle.length > 8
                ? this.planTexts.planTitle.slice(0, 8) + '...'
                : this.planTexts.planTitle
        this.confirmModalText.text = `'${title}' 일정을 저장하시겠어요?`
        this.doShowConfirmSaveModal = true
    }
    hideConfirmSaveModal() {
        this.doShowConfirmSaveModal = false
    }
    onConfirmSave() {
        this.registerPlan(() => {
            this.doShowConfirmSaveModal = false
        })
    }
    // --------------------------------------------------------------------------------

    public unsubscribe$ = new Subject<void>()

    constructor(
        private centerUsersService: CenterUsersService,
        private storageService: StorageService,
        private nxStore: Store,
        private centerCalendarService: CenterCalendarService
    ) {}

    ngOnInit(): void {
        this.nxStore
            .pipe(
                select(scheduleIsResetSelector),
                concatLatestFrom(() => [
                    this.nxStore.select(drawerSelector),
                    this.nxStore.select(ScheduleSelector.instructorList),
                    this.nxStore.select(ScheduleSelector.schedulingInstructor),
                ]),
                takeUntil(this.unsubscribe$)
            )
            .subscribe(([schDrawerIsReset, drawer, instructorList, schedulingInstructor]) => {
                if (schDrawerIsReset == true && drawer['tabName'] == 'general-schedule') {
                    this.titleTime = dayjs().format('M/D (dd) A hh시 mm분')
                    this.initTimePickAndDatePick()
                    this.initStaffList(schedulingInstructor)
                    this.instructorList = instructorList
                    this.nxStore.dispatch(setScheduleDrawerIsReset({ isReset: false }))
                }
            })

        this.nxStore.pipe(select(ScheduleSelector.operatingHour), takeUntil(this.unsubscribe$)).subscribe((opHour) => {
            this.centerOperatingTime = opHour
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

    registerPlan(fn?: () => void) {
        const selectedStaff = _.find(this.instructorList, (item) => {
            return this.StaffSelectValue.value.id == item.instructor.calendar_user.id
        })
        console.log('this.timepick.startTime : ', this.timepick.startTime, this.timepick.endTime)
        const reqBody: CreateCalendarTaskReqBody = {
            type_code: 'calendar_task_type_normal',
            name: this.planTexts.planTitle,
            start_date: dayjs(this.datepick.date).format('YYYY-MM-DD'),
            end_date: dayjs(this.datepick.date).format('YYYY-MM-DD'),
            all_day: false,
            start_time: this.timepick.startTime.slice(0, 5),
            end_time: this.timepick.endTime.slice(0, 5), // !!확인 필요
            memo: this.planTexts.planDetail,
            repeat: false,
            responsibility_user_id: selectedStaff.instructor.calendar_user.id,
        }
        this.centerCalendarService.createCalendarTask(this.center.id, selectedStaff.instructor.id, reqBody).subscribe({
            next: (_) => {
                fn ? fn() : null
                console.log('general register reqbody: ', reqBody)
                this.nxStore.dispatch(ScheduleActions.setIsScheduleEventChanged({ isScheduleEventChanged: true }))
                this.closeDrawer()
                this.nxStore.dispatch(showToast({ text: `${this.planTexts.planTitle} 기타 일정이 추가되었습니다.` }))
            },
            error: (err) => {
                console.log('gymCalendarService.createTask err: ', err)
            },
        })
    }

    closeDrawer() {
        this.nxStore.dispatch(closeDrawer())
    }

    initStaffList(schedulingInstructor: Calendar) {
        this.center = this.storageService.getCenter()
        this.user = this.storageService.getUser()
        this.staffSelect_list = []
        this.centerUsersService.getUserList(this.center.id, '', '').subscribe((users) => {
            const managers = _.filter(users, (user) => user.role_code != 'member')
            managers.forEach((v) => {
                this.staffSelect_list.push({
                    name: v.center_user_name ?? v.name,
                    value: v,
                })
            })

            managers.find((v) => {
                if (schedulingInstructor != undefined && schedulingInstructor.calendar_user.id == v.id) {
                    this.StaffSelectValue = { name: v.center_user_name ?? v.name, value: v }
                    this.nxStore.dispatch(ScheduleActions.setSchedulingInstructor({ schedulingInstructor: undefined }))
                    return true
                } else if (schedulingInstructor == undefined && this.user.id == v.id) {
                    this.StaffSelectValue = { name: v.center_user_name ?? v.name, value: v }
                    return true
                }
                return false
            })
        })
    }

    initTimePickAndDatePick() {
        this.nxStore.pipe(select(ScheduleSelector.selectedDate), takeUntil(this.unsubscribe$)).subscribe((date) => {
            this.timepick.startTime = dayjs(date.startDate).format('HH:mm:ss')
            this.timepick.endTime = dayjs(date.endDate).format('HH:mm:ss')
            this.datepick.date = dayjs(date.startDate).format('YYYY-MM-DD')
        })
    }
}
