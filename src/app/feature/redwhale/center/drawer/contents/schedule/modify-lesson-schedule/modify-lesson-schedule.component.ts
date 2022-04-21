import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core'

import _ from 'lodash'
import dayjs from 'dayjs'
import isSameOrBefor from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrBefor)

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'
import { CenterUsersService } from '@services/center-users.service'
import { CenterLessonService } from '@services/center-lesson.service'
import { CenterCalendarService, UpdateCalendarTaskReqBody, UpdateMode } from '@services/center-calendar.service'

import { User } from '@schemas/user'
import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { ClassCategory } from '@schemas/class-category'
import { ClassItem } from '@schemas/class-item'
import { MembershipItem } from '@schemas/membership-item'
import { Calendar } from '@schemas/calendar'
import { CalendarTask } from '@schemas/calendar-task'

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
    selector: 'modify-lesson-schedule',
    templateUrl: './modify-lesson-schedule.component.html',
    styleUrls: ['./modify-lesson-schedule.component.scss'],
})
export class ModifyLessonScheduleComponent implements OnInit, OnDestroy, AfterViewInit {
    public gymOperatingTime: ScheduleReducer.CenterOperatingHour = { start: null, end: null }

    public titleTime: string

    public lessonEvent: Task = undefined
    public lessonRepeatOption: UpdateMode

    // save confirm modal var
    public doShowConfirmSaveModal = false
    onClickSave() {
        this.doShowConfirmSaveModal = true
    }
    onConfirmSaveConfirm() {
        this.doShowConfirmSaveModal = false
    }
    onConfirmSaveCancel() {
        this.doShowConfirmSaveModal = false
    }

    // - // vars for lesson membership list
    public lesMembershipList: Array<MembershipItem> = []
    public doShowMembershipModal = false
    hideMembershipModal() {
        this.doShowMembershipModal = false
    }
    showMembershipModal() {
        this.doShowMembershipModal = true
    }

    // repeat day vars
    public dayRepeatSwitch = false

    // datepicker vars

    @ViewChild('datepicker') datepicker: ElementRef
    public doShowDayPick = false
    public dayPick = { date: '' }

    @ViewChild('rw_datepicker') rw_datepicker: ElementRef
    public doShowRepeatDatePick = false
    public repeatDatepick = {
        startDate: '',
        endDate: '',
    }
    public dayDiff = ''

    // timepick var
    public timepick = ''

    // day repeat var
    public repeatOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    onDayRepeatChange(dayList) {
        this.repeatOfWeek = dayList
    }

    // reservation vars
    reservDropdownOpen = false
    reserveSettingInputs = {
        reservation_start: '7',
        reservation_end: '24',
        reservation_cancel_end: '12',
    }

    // lesson schedule var
    public planDetailInputs = {
        plan: '',
        detail: '',
    }
    public people = ''
    public color = ''
    onColorClick(color) {
        this.color = color
    }
    // - // assignee var
    public staffSelect_list: Array<{ name: string; value: CenterUser }> = []
    public StaffSelectValue: { name: string; value: CenterUser } = { name: 'test', value: undefined }

    public instructorList: Array<ScheduleReducer.InstructorType> = []

    public center: Center
    public user: User

    public unsubscribe$ = new Subject<void>()

    constructor(
        private storageService: StorageService,
        private centerLessonService: CenterLessonService,
        private centerUsersService: CenterUsersService,
        private centerCalendarService: CenterCalendarService,
        private nxStore: Store
    ) {
        this.center = this.storageService.getCenter()
        this.selectLessonOptions()
        this.selectInstructors()
        this.selectLessonEvent()
        this.selectTaskReservations()
    }

    ngOnInit(): void {
        this.titleTime = dayjs().format('M/D (dd) A hh시 mm분')

        this.nxStore
            .pipe(select(ScheduleSelector.operatingHour), takeUntil(this.unsubscribe$))
            .subscribe((operatingTime) => {
                this.gymOperatingTime = operatingTime
            })
    }
    ngOnDestroy(): void {
        this.unsubscribe$.next()
        this.unsubscribe$.complete()
    }
    ngAfterViewInit(): void {}

