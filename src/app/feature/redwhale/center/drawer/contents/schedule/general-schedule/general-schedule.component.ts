import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import dayjs from 'dayjs'
import _ from 'lodash'

import { StorageService } from '@services/storage.service'
import { CenterCalendarService, CreateCalendarTaskReqBody } from '@services/center-calendar.service'

import { User } from '@schemas/user'
import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { Calendar } from '@schemas/calendar'

// rxjs
import { Subject } from 'rxjs'
import { take, takeUntil } from 'rxjs/operators'

// ngrx
import { select, Store } from '@ngrx/store'
import { concatLatestFrom } from '@ngrx/effects'
import * as ScheduleActions from '@centerStore/actions/sec.schedule.actions'
import * as ScheduleReducer from '@centerStore/reducers/sec.schedule.reducer'
import * as ScheduleSelector from '@centerStore/selectors/sec.schedule.selector'

import { drawerSelector, scheduleIsResetSelector } from '@appStore/selectors'
import { closeDrawer, setScheduleDrawerIsReset } from '@appStore/actions/drawer.action'
import { showToast } from '@appStore/actions/toast.action'
import * as CenterCommonSelector from '@centerStore/selectors/center.common.selector'
import { MultiSelect } from '@schemas/components/multi-select'

@Component({
    selector: 'general-schedule',
    templateUrl: './general-schedule.component.html',
    styleUrls: ['./general-schedule.component.scss'],
})
export class GeneralScheduleComponent implements OnInit, AfterViewInit, OnDestroy {
    public center: Center
    public user: User
    public curCenterCalendar: Calendar = undefined

    public centerOperatingTime: ScheduleReducer.CenterOperatingHour = { start: null, end: null }

    public titleTime$ = this.nxStore.select(ScheduleSelector.taskTitleTime)

    // - // assignee var
    public multiStaffSelect_list: MultiSelect = []
    public multiStaffSelectValue: MultiSelect = []
    public instructorList: Array<ScheduleReducer.InstructorType> = []

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

    // repeat day vars
    public dayRepeatSwitch = false

    @ViewChild('rw_datepicker') rw_datepicker: ElementRef
    public doShowRepeatDatePick = false
    public repeatDatepick = {
        startDate: '',
        endDate: '',
    }
    public dayDiff = ''
    toggleShowRepeatDatePicker() {
        this.doShowRepeatDatePick = !this.doShowRepeatDatePick
    }
    closeShowRepeatDatePicker() {
        this.doShowRepeatDatePick = false
    }
    checkClickRepeatDatePickOutside(event) {
        _.some(event.path, this.rw_datepicker.nativeElement) ? null : this.closeShowRepeatDatePicker()
    }
    onRepeatDatePickRangeChange() {
        if (this.repeatDatepick.endDate) {
            this.dayDiff = String(this.getDayDiff(this.repeatDatepick))
        }
    }
    getDayDiff(date: { startDate: string; endDate: string }) {
        const date1 = dayjs(date.startDate)
        const date2 = dayjs(date.endDate)

        return date2.diff(date1, 'day') + 1
    }

    // day repeat var
    public repeatOfWeek = [0, 1, 2, 3, 4, 5, 6]
    onDayRepeatChange(dayList: number[]) {
        this.repeatOfWeek = dayList
    }

    // --------------------------------------------------------------------------------

    public unsubscribe$ = new Subject<void>()

    constructor(
        private storageService: StorageService,
        private nxStore: Store,
        private centerCalendarService: CenterCalendarService
    ) {}

