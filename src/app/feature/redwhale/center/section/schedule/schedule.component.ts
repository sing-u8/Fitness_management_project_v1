import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core'
import { Location } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router'

import _ from 'lodash'
import dayjs from 'dayjs'

// fullcalendar
import { FullCalendarComponent, CalendarOptions } from '@fullcalendar/angular'
import { EventClickArg, EventHoveringArg, EventDropArg } from '@fullcalendar/common'
import koLocale from '@fullcalendar/core/locales/ko'

// services
import { StorageService } from '@services/storage.service'
import { CenterCalendarService } from '@services/center-calendar.service'
import { CenterService } from '@services/center.service'
import { CenterUsersService } from '@services/center-users.service'

// schemas
import { Center } from '@schemas/center'
import { Calendar } from '@schemas/calendar'

// rxjs
import { Observable, Subject, lastValueFrom } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

// ngrx
import { Store, select } from '@ngrx/store'
import { drawerSelector } from '@appStore/selectors'
import { showToast } from '@appStore/actions/toast.action'
import { openDrawer, closeDrawer, setScheduleDrawerIsReset } from '@appStore/actions/drawer.action'

import * as FromSchedule from '@centerStore/reducers/sec.schedule.reducer'
import * as ScheduleSelector from '@centerStore/selectors/sec.schedule.selector'
import * as ScheduleActions from '@centerStore/actions/sec.schedule.actions'
import { CenterUser } from '@schemas/center-user'

// temp
export type GymOperatingTime = { start: string; end: string }
export type ViewType = 'resourceTimeGridDay' | 'timeGridWeek' | 'dayGridMonth'