    closeDrawer() {
        this.nxStore.dispatch(closeDrawer())
    }

    onTimeClick(time: { key: string; name: string }) {
        this.timepick = time.key
    }

    // ------------------------------------------ 직원 셀렉트 데이터 초기화 -------------------------------------------

    // ------------------------------------------register lesson task------------------------------------------------
    modifyLessonTask(fn?: () => void) {
        let reqBody: UpdateCalendarTaskReqBody = undefined
        const selectedStaff = _.find(this.instructorList, (item) => {
            return this.StaffSelectValue.value.id == item.instructor.user_id
        })
        if (this.dayRepeatSwitch) {
            reqBody = {
                option: this.lessonRepeatOption,
                trainer_id: selectedStaff.instructor.user_id,
                lesson_item_id: Number(this.lessonEvent.lesson.lesson_item_id),
                name: this.planDetailInputs.plan,
                color: this.lessonEvent.lesson.color,
                date: dayjs(this.dayPick.date).format('YYYY-MM-DD'),
                start_time: this.timepick,
                repetition_start_date: dayjs(this.repeatDatepick.startDate).format('YYYY-MM-DD'),
                repetition_end_date: dayjs(this.repeatDatepick.endDate).format('YYYY-MM-DD'),
                people: Number(this.people),
                memo: this.planDetailInputs.detail,
                repetition_days: this.repeatOfWeek,
                reservation_start_day: Number(this.reserveSettingInputs.reservation_start),
                reservation_end_hour: Number(this.reserveSettingInputs.reservation_end),
                reservation_cancel_end_hour: Number(this.reserveSettingInputs.reservation_cancel_end),
            }
            if (this.lessonRepeatOption == 'this' && this.isAlreadyRepeat == true) {
                // 반복 수업의 이번 일정만 수정할 때
                reqBody = { ...reqBody, ...{ new_repetition_yn: 0 } }
            } else if (this.isAlreadyRepeat == false) {
                // 반복 수업이 아닌 일정이 반복 수업 설정을 할 때
                _.omit(reqBody, ['option'])
                reqBody = { ...reqBody, ...{ new_repetition_yn: 1 } }
            }
        } else {
            reqBody = {
                new_repetition_yn: 0,
                trainer_id: selectedStaff.instructor.user_id,
                lesson_item_id: Number(this.lessonEvent.lesson.lesson_item_id),
                name: this.planDetailInputs.plan,
                color: this.lessonEvent.lesson.color,
                date: dayjs(this.dayPick.date).format('YYYY-MM-DD'),
                start_time: this.timepick,
                people: Number(this.people),
                memo: this.planDetailInputs.detail,
                reservation_start_day: Number(this.reserveSettingInputs.reservation_start),
                reservation_end_hour: Number(this.reserveSettingInputs.reservation_end),
                reservation_cancel_end_hour: Number(this.reserveSettingInputs.reservation_cancel_end),
            }

            console.log('none dayRepeatSwitch req body: ', reqBody)
        }

        this.gymCalendarService
            .updateTask(this.center.id, String(this.lessonEvent.id), reqBody as UpdateCalendarTaskReqBody)
            .subscribe(
                (res) => {
                    fn ? fn() : null
                    this.gymScheduleState.setIsScheduleEventChangedState(true)
                    this.closeDrawer()
                    this.globalService.showToast(
                        `'${this.restrictText(this.planDetailInputs.plan, 8)}' 기타 일정이 수정되었습니다.`
                    )
                },
                (err) => {
                    console.log('gymCalendarService.createTask err: ', err)
                }
            )
    }

    // -----------------------------  일정 생성 수정 모달 ------------------------------------