    ngOnInit(): void {
        this.nxStore.pipe(select(ScheduleSelector.curCenterCalendar), takeUntil(this.unsubscribe$)).subscribe((ccc) => {
            this.curCenterCalendar = ccc
        })
        this.nxStore
            .pipe(
                select(scheduleIsResetSelector),
                concatLatestFrom(() => [
                    this.nxStore.select(drawerSelector),
                    this.nxStore.select(ScheduleSelector.instructorList),
                    this.nxStore.select(ScheduleSelector.schedulingInstructors),
                ]),
                takeUntil(this.unsubscribe$)
            )
            .subscribe(([schDrawerIsReset, drawer, instructorList, schedulingInstructors]) => {
                if (schDrawerIsReset == true && drawer['tabName'] == 'general-schedule') {
                    this.initTimePickAndDatePick()
                    this.instructorList = instructorList
                    this.initStaffList(instructorList, schedulingInstructors)
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
        let reqBody: CreateCalendarTaskReqBody = undefined
        const selectedStaffs = _.filter(this.multiStaffSelectValue, (item) => item.checked)
        if (this.dayRepeatSwitch) {
            reqBody = {
                type_code: 'calendar_task_type_normal',
                name: this.planTexts.planTitle,
                start_date: dayjs(this.repeatDatepick.startDate).format('YYYY-MM-DD'),
                end_date: dayjs(this.repeatDatepick.startDate).format('YYYY-MM-DD'),
                all_day: false,
                start_time: this.timepick.startTime.slice(0, 5),
                end_time: this.timepick.endTime.slice(0, 5),
                memo: this.planTexts.planDetail,
                repeat: true,
                responsibility_center_user_ids: selectedStaffs.map((v) => v.value.id),
                repeat_day_of_the_week: this.repeatOfWeek,
                repeat_cycle_unit_code: 'calendar_task_group_repeat_cycle_unit_week',
                repeat_cycle: 1,
                repeat_termination_type_code: 'calendar_task_group_repeat_termination_type_date',
                repeat_end_date: dayjs(this.repeatDatepick.endDate).format('YYYY-MM-DD'),
            }
        } else {
            reqBody = {
                type_code: 'calendar_task_type_normal',
                name: this.planTexts.planTitle,
                start_date: dayjs(this.datepick.date).format('YYYY-MM-DD'),
                end_date: dayjs(this.datepick.date).format('YYYY-MM-DD'),
                all_day: false,
                start_time: this.timepick.startTime.slice(0, 5),
                end_time: this.timepick.endTime.slice(0, 5),
                memo: this.planTexts.planDetail,
                repeat: false,
                responsibility_center_user_ids: selectedStaffs.map((v) => v.value.id),
            }
        }

        this.centerCalendarService.createCalendarTask(this.center.id, this.curCenterCalendar.id, reqBody).subscribe({
            next: (_) => {
                fn ? fn() : null
                this.nxStore.dispatch(ScheduleActions.setIsScheduleEventChanged({ isScheduleEventChanged: true }))
                this.closeDrawer()
                this.nxStore.dispatch(showToast({ text: `'${this.planTexts.planTitle}' 기타 일정이 추가되었습니다.` }))
            },
            error: (err) => {
                console.log('gymCalendarService.createTask err: ', err)
            },
        })
    }

    closeDrawer() {
        this.nxStore.dispatch(closeDrawer({ tabName: 'schedule-none' }))
    }

    initStaffList(instructorList: ScheduleReducer.InstructorType[], schedulingInstructors: CenterUser[]) {
        this.center = this.storageService.getCenter()
        this.user = this.storageService.getUser()
        this.multiStaffSelect_list = []

        this.multiStaffSelect_list = this.instructorList.map((v) => ({
            name: v.instructor.name,
            value: v.instructor,
            checked: false,
        }))

        if (!_.isEmpty(schedulingInstructors)) {
            this.multiStaffSelectValue = _.filter(
                schedulingInstructors,
                (cu) => _.findIndex(this.multiStaffSelect_list, (msi) => msi.value.id == cu.id) != -1
            ).map((v) => ({
                name: v.name,
                value: v,
                checked: true,
            }))
            this.nxStore.dispatch(ScheduleActions.setSchedulingInstructors({ schedulingInstructors: undefined }))
        } else {
            this.multiStaffSelectValue = _.filter(
                this.multiStaffSelect_list,
                (msi) => msi.value.id == this.user.id
            ).map((v) => ({
                name: v.value.name,
                value: v.value,
                checked: true,
            }))
        }
    }

    initTimePickAndDatePick() {
        this.nxStore.pipe(select(ScheduleSelector.selectedDate), takeUntil(this.unsubscribe$)).subscribe((date) => {
            this.timepick.startTime = dayjs(date.startDate).format('HH:mm:ss')
            this.timepick.endTime = dayjs(date.endDate).format('HH:mm:ss')
            this.repeatDatepick.startDate = dayjs(date.startDate).format('YYYY-MM-DD')
            this.datepick.date = dayjs(date.startDate).format('YYYY-MM-DD')
        })
    }
}
