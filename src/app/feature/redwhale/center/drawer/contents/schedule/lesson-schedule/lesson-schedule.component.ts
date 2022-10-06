import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import _ from 'lodash'
import dayjs from 'dayjs'
import isSameOrBefor from 'dayjs/plugin/isSameOrBefore'
import { StorageService } from '@services/storage.service'
import { CenterUsersService } from '@services/center-users.service'
import { CenterLessonService } from '@services/center-lesson.service'
import { CenterCalendarService, CreateCalendarTaskReqBody } from '@services/center-calendar.service'
import { ScheduleHelperService } from '@services/center/schedule-helper.service'
import { WordService } from '@services/helper/word.service'

import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { ClassCategory } from '@schemas/class-category'
import { ClassItem } from '@schemas/class-item'
import { MembershipItem } from '@schemas/membership-item'
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
import * as CenterCommonSelector from '@centerStore/selectors/center.common.selector'

import { drawerSelector, scheduleIsResetSelector } from '@appStore/selectors'
import { closeDrawer, setScheduleDrawerIsReset } from '@appStore/actions/drawer.action'
import { showToast } from '@appStore/actions/toast.action'

dayjs.extend(isSameOrBefor)

@Component({
    selector: 'lesson-schedule',
    templateUrl: './lesson-schedule.component.html',
    styleUrls: ['./lesson-schedule.component.scss'],
})
export class LessonScheduleComponent implements OnInit, OnDestroy, AfterViewInit {
    public centerOperatingTime: ScheduleReducer.CenterOperatingHour = { start: null, end: null }

    public titleTime$ = this.nxStore.select(ScheduleSelector.taskTitleTime)

    // lesson var
    public lessonCategList: Array<ClassCategory>
    public isLessonCategInit = false
    public selectedLesson: { lesson: ClassItem; lessonCateg: ClassCategory } = undefined

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
    onDayRepeatChange(dayList: number[]) {
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
    public StaffSelectValue: { name: string; value: CenterUser } = { name: undefined, value: undefined }

    public schInstructorList: Array<ScheduleReducer.InstructorType> = []
    public centerInstructorList: Array<CenterUser> = []

    public center: Center

    public unsubscribe$ = new Subject<void>()

    // ngrx vars
    public schedulingInstructor: Calendar

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
        this.selectLessonCategories()

        this.selectTimePickAndDatePick()
        this.selectInstructors()
    }

