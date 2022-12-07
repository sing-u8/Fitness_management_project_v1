import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core'
import { Location } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'

import _ from 'lodash'
import dayjs from 'dayjs'

// fullcalendar
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular'
import { EventClickArg, EventDropArg, EventHoveringArg } from '@fullcalendar/common'
import koLocale from '@fullcalendar/core/locales/ko'

// services
import { StorageService } from '@services/storage.service'
import { CenterCalendarService, DeleteMode, UpdateCalendarTaskReqBody } from '@services/center-calendar.service'
import { CenterService } from '@services/center.service'
import { CenterUsersService } from '@services/center-users.service'
import { CalendarTaskService } from '@services/helper/calendar-task.service'
import { WordService } from '@services/helper/word.service'

// schemas
import { Center } from '@schemas/center'
import { Calendar } from '@schemas/calendar'
import { CalendarTask } from '@schemas/calendar-task'
import { Loading } from '@schemas/store/loading'
import { User } from '@schemas/user'
import { UserBooked } from '@schemas/user-booked'
import { UserAbleToBook } from '@schemas/user-able-to-book'

// rxjs
import { Observable, Subject } from 'rxjs'
import { take, takeUntil } from 'rxjs/operators'

// ngrx
import { select, Store } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'
import { closeDrawer, openDrawer, setScheduleDrawerIsReset } from '@appStore/actions/drawer.action'

import * as FromSchedule from '@centerStore/reducers/sec.schedule.reducer'
import * as ScheduleSelector from '@centerStore/selectors/sec.schedule.selector'
import { calendarOptions } from '@centerStore/selectors/sec.schedule.selector'
import * as ScheduleActions from '@centerStore/actions/sec.schedule.actions'
import { CenterUser } from '@schemas/center-user'

// temp
export type GymOperatingTime = { start: string; end: string }
export type ViewType = 'resourceTimeGridDay' | 'timeGridWeek' | 'dayGridMonth'
export type ScheduleEvent = {
    title: string
    start: string
    end: string
    resourceIds?: Array<string>
    originItem: CalendarTask
    textColor: string
    color: string
}