    onSaveButtonClick() {
        const isLessonReserved = false
        // this.lessonEvent.lesson.reservation.length > 0 || this.reservationExistInOtherTasks ? true : false

        const isTimePickConsistent = this.initTimepick == this.timepick
        const isRepeatDateConsistent =
            this.dayRepeatSwitch &&
            this.initRepeatDatepick.startDate == this.repeatDatepick.startDate &&
            this.initRepeatDatepick.endDate == this.repeatDatepick.endDate
        const isRepeatDaysConsistent = this.arraysMatch(this.initRepeatOfWeek, this.repeatOfWeek)
        const isDayPickConsistent = this.initDayPick.date == this.dayPick.date
        const isNonRepeatDayPickConsistent = !this.dayRepeatSwitch && isDayPickConsistent

        if (
            !isLessonReserved ||
            (isLessonReserved &&
                isTimePickConsistent &&
                ((isRepeatDateConsistent && isRepeatDaysConsistent && isDayPickConsistent) ||
                    isNonRepeatDayPickConsistent))
        ) {
            this.showModifyModal(this.planDetailInputs.plan)
        } else {
            this.showReservedModifyModel()
        }
    }

    public modifyModalText = {
        text: '',
        subText: `이미 예약한 회원이 있는 경우,
        회원에게 일정 수정 알림이 발송됩니다.`,
        cancelButtonText: '취소',
        confirmButtonText: '일정 수정',
    }
    public doShowModifyModal = false
    showModifyModal(title: string) {
        this.modifyModalText.text = `'${this.restrictText(title, 7)}' 일정을 수정하시겠어요?`
        this.doShowModifyModal = true
    }
    hideModifyModal() {
        this.doShowModifyModal = false
    }
    onModifyModalConfirm() {
        this.modifyLessonTask()
    }

    public doShowReservedModifyModal = false
    showReservedModifyModel() {
        this.modifyModalText.text = '앗! 해당 일정에 예약된 회원이 있어요.😮'
        this.doShowReservedModifyModal = true
    }
    hideReservedModifyModel() {
        this.doShowReservedModifyModal = false
    }
    onReservedModifyModelConfirm() {
        this.modifyLessonTask()
    }

    restrictText(title: string, len: number): string {
        return title.length > len ? title.slice(0, len) + '...' : title
    }

    // ------------------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------------------------

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

    checkClickDayPickOutside(event) {
        _.some(event.path, this.datepicker.nativeElement) ? null : (this.doShowDayPick = !this.doShowDayPick)
    }

    // onKeypress and keyup --------------------------------------------------------------------------------
    restrictToNumber(event) {
        const code = event.which ? event.which : event.keyCode
        if (code < 48 || code > 57) {
            return false
        }
    }
    onPeopleKeyUp(event) {
        if (event.code == 'Enter') return
        this.people = this.people.replace(/[^0-9]/gi, '')
    }
    onInputKeyup(event, type: 'reservation_start' | 'reservation_end' | 'reservation_cancel_end') {
        if (event.code == 'Enter') return
        this.reserveSettingInputs[type] = this.reserveSettingInputs[type].replace(/[^0-9]/gi, '')
    }

    // ----- select functions ----------------------------------------------------------------------------
    selectInstructors() {
        this.gymScheduleState
            .selectInstructorsState()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((instructors) => {
                this.instructorList = instructors
                console.log('this.instructorList: ', this.instructorList)
            })
    }

    setSelectedStaff(calId: number) {
        this.center = this.storageService.getCenter()
        this.gymCalendarService.getCalendarList(this.center.id).subscribe((calendarList) => {
            const calendar_user = _.find(calendarList, (calendar) => {
                return calendar.id == String(calId)
            })
            this.gymUserService
                .getUserList(this.center.id, '', 'administrator, manager, staff')
                .subscribe((managers) => {
                    managers.forEach((v) => {
                        this.staffSelect_list.push({
                            name: v.gym_user_name ?? v.given_name,
                            value: v,
                        })
                        calendar_user.user_id == v.id
                            ? (this.StaffSelectValue = { name: v.gym_user_name ?? v.given_name, value: v })
                            : null
                    })
                })
        })
    }

