import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import dayjs from 'dayjs'
import _ from 'lodash'

import { StorageService } from '@services/storage.service'
import { CenterCalendarService, UpdateCalendarTaskReqBody, UpdateMode } from '@services/center-calendar.service'
import { WordService } from '@services/helper/word.service'

import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
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
import { MultiSelect } from '@schemas/components/multi-select'
import { Calendar } from '@schemas/calendar'
import { Loading } from '@schemas/store/loading'
import { CalendarTaskOverview } from '@schemas/calendar-task-overview'

@Component({
    selector: 'modify-general-schedule',
    templateUrl: './modify-general-schedule.component.html',
    styleUrls: ['./modify-general-schedule.component.scss'],
})
export class ModifyGeneralScheduleComponent implements OnInit, AfterViewInit, OnDestroy {
    public center: Center

    public generalEvent: CalendarTask
    public generalRepeatOption: UpdateMode
    selectGeneralOptions() {
        this.nxStore
            .pipe(select(ScheduleSelector.modifyGeneralOption), takeUntil(this.unsubscribe$))
            .subscribe((option) => {
                console.log('general repeat option ', option)
                this.generalRepeatOption = option
            })
    }
    public isAlreadyRepeat = false

    public gymOperatingTime: ScheduleReducer.CenterOperatingHour = { start: null, end: null }

    public titleTime: string

    public multiStaffSelect_list: MultiSelect = []
    public multiStaffSelectValue: MultiSelect = []

    public instructorList: Array<ScheduleReducer.InstructorType> = []

    public planTexts = {
        planTitle: '',
        planDetail: '',
    }

    // repeat day vars
    public dayRepeatSwitch = false

    public doShowDatepick = false
    public datepick: { date: string } = { date: '' }
    @ViewChild('datepicker') datepicker: ElementRef
    checkClickDatePickOutside(event) {
        _.some(event.path, this.datepicker.nativeElement) ? null : (this.doShowDatepick = !this.doShowDatepick)
    }

    @ViewChild('rw_datepicker') rw_datepicker: ElementRef
    public doShowRepeatDatePick = false
    public repeatDatepick = {
        startDate: '',
        endDate: '',
    }
    public dayDiff = ''

    // timepick var
    public timepick: { startTime: string; endTime: string } = { startTime: '', endTime: '' }

    // day repeat var
    public repeatOfWeek = [0, 1, 2, 3, 4, 5, 6]
    onDayRepeatChange(dayList) {
        this.repeatOfWeek = dayList
    }
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

    // --------------------------------------------------------------------------------
    cancelModifyGeneralSchedule() {
        this.closeDrawer()
    }
    // --------------------------------------------------------------------------------
    public curCenterCalendar: Calendar = undefined

    public unsubscribe$ = new Subject<void>()

    constructor(
        private storageService: StorageService,
        private centerCalendarService: CenterCalendarService,
        private wordService: WordService,
        private nxStore: Store
    ) {}