@Component({
    selector: 'schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit, AfterViewInit, OnDestroy {
    public center: Center
    public user: User
    public unsubscriber$ = new Subject<void>()

    public dateViewTypes = {
        day: { name: '일', type: 'resourceTimeGridDay' },
        week: { name: '주', type: 'timeGridWeek' },
        month: { name: '월', type: 'dayGridMonth' },
    }
    public eventList: ScheduleEvent[] = []

    // datepicker data
    public weekPickerData: { startDate: string; endDate: string } = {
        startDate: undefined,
        endDate: undefined,
    }
    public datePickerData: { date: string } = { date: undefined }

    // drawer var
    drawerDate: { startDate: Date; endDate: Date } = { startDate: undefined, endDate: undefined }

    // fullcalendar
    @ViewChild('full_calendar') fullCalendar: FullCalendarComponent
    public fullCalendarOptions: CalendarOptions
    public calendarTitle: string

    // // 초기값 고정 필수!
    public activeStart: string = FromSchedule.CalendarConfigInfoInit.startDate
    public activeEnd: string = FromSchedule.CalendarConfigInfoInit.endDate
    public selectedDateViewType: ViewType = FromSchedule.CalendarConfigInfoInit.viewType

    // ngrx vars
    public curCenterCalendar$_: Calendar = undefined
    public instructorList$_: FromSchedule.InstructorType[] = []
    public lectureFilter$_: FromSchedule.LectureFilter = FromSchedule.LectureFilterInit
    public isLoading$_: Loading = 'idle'
    public curCenterId$: Observable<string>

    constructor(
        private nxStore: Store,
        private storageService: StorageService,
        private CenterCalendarService: CenterCalendarService,
        private centerService: CenterService,
        private centerUsersService: CenterUsersService,
        private calendarTaskHelperService: CalendarTaskService,
        private renderer: Renderer2,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private location: Location,
        private wordService: WordService
    ) {
        this.center = this.storageService.getCenter()

        this.nxStore
            .pipe(select(ScheduleSelector.operatingHour), takeUntil(this.unsubscriber$))
            .subscribe((operatingHour) => {
                this.operatingTime = _.cloneDeep(operatingHour)
            })

        this.nxStore.pipe(select(calendarOptions), take(1)).subscribe((calendarOptions) => {
            if (_.isEmpty(calendarOptions)) {
                this.initFullCalendar()
            } else {
                this.fullCalendarOptions = calendarOptions
            }
        })
    }

    ngOnInit(): void {
        this.user = this.storageService.getUser()

        this.nxStore
            .pipe(select(ScheduleSelector.curCenterCalendar), takeUntil(this.unsubscriber$))
            .subscribe((ccc) => {
                this.curCenterCalendar$_ = ccc
            })
        this.curCenterId$ = this.nxStore.select(ScheduleSelector.curCenterId)
        this.nxStore.pipe(select(ScheduleSelector.isLoading), takeUntil(this.unsubscriber$)).subscribe((loading) => {
            this.isLoading$_ = loading
        })

        this.nxStore
            .pipe(select(ScheduleSelector.doLessonsExist), takeUntil(this.unsubscriber$))
            .subscribe((doExist) => {
                this.doShowEmptyLessonModal = !doExist
            })

        this.nxStore.pipe(select(ScheduleSelector.curCenterId), take(1)).subscribe((curCenterid) => {
            if (curCenterid != this.center.id) {
                this.nxStore.dispatch(ScheduleActions.resetAll())
                this.nxStore.dispatch(ScheduleActions.startLoadScheduleState())
                this.nxStore.dispatch(ScheduleActions.setCurCenterId({ centerId: this.center.id }))
            }
        })

        this.nxStore.pipe(select(ScheduleSelector.datePick), takeUntil(this.unsubscriber$)).subscribe((date) => {
            this.datePickerData = { date }
        })
        this.nxStore.pipe(select(ScheduleSelector.weekPick), takeUntil(this.unsubscriber$)).subscribe((weekPick) => {
            this.weekPickerData = _.cloneDeep(weekPick)
        })
    }
    ngAfterViewInit(): void {
        this.nxStore
            .pipe(select(ScheduleSelector.calendarConfig), takeUntil(this.unsubscriber$))
            .subscribe((calConfig) => {
                console.log(
                    'ScheduleSelector.calendarConfig : ',
                    _.isEqual(calConfig, FromSchedule.CalendarConfigInfoInit)
                )
                if (_.isEqual(calConfig, FromSchedule.CalendarConfigInfoInit)) {
                    const calView = this.fullCalendar.getApi().view
                    this.setCalendarTitle('timeGridWeek')
                    this.nxStore.dispatch(
                        ScheduleActions.setCalendarConfig({
                            calendarConfig: {
                                startDate: dayjs(calView.activeStart).format('YYYY-MM-DD'),
                                endDate: dayjs(calView.activeEnd).format('YYYY-MM-DD'),
                                viewType: 'timeGridWeek',
                            },
                        })
                    )
                    this.initDatePickerData()
                } else {
                    this.activeStart = calConfig.startDate
                    this.activeEnd = calConfig.endDate
                    this.selectedDateViewType = calConfig.viewType
                }
            })

        this.nxStore
            .pipe(select(ScheduleSelector.lectureFilter), takeUntil(this.unsubscriber$))
            .subscribe((lectureFilter) => {
                this.lectureFilter$_ = _.cloneDeep(lectureFilter)
                this.setEventsFiltersChange(this.instructorList$_, this.lectureFilter$_)
            })
        this.nxStore
            .pipe(select(ScheduleSelector.instructorList), takeUntil(this.unsubscriber$))
            .subscribe((instructorList) => {
                this.instructorList$_ = _.cloneDeep(instructorList)
                this.initViewsOption(this.selectedDateViewType)
                this.setEventsFiltersChange(this.instructorList$_, this.lectureFilter$_)
                const checkedInstructorLength =
                    instructorList.length == 0
                        ? 0
                        : instructorList.reduce((checkedLen, val) => checkedLen + (val.selected ? 1 : 0), 0)
                if (checkedInstructorLength > 0) {
                    this.getTaskList(this.selectedDateViewType)
                }
            })

        this.nxStore
            .pipe(select(ScheduleSelector.isScheduleEventChanged), takeUntil(this.unsubscriber$))
            .subscribe((status) => {
                console.log('isScheduleEventChanged - in schedule -- status ', status)
                if (status == true) {
                    this.getTaskList(this.selectedDateViewType)
                    this.nxStore.dispatch(ScheduleActions.setIsScheduleEventChanged({ isScheduleEventChanged: false }))
                }
            })

        this.nxStore.pipe(select(calendarOptions), takeUntil(this.unsubscriber$)).subscribe((calendarOptions) => {
            console.log('calendarOptions selector :  ', calendarOptions, !_.isEmpty(calendarOptions))
            if (!_.isEmpty(calendarOptions)) {
                this.initCalendarOptionFuncs()
                this.recallCalendarState(this.selectedDateViewType)
            }
        })

        this.nxStore.pipe(select(ScheduleSelector.taskList), takeUntil(this.unsubscriber$)).subscribe((taskList) => {
            this.eventList = taskList.map((task) => this.makeScheduleEvent(task, this.selectedDateViewType))
            console.log('getTaskList : ', this.eventList)
            this.setEventsFiltersChange(this.instructorList$_, this.lectureFilter$_)
        })
    }
    ngOnDestroy(): void {
        this.closeDrawer()
        this.unsubscriber$.next()
        this.unsubscriber$.complete()
        this.nxStore.dispatch(ScheduleActions.setCalendarOptions({ calendarOptions: this.fullCalendar.options }))
    }
    // ---------------------------------------------------------------------------------------------------------//

    // --------------------------------- alert modal vars & funcs when lesson is empty --------------------------------//
    public doShowEmptyLessonModal = false
    public emptyLessonText = {
        text: '앗! 등록된 수업이 없어요. 😱',
        subText: `수업 일정을 추가하기 위해
        센터의 수업 및 회원권 정보를 등록해주세요.`,
        cancelButtonText: '뒤로',
        confirmButtonText: '수업 등록하기',
    }
    onEmptyLessonModalCancel() {
        this.doShowEmptyLessonModal = false
        // ! 필요에 따라 분기를 나눠서 뒤로가기를 구현해야 할 수 있음
        this.location.back()
    }
    onEmptyLessonModalConfirm() {
        this.doShowEmptyLessonModal = false
        this.router.navigate(['../lesson'], { relativeTo: this.activatedRoute })
    }
    // --------------------------------- modal operating fucntions and texts --------------------------------//
    public operatingTime: GymOperatingTime = { start: undefined, end: undefined }
    public operatingDayOfWeek: { value: number[] } = { value: [0, 1, 2, 3, 4, 5, 6] }
    public operatingAllDay = false

    public doShowCenterOperModal = false
    openCenterOperatingModal() {
        this.doShowCenterOperModal = true
    }
    onCenterOperatingModalCancel() {
        this.doShowCenterOperModal = false
        this.getOperatingData(this.center.id)
    }
    onCenterOperatingModalConfirm(Return: {
        operatingTime: GymOperatingTime
        operatingDayOfWeek: { value: number[] }
        isAllTime: boolean
    }) {
        this.centerService
            .updateCenter(this.center.id, {
                day_of_the_week: Return.operatingDayOfWeek.value,
                open_time: Return.operatingTime.start.slice(0, 5),
                close_time: Return.operatingTime.end.slice(0, 5),
                all_day: Return.isAllTime,
            })
            .subscribe((gymData) => {
                // UI가 두 번 변함!!!
                this.fullCalendar.options = {
                    ...this.fullCalendar.options,
                    ...{
                        hiddenDays: this.getHiddenDays(Return.operatingDayOfWeek.value),
                        slotMinTime: Return.isAllTime ? '00:00:00' : Return.operatingTime.start,
                        slotMaxTime: Return.isAllTime ? '23:59:00' : Return.operatingTime.end,
                    },
                }

                // ! 대체용
                // this.fullCalendar
                //     .getApi()
                //     .setOption('hiddenDays', this.getHiddenDays(Return.operatingDayOfWeek.value)))
                this.changeView(this.selectedDateViewType)
                this.nxStore.dispatch(showToast({ text: '센터 운영 시간이 변경되었습니다.' }))
                this.doShowCenterOperModal = false
            })
    }

    getOperatingData(centerId: string, fn?: () => void) {
        this.centerService.getCenter(centerId).subscribe((center) => {
            const operatingTime: GymOperatingTime = {
                start: center.open_time,
                end: center.close_time,
            }
            this.nxStore.dispatch(ScheduleActions.setOperatingHour({ operatingHour: operatingTime }))
            this.operatingDayOfWeek.value = center.day_of_the_week
            this.operatingAllDay = center.all_day
            fn ? fn() : null
        })
    }

    getHiddenDays(days: number[]) {
        const newHiddenDays = [0, 1, 2, 3, 4, 5, 6]
        return _.difference(newHiddenDays, days)
    }

    // --------------------- fucntions for datepicker related to fullcalendar  --------------
    initDatePickerData() {
        this.weekPickerData.startDate = dayjs().startOf('week').format('YYYY-MM-DD')
        this.weekPickerData.endDate = dayjs().endOf('week').format('YYYY-MM-DD')
        this.datePickerData.date = dayjs().format('YYYY-MM-DD')
        this.nxStore.dispatch(
            ScheduleActions.setWeekPick({
                startDate: dayjs().startOf('week').format('YYYY-MM-DD'),
                endDate: dayjs().endOf('week').format('YYYY-MM-DD'),
            })
        )
        this.nxStore.dispatch(ScheduleActions.setDatePick({ date: dayjs().format('YYYY-MM-DD') }))
    }
    onDatePickerClick(rDate: { date: string }) {
        const calendarApi = this.fullCalendar.getApi()
        calendarApi.view.calendar.gotoDate(rDate.date)
        this.setCalendarTitle(this.selectedDateViewType)

        const calView = this.fullCalendar.getApi().view
        // this.activeStart = dayjs(calView.activeStart).format('YYYY-MM-DD')
        // this.activeEnd = dayjs(calView.activeEnd).format('YYYY-MM-DD')
        this.nxStore.dispatch(ScheduleActions.setDatePick({ date: rDate.date }))
        this.nxStore.dispatch(
            ScheduleActions.setCalendarConfig({
                calendarConfig: {
                    startDate: dayjs(calView.activeStart).format('YYYY-MM-DD'),
                    endDate: dayjs(calView.activeEnd).format('YYYY-MM-DD'),
                },
            })
        )
        this.getTaskList(this.selectedDateViewType)
    }
    onWeekPickerClick(rDate: { startDate: string; endDate: string }) {
        const calendarApi = this.fullCalendar.getApi()
        calendarApi.view.calendar.gotoDate(rDate.startDate)
        this.setCalendarTitle(this.selectedDateViewType)

        const calView = calendarApi.view
        // this.activeStart = dayjs(calView.activeStart).format('YYYY-MM-DD')
        // this.activeEnd = dayjs(calView.activeEnd).format('YYYY-MM-DD')
        this.nxStore.dispatch(ScheduleActions.setWeekPick({ startDate: rDate.startDate, endDate: rDate.endDate }))
        this.nxStore.dispatch(
            ScheduleActions.setCalendarConfig({
                calendarConfig: {
                    startDate: dayjs(calView.activeStart).format('YYYY-MM-DD'),
                    endDate: dayjs(calView.activeEnd).format('YYYY-MM-DD'),
                },
            })
        )
        this.getTaskList(this.selectedDateViewType)
    }

    // --------------------- functions for top of full calendar ---------------------

    changeView(viewType: ViewType) {
        this.nxStore.dispatch(
            ScheduleActions.setCalendarConfig({
                calendarConfig: {
                    viewType,
                },
            })
        )

        const calendarApi = this.fullCalendar.getApi()
        calendarApi.changeView(viewType)

        this.nxStore.dispatch(
            ScheduleActions.setCalendarConfig({
                calendarConfig: {
                    startDate: dayjs(calendarApi.view.activeStart).format('YYYY-MM-DD'),
                    endDate: dayjs(calendarApi.view.activeEnd).format('YYYY-MM-DD'),
                },
            })
        )

        this.getTaskList(viewType)
        this.initViewsOption(viewType)
        this.setDatePickerWhenViewChange(viewType)
        this.setCalendarTitle(viewType)
    }

    initViewsOption(viewType: ViewType) {
        switch (viewType) {
            case 'resourceTimeGridDay':
                const resoruces = []
                _.forEach(_.filter(this.instructorList$_, ['selected', true]), (value) => {
                    resoruces.push({
                        id: value.instructor.id,
                        title: value.instructor.name,
                        instructorData: value.instructor,
                    })
                })
                this.fullCalendar.options = { ...this.fullCalendar.options, ...{ resources: resoruces } }
                break
            case 'timeGridWeek':
                break
            case 'dayGridMonth':
                break
        }
    }

    onMoveDate(type: 'prev' | 'next' | 'today') {
        switch (type) {
            case 'prev':
                this.fullCalendar.getApi().prev()
                break
            case 'next':
                this.fullCalendar.getApi().next()
                break
            case 'today':
                this.fullCalendar.getApi().today()
                break
        }
        const calView = this.fullCalendar.getApi().view
        this.nxStore.dispatch(
            ScheduleActions.setCalendarConfig({
                calendarConfig: {
                    startDate: dayjs(calView.activeStart).format('YYYY-MM-DD'),
                    endDate: dayjs(calView.activeEnd).format('YYYY-MM-DD'),
                },
            })
        )
        this.setDatePickerWhenViewChange(this.selectedDateViewType)
        this.setCalendarTitle(this.selectedDateViewType)
        this.getTaskList(this.selectedDateViewType)
    }

    setDatePickerWhenViewChange(viewType: ViewType) {
        const calendarApi = this.fullCalendar.getApi()
        const activeStart = dayjs(calendarApi.view.activeStart).format('YYYY-MM-DD')
        const activeEnd = dayjs(calendarApi.view.activeEnd).subtract(1, 'day').format('YYYY-MM-DD')

        switch (viewType) {
            case 'resourceTimeGridDay':
                this.nxStore.dispatch(ScheduleActions.setDatePick({ date: activeStart }))
                break
            case 'timeGridWeek':
                this.nxStore.dispatch(ScheduleActions.setWeekPick({ startDate: activeStart, endDate: activeEnd }))
                break
            case 'dayGridMonth':
                // !! 가장 날짜를 많이 차지하는 달로 선택하게 하기  [필요하면]
                this.nxStore.dispatch(ScheduleActions.setDatePick({ date: dayjs().format('YYYY-MM-DD') }))
                break
        }
    }

    setCalendarTitle(viewType: ViewType) {
        const calendarApi = this.fullCalendar.getApi()
        switch (viewType) {
            // !!day, month에서 데이트 픽커 초기화 안됨
            case 'resourceTimeGridDay':
                this.calendarTitle = dayjs(calendarApi.view.activeStart).format('MM.DD (dd)')
                break
            case 'timeGridWeek':
                this.calendarTitle =
                    dayjs(calendarApi.view.activeStart).format('MM.DD (dd)') +
                    ' - ' +
                    dayjs(calendarApi.view.activeEnd).subtract(1, 'day').format('MM.DD (dd)')
                break
            case 'dayGridMonth':
                this.calendarTitle = calendarApi.view.title
                break
        }
    }

    recallCalendarState(viewType: ViewType) {
        const calendarApi = this.fullCalendar.getApi()
        // recall title and schedule
        switch (viewType) {
            case 'resourceTimeGridDay':
                this.calendarTitle = dayjs(this.datePickerData.date).format('MM.DD (dd)')
                calendarApi.view.calendar.gotoDate(this.datePickerData.date)
                break
            case 'timeGridWeek':
                this.calendarTitle =
                    dayjs(this.weekPickerData.startDate).format('MM.DD (dd)') +
                    ' - ' +
                    dayjs(this.weekPickerData.endDate).subtract(1, 'day').format('MM.DD (dd)')
                calendarApi.view.calendar.gotoDate(this.weekPickerData.startDate)
                break
            case 'dayGridMonth':
                this.calendarTitle = dayjs(this.datePickerData.date).format('YYYY년 M월')
                calendarApi.view.calendar.gotoDate(this.datePickerData.date)
                break
        }
        calendarApi.changeView(viewType)
    }

    getTaskList(viewType: ViewType, callback?: (eventList: ScheduleEvent[]) => void) {
        this.nxStore.dispatch(
            ScheduleActions.startGetAllCalendarTask({
                centerId: this.center.id,
                cb: (taskList: CalendarTask[]) => {
                    if (_.isFunction(callback)) {
                        const eventList = taskList.map((task) => this.makeScheduleEvent(task, viewType))
                        callback(eventList)
                    }
                },
            })
        )
    }

    // !!!!!!!!!!!!!!!!!!!!
    makeScheduleEvent(task: CalendarTask, viewType: ViewType): ScheduleEvent {
        if (viewType == 'resourceTimeGridDay') {
            return {
                title: task.name,
                start: task.start,
                end: task.end,
                resourceIds: task.responsibility.map((v) => v.id),
                originItem: task,
                textColor: '#212121',
                color: task.type_code == 'calendar_task_type_normal' ? '#F6F6F6' : '#FFFFFF',
            }
        } else {
            return {
                title: task.name,
                start: task.start,
                end: task.end,
                originItem: task,
                textColor: '#212121',
                color: task.type_code == 'calendar_task_type_normal' ? '#F6F6F6' : '#FFFFFF',
            }
        }
    }
    // filter dropdown functions
    setEventsFiltersChange(instructors: FromSchedule.InstructorType[], scheduleType: FromSchedule.LectureFilter) {
        if (!this.fullCalendar) return

        const instructorEventList = []
        const lessonTypeEventList = []

        // filter instructor
        if (instructors.length > 0 && this.eventList.length > 0) {
            _.forEach(this.eventList, (event) => {
                if (
                    _.findIndex(instructors, (instructor) => {
                        return (
                            instructor.selected &&
                            event.originItem.responsibility.findIndex((v) => v.id == instructor.instructor.id) != -1
                        )
                    }) != -1
                ) {
                    instructorEventList.push(event)
                }
            })
        }

        // filter lessonType
        if (scheduleType && this.eventList.length > 0) {
            _.forEach(this.eventList, (event) => {
                const isNormalType =
                    scheduleType['calendar_task_type_normal'].selected == true && event.originItem.class == null
                const isOneToOneType =
                    scheduleType['calendar_task_type_onetoone'].selected == true &&
                    event.originItem.class?.type_code == 'class_item_type_onetoone'
                const isGroupType =
                    scheduleType['calendar_task_type_group'].selected == true &&
                    event.originItem.class?.type_code == 'class_item_type_group'

                if (isNormalType || isOneToOneType || isGroupType) {
                    lessonTypeEventList.push(event)
                }
            })
        }

        console.log(
            'setEventsFiltersChange ---------------- ',
            instructors,
            'scheduleType: ',
            scheduleType,
            'eventList : ',
            this.eventList
        )
        console.log('lessonTypeEventList : ', lessonTypeEventList, ',  instructorEventList : ', instructorEventList)

        // apply filtered task list
        if (lessonTypeEventList.length > 0 && instructorEventList.length > 0) {
            let _intersectList = _.intersectionWith(instructorEventList, lessonTypeEventList, (a, b) => {
                return a.originItem.id == b.originItem.id
            })

            _intersectList = [
                ..._intersectList,
                ..._.filter(this.eventList, (v) => v.originItem.responsibility.length == 0),
            ]

            this.fullCalendar.options = { ...this.fullCalendar.options, ...{ events: _intersectList } }
        } else {
            this.fullCalendar.options = {
                ...this.fullCalendar.options,
                ...{ events: _.filter(this.eventList, (v) => v.originItem.responsibility.length == 0) },
            }
        }
    }

    // ------------------------------------------- schedule dropdown  ------------------------------------------//
    @ViewChild('schdule_dropdown') schdule_dropdown_el: ElementRef
    public doShowScheduleDropdown = false
    showScheduleDropdown() {
        this.doShowScheduleDropdown = true
    }
    hideScheduleDropdown() {
        this.doShowScheduleDropdown = false
    }

    // drawer function
    openGeneralScheduleDrawer() {
        this.setDrawerDate()

        this.setTaskTitleTime()
        this.nxStore.dispatch(openDrawer({ tabName: 'general-schedule' }))
        this.nxStore.dispatch(setScheduleDrawerIsReset({ isReset: true }))

        // this.fullCalendar.getApi().updateSize()
    }
    openLessonScheduleDrawer() {
        this.setDrawerDate()

        this.setTaskTitleTime()
        this.nxStore.dispatch(openDrawer({ tabName: 'lesson-schedule' }))
        this.nxStore.dispatch(setScheduleDrawerIsReset({ isReset: true }))

        // this.fullCalendar.getApi().updateSize()
    }
    closeDrawer() {
        this.nxStore.dispatch(closeDrawer())
        const calApi = this.fullCalendar.getApi()
        if (calApi?.updateSize) {
            calApi.updateSize()
        }
    }

    setDrawerDate() {
        if (!this.drawerDate.endDate) {
            this.nxStore.dispatch(
                ScheduleActions.setSelectedDate({
                    selectedDate: {
                        startDate: this.drawerDate.startDate,
                        endDate: new Date(this.drawerDate.startDate.getTime() + 30 * 60000),
                        viewType: this.selectedDateViewType,
                    },
                })
            )
        } else {
            this.nxStore.dispatch(
                ScheduleActions.setSelectedDate({
                    selectedDate: {
                        startDate: this.drawerDate.startDate,
                        endDate: this.drawerDate.endDate,
                        viewType: this.selectedDateViewType,
                    },
                })
            )
        }
    }

    // <-------------------------------------- fullcalendar option functions----------------------------------------------------------//
    // fullcalendar fucntions
    initFullCalendar(): void {
        const hiddenDays = this.getHiddenDays(this.center.day_of_the_week)
        const operatingTime = { start: this.center.open_time, end: this.center.close_time }
        this.fullCalendarOptions = {
            schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
            initialView: this.selectedDateViewType,
            locales: [koLocale],
            locale: 'ko',
            height: '100%',
            headerToolbar: false,
            // contentHeight: 'auto',

            views: {
                resourceTimeGridDay: {
                    allDaySlot: false,
                },
                timeGridWeek: {
                    allDaySlot: false,
                },
                dayGridMonth: {
                    dayMaxEventRows: 4,
                    fixedWeekCount: false,
                },
            },
            slotMinTime: operatingTime.start,
            slotMaxTime: operatingTime.end,
            hiddenDays: hiddenDays,
            selectable: true,
            editable: true,
            droppable: true,
            eventDurationEditable: false,

            events: [],
            resources: [],
        }
        this.initCalendarOptionFuncs()
        this.getOperatingData(this.center.id)
    }
    initCalendarOptionFuncs() {
        this.fullCalendarOptions = {
            ...this.fullCalendarOptions,
            dateClick: this.onDateClick.bind(this),
            eventClick: this.onEventClick.bind(this),
            select: this.onDateSelect.bind(this),
            eventDidMount: this.eventDidMount.bind(this),
            dayCellDidMount: this.dayCellDidMount.bind(this),
            eventMouseEnter: this.eventMouseEnter.bind(this),
            eventMouseLeave: this.eventMouseLeave.bind(this),
            eventDrop: this.eventDrop.bind(this),
        }
    }

    // full calendar event functions
    onEventClick(arg: EventClickArg) {
        console.log('onEventClick arg: ', arg)
        console.log('onEventClick event: ', arg.event.extendedProps['originItem'])

        if (arg.event.extendedProps['originItem'].type_code == 'calendar_task_type_normal') {
            this.generalEventData = arg.event.extendedProps['originItem']
            this.showModifyGeneralEventModal()
        } else {
            this.lessonEventData = arg.event.extendedProps['originItem']
            // this.getLessonModalCalId(this.lessonEventData)
            this.showModifyLessonEventModal()
        }
    }

    onDateSelect(arg) {
        console.log('onDateSelect: ', arg)
        if (this.isLoading$_ != 'done') return
        if (arg.view.type == 'dayGridMonth') {
            if (this.dayCellLeave) {
                this.hideScheduleDropdown()
            }
            this.setSchedulingInstructor(arg)
            return
        }
        const highlight_El: HTMLElement = arg.jsEvent.toElement
        const highlight_pos = highlight_El.getBoundingClientRect()

        this.drawerDate = { startDate: new Date(arg.startStr), endDate: new Date(arg.endStr) }
        const posX = highlight_pos.right - 120 // + 105(dropdown width) + 15(padding)
        const posY = window.innerHeight < 85 + highlight_pos.bottom ? highlight_pos.top - 81 : highlight_pos.bottom + 5
        this.renderer.setStyle(this.schdule_dropdown_el.nativeElement, 'left', `${posX}px`)
        this.renderer.setStyle(this.schdule_dropdown_el.nativeElement, 'top', `${posY}px`)

        this.setSchedulingInstructor(arg)
        this.showScheduleDropdown()
    }
    onDateClick(arg) {
        if (this.isLoading$_ != 'done') return
        if (arg.view.type == 'dayGridMonth') {
            if (this.dayCellLeave) {
                this.hideScheduleDropdown()
            }
            return
        }
        const highlight_El: HTMLElement = arg.dayEl.getElementsByClassName('fc-highlight')[0]
        const highlight_pos = highlight_El.getBoundingClientRect()

        console.log('onDateClick: ', arg, highlight_pos)
        this.drawerDate = { startDate: new Date(arg.dateStr), endDate: null }
        const posX = highlight_pos.right - 120 // + 105(dropdown width) + 15(padding)
        const posY = window.innerHeight < 85 + highlight_pos.bottom ? highlight_pos.top - 81 : highlight_pos.bottom + 5
        this.renderer.setStyle(this.schdule_dropdown_el.nativeElement, 'left', `${posX}px`)
        this.renderer.setStyle(this.schdule_dropdown_el.nativeElement, 'top', `${posY}px`)

        this.setSchedulingInstructor(arg)
        this.showScheduleDropdown()
    }

    public setSchedulingInstructor(arg) {
        console.log('setSchedulingInstructor func arg  : ', arg)
        if (arg.view.type == 'resourceTimeGridDay') {
            console.log(
                "arg.view.type == 'resourceTimeGridDay' -- ",
                arg.view.type == 'resourceTimeGridDay',
                arg.resource.extendedProps.instructorData
            )

            this.nxStore.dispatch(
                ScheduleActions.setSchedulingInstructors({
                    schedulingInstructors: [arg.resource.extendedProps.instructorData],
                })
            )
        } else {
            if (this.curCenterCalendar$_) {
                this.nxStore.dispatch(
                    ScheduleActions.setSchedulingInstructors({
                        schedulingInstructors: undefined, // this.curCenterCalendar$_,
                    })
                )
            }
        }
        this.setTempTaskTitleTime(arg)
    }

    public tempTaskTitleTime: Date = undefined
    public setTempTaskTitleTime(arg) {
        if (arg.view.type == 'dayGridMonth') {
            const date = this.operatingTime.start.split(':').map((time) => Number(time))
            this.tempTaskTitleTime = new Date(new Date().setHours(date[0], date[1], date[2]))
            console.log('setTempTaskTitleTime : ', date, ' - ', this.tempTaskTitleTime)
        } else {
            this.tempTaskTitleTime = arg.date
        }
    }
    public setTaskTitleTime() {
        this.nxStore.dispatch(ScheduleActions.setTaskTitleTime({ taskTitleTime: this.tempTaskTitleTime }))
    }

    eventDidMount(arg) {
        // console.log('onEventDidMount: ', arg, arg.event.extendedProps.originItem)

        if (arg.view.type == 'resourceTimeGridDay' || arg.view.type == 'timeGridWeek') {
            const eventMainFrame_el: HTMLElement = arg.el.getElementsByClassName('fc-event-main-frame')[0]
            eventMainFrame_el.style.padding = '0 0 0 10px'
            eventMainFrame_el.style.position = 'relative'

            const eventTitleContainerEl: HTMLElement = arg.el.getElementsByClassName('fc-event-title-container')[0]
            const eventTitleEl: HTMLElement = arg.el.getElementsByClassName('fc-event-title')[0]
            const eventTimeEl: HTMLElement = arg.el.getElementsByClassName('fc-event-time')[0]

            const insts = _.orderBy(arg.event.extendedProps.originItem.responsibility, 'center_user_name')

            if (arg.event.extendedProps.originItem.type_code == 'calendar_task_type_normal') {
                eventTitleContainerEl.appendChild(eventTimeEl)
                eventTitleEl.classList.add('rw-typo-subtext3')
                eventTitleEl.style.fontSize = '1.1rem'
                eventTitleEl.style.fontWeight = '500'
                eventTitleEl.style.whiteSpace = 'nowrap'
                eventTitleEl.style.color = '#606060'

                eventTimeEl.style.fontSize = '1.1rem'
                eventTimeEl.style.fontWeight = '400'
                eventTimeEl.style.whiteSpace = 'nowrap'
                eventTimeEl.style.color = '#c9c9c9'
                eventTimeEl.innerHTML = `${
                    insts.length > 1
                        ? insts[0].center_user_name + ` 외 ${insts.length - 1}명`
                        : insts[0]?.center_user_name ?? '담당자 없음'
                }`
            } else {
                eventTitleEl.classList.add('rw-typo-subtext0')
                eventTitleEl.style.fontSize = '1.2rem'
                eventTitleEl.style.fontWeight = '700'
                eventTitleEl.style.whiteSpace = 'nowrap'

                eventTitleContainerEl.appendChild(eventTimeEl)
                eventTimeEl.classList.add('rw-typo-subtext4')
                eventTimeEl.style.color = '#C9C9C9'
                eventTimeEl.style.fontSize = '1.1rem'
                eventTimeEl.innerHTML = `${
                    insts.length > 1
                        ? insts[0].center_user_name + ` 외 ${insts.length - 1}명`
                        : insts[0]?.center_user_name ?? '담당자 없음'
                } ㆍ ${arg.event.extendedProps.originItem.class.booked_count}/${
                    arg.event.extendedProps.originItem.class.capacity
                }명`
                // event color tag
                eventMainFrame_el.insertAdjacentHTML(
                    'afterbegin',
                    `
                        <div
                            style="
                            border-top-left-radius: 2.5px;
                            border-bottom-left-radius: 2.5px;
                            position: absolute;
                            left: -1px;
                            top: -1px;
                            height: calc(100% + 1px);
                            width: 4px;
                            background-color:${arg.event.extendedProps.originItem.color ?? 'var(--border-color)'};"
                        ></div>
                    `
                )
            }
        } else if (arg.view.type == 'dayGridMonth') {
            arg.el.style.padding = '0 0 0 10px'
            arg.el.style.position = 'relative'

            const eventTitleContainerEl: HTMLElement = arg.el.getElementsByClassName('fc-daygrid-event-dot')[0]
            const eventTitleEl: HTMLElement = arg.el.getElementsByClassName('fc-event-title')[0]
            const eventTimeEl: HTMLElement = arg.el.getElementsByClassName('fc-event-time')[0]

            eventTitleContainerEl.style.display = 'none'
            eventTimeEl.style.display = 'none'

            eventTitleEl.classList.add('rw-typo-subtext3')
            eventTitleEl.style.color = '#212121'
            eventTitleEl.style.whiteSpace = 'nowrap'
            if (arg.event.extendedProps.originItem.type_code == 'calendar_task_type_normal') {
                eventTitleEl.style.fontWeight = '500'
                arg.el.style.backgroundColor = 'var(--background-color)'
                eventTitleEl.innerHTML = arg.event.extendedProps.originItem.memo
                    ? `${arg.event.extendedProps.originItem.name}  (${arg.event.extendedProps.originItem.memo})`
                    : `${arg.event.extendedProps.originItem.name}`
            } else {
                eventTitleEl.style.fontWeight = '700'
                // event color tag
                arg.el.insertAdjacentHTML(
                    'afterbegin',
                    `
                        <div
                            style="
                            border-top-left-radius: 2.5px;
                            border-bottom-left-radius: 2.5px;
                            position: absolute;
                            left: -1px;
                            top: -1px;
                            height: calc(100% + 1px);
                            width: 5px;
                            background-color:${arg.event.extendedProps.originItem.color ?? 'var(--border-color)'};"
                        ></div>
                    `
                )
            }
        }
    }

    eventMouseEnter(arg: EventHoveringArg) {
        this.showTooltip(arg)
    }
    eventMouseLeave(arg: EventHoveringArg) {
        this.hideTooltip()
    }

    eventDrop(arg: EventDropArg) {
        console.log('eventDrop: ', arg, arg.event.startStr, arg.event.endStr)
        console.log('extendedProps: ', arg.event.extendedProps)
        this.fullCalendar.getApi().render()
        let calTask: CalendarTask = _.cloneDeep(arg.event.extendedProps['originItem'] as CalendarTask)

        if (arg.event.extendedProps['originItem'].type_code == 'calendar_task_type_normal') {
            const reqBody: UpdateCalendarTaskReqBody = {
                start_date: dayjs(arg.event.startStr).format('YYYY-MM-DD'),
                start_time: dayjs(arg.event.startStr).format('HH:mm'),
                end_date: dayjs(arg.event.endStr).format('YYYY-MM-DD'),
                end_time: dayjs(arg.event.endStr).format('HH:mm'),
            }

            this.nxStore.dispatch(
                ScheduleActions.startUpdateCalendarTask({
                    centerId: this.center.id,
                    calendarId: this.curCenterCalendar$_.id,
                    taskId: calTask.id,
                    reqBody: reqBody,
                    mode: 'one',
                    cb: () => {
                        // this.getTaskList(this.selectedDateViewType)
                        this.nxStore.dispatch(
                            showToast({
                                text: `'${this.wordService.ellipsis(calTask.name, 8)}' 기타 일정이 수정 되었습니다.`,
                            })
                        )
                    },
                })
            )
        } else {
            const eventData: CalendarTask = arg.event.extendedProps['originItem'] as CalendarTask
            let reqBody: UpdateCalendarTaskReqBody = undefined
            if (eventData.calendar_task_group_id) {
                reqBody = {
                    start_date: dayjs(arg.event.startStr).format('YYYY-MM-DD'),
                    start_time: dayjs(arg.event.startStr).format('HH:mm'),
                    end_date: dayjs(arg.event.endStr).format('YYYY-MM-DD'),
                    end_time: dayjs(arg.event.endStr).format('HH:mm'),
                    class: {
                        name: eventData.class.name,
                        category_name: eventData.class.category_name,
                        class_item_id: eventData.class.class_item_id,
                        type_code: eventData.class.type_code,
                        state_code: 'calendar_task_class_state_active',
                        duration: String(eventData.class.duration),
                        capacity: String(eventData.class.capacity),
                        start_booking_until: String(eventData.class.start_booking_until),
                        end_booking_before: String(eventData.class.end_booking_before),
                        cancel_booking_before: String(eventData.class.cancel_booking_before),
                        instructor_user_ids: eventData.class.instructors.map((v) => v.id),
                    },
                }
            } else {
                reqBody = {
                    start_date: dayjs(arg.event.startStr).format('YYYY-MM-DD'),
                    start_time: dayjs(arg.event.startStr).format('HH:mm'),
                    end_date: dayjs(arg.event.endStr).format('YYYY-MM-DD'),
                    end_time: dayjs(arg.event.endStr).format('HH:mm'),
                    class: {
                        name: eventData.class.name,
                        category_name: eventData.class.category_name,
                        class_item_id: eventData.class.class_item_id,
                        type_code: eventData.class.type_code,
                        state_code: 'calendar_task_class_state_active',
                        duration: String(eventData.class.duration),
                        capacity: String(eventData.class.capacity),
                        start_booking_until: String(eventData.class.start_booking_until),
                        end_booking_before: String(eventData.class.end_booking_before),
                        cancel_booking_before: String(eventData.class.cancel_booking_before),
                        instructor_user_ids: eventData.class.instructors.map((v) => v.id),
                    },
                }
            }
            console.log('drop event: ', reqBody)
            this.nxStore.dispatch(
                ScheduleActions.startUpdateCalendarTask({
                    centerId: this.center.id,
                    calendarId: this.curCenterCalendar$_.id,
                    taskId: calTask.id,
                    reqBody: reqBody,
                    mode: 'one',
                    cb: () => {
                        // this.getTaskList(this.selectedDateViewType)
                        this.nxStore.dispatch(
                            showToast({
                                text: `'${this.wordService.ellipsis(calTask.name, 8)}' 수업 일정이 수정 되었습니다.`,
                            })
                        )
                    },
                })
            )
        }

        calTask = _.assign(calTask, {
            start: dayjs(arg.event.startStr).format('YYYY-MM-DD HH:mm:ss'),
            end: dayjs(arg.event.endStr).format('YYYY-MM-DD HH:mm:ss'),
        })
        this.nxStore.dispatch(ScheduleActions.updatetask({ task: calTask }))
    }

    public dayCellLeave = true
    dayCellDidMount(arg) {
        if (arg.view.type == 'dayGridMonth') {
            if (arg.el.classList.contains('fc-daygrid-day')) {
                // normal daycell element
                const daygridDayTop_el: HTMLElement = arg.el.getElementsByClassName('fc-daygrid-day-top')[0]
                const isToday = arg.el.classList.contains('fc-day-today')
                if (daygridDayTop_el) {
                    daygridDayTop_el.style.flexDirection = 'row'
                    daygridDayTop_el.style.justifyContent = 'space-between'
                    daygridDayTop_el.style.alignItems = 'center'
                    const daygridDayNumber: HTMLElement = arg.el.getElementsByClassName('fc-daygrid-day-number')[0]
                    daygridDayNumber.style.display = 'none'
                    daygridDayTop_el.insertAdjacentHTML(
                        'afterbegin',
                        `
                        <div
                            class="rw-typo-subtext0"
                            style="display: flex; align-items: center; justify-content: center; padding: 8px 0px 5px 8px;"
                        >
                            ${arg.dayNumberText.slice(0, -1)}
                            <span style="font-size: 1.1rem; margin-left: 7px;margin-top: 2px;">${
                                isToday ? '오늘' : ''
                            }</span>
                        </div>
                        `
                    )
                    daygridDayTop_el.insertAdjacentHTML(
                        'beforeend',
                        `
                            <div
                                class="daygrid-top-add-schedule-button"
                                style="display: flex; align-items: center; justify-content: center;
                                    border-radius: 8px; width:21px; height:21px; cursor:pointer;
                                    background-color:var(--font-color); margin-right: 7.5px; z-index:10;"
                            >
                                <img
                                    src="assets/icons/etc/plus-white.svg"
                                    style="width:16px; height:16px"
                                />
                            </div>
                        `
                    )

                    const addSchButton_el: HTMLElement = arg.el.getElementsByClassName(
                        'daygrid-top-add-schedule-button'
                    )[0]
                    addSchButton_el.onclick = (e) => {
                        console.log('add schButton event : ', e, '-- arg :', arg)
                        if (this.doShowScheduleDropdown == false) {
                            const bt_pos = addSchButton_el.getBoundingClientRect()
                            this.drawerDate = {
                                startDate: dayjs(
                                    dayjs(`${dayjs(arg.date).format('YYYY-MM-DD')} ${this.operatingTime.start}`).format(
                                        'YYYY-MM-DD HH:mm:ss'
                                    )
                                ).toDate(),
                                endDate: null,
                            }
                            const posX = window.innerWidth < 105 + bt_pos.right ? bt_pos.left - 84 : bt_pos.left
                            const posY = window.innerHeight < 85 + bt_pos.bottom ? bt_pos.top - 81 : bt_pos.bottom + 5
                            this.renderer.setStyle(this.schdule_dropdown_el.nativeElement, 'left', `${posX}px`)
                            this.renderer.setStyle(this.schdule_dropdown_el.nativeElement, 'top', `${posY}px`)
                            this.showScheduleDropdown()
                        } else {
                            this.hideScheduleDropdown()
                        }
                    }
                    addSchButton_el.onmouseenter = (e) => {
                        this.dayCellLeave = false
                    }
                    addSchButton_el.onmouseleave = (e) => {
                        this.dayCellLeave = true
                    }
                }
            } else if (arg.el.classList.contains('fc-popover')) {
                // popover element
                const popover_el: HTMLElement = arg.el
                const popoverTitle_el: HTMLElement = arg.el.getElementsByClassName('fc-popover-title')[0]
                const popoverBody_el: HTMLElement = arg.el.getElementsByClassName('fc-popover-body')[0]
                const popoverClose_el: HTMLElement = arg.el.getElementsByClassName('fc-popover-close')[0]

                arg.el.style.borderColor = 'transparent'
                arg.el.style.borderRadius = '0px'

                popover_el.style.width = '234px'
                popoverBody_el.style.setProperty('padding', '0px', 'important')
                popoverBody_el.classList.add('thin-scroll-y-overlay2')
                popoverBody_el.style.maxHeight = '180px'

                popoverTitle_el.innerHTML = `${dayjs(arg.date).format('DD')}`
                popoverTitle_el.classList.add('rw-typo-subtext0')
                popoverTitle_el.style.fontWeight = '500'
                popoverTitle_el.style.fontSize = '1.2rem'
                popoverTitle_el.style.padding = '4px 0px 0px 4px'
            }
        }
    }

    onAddSchButtonClick(event) {
        console.log('onAddSchButtonClick: ', event)
    }
    // ------------------------- fullcalendar option functions ----------------------------------------------->//

    // ---------------------- vars and functions related to option functions ---------------------------------//
    isLessonTask(arg: EventHoveringArg) {
        return arg.event.extendedProps['originItem']['type_code'] == 'calendar_task_type_class'
    }

    public tooltipText: string = undefined
    @ViewChild('member_schedule_tooltip') member_schedule_tooltip: ElementRef

    showTooltip(arg: EventHoveringArg) {
        if (!this.isLessonTask(arg)) return
        const taskStatus = this.calendarTaskHelperService.getClassCalendarTaskStatus(
            arg.event.extendedProps['originItem']
        )
        this.tooltipText = taskStatus.text
        if (!taskStatus.status) {
            return
        }
        const eventTitle_el = arg.el.getElementsByClassName('fc-event-title')[0]
        const eventTitlePos = eventTitle_el.getBoundingClientRect()
        this.renderer.setStyle(this.member_schedule_tooltip.nativeElement, 'display', 'flex')
        this.renderer.setStyle(this.member_schedule_tooltip.nativeElement, 'left', `${eventTitlePos.left + 5}px`)
        this.renderer.setStyle(this.member_schedule_tooltip.nativeElement, 'top', `${eventTitlePos.top - 32}px`)
    }
    hideTooltip() {
        this.renderer.setStyle(this.member_schedule_tooltip.nativeElement, 'display', 'none')
    }

    // ---------------------------------------------------------------------------------------------------------//

    // ---------------------------------- !!  일정 수정 모달 vars and functions  !! -----------------------------------------------

    public doShowRepeatLessonOptionModal = false
    public repeatLessonTitle = ''
    public repeatedLessonTask: CalendarTask = undefined
    showRepeatLessonOptionModal() {
        this.doShowRepeatLessonOptionModal = true
    }
    hideRepeatLessonOptionModal() {
        this.doShowRepeatLessonOptionModal = false
    }
    onRepeatLessonOptionCancel() {
        this.hideRepeatLessonOptionModal()
        this.repeatedLessonTask = undefined
    }
    onRepeatLessonOptionConfirm(modifyOption: FromSchedule.ModifyLessonOption) {
        this.nxStore.dispatch(ScheduleActions.setModifyLessonOption({ option: modifyOption }))
        this.nxStore.dispatch(ScheduleActions.setModifyLessonEvent({ event: this.repeatedLessonTask }))

        // !! 아직 예약 부분은 API문제로 구현 불가
        // this.gymScheduleState.getLessonTaskReservations(this.center.id, String(this.repeatedLessonTask.id))
        this.hideRepeatLessonOptionModal()
        this.nxStore.dispatch(openDrawer({ tabName: 'modify-lesson-schedule' }))
        this.repeatedLessonTask = undefined
        // this.fullCalendar.getApi().updateSize()
    }

    public doShowRepeatGeneralOptionModal = false
    public repeatGeneralTitle = ''
    public repeatedGeneralTask: CalendarTask = undefined
    showRepeatGeneralOptionModal() {
        this.doShowRepeatGeneralOptionModal = true
    }
    hideRepeatGeneralOptionModal() {
        this.doShowRepeatGeneralOptionModal = false
    }
    onRepeatGeneralOptionCancel() {
        this.hideRepeatGeneralOptionModal()
        this.repeatedGeneralTask = undefined
    }
    onRepeatGeneralOptionConfirm(modifyOption: FromSchedule.ModifyLessonOption) {
        this.nxStore.dispatch(ScheduleActions.setModifyGeneralOption({ option: modifyOption }))
        this.nxStore.dispatch(ScheduleActions.setModifyGeneralEvent({ event: this.repeatedGeneralTask }))

        // !! 아직 예약 부분은 API문제로 구현 불가
        // this.gymScheduleState.getLessonTaskReservations(this.center.id, String(this.repeatedLessonTask.id))
        this.hideRepeatGeneralOptionModal()
        this.nxStore.dispatch(openDrawer({ tabName: 'modify-general-schedule' }))
        this.repeatedGeneralTask = undefined
        // this.fullCalendar.getApi().updateSize()
    }
    // - //

    public lessonEventData: CalendarTask = undefined
    updateLessonEventData(calTaskId: string, eventList: ScheduleEvent[]) {
        this.lessonEventData = eventList.find((v) => v.originItem.id == calTaskId).originItem
    }

    public doShowModifyLessonEventModal = false
    showModifyLessonEventModal() {
        this.doShowModifyLessonEventModal = true
    }
    hideModifyLessonEventModal() {
        this.doShowModifyLessonEventModal = false
    }
    onDeleteLessonEvent(lessonTask: CalendarTask) {
        this.hideModifyLessonEventModal()
        // !! repetition id --> calendar_task_group_id 가 맞는지 확인 필요
        if (lessonTask.calendar_task_group_id) {
            this.showDelRepeatLessonModal(lessonTask)
        } else {
            this.showDeleteEventModal(lessonTask, 'lesson')
        }
    }
    onModifyLessonEvent(lessonTask: CalendarTask) {
        // !! repetition id --> calendar_task_group_id 가 맞는지 확인 필요
        if (!lessonTask.calendar_task_group_id) {
            this.hideModifyLessonEventModal()

            this.nxStore.dispatch(ScheduleActions.setModifyLessonEvent({ event: lessonTask }))
            this.nxStore.dispatch(openDrawer({ tabName: 'modify-lesson-schedule' }))
            // this.fullCalendar.getApi().updateSize()
        } else {
            this.repeatedLessonTask = lessonTask
            this.repeatLessonTitle = lessonTask.name
            this.hideModifyLessonEventModal()
            this.showRepeatLessonOptionModal()
        }
    }
    onReserveMember(cmpReturn: { lessonTask: CalendarTask; usersBooked: UserBooked[] }) {
        this.showReserveModal(cmpReturn.lessonTask, cmpReturn.usersBooked)
    }

    public generalEventData: CalendarTask = undefined
    public doShowModifyGeneralEventModal = false
    showModifyGeneralEventModal() {
        this.doShowModifyGeneralEventModal = true
    }
    hideModifyGeneralEventModal() {
        this.doShowModifyGeneralEventModal = false
    }
    onDeleteGeneralEvent(generalTask: CalendarTask) {
        this.hideModifyGeneralEventModal()
        if (generalTask.calendar_task_group_id) {
            this.showDelRepeatGeneralModal(generalTask)
        } else {
            this.showDeleteEventModal(generalTask, 'general')
        }
    }
    onModifyGeneralEvent(generalTask: CalendarTask) {
        // this.fullCalendar.getApi().updateSize()
        if (!generalTask.calendar_task_group_id) {
            this.hideModifyGeneralEventModal()

            this.nxStore.dispatch(ScheduleActions.setModifyGeneralEvent({ event: generalTask }))
            this.nxStore.dispatch(openDrawer({ tabName: 'modify-general-schedule' }))
            // this.fullCalendar.getApi().updateSize()
        } else {
            this.repeatedGeneralTask = generalTask
            this.repeatGeneralTitle = generalTask.name
            this.hideModifyGeneralEventModal()
            this.showRepeatGeneralOptionModal()
        }
    }

    public doShowDelRepeatGeneralModal = false
    public delRepeatGeneralData: CalendarTask = undefined
    public delRepeatGeneralType: DeleteMode = undefined
    public delRepeatGeneralTitle = ''
    showDelRepeatGeneralModal(task: CalendarTask) {
        this.delRepeatGeneralData = task
        this.delRepeatGeneralTitle = task.name
        this.doShowDelRepeatGeneralModal = true
    }
    hideDelRepeatGeneralModal() {
        this.doShowDelRepeatGeneralModal = false
    }
    onDelRepeatGeneralConfirm(deleteType: DeleteMode) {
        this.delRepeatGeneralType = deleteType
        // !! 아직 예약 부분은 API문제로 구현 불가
        // if (this.delRepeatLessonData.class.reservation.length > 0) {
        //     this.reservedLessonType = 'repeat'
        //     this.showReservedDelLessonModal()
        //     this.hideDelRepeatLessonModal()
        // } else {
        this.deleteRepeatGeneralEvent()
        this.hideDelRepeatGeneralModal()
        // }
    }
    onDelRepeatGeneralCancel() {
        this.hideDelRepeatGeneralModal()
    }
    deleteRepeatGeneralEvent(fn?: () => void) {
        this.CenterCalendarService.deleteCalendarTask(
            this.center.id,
            this.curCenterCalendar$_.id,
            String(this.delRepeatGeneralData.id),
            this.delRepeatGeneralType
        ).subscribe((_) => {
            this.getTaskList(this.selectedDateViewType)
            this.hideDelRepeatGeneralModal()
            this.nxStore.dispatch(
                showToast({
                    text: `'${this.wordService.ellipsis(
                        this.delRepeatGeneralData.name,
                        7
                    )}' 기타 일정이 삭제되었습니다.`,
                })
            )
            this.delRepeatGeneralData = undefined
            this.delRepeatGeneralType = undefined
            fn ? fn() : null
        })
    }

    // - // lesson reserve modal and cancel modal
    //  reserve modal vars and funcs
    public reserveLessonData: CalendarTask = undefined
    public usersBookedLength = 0
    public doShowReserveModal = false
    showReserveModal(reserveLessonData: CalendarTask, usersBooked: UserBooked[]) {
        this.usersBookedLength = usersBooked.length
        this.reserveLessonData = reserveLessonData
        this.doShowReserveModal = true
        this.hideModifyLessonEventModal()
    }
    hideReserveModal() {
        this.doShowReserveModal = false
    }
    onReserveModalCancel() {
        this.hideReserveModal()
        this.showModifyLessonEventModal()
        this.reserveLessonData = undefined
    }
    onReserveModalConfirm(cmpReturn: { usersAbleToBook: UserAbleToBook[] }) {
        console.log('onReserveModalConfirm : ', cmpReturn, {
            centerId: this.center.id,
            reserveLesData: this.reserveLessonData.id,
        })

        // !! user_membership_ids를 추가하는 방법 다시 생각해야 함.
        this.CenterCalendarService.reserveTask(this.center.id, this.curCenterCalendar$_.id, this.reserveLessonData.id, {
            user_membership_ids: cmpReturn.usersAbleToBook.map((v) => v.user_memberships[0].id),
        }).subscribe(() => {
            this.hideReserveModal()
            this.showModifyLessonEventModal()
            this.nxStore.dispatch(showToast({ text: `${this.reserveLessonData.name} 일정에 회원이 예약되었습니다.` }))

            this.getTaskList(this.selectedDateViewType, (eventList) => {
                this.updateLessonEventData(this.lessonEventData.id, eventList)
                this.reserveLessonData = undefined
            })
        })
    }

    // cancel reserve modal vars and funcs
    public cancelReserveText = {
        text: '회원의 예약을 취소하시겠어요? 😮',
        subText: `회원의 예약을 취소할 경우,
        회원에게 예약 취소 알림이 발송됩니다.`,
        cancelButtonText: '뒤로',
        confirmButtonText: '예약 취소',
    }
    public beCanceledReservationData: { taskReservation: UserBooked; lessonData: CalendarTask } = undefined
    doShowCancelReserveModal = false
    showCancelReserveModal(cancelData: { taskReservation: UserBooked; lessonData: CalendarTask }) {
        this.beCanceledReservationData = cancelData
        this.doShowCancelReserveModal = true
        this.hideModifyLessonEventModal()
    }
    hideCancelReserveModal() {
        this.doShowCancelReserveModal = false
    }
    onCancelReserveModalCancel() {
        this.hideCancelReserveModal()
        this.showModifyLessonEventModal()
    }
    onCancelReserveModalConfirm() {
        this.CenterCalendarService.cancelReservedTask(
            this.center.id,
            this.curCenterCalendar$_.id,
            this.beCanceledReservationData.lessonData.id,
            this.beCanceledReservationData.taskReservation.booking_id
        ).subscribe((__) => {
            this.hideReserveModal()
            this.showModifyLessonEventModal()
            const userName = this.beCanceledReservationData.taskReservation.name
            this.nxStore.dispatch(
                showToast({
                    text: `${userName}님의 예약이 취소되었습니다.`,
                })
            )
            this.getTaskList(this.selectedDateViewType, (eventList) => {
                this.updateLessonEventData(this.lessonEventData.id, eventList)
                this.beCanceledReservationData = undefined
            })
        })
        this.hideCancelReserveModal()
        this.showModifyLessonEventModal()
    }

    // - // delete event modal -----------------------------------
    public deleteEventText = {
        text: '',
        subText: `일정을 삭제하실 경우,
            삭제된 일정 정보는 복구하실 수 없어요.`,
        cancelButtonText: '취소',
        confirmButtonText: '일정 삭제',
    }
    public deletedEvent: CalendarTask = undefined
    public deleteEventType: 'general' | 'lesson'
    public doShowDeleteEventModal = false
    showDeleteEventModal(task: CalendarTask, eventType: 'general' | 'lesson') {
        this.deletedEvent = task
        this.deleteEventType = eventType
        this.deleteEventText.text = `'${task.name}' 일정을 삭제하시겠어요?`
        this.doShowDeleteEventModal = true
    }
    hideDeleteEventModal() {
        this.doShowDeleteEventModal = false
    }
    onDeleteEventCancel() {
        this.hideDeleteEventModal()
    }
    onDeleteEventConfirm() {
        if (this.deleteEventType == 'general') {
            this.CenterCalendarService.deleteCalendarTask(
                this.center.id,
                this.curCenterCalendar$_.id,
                String(this.deletedEvent.id),
                'one'
            ).subscribe((_) => {
                this.getTaskList(this.selectedDateViewType)
                this.hideDeleteEventModal()
                this.nxStore.dispatch(
                    showToast({
                        text: `'${this.wordService.ellipsis(this.deletedEvent.name, 7)}' 기타 일정이 삭제되었습니다.`,
                    })
                )
                this.deletedEvent = undefined
            })
        } else {
            if (this.deletedEvent.class.booked_count > 0) {
                this.reservedLessonType = 'single'
                this.hideDeleteEventModal()
                this.showReservedDelLessonModal()
            } else {
                this.deleteSingleLessonEvent()
            }
        }
    }

    deleteSingleLessonEvent(fn?: () => void) {
        this.CenterCalendarService.deleteCalendarTask(
            this.center.id,
            this.curCenterCalendar$_.id,
            String(this.deletedEvent.id),
            'one'
        ).subscribe((_) => {
            this.getTaskList(this.selectedDateViewType)
            this.hideDeleteEventModal()
            this.nxStore.dispatch(
                showToast({
                    text: `'${this.wordService.ellipsis(this.deletedEvent.name, 7)}' 수업 일정이 삭제되었습니다.`,
                })
            )
            this.deletedEvent = undefined
            fn ? fn() : null
        })
    }

    // - // 반복 수업 일정 삭제 모달 ------------------------------
    public doShowDelRepeatLessonModal = false
    public delRepeatLessonData: CalendarTask = undefined
    public delRepeatType: DeleteMode = undefined
    public delRepeatLessonTitle = ''
    showDelRepeatLessonModal(task: CalendarTask) {
        this.delRepeatLessonData = task
        this.delRepeatLessonTitle = task.name
        this.doShowDelRepeatLessonModal = true
    }
    hideDelRepeatLessonModal() {
        this.doShowDelRepeatLessonModal = false
    }
    onDelRepeatLessonConfirm(deleteType: DeleteMode) {
        this.delRepeatType = deleteType
        // !! 아직 예약 부분은 API문제로 구현 불가
        // if (this.delRepeatLessonData.class.reservation.length > 0) {
        //     this.reservedLessonType = 'repeat'
        //     this.showReservedDelLessonModal()
        //     this.hideDelRepeatLessonModal()
        // } else {
        this.deleteRepeatLessonEvent()
        this.hideDelRepeatLessonModal()
        // }
    }
    onDelRepeatLessonCancel() {
        this.hideDelRepeatLessonModal()
    }
    deleteRepeatLessonEvent(fn?: () => void) {
        this.CenterCalendarService.deleteCalendarTask(
            this.center.id,
            this.curCenterCalendar$_.id,
            String(this.delRepeatLessonData.id),
            this.delRepeatType
        ).subscribe((_) => {
            this.getTaskList(this.selectedDateViewType)
            this.hideDelRepeatLessonModal()
            this.nxStore.dispatch(
                showToast({
                    text: `'${this.wordService.ellipsis(
                        this.delRepeatLessonData.name,
                        7
                    )}' 수업 일정이 삭제되었습니다.`,
                })
            )
            this.delRepeatLessonData = undefined
            this.delRepeatType = undefined
            fn ? fn() : null
        })
    }

    // - // 수업 일정 삭제 시 예약 있을 때 알림 모달 ------------------------
    public deleteLessonEventText = {
        text: '앗! 해당 일정에 예약된 회원이 있어요.😮',
        subText: `이미 예약한 회원이 있는 경우,
            예약이 강제 취소되며 회원에게 알림이 발송됩니다.`,
        cancelButtonText: '취소',
        confirmButtonText: '일정 삭제',
    }
    public doShowReservedDelLessonModal = false

    // !! 확인 필요
    public reservedLessonType: 'single' | 'repeat' = undefined
    showReservedDelLessonModal() {
        this.doShowReservedDelLessonModal = true
    }
    hideReservedDelLessonModal() {
        this.doShowReservedDelLessonModal = false
    }
    onReservedDelLessonConfrim() {
        if (this.reservedLessonType == 'single') {
            this.deleteSingleLessonEvent(() => {
                this.hideReservedDelLessonModal()
            })
        } else if (this.reservedLessonType == 'repeat') {
            this.deleteRepeatLessonEvent(() => {
                this.hideReservedDelLessonModal()
            })
        }
    }
    onReservedDelLessonCancel() {
        this.hideReservedDelLessonModal()
    }
}
