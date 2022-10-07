import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'

import _ from 'lodash'
import dayjs from 'dayjs'
import isSameOrBefor from 'dayjs/plugin/isSameOrBefore'
import { StorageService } from '@services/storage.service'
import { CenterUsersService } from '@services/center-users.service'
import { CenterLessonService } from '@services/center-lesson.service'
import { CenterCalendarService, UpdateCalendarTaskReqBody, UpdateMode } from '@services/center-calendar.service'
import { ScheduleHelperService } from '@services/center/schedule-helper.service'
import { WordService } from '@services/helper/word.service'

import { User } from '@schemas/user'
import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { MembershipItem } from '@schemas/membership-item'
import { CalendarTask } from '@schemas/calendar-task'

// rxjs
import { Subject } from 'rxjs'
import { take, takeUntil } from 'rxjs/operators'

// ngrx
import { select, Store } from '@ngrx/store'
import { concatLatestFrom } from '@ngrx/effects'
import * as ScheduleReducer from '@centerStore/reducers/sec.schedule.reducer'
import * as ScheduleSelector from '@centerStore/selectors/sec.schedule.selector'
import * as CenterCommonSelector from '@centerStore/selectors/center.common.selector'
import * as ScheduleActions from '@centerStore/actions/sec.schedule.actions'
import { closeDrawer } from '@appStore/actions/drawer.action'
import { showToast } from '@appStore/actions/toast.action'

dayjs.extend(isSameOrBefor)

@Component({
    selector: 'modify-lesson-schedule',
    templateUrl: './modify-lesson-schedule.component.html',
    styleUrls: ['./modify-lesson-schedule.component.scss'],
})
export class ModifyLessonScheduleComponent implements OnInit, OnDestroy, AfterViewInit {
    public gymOperatingTime: ScheduleReducer.CenterOperatingHour = { start: null, end: null }

    public titleTime: string

