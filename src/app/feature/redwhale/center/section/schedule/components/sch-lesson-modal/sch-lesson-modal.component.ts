import {
    Component,
    Input,
    ElementRef,
    Renderer2,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    AfterViewChecked,
    ViewChild,
} from '@angular/core'
import dayjs from 'dayjs'
import _ from 'lodash'

import { CenterCalendarService } from '@services/center-calendar.service'
import { StorageService } from '@services/storage.service'
import { CalendarTaskService } from '@services/helper/calendar-task.service'

import { CalendarTask } from '@schemas/calendar-task'
import { UserBooked } from '@schemas/user-booked'
import { Center } from '@schemas/center'
import { CalendarTaskOverview } from '@schemas/calendar-task-overview'
import { Loading } from '@schemas/store/loading'

const dayOfWeekInit = [
    { key: 0, name: '일', selected: false },
    { key: 1, name: '월', selected: false },
    { key: 2, name: '화', selected: false },
    { key: 3, name: '수', selected: false },
    { key: 4, name: '목', selected: false },
    { key: 5, name: '금', selected: false },
    { key: 6, name: '토', selected: false },
]
@Component({
    selector: 'rw-sch-lesson-modal',
    templateUrl: './sch-lesson-modal.component.html',
    styleUrls: ['./sch-lesson-modal.component.scss'],
})
export class SchLessonModalComponent implements AfterViewChecked, OnChanges {
    @Input() visible: boolean
    @Input() lessonData: CalendarTaskOverview
    @Input() responsibilityCalId: string

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() delete = new EventEmitter<any>()
    @Output() modify = new EventEmitter<any>()
    @Output() reserveMember = new EventEmitter<{ lessonTask: CalendarTask; usersBooked: UserBooked[] }>()
    @Output() cancelReservedMember = new EventEmitter<any>()

    public center: Center

    public date: string
    public time: string
    public reservationEnableTime: string
    public reservationCancelEndTime: string

    public lessonTask: CalendarTask
    public isLessonTaskLoading: Loading = 'idle'
    public getLessonTask(cto: CalendarTaskOverview) {
        this.isLessonTaskLoading = 'pending'
        this.centerCalendarService
            .getCalendarTasksDetail(this.center.id, this.responsibilityCalId, cto.id)
            .subscribe((calTask) => {
                this.lessonTask = calTask
                this.initReservationEnableTime()
                this.initReservationCancelEndTime()
                this.initLessonCardData()
                this.getLessonCalendarTaskStatus()
                this.isLessonTaskLoading = 'done'
            })
    }

    public repeatText: string

    public screen_status: 'lesson' | 'reservation' = 'lesson'
    onLessonClick() {
        this.screen_status = 'lesson'
    }

    onReservationClick() {
        this.screen_status = 'reservation'
    }