    ngOnInit(): void {
        this.center = this.storageService.getCenter()
        this.selectGeneralOptions()
        this.nxStore.pipe(select(ScheduleSelector.curCenterCalendar), takeUntil(this.unsubscribe$)).subscribe((ccc) => {
            this.curCenterCalendar = ccc
        })
        this.nxStore
            .pipe(
                select(ScheduleSelector.modifyGeneralEvent),
                concatLatestFrom(() => [this.nxStore.select(ScheduleSelector.instructorList)]),
                takeUntil(this.unsubscribe$)
            )
            .subscribe(([event, instructors]) => {
                this.instructorList = instructors
                this.isAlreadyRepeat = false
                this.generalEvent = event
                this.planTexts = {
                    planTitle: event.name,
                    planDetail: event.memo,
                }
                this.titleTime = dayjs(this.generalEvent.start).format('M/D (dd) A hh시 mm분')
                // !! 날짜 확인하기
                this.timepick.startTime = dayjs(event.start).format('HH:mm:ss')
                this.timepick.endTime = dayjs(event.end).format('HH:mm:ss')
                this.datepick.date = dayjs(event.start).format('YYYY-MM-DD')

                this.initStaffList(instructors, event)

                if (event.calendar_task_group_id) {
                    this.dayRepeatSwitch = true
                    this.isAlreadyRepeat = true

                    this.repeatDatepick.startDate =
                        this.generalRepeatOption == 'all'
                            ? dayjs(event.repeat_start_date).format('YYYY-MM-DD')
                            : dayjs(event.start).format('YYYY-MM-DD')
                    this.repeatDatepick.endDate = dayjs(event.repeat_end_date).format('YYYY-MM-DD')
                    this.dayDiff = String(this.getDayDiff(this.repeatDatepick))
                } else {
                    this.repeatDatepick.startDate = dayjs(event.start).format('YYYY-MM-DD')
                    this.dayRepeatSwitch = false
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
        let reqBody: UpdateCalendarTaskReqBody = undefined
        const selectedStaffs = _.filter(this.multiStaffSelectValue, (item) => item.checked)

        if (this.dayRepeatSwitch && this.generalRepeatOption != 'one') {
            reqBody = {
                responsibility_center_user_ids: selectedStaffs.map((v) => v.value.id),
                name: this.planTexts.planTitle,
                start_date: dayjs(this.repeatDatepick.startDate).format('YYYY-MM-DD'),
                end_date: dayjs(this.repeatDatepick.startDate).format('YYYY-MM-DD'),
                start_time: this.timepick.startTime.slice(0, 5),
                end_time: this.timepick.endTime.slice(0, 5),
                memo: this.planTexts.planDetail,
                repeat: true,
                repeat_day_of_the_week: this.repeatOfWeek,
                repeat_cycle_unit_code: 'calendar_task_group_repeat_cycle_unit_week',
                repeat_cycle: 1,
                repeat_termination_type_code: 'calendar_task_group_repeat_termination_type_date',
                repeat_end_date: dayjs(this.repeatDatepick.endDate).format('YYYY-MM-DD'),
            }
        } else {
            reqBody = {
                responsibility_center_user_ids: selectedStaffs.map((v) => v.value.id),
                name: this.planTexts.planTitle,
                start_date: dayjs(this.datepick.date).format('YYYY-MM-DD'),
                end_date: dayjs(this.datepick.date).format('YYYY-MM-DD'),
                start_time: this.timepick.startTime.slice(0, 5),
                end_time: this.timepick.endTime.slice(0, 5),
                memo: this.planTexts.planDetail,
            }
        }

        this.nxStore.dispatch(
            ScheduleActions.startUpdateCalendarTask({
                centerId: this.center.id,
                calendarId: this.curCenterCalendar.id,
                taskId: this.generalEvent.id,
                reqBody: reqBody,
                mode: this.generalRepeatOption,
                cb: () => {
                    fn ? fn() : null
                    this.nxStore.dispatch(ScheduleActions.setIsScheduleEventChanged({ isScheduleEventChanged: true }))
                    this.closeDrawer()
                    this.nxStore.dispatch(
                        showToast({
                            text: `'${this.wordService.ellipsis(
                                this.planTexts.planTitle,
                                8
                            )}' 기타 일정이 수정 되었습니다.`,
                        })
                    )
                },
            })
        )
    }

    closeDrawer() {
        this.nxStore.dispatch(closeDrawer({ tabName: 'schedule-none' }))
    }

    initStaffList(instructorList: ScheduleReducer.InstructorType[], event: CalendarTask) {
        const instList = _.filter(
            instructorList,
            (v) => _.findIndex(event.responsibility, (vi) => vi.id == v.instructor.id) == -1
        ).map((v) => ({
            name: v.instructor.name,
            value: v.instructor,
            checked: false,
        }))
        this.multiStaffSelect_list = _.cloneDeep(
            _.orderBy(
                [
                    ...event.responsibility.map((v) => ({
                        name: v.name,
                        value: v,
                        checked: true,
                    })),
                    ...instList,
                ],
                (v) => v.name
            )
        )
        this.multiStaffSelectValue = event.responsibility.map((v) => ({
            name: v.name,
            value: v,
            checked: true,
        }))

        // this.nxStore
        //     .select(CenterCommonSelector.instructors)
        //     .pipe(take(1))
        //     .subscribe((instructors) => {
        //         const centerInstructorList = _.cloneDeep(instructors)
        //         this.multiStaffSelect_list = centerInstructorList
        //             .filter((ci) => -1 != instructorList.findIndex((v) => ci.id == v.instructor.id))
        //             .map((value) => ({
        //                 name: value.center_user_name,
        //                 value: value,
        //                 checked: false,
        //             }))
        //     })
    }
}