    public reservationExistInOtherTasks = false
    selectTaskReservations() {
        const curLessonEvent = this.gymScheduleState.modifyLessonEvent
        const modifyOption = this.gymScheduleState.modifyLessonOption
        this.gymScheduleState
            .selectLessonTaskReservState()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((reservations) => {
                let reservationCount = 0
                switch (modifyOption) {
                    case 'this':
                        this.reservationExistInOtherTasks = false
                        break
                    case 'from_now_on':
                        reservationCount = _.reduce(
                            _.filter(reservations, (reservation) =>
                                dayjs(curLessonEvent.date).isSameOrBefore(reservation.date)
                            ),
                            (acc, val) => acc + val.reservation_count,
                            0
                        )
                        this.reservationExistInOtherTasks = reservationCount > 0 ? true : false
                        break
                    case 'all':
                        reservationCount = _.reduce(reservations, (acc, val) => acc + val.reservation_count, 0)
                        this.reservationExistInOtherTasks = reservationCount > 0 ? true : false
                        break
                }
            })
    }

    selectLessonOptions() {
        this.gymScheduleState
            .selectModifyLessonOptionState()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((option) => {
                this.lessonRepeatOption = option
                console.log('selectModifyLessonOptionState: ', this.lessonRepeatOption)
            })
    }

    public initRepeatOfWeek = []

    public initTimepick = ''
    public initDayPick = { date: '' }
    public initRepeatDatepick = { startDate: '', endDate: '' }
    setInitDateVars() {
        this.initTimepick = ''
        this.initDayPick = { date: '' }
        this.initRepeatDatepick = { startDate: '', endDate: '' }
        this.initRepeatOfWeek = []

        this.initTimepick = this.timepick
        this.initDayPick = this.dayPick
        this.initRepeatDatepick = this.repeatDatepick
        this.initRepeatOfWeek = this.repeatOfWeek
    }

    public isAlreadyRepeat = false
    selectLessonEvent() {
        this.gymScheduleState
            .selectModifyLessonEventState()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((lessonEvent) => {
                console.log('selectModifyLessonEventState: ', lessonEvent)
                this.isAlreadyRepeat = false

                this.lessonEvent = lessonEvent
                this.setSelectedStaff(lessonEvent.calendar_id)

                this.planDetailInputs = {
                    plan: lessonEvent.name,
                    detail: lessonEvent.memo,
                }
                this.color = lessonEvent.color
                this.lesMembershipList = lessonEvent.membership_item

                this.people = String(lessonEvent.lesson.people)
                this.timepick = dayjs(lessonEvent.date + ' ' + lessonEvent.start_time).format('HH:mm:ss')
                this.dayPick.date = dayjs(lessonEvent.date).format('YYYY-MM-DD')

                this.repeatDatepick = { startDate: '', endDate: '' }
                this.setRepeatDayOfWeek(lessonEvent.repetition_code)
                if (lessonEvent.repetition_id) {
                    this.dayRepeatSwitch = true
                    this.isAlreadyRepeat = true

                    this.repeatDatepick.startDate =
                        this.lessonRepeatOption == 'all'
                            ? dayjs(lessonEvent.repetition_start_date).format('YYYY-MM-DD')
                            : dayjs(lessonEvent.date).format('YYYY-MM-DD')
                    this.repeatDatepick.endDate = dayjs(lessonEvent.repetition_end_date).format('YYYY-MM-DD')
                    this.dayDiff = String(this.getDayDiff(this.repeatDatepick))
                } else {
                    this.repeatDatepick.startDate = dayjs(lessonEvent.date).format('YYYY-MM-DD')
                    this.dayRepeatSwitch = false
                }
                this.setInitDateVars()
            })
    }

    setRepeatDayOfWeek(repeatCode: string) {
        if (!repeatCode) return
        if (repeatCode == 'all') {
            this.repeatOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
        } else if (repeatCode == 'weekdays') {
            this.repeatOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri']
        } else if (repeatCode == 'weekend') {
            this.repeatOfWeek = ['sun', 'sat']
        } else {
            this.repeatOfWeek = _.split(repeatCode, '_')
        }
        console.log('setRepeatDayOfWeek: ', this.repeatOfWeek)
    }

    // helper function
    arraysMatch(arr1, arr2) {
        if (arr1.length !== arr2.length) return false
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false
        }
        return true
    }
}