    changed: boolean
    public isMouseModalDown: boolean

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private centerCalendarService: CenterCalendarService,
        private storageService: StorageService,
        private calendarTaskHelperService: CalendarTaskService
    ) {
        this.isMouseModalDown = false
        this.center = this.storageService.getCenter()
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && !changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
        if (this.lessonData) {
            let isAnotherLesson = false
            if (
                (!changes['lessonData']?.previousValue && changes['lessonData']?.currentValue) ||
                (changes['lessonData']?.previousValue &&
                    changes['lessonData'].previousValue?.id != changes['lessonData'].currentValue?.id)
            ) {
                isAnotherLesson = true
                this.getLessonTask(this.lessonData)
            }
            this.setRepeatDayOfWeek()
            this.getRepeatTimeDiff()
            this.getTimeDiff()
            this.initTime()
            this.initDate()
            this.getUsersBooked(isAnotherLesson)
        }
    }

    ngAfterViewChecked() {
        if (this.changed) {
            this.changed = false

            if (this.visible) {
                this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'display-block')
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
            }
        }
    }

    onCancel(): void {
        this.cancel.emit({})
        this.screen_status = 'lesson'
    }

    onDelete() {
        this.delete.emit(this.lessonData)
        this.screen_status = 'lesson'
    }
    onModify() {
        this.modify.emit(this.lessonData)
    }
    onReserveMember() {
        this.reserveMember.emit({ lessonTask: this.lessonTask, usersBooked: this.userBookeds })
    }

    onCancelReservedMember(taskReservation: UserBooked) {
        this.cancelReservedMember.emit({ taskReservation: taskReservation, lessonData: this.lessonData })
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }

    // lesson data funcs
    initDate() {
        this.date = dayjs(this.lessonData.start).format('YYYY.MM.DD (dd)')
    }

    initTime() {
        const timeDiff = this.getTimeDiff()
        this.time =
            dayjs(this.lessonData.start).format('a hh:mm') +
            ' - ' +
            dayjs(this.lessonData.end).format('a hh:mm') +
            ` ${timeDiff}`
    }
    getTimeDiff() {
        const timeDiff = dayjs(this.lessonData.end).diff(dayjs(this.lessonData.start), 'minute')
        return `(${timeDiff}분)`
    }

    public repeatTimeDiff = ''
    getRepeatTimeDiff() {
        if (!this.lessonData.calendar_task_group_id) return
        const timeDiff =
            dayjs(this.lessonData.repeat_end_date).diff(dayjs(this.lessonData.repeat_start_date), 'day') + 1
        this.repeatTimeDiff = `(${timeDiff}일)`
    }

    initReservationEnableTime() {
        this.reservationEnableTime =
            dayjs(this.lessonTask.class.start_booking).format('MM.DD A hh:mm') +
            ' - ' +
            dayjs(this.lessonTask.class.end_booking).format('MM.DD A hh:mm') +
            ' 예약 가능'
    }
    initReservationCancelEndTime() {
        this.reservationCancelEndTime =
            dayjs(this.lessonTask.class.cancel_booking).format('YYYY.MM.DD A hh:mm') + ' 까지 예약 취소 가능'
    }

    // 일정 반복 기간 변수 및 함수
    public dayOfWeek = _.cloneDeep(dayOfWeekInit)
    initDayOfWeek() {
        const _dayOfWeek = _.cloneDeep(dayOfWeekInit)

        _.forEach(
            _.map(_.split(this.lessonData.repeat_day_of_the_week, ','), (v) => _.toNumber(v)),
            (day) => {
                _.forEach(_dayOfWeek, (dayObj, idx) => {
                    if (dayObj.key == day) {
                        _dayOfWeek[idx].selected = true
                    }
                })
            }
        )

        console.log(
            'init day of week : ',
            _dayOfWeek,
            this.lessonData.repeat_day_of_the_week,
            _.split(this.lessonData.repeat_day_of_the_week, ','),
            _.map(_.split(this.lessonData.repeat_day_of_the_week, ','), (v) => _.toNumber(v))
        )
        this.dayOfWeek = _dayOfWeek
    }

    setRepeatDayOfWeek() {
        this.initDayOfWeek()
        if (_.every(this.dayOfWeek, ['selected', true])) {
            this.repeatText = '매일'
        } else if (
            this.dayOfWeek[0].selected == true &&
            this.dayOfWeek[1].selected == false &&
            this.dayOfWeek[2].selected == false &&
            this.dayOfWeek[3].selected == false &&
            this.dayOfWeek[4].selected == false &&
            this.dayOfWeek[5].selected == false &&
            this.dayOfWeek[6].selected == true
        ) {
            this.repeatText = '주말'
        } else if (
            this.dayOfWeek[0].selected == false &&
            this.dayOfWeek[1].selected == true &&
            this.dayOfWeek[2].selected == true &&
            this.dayOfWeek[3].selected == true &&
            this.dayOfWeek[4].selected == true &&
            this.dayOfWeek[5].selected == true &&
            this.dayOfWeek[6].selected == false
        ) {
            this.repeatText = '평일'
        } else {
            const selectedDays = _.filter(this.dayOfWeek, ['selected', true])
            let text = ''
            _.forEach(selectedDays, (value, idx, list) => {
                text += idx == list.length - 1 ? value.name : value.name + ', '
            })
            this.repeatText = text
        }
    }

    //
    public lessonCardData = {
        categName: '',
        lessonName: '',
        duration: 0,
        lessonType: '',
        instructor: undefined,
    }
    initLessonCardData() {
        const insts = _.orderBy(this.lessonTask.responsibility, 'name')
        this.lessonCardData = {
            categName: this.lessonTask.class.category_name,
            lessonName: this.lessonTask.class.name,
            duration: this.lessonTask.class.duration,
            lessonType: this.lessonTask.class.type_code == 'class_item_type_onetoone' ? '1:1 수업' : '그룹 수업',
            instructor:
                this.lessonTask.responsibility.length > 1 ? insts[0].name + ` 외 ${insts.length - 1}명` : insts[0].name,
        }
    }

    // reservation vars and funcs
    public userBookeds: Array<UserBooked> = []
    public isUsersBookedInitialized = false

    getUsersBooked(isAnotherLesson: boolean) {
        if (isAnotherLesson) this.isUsersBookedInitialized = false
        this.centerCalendarService
            .getReservedUsers(this.center.id, this.responsibilityCalId, this.lessonData.id)
            .subscribe((userBookeds: UserBooked[]) => {
                this.userBookeds = userBookeds
                this.isUsersBookedInitialized = true
            })
    }

    public isBookingEnd = false
    public isBookable = false
    public isCancelBookingEnd = false
    public isTaskEnd = false

    getLessonCalendarTaskStatus() {
        this.isBookingEnd = this.calendarTaskHelperService.isBookingEnd(this.lessonData)
        this.isBookable = this.calendarTaskHelperService.isBookable(this.lessonData)
        this.isCancelBookingEnd = this.calendarTaskHelperService.isCancelBookingEnd(this.lessonData)
        this.isTaskEnd = this.calendarTaskHelperService.isTaskEnd(this.lessonData)
    }
}
