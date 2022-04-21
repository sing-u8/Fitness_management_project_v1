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
import { CenterLessonService } from '@services/center-lesson.service'
import { StorageService } from '@services/storage.service'

import { CalendarTask } from '@schemas/calendar-task'
import { ClassCategory } from '@schemas/class-category'
import { ClassItem } from '@schemas/class-item'

@Component({
    selector: 'rw-sch-lesson-modal',
    templateUrl: './sch-lesson-modal.component.html',
    styleUrls: ['./sch-lesson-modal.component.scss'],
})
export class SchLessonModalComponent implements AfterViewChecked, OnChanges {
    @Input() visible: boolean
    @Input() lessonData: CalendarTask

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() delete = new EventEmitter<any>()
    @Output() modify = new EventEmitter<any>()
    @Output() reserveMember = new EventEmitter<any>()
    @Output() cancelReservedMember = new EventEmitter<any>()

    public date: string
    public time: string
    public reservationEnableTime: string
    public reservationCancelEndTime: string

    public repeatText: string

    // !! taskReservation type인데 예약 관련 부분이 없어서 any
    public lessonReservations: Array<any> = []

    public screen_status: 'lesson' | 'reservation' = 'lesson'
    onLessonClick() {
        this.screen_status = 'lesson'
    }

    onReservationClick() {
        this.screen_status = 'reservation'
    }

    changed: boolean
    public isMouseModalDown: boolean

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.isMouseModalDown = false
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && !changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
        if (this.lessonData) {
            this.initDate()
            this.initTime()
            this.getTimeDiff()
            this.getRepeatTimeDiff()
            this.initReservationEnableTime()
            this.initReservationCancelEndTime()
            // ! 나중에 맞는 속성인지 확인 필요
            this.setRepeatDayOfWeek(this.lessonData.repeat_cycle_unit_code)

            this.initLessonCardData()
        }
        console.log('lessonData in g modal: ', this.lessonData)
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
        this.reserveMember.emit(this.lessonData)
    }

    // !! taskReservation type인데 예약 관련 부분이 없어서 any
    onCancelReservedMember(taskReservation: any) {
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
        // if (!this.lessonData.repetition_id) return
        // const timeDiff = dayjs(this.lessonData.repetition_end_date).diff(
        //     dayjs(this.lessonData.repetition_start_date),
        //     'day'
        // )
        // this.repeatTimeDiff = `(${timeDiff}일)`
    }

    initReservationEnableTime() {
        this.reservationEnableTime =
            dayjs(this.lessonData.class.start_booking).format('MM.DD A hh:mm') +
            ' - ' +
            dayjs(this.lessonData.class.end_booking).format('MM.DD A hh:mm') +
            ' 예약 가능'
    }
    initReservationCancelEndTime() {
        this.reservationCancelEndTime =
            dayjs(this.lessonData.class.cancel_booking).format('YYYY.MM.DD A hh:mm') + ' 까지 예약 취소 가능'
    }

    public repeatMather = {
        sun: '일',
        mon: '월',
        tue: '화',
        wed: '수',
        thu: '목',
        fri: '금',
        sat: '토',
    }
    setRepeatDayOfWeek(repeatCode: string) {
        if (repeatCode == 'all') {
            this.repeatText = '매일'
        } else if (repeatCode == 'weekdays') {
            this.repeatText = '평일'
        } else if (repeatCode == 'weekend') {
            this.repeatText = '주말'
        } else {
            this.repeatText = _.split(repeatCode, '_')
                .reduce((acc, cur) => {
                    return acc + this.repeatMather[cur] + ', '
                }, '')
                .slice(0, -2)
        }
        console.log('setRepeatDayOfWeek: ', this.repeatText)
    }

    public lessonCardData = {
        categName: '',
        lessonName: '',
        duration: 0,
        lessonType: '',
        instructor: undefined,
    }
    initLessonCardData() {
        this.lessonCardData = {
            categName: this.lessonData.class.category_name,
            lessonName: this.lessonData.class.name,
            duration: this.lessonData.class.duration,
            lessonType: this.lessonData.class.type_code == 'class_item_type_onetoone' ? '1:1 수업' : '그룹 수업',
            instructor: this.lessonData.responsibility.center_user_name,
        }
    }
}