    ngOnInit(): void {
        this.nxStore
            .pipe(select(ScheduleSelector.schedulingInstructor), takeUntil(this.unsubscribe$))
            .subscribe((schInstructor) => {
                this.schedulingInstructor = schInstructor
            })
        this.nxStore
            .pipe(
                select(scheduleIsResetSelector),
                concatLatestFrom(() => [this.nxStore.select(drawerSelector)]),
                takeUntil(this.unsubscribe$)
            )
            .subscribe(([schDrawerIsReset, drawer]) => {
                if (schDrawerIsReset == true && drawer['tabName'] == 'lesson-schedule') {
                    this.selectedLesson = undefined
                    this.nxStore.dispatch(setScheduleDrawerIsReset({ isReset: false }))
                }
            })

        this.nxStore.pipe(select(ScheduleSelector.operatingHour), takeUntil(this.unsubscribe$)).subscribe((opHour) => {
            this.centerOperatingTime = opHour
        })

        this.nxStore
            .select(ScheduleSelector.instructorList)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((schInstructorList) => {
                this.schInstructorList = schInstructorList
                console.log('this.schInstructorList - ', this.schInstructorList)
                this.nxStore
                    .select(CenterCommonSelector.instructors)
                    .pipe(take(1))
                    .subscribe((instructors) => {
                        this.centerInstructorList = instructors
                        console.log('this.centerInstructorList - ', this.centerInstructorList)
                        this.initInstructorList()
                    })
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

    // init instructor list
    initInstructorList() {
        if (this.schInstructorList.length > 0 && this.centerInstructorList.length > 0) {
            this.staffSelect_list = this.centerInstructorList
                .filter((ci) => -1 != this.schInstructorList.findIndex((v) => ci.id == v.instructor.calendar_user.id))
                .map((value) => ({
                    name: value.center_user_name,
                    value: value,
                }))
        }
    }

    // ------------------------------------------register lesson task------------------------------------------------
    registerLessonTask(fn?: () => void) {
        let reqBody: CreateCalendarTaskReqBody = undefined
        const selectedStaff = _.find(this.schInstructorList, (item) => {
            return this.StaffSelectValue.value.id == item.instructor.calendar_user.id
        })
        // console.log('selectedStaff -- ', this.schInstructorList, this.StaffSelectValue)

        if (this.dayRepeatSwitch) {
            reqBody = {
                type_code: 'calendar_task_type_class',
                name: this.planDetailInputs.plan,
                start_date: dayjs(this.repeatDatepick.startDate).format('YYYY-MM-DD'),
                end_date: dayjs(this.repeatDatepick.startDate).format('YYYY-MM-DD'),
                all_day: false,
                start_time: this.timepick.slice(0, 5),
                end_time: this.scheduleHelperService.getLessonEndTime(
                    this.timepick,
                    this.selectedLesson.lesson.duration
                ),
                color: this.color,
                memo: this.planDetailInputs.detail,
                repeat: true,
                repeat_day_of_the_week: this.repeatOfWeek,
                repeat_cycle_unit_code: 'calendar_task_group_repeat_cycle_unit_week',
                repeat_cycle: 1,
                repeat_termination_type_code: 'calendar_task_group_repeat_termination_type_date',
                repeat_end_date: dayjs(this.repeatDatepick.endDate).format('YYYY-MM-DD'),
                responsibility_user_id: selectedStaff.instructor.calendar_user.id,
                class: {
                    category_name: this.selectedLesson.lessonCateg.name,
                    name: this.selectedLesson.lesson.name,
                    class_item_id: this.selectedLesson.lesson.id,
                    type_code: this.selectedLesson.lesson.type_code,
                    state_code: 'calendar_task_class_state_active',
                    duration: String(this.selectedLesson.lesson.duration),
                    capacity: this.people,
                    start_booking_until: this.reserveSettingInputs.reservation_start,
                    end_booking_before: this.reserveSettingInputs.reservation_end,
                    cancel_booking_before: this.reserveSettingInputs.reservation_cancel_end,
                    instructor_user_ids: [selectedStaff.instructor.calendar_user.id],
                },
            }

            // console.log('dayRepeatSwitch req body: ', reqBody)
        } else {
            reqBody = {
                type_code: 'calendar_task_type_class',
                name: this.planDetailInputs.plan,
                start_date: dayjs(this.dayPick.date).format('YYYY-MM-DD'),
                end_date: dayjs(this.dayPick.date).format('YYYY-MM-DD'),
                all_day: false,
                start_time: this.timepick.slice(0, 5),
                end_time: this.scheduleHelperService.getLessonEndTime(
                    this.timepick,
                    this.selectedLesson.lesson.duration
                ),
                color: this.color,
                memo: this.planDetailInputs.detail,
                repeat: false,
                responsibility_user_id: selectedStaff.instructor.calendar_user.id,
                class: {
                    class_item_id: this.selectedLesson.lesson.id,
                    type_code: this.selectedLesson.lesson.type_code,
                    state_code: 'calendar_task_class_state_active',
                    category_name: this.selectedLesson.lessonCateg.name,
                    name: this.selectedLesson.lesson.name,
                    duration: String(this.selectedLesson.lesson.duration),
                    capacity: this.people,
                    start_booking_until: this.reserveSettingInputs.reservation_start,
                    end_booking_before: this.reserveSettingInputs.reservation_end,
                    cancel_booking_before: this.reserveSettingInputs.reservation_cancel_end,
                    instructor_user_ids: [selectedStaff.instructor.calendar_user.id],
                },
            }
        }
        // console.log('createCalendarTask req body: ', reqBody)
        this.centerCalendarService.createCalendarTask(this.center.id, selectedStaff.instructor.id, reqBody).subscribe({
            next: (res) => {
                fn ? fn() : null
                this.nxStore.dispatch(ScheduleActions.setIsScheduleEventChanged({ isScheduleEventChanged: true }))
                this.closeDrawer()
                this.nxStore.dispatch(
                    showToast({
                        text: `'${this.wordService.ellipsis(
                            this.planDetailInputs.plan,
                            8
                        )}' 수업 일정이 추가되었습니다.`,
                    })
                )
            },
            error: (err) => {
                console.log('gymCalendarService.createTask err: ', err)
            },
        })
    }

    // -----------------------------  일정 생성 취소 모달 ------------------------------------
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
        subText: `수업 일정은 저장과 동시에
        예약 가능한 회원에게 모두 공개됩니다.`,
        cancelButtonText: '취소',
        confirmButtonText: '저장',
    }
    showConfirmSaveModal() {
        const title =
            this.planDetailInputs.plan.length > 8
                ? this.planDetailInputs.plan.slice(0, 8) + '...'
                : this.planDetailInputs.plan
        this.confirmModalText.text = `'${title}' 일정을 저장하시겠어요?`
        this.doShowConfirmSaveModal = true
    }
    hideConfirmSaveModal() {
        this.doShowConfirmSaveModal = false
    }
    onConfirmSave() {
        this.registerLessonTask(() => {
            this.doShowConfirmSaveModal = false
        })
    }
    // ------------------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------------------------
    onLessonClick(res: { lesson: ClassItem; lessonCateg: ClassCategory }) {
        this.selectedLesson = { lesson: res.lesson, lessonCateg: res.lessonCateg }
        this.planDetailInputs = { plan: res.lesson.name, detail: res.lesson.memo }

        this.getLinkedMemberships(res.lesson, res.lessonCateg)
        this.people = String(res.lesson.capacity)
        this.color = res.lesson.color

        this.reserveSettingInputs.reservation_start = String(res.lesson.start_booking_until)
        this.reserveSettingInputs.reservation_end = String(res.lesson.end_booking_before)
        this.reserveSettingInputs.reservation_cancel_end = String(res.lesson.cancel_booking_before)

        _.find(this.staffSelect_list, (item) => {
            if (this.schedulingInstructor != undefined && item.value.id == this.schedulingInstructor.calendar_user.id) {
                // 캘린더 (일) 모드에서 일정 추가 시 해당 직원이 등록될 수업의 담당자가 됨
                this.StaffSelectValue = { name: item.value.center_user_name, value: item.value }
                this.nxStore.dispatch(ScheduleActions.setSchedulingInstructor({ schedulingInstructor: undefined }))
                return true
            } else if (this.schedulingInstructor != undefined && item.value.id == res.lesson.instructors[0].id) {
                this.StaffSelectValue = { name: item.value.center_user_name, value: item.value }
                return true
            }
            return false
        })
    }

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

    // ----- select instructors ----------------------------------------------------------------------------
    selectInstructors() {
        this.nxStore
            .pipe(select(ScheduleSelector.instructorList), takeUntil(this.unsubscribe$))
            .subscribe((instructors) => {
                this.schInstructorList = instructors
            })
    }

    selectTimePickAndDatePick() {
        this.nxStore.pipe(select(ScheduleSelector.selectedDate), takeUntil(this.unsubscribe$)).subscribe((date) => {
            this.timepick = dayjs(date.startDate).format('HH:mm:ss')

            this.repeatDatepick.startDate = dayjs(date.startDate).format('YYYY-MM-DD')
            this.dayPick.date = dayjs(date.startDate).format('YYYY-MM-DD')
        })
    }

    selectLessonCategories() {
        this.centerLessonService
            .getCategoryList(this.center.id)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((lessonCateg) => {
                const fillCateg = []
                const emtpyCateg = []
                _.forEach(lessonCateg, (categ) => {
                    categ.item_count > 0 ? fillCateg.push(categ) : emtpyCateg.push(categ)
                })
                this.lessonCategList = [...fillCateg, ...emtpyCateg]
                this.isLessonCategInit = true
            })
    }

    getLinkedMemberships(lesson: ClassItem, lessonCateg: ClassCategory) {
        this.centerLessonService
            .getLinkedMemberships(this.center.id, lessonCateg.id, lesson.id)
            .subscribe((memberships) => {
                this.lesMembershipList = memberships
            })
    }
}