    public lessonEvent: CalendarTask = undefined
    public lessonRepeatOption: UpdateMode
    selectLessonOptions() {
        this.nxStore
            .pipe(select(ScheduleSelector.modifyLessonOption), takeUntil(this.unsubscribe$))
            .subscribe((option) => {
                this.lessonRepeatOption = option
            })
    }

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
    public repeatOfWeek = [0, 1, 2, 3, 4, 5, 6]
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
        private nxStore: Store,
        private scheduleHelperService: ScheduleHelperService,
        private wordService: WordService
    ) {
        this.center = this.storageService.getCenter()
        this.selectLessonOptions()
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
            return this.StaffSelectValue.value.id == item.instructor.calendar_user.id
        })
        console.log(
            'dayRepeatSwitch: ',
            this.dayRepeatSwitch,
            'modifyLessonTask  -- this.lessonEvent : ',
            this.lessonEvent,
            'dayPick: ',
            this.dayPick,
            dayjs(this.dayPick.date).format('YYYY-MM-DD')
        )
        if (this.dayRepeatSwitch && this.lessonRepeatOption != 'one') {
            reqBody = {
                type_code: 'calendar_task_type_class',
                name: this.planDetailInputs.plan,
                start_date: dayjs(this.repeatDatepick.startDate).format('YYYY-MM-DD'),
                end_date: dayjs(this.repeatDatepick.startDate).format('YYYY-MM-DD'),
                start_time: this.timepick.slice(0, 5),
                end_time: this.scheduleHelperService.getLessonEndTime(this.timepick, this.lessonEvent.class.duration),
                color: this.lessonEvent.color,
                memo: this.planDetailInputs.detail,
                repeat: true,
                repeat_day_of_the_week: this.repeatOfWeek,
                repeat_cycle_unit_code: 'calendar_task_group_repeat_cycle_unit_week',
                repeat_cycle: 1,
                repeat_termination_type_code: 'calendar_task_group_repeat_termination_type_date',
                repeat_end_date: dayjs(this.repeatDatepick.endDate).format('YYYY-MM-DD'),
                responsibility_user_id: selectedStaff.instructor.calendar_user.id,
                class: {
                    name: this.lessonEvent.class.name,
                    category_name: this.lessonEvent.class.category_name,
                    class_item_id: this.lessonEvent.class.class_item_id,
                    type_code: this.lessonEvent.class.type_code,
                    state_code: 'calendar_task_class_state_active',
                    duration: String(this.lessonEvent.class.duration),
                    capacity: this.people,
                    start_booking_until: this.reserveSettingInputs.reservation_start,
                    end_booking_before: this.reserveSettingInputs.reservation_end,
                    cancel_booking_before: this.reserveSettingInputs.reservation_cancel_end,
                    instructor_user_ids: [selectedStaff.instructor.calendar_user.id],
                },
            }
        } else {
            reqBody = {
                type_code: 'calendar_task_type_class',
                name: this.planDetailInputs.plan,
                start_date: this.dayPick.date,
                end_date: this.dayPick.date,
                start_time: this.timepick.slice(0, 5),
                end_time: this.scheduleHelperService.getLessonEndTime(this.timepick, this.lessonEvent.class.duration),
                color: this.lessonEvent.color,
                memo: this.planDetailInputs.detail,
                responsibility_user_id: selectedStaff.instructor.calendar_user.id,
                class: {
                    name: this.lessonEvent.class.name,
                    category_name: this.lessonEvent.class.category_name,
                    class_item_id: this.lessonEvent.class.class_item_id,
                    type_code: this.lessonEvent.class.type_code,
                    state_code: 'calendar_task_class_state_active',
                    duration: String(this.lessonEvent.class.duration),
                    capacity: this.people,
                    start_booking_until: this.reserveSettingInputs.reservation_start,
                    end_booking_before: this.reserveSettingInputs.reservation_end,
                    cancel_booking_before: this.reserveSettingInputs.reservation_cancel_end,
                    instructor_user_ids: [selectedStaff.instructor.calendar_user.id],
                },
            }
        }

        const calId = this.instructorList.find((v) => v.instructor.calendar_user.id == this.StaffSelectValue.value.id)
            .instructor.id

        this.nxStore.dispatch(
            ScheduleActions.startUpdateCalendarTask({
                centerId: this.center.id,
                calendarId: calId,
                taskId: this.lessonEvent.id,
                reqBody: reqBody,
                mode: this.lessonRepeatOption,
                cb: () => {
                    fn ? fn() : null
                    this.nxStore.dispatch(ScheduleActions.setIsScheduleEventChanged({ isScheduleEventChanged: true }))
                    this.closeDrawer()
                    this.nxStore.dispatch(
                        showToast({
                            text: `'${this.wordService.ellipsis(
                                this.planDetailInputs.plan,
                                8
                            )}' 수업 일정이 수정되었습니다.`,
                        })
                    )
                },
            })
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
        console.log('this.initRepeatOfWeek : ', this.initRepeatOfWeek, this.repeatOfWeek)
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
        this.modifyModalText.text = `'${this.wordService.ellipsis(title, 7)}' 일정을 수정하시겠어요?`
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
        return true
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

    public reservationExistInOtherTasks = false
    selectTaskReservations() {
        // const curLessonEvent = this.gymScheduleState.modifyLessonEvent
        // const modifyOption = this.gymScheduleState.modifyLessonOption
        // this.gymScheduleState
        //     .selectLessonTaskReservState()
        //     .pipe(takeUntil(this.unsubscribe$))
        //     .subscribe((reservations) => {
        //         let reservationCount = 0
        //         switch (modifyOption) {
        //             case 'this':
        //                 this.reservationExistInOtherTasks = false
        //                 break
        //             case 'from_now_on':
        //                 reservationCount = _.reduce(
        //                     _.filter(reservations, (reservation) =>
        //                         dayjs(curLessonEvent.date).isSameOrBefore(reservation.date)
        //                     ),
        //                     (acc, val) => acc + val.reservation_count,
        //                     0
        //                 )
        //                 this.reservationExistInOtherTasks = reservationCount > 0 ? true : false
        //                 break
        //             case 'all':
        //                 reservationCount = _.reduce(reservations, (acc, val) => acc + val.reservation_count, 0)
        //                 this.reservationExistInOtherTasks = reservationCount > 0 ? true : false
        //                 break
        //         }
        //     })
    }

    public initRepeatOfWeek: number[] = []

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
        this.nxStore
            .pipe(
                select(ScheduleSelector.modifyLessonEvent),
                concatLatestFrom(() => [this.nxStore.select(ScheduleSelector.instructorList)]),
                takeUntil(this.unsubscribe$)
            )
            .subscribe(([lessonEvent, instructors]) => {
                this.instructorList = instructors
                this.isAlreadyRepeat = false
                this.lessonEvent = lessonEvent

                this.StaffSelectValue = {
                    name: lessonEvent.responsibility.center_user_name,
                    value: lessonEvent.responsibility,
                }
                this.initStaffList(instructors)

                this.planDetailInputs = {
                    plan: lessonEvent.name,
                    detail: lessonEvent.memo,
                }
                this.color = lessonEvent.color
                this.lesMembershipList = lessonEvent.class.membership_items

                this.people = String(lessonEvent.class.capacity)
                lessonEvent.start
                this.timepick = dayjs(lessonEvent.start).format('HH:mm:ss')
                this.dayPick.date = dayjs(lessonEvent.start).format('YYYY-MM-DD')

                this.repeatDatepick = { startDate: '', endDate: '' }
                this.repeatOfWeek = lessonEvent.repeat_day_of_the_week ?? []

                if (lessonEvent.calendar_task_group_id) {
                    this.dayRepeatSwitch = true
                    this.isAlreadyRepeat = true

                    // !! repeat start 속성 필요
                    this.repeatDatepick.startDate =
                        this.lessonRepeatOption == 'all'
                            ? dayjs(lessonEvent.start).format('YYYY-MM-DD')
                            : dayjs(lessonEvent.start).format('YYYY-MM-DD')
                    this.repeatDatepick.endDate = dayjs(lessonEvent.repeat_end_date).format('YYYY-MM-DD')
                    this.dayDiff = String(this.getDayDiff(this.repeatDatepick))
                } else {
                    this.repeatDatepick.startDate = dayjs(lessonEvent.start).format('YYYY-MM-DD')
                    this.dayRepeatSwitch = false
                }
                this.setInitDateVars()
            })
    }

    // helper function
    arraysMatch(arr1: any[], arr2: any[]) {
        if (arr1.length !== arr2.length) return false
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false
        }
        return true
    }
}