@Component({
    selector: 'schedule',
    templateUrl: './schedule.component.html',
    styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit, AfterViewInit, OnDestroy {
    public center: Center
    public user: CenterUser
    public unsubscriber$ = new Subject<void>()

    public dateViewTypes = {
        day: { name: '일', type: 'resourceTimeGridDay' },
        week: { name: '주', type: 'timeGridWeek' },
        month: { name: '월', type: 'dayGridMonth' },
    }
    public selectedDateViewType: ViewType = 'resourceTimeGridDay' // undefined
    public eventList = []

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
    public activeStart: string
    public activeEnd: string
    public calendarTitle: string

    // ngrx vars
    public instructorList$_: FromSchedule.InstructorType[]
    public lectureFilter$_: FromSchedule.LectureFilter

    constructor(
        private nxStore: Store,
        private storageService: StorageService,
        private CenterCalendarService: CenterCalendarService,
        // private gymDashboardStateService: GymDashboardStateService,
        // private gymLessonService: GymLessonService,
        private centerService: CenterService,
        private centerUsersService: CenterUsersService,
        private renderer: Renderer2,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private location: Location
    ) {
        this.center = this.storageService.getCenter()
        this.nxStore
            .pipe(select(ScheduleSelector.operatingHour), takeUntil(this.unsubscriber$))
            .subscribe((operatingHour) => {
                this.operatingTime = _.cloneDeep(operatingHour)
            })
    }

    async ngOnInit(): Promise<void> {
        const userData = this.storageService.getUser()
        // console.log('before get user using api')
        // this.user = (await lastValueFrom(this.centerUsersService.getUserList(this.center.id))).find(
        //     (centerUser) => centerUser.id == userData.id
        // )
        // console.log('after get user using api : ', this.user)
        this.nxStore
            .pipe(select(ScheduleSelector.doLessonsExist), takeUntil(this.unsubscriber$))
            .subscribe((doExist) => {
                this.doShowEmptyLessonModal = doExist ? false : true
            })

        this.nxStore
            .pipe(select(ScheduleSelector.curCenterId), takeUntil(this.unsubscriber$))
            .subscribe((curCenterid) => {
                console.log('select(ScheduleSelector.curCenterId) !!!!!')
                if (curCenterid != this.center.id) {
                    console.log('select(ScheduleSelector.curCenterId)  ---curCenterid != this.center.id !!!!!')
                    this.nxStore.dispatch(ScheduleActions.resetAll())
                    this.nxStore.dispatch(ScheduleActions.startLoadScheduleState())
                }
            })
        this.nxStore
            .pipe(select(ScheduleSelector.instructorList), takeUntil(this.unsubscriber$))
            .subscribe((instructorList) => {
                this.instructorList$_ = _.cloneDeep(instructorList)
            })
        this.nxStore
            .pipe(select(ScheduleSelector.lectureFilter), takeUntil(this.unsubscriber$))
            .subscribe((lectureFilter) => {
                this.lectureFilter$_ = _.cloneDeep(lectureFilter)
            })

        this.initDatePickerData()
        this.initFullCalendar()
    }
    ngAfterViewInit(): void {
        this.setCalendarTitle('timeGridWeek')

        const calView = this.fullCalendar.getApi().view
        this.activeStart = dayjs(calView.activeStart).format('YYYY-MM-DD')
        this.activeEnd = dayjs(calView.activeEnd).format('YYYY-MM-DD')
        this.getCalendarIds(() => {
            this.getTaskList(this.selectedDateViewType)
        })
    }
    ngOnDestroy(): void {
        this.closeDrawer()
        this.unsubscriber$.next()
        this.unsubscriber$.complete()
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
    public operatingDayOfWeek: { value: number[] } = { value: [] }
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
    }) {
        this.centerService
            .updateCenter(this.center.id, {
                day_of_the_week: Return.operatingDayOfWeek.value,
                open_time: Return.operatingTime.start.slice(0, 5),
                close_time: Return.operatingTime.end.slice(0, 5),
            })
            .subscribe((gymData) => {
                // UI가 두 번 변함!!!
                this.fullCalendar.options = {
                    ...this.fullCalendar.options,
                    ...{
                        hiddenDays: this.getHiddenDays(Return.operatingDayOfWeek.value),
                        slotMinTime: Return.operatingTime.start,
                        slotMaxTime: Return.operatingTime.end,
                    },
                }
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
        console.log('initDatePickerData(): ', this.datePickerData)
    }
    onDatePickerClick(rDate: { date: string }) {
        console.log('onDatePickerClick: ', rDate.date)
        const calendarApi = this.fullCalendar.getApi()
        calendarApi.view.calendar.gotoDate(rDate.date)
        // this.setCalendarTitle(this.selectedDateViewType)

        const calView = this.fullCalendar.getApi().view
        this.activeStart = dayjs(calView.activeStart).format('YYYY-MM-DD')
        this.activeEnd = dayjs(calView.activeEnd).format('YYYY-MM-DD')
        this.getTaskList(this.selectedDateViewType)
    }
    onWeekPickerClick(rDate: { startDate: string; endDate: string }) {
        console.log('onWeekPickerClick: ', rDate)
        const calendarApi = this.fullCalendar.getApi()
        calendarApi.view.calendar.gotoDate(rDate.startDate)
        // this.setCalendarTitle(this.selectedDateViewType)

        const calView = calendarApi.view
        this.activeStart = dayjs(calView.activeStart).format('YYYY-MM-DD')
        this.activeEnd = dayjs(calView.activeEnd).format('YYYY-MM-DD')
        this.getTaskList(this.selectedDateViewType)
    }

    // --------------------- functions for top of full calendar ---------------------

    changeView(viewType: ViewType) {
        this.selectedDateViewType = viewType

        const calendarApi = this.fullCalendar.getApi()
        calendarApi.changeView(viewType)

        this.activeStart = dayjs(calendarApi.view.activeStart).format('YYYY-MM-DD')
        this.activeEnd = dayjs(calendarApi.view.activeEnd).format('YYYY-MM-DD')
        console.log('activeStart, activeEnd: ', this.activeStart, '; ', this.activeEnd)

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
        this.activeStart = dayjs(calView.activeStart).format('YYYY-MM-DD')
        this.activeEnd = dayjs(calView.activeEnd).format('YYYY-MM-DD')

        this.setDatePickerWhenViewChange(this.selectedDateViewType)
        this.setCalendarTitle(this.selectedDateViewType)
        this.getTaskList(this.selectedDateViewType)
    }

    setDatePickerWhenViewChange(viewType: ViewType) {
        const calendarApi = this.fullCalendar.getApi()

        const activeStart = dayjs(calendarApi.view.activeStart).format('YYYY-MM-DD')
        const activeEnd = dayjs(calendarApi.view.activeEnd).subtract(1, 'day').format('YYYY-MM-DD')
        console.log("dayjs(calendarApi.view.activeEnd).subtract(1, 'day').format('YYYY-MM-DD') : ", activeEnd)

        switch (viewType) {
            case 'resourceTimeGridDay':
                this.datePickerData = { date: activeStart }
                break
            case 'timeGridWeek':
                this.weekPickerData = { startDate: activeStart, endDate: activeEnd }
                break
            case 'dayGridMonth':
                this.datePickerData = { date: dayjs().format('YYYY-MM-DD') }
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

    // calendar service
    public calIds: Array<Calendar> = []
    getCalendarIds(fn?: () => void) {
        this.CenterCalendarService.getCalendars(this.center.id, {}).subscribe((calIds) => {
            this.calIds = calIds
            fn ? fn() : null
        })
    }

    getTaskList(viewType: ViewType, calendarId?: string) {
        console.log('this.activeStart : ', this.activeStart)
        // this.CenterCalendarService.getCalendarTasks(
        //     this.center.id,
        //     calendarId,
        //     this.activeStart,
        //     this.activeEnd
        // ).subscribe((tasks) => {
        //     this.eventList = tasks.map((task) => {
        //         console.log('getTaskList  one : ', task)
        //         if (viewType == 'resourceTimeGridDay') {
        //             return {
        //                 title: task.name,
        //                 start: task.start,
        //                 end: task.end,
        //                 resourceId: task.id,
        //                 originItem: task,
        //                 assginee: this.calIds.length > 0 ? _.find(this.calIds, (calId) => calId.id == task.id) : null,
        //                 textColor: '#212121',
        //                 color: task.type_code == 'general' ? '#F6F6F6' : '#FFFFFF',
        //             }
        //         } else {
        //             return {
        //                 title: task.name,
        //                 start: task.start,
        //                 end: task.end,
        //                 originItem: task,
        //                 assginee: this.calIds.length > 0 ? _.find(this.calIds, (calId) => calId.id == task.id) : null,
        //                 textColor: '#212121',
        //                 color: task.type_code == 'general' ? '#F6F6F6' : '#FFFFFF',
        //             }
        //         }
        //     })
        //     console.log('getTaskList - start, end: ', this.activeStart, ', ', this.activeEnd, '; ', viewType)
        //     console.log('getTaskList : ', this.eventList)
        //     // this.setEventsFiltersChange(this.instructorList, this.lectureFilter)
        // })
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

        this.nxStore.dispatch(openDrawer({ tabName: 'general-schedule' }))
        this.nxStore.dispatch(setScheduleDrawerIsReset({ isReset: true }))

        // this.fullCalendar.getApi().updateSize()
    }
    openLessonScheduleDrawer() {
        this.setDrawerDate()

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
        // console.log('initFullCalendar: operatingTime: ', this.operatingTime, hiddenDays)
        this.selectedDateViewType = 'timeGridWeek'
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

            dateClick: this.onDateClick.bind(this),
            eventClick: this.onEventClick.bind(this),
            select: this.onDateSelect.bind(this),
            eventDidMount: this.eventDidMount.bind(this),
            dayCellDidMount: this.dayCellDidMount.bind(this),
            eventMouseEnter: this.eventMouseEnter.bind(this),
            eventMouseLeave: this.eventMouseLeave.bind(this),
            eventDrop: this.eventDrop.bind(this),

            events: [],
            resources: [],
        }
        this.getOperatingData(this.center.id)
    }

    // full calendar event functions
    onEventClick(arg: EventClickArg) {
        // console.log('onEventClick arg: ', arg)
        // if (arg.event.extendedProps.originItem.type == 'general') {
        //     this.generalEventData = arg.event.extendedProps.originItem
        //     this.generalAssignee = _.find(
        //         this.instructorList,
        //         (item) => arg.event.extendedProps.originItem.calendar_id == item.instructor.id
        //     ).instructor
        //     this.showModifyGeneralEventModal()
        // } else {
        //     this.lessonEventData = arg.event.extendedProps.originItem
        //     this.showModifyLessonEventModal()
        // }
    }

    onDateSelect(arg) {
        console.log('onDateSelect: ', arg)
        if (arg.view.type == 'dayGridMonth') {
            if (this.dayCellLeave) {
                this.hideScheduleDropdown()
            }
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
        if (arg.view.type == 'resourceTimeGridDay') {
            // this.gymScheduleState.setSchedulingInstructor(arg.resource.extendedProps.instructorData as Calendar)
        }
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

            if (arg.event.extendedProps.originItem.type == 'general') {
                eventTitleContainerEl.appendChild(eventTimeEl)
                eventTitleEl.classList.add('rw-typo-subtext3')
                eventTitleEl.style.fontSize = '1.1rem'
                eventTitleEl.style.fontWeight = '500'
                eventTitleEl.style.whiteSpace = 'nowrap'
                eventTitleEl.style.color = '#606060'

                if (arg.event.extendedProps.originItem.memo) {
                    eventTimeEl.style.fontSize = '1.1rem'
                    eventTimeEl.style.fontWeight = '400'
                    eventTimeEl.style.whiteSpace = 'nowrap'
                    eventTimeEl.style.color = '#c9c9c9'
                    eventTimeEl.innerHTML = `${arg.event.extendedProps.originItem.memo}`
                } else {
                    eventTitleEl.style.alignItems = 'center'
                    eventTitleEl.style.display = 'flex'
                    eventTitleEl.style.height = '100%'
                    eventTimeEl.style.display = 'none'
                }
            } else {
                eventTitleEl.classList.add('rw-typo-subtext0')
                eventTitleEl.style.fontSize = '1.2rem'
                eventTitleEl.style.fontWeight = '700'
                eventTitleEl.style.whiteSpace = 'nowrap'

                eventTitleContainerEl.appendChild(eventTimeEl)
                eventTimeEl.classList.add('rw-typo-subtext4')
                eventTimeEl.style.color = '#C9C9C9'
                eventTimeEl.style.fontSize = '1.1rem'
                eventTimeEl.innerHTML = `${arg.event.extendedProps.assginee.name} ㆍ ${arg.event.extendedProps.originItem.lesson.reservation.length}/${arg.event.extendedProps.originItem.lesson.people}명`
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
                            height: 105%;
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
            if (arg.event.extendedProps.originItem.type == 'general') {
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
                            height: 105%;
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
        // if (arg.event.extendedProps.originItem.type == 'general') {
        //     const reqBody: UpdateTaskRequestBody = {
        //         option: 'this',
        //         trainer_id: this.storageService.getUser().id,
        //         name: arg.event.extendedProps.originItem.name,
        //         date: dayjs(arg.event.startStr).format('YYYY-MM-DD'),
        //         start_time: dayjs(arg.event.startStr).format('HH:mm:ss'),
        //         end_time: dayjs(arg.event.endStr).format('HH:mm:ss'),
        //         memo: arg.event.extendedProps.originItem.memo,
        //     }
        //     this.gymCalendarService
        //         .updateTask(this.gym.id, String(arg.event.extendedProps.originItem.id), reqBody)
        //         .subscribe((__) => {
        //             this.gymScheduleState.setIsScheduleEventChangedState(true)
        //             this.globalService.showToast(
        //                 `${this.restrictText(arg.event.extendedProps.originItem.name, 8)} 기타 일정이 수정 되었습니다.`
        //             )
        //         })
        // } else {
        //     const eventData: Task = arg.event.extendedProps.originItem as Task
        //     let reqBody: UpdateTaskRequestBody = undefined
        //     if (eventData.repetition_id) {
        //         reqBody = {
        //             option: 'this',
        //             trainer_id: eventData.lesson.trainers[0].id,
        //             lesson_item_id: Number(eventData.lesson.lesson_item_id),
        //             name: eventData.name,
        //             color: eventData.lesson.color,
        //             date: dayjs(arg.event.startStr).format('YYYY-MM-DD'),
        //             start_time: dayjs(arg.event.startStr).format('HH:mm:ss'),
        //             new_repetition_yn: 0,
        //             repetition_start_date: dayjs(eventData.repetition_start_date).format('YYYY-MM-DD'),
        //             repetition_end_date: dayjs(eventData.repetition_end_date).format('YYYY-MM-DD'),
        //             people: eventData.lesson.people,
        //             memo: eventData.memo,
        //             repetition_days: this.getRepeatDayOfWeek(eventData.repetition_code),
        //             reservation_start_day: eventData.lesson.reservation_start_day,
        //             reservation_end_hour: eventData.lesson.reservation_end_hour,
        //             reservation_cancel_end_hour: eventData.lesson.reservation_cancel_end_hour,
        //         }
        //     } else {
        //         reqBody = {
        //             option: 'this',
        //             new_repetition_yn: 0,
        //             trainer_id: eventData.lesson.trainers[0].id,
        //             lesson_item_id: Number(eventData.lesson.lesson_item_id),
        //             name: eventData.name,
        //             color: eventData.lesson.color,
        //             date: dayjs(arg.event.startStr).format('YYYY-MM-DD'),
        //             start_time: dayjs(arg.event.startStr).format('HH:mm:ss'),
        //             people: eventData.lesson.people,
        //             memo: eventData.memo,
        //             reservation_start_day: eventData.lesson.reservation_start_day,
        //             reservation_end_hour: eventData.lesson.reservation_end_hour,
        //             reservation_cancel_end_hour: eventData.lesson.reservation_cancel_end_hour,
        //         }
        //     }
        //     console.log('drop event: ', reqBody)
        //     this.gymCalendarService
        //         .updateTask(this.gym.id, String(eventData.id), reqBody as UpdateTaskRequestBody)
        //         .subscribe((res) => {
        //             this.gymScheduleState.setIsScheduleEventChangedState(true)
        //             this.globalService.showToast(
        //                 `'${this.restrictText(eventData.name, 8)}'' 수업 일정이 수정되었습니다.`
        //             )
        //         })
        // }
    }

    getRepeatDayOfWeek(repeatCode: string) {
        if (!repeatCode) return ''
        if (repeatCode == 'all') {
            return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
        } else if (repeatCode == 'weekdays') {
            return ['mon', 'tue', 'wed', 'thu', 'fri']
        } else if (repeatCode == 'weekend') {
            return ['sun', 'sat']
        } else {
            return _.split(repeatCode, '_')
        }
    }

    public dayCellLeave = true
    dayCellDidMount(arg) {
        // console.log('dayCellDidMount arg: ', arg)

        if (arg.view.type == 'dayGridMonth') {
            console.log('dayCellDidMount =======================')
            if (arg.el.classList.contains('fc-daygrid-day')) {
                // normal daycell element
                const daygridDayTop_el: HTMLElement = arg.el.getElementsByClassName('fc-daygrid-day-top')[0]
                const isToday = arg.el.classList.contains('fc-day-today')
                if (daygridDayTop_el) {
                    console.log('daygridDayTop_el : ', daygridDayTop_el)
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
                        if (this.doShowScheduleDropdown == false) {
                            const bt_pos = addSchButton_el.getBoundingClientRect()
                            this.drawerDate = { startDate: arg.date, endDate: null }
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
    public tooltipText: string = undefined
    @ViewChild('member_schedule_tooltip') member_schedule_tooltip: ElementRef

    setTooltipText(
        status:
            | 'task_end'
            | 'full_amount_people'
            | 'before_reservation_duration'
            | 'after_reservation_duration'
            | 'reservation_available'
    ) {
        this.tooltipText =
            status == 'reservation_available'
                ? '예약을 받고 있어요. 🤗'
                : status == 'full_amount_people'
                ? '정원이 다 찼어요. 🎉'
                : status == 'after_reservation_duration'
                ? '예약이 마감됐어요. 🚫'
                : status == 'task_end'
                ? '종료된 수업이에요. 🚫'
                : 'null'

        return this.tooltipText == 'null' ? false : true
    }
    showTooltip(arg: EventHoveringArg) {
        if (!this.setTooltipText(arg.event.extendedProps['originItem'].status)) return
        const eventTitle_el = arg.el.getElementsByClassName('fc-event-title')[0]
        const eventTitlePos = eventTitle_el.getBoundingClientRect()
        this.renderer.setStyle(this.member_schedule_tooltip.nativeElement, 'display', 'flex')
        this.renderer.setStyle(this.member_schedule_tooltip.nativeElement, 'left', `${eventTitlePos.left + 5}px`)
        this.renderer.setStyle(this.member_schedule_tooltip.nativeElement, 'top', `${eventTitlePos.top - 32}px`)
        // this.member_schedule_tooltip.nativeElement
    }
    hideTooltip() {
        this.renderer.setStyle(this.member_schedule_tooltip.nativeElement, 'display', 'none')
    }

    // ---------------------------------------------------------------------------------------------------------//
}
