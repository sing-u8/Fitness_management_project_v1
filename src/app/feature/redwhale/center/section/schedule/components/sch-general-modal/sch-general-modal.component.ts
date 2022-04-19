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
import { CenterUsersService } from '@services/center-users.service'

import { CalendarTask } from '@schemas/calendar-task'
import { Calendar } from '@schemas/calendar'
import { CenterUser } from '@schemas/center-user'

@Component({
    selector: 'rw-sch-general-modal',
    templateUrl: './sch-general-modal.component.html',
    styleUrls: ['./sch-general-modal.component.scss'],
})
export class SchGeneralModalComponent implements AfterViewChecked, OnChanges {
    @Input() visible: boolean
    @Input() generalData: CalendarTask
    @Input() assignee: Calendar

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() delete = new EventEmitter<any>()
    @Output() modify = new EventEmitter<any>()

    public date: string
    public time: string

    changed: boolean

    public isMouseModalDown: boolean

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private centerCalendarService: CenterCalendarService,
        private centerUsersService: CenterUsersService,
        private storageService: StorageService
    ) {
        this.isMouseModalDown = false
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
        if (this.generalData) {
            this.initDate()
            this.initTime()
            this.setSelectedStaff(this.generalData)
        }
        console.log('generalData in g modal: ', this.generalData)
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
    }
    onDelete() {
        this.delete.emit(this.generalData)
    }
    onModify() {
        this.modify.emit(this.generalData)
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }

    // general data funcs
    initDate() {
        this.date = dayjs(this.generalData.start).format('YYYY.MM.DD (dd)')
    }

    initTime() {
        const timeDiff = this.getTimeDiff()
        this.time =
            dayjs(this.generalData.start).format('a hh:mm') +
            ' - ' +
            dayjs(this.generalData.end).format('a hh:mm') +
            ` ${timeDiff}`
    }
    getTimeDiff() {
        const timeDiff = dayjs(this.generalData.end).diff(dayjs(this.generalData.start), 'minute')
        console.log('timeDiff in g modal: ', timeDiff)
        return `(${timeDiff}분)`
    }

    // staff func
    public curStaff: CenterUser = undefined
    setSelectedStaff(calTask: CalendarTask) {
        const instructorId = calTask.responsibility.id
        const center = this.storageService.getCenter()
        this.centerCalendarService.getCalendars(center.id, {}).subscribe((calendarList) => {
            const calendar = _.find(calendarList, (calendar) => {
                return calendar.calendar_user.id == instructorId
            })
            this.centerUsersService.getUserList(center.id, '', '').subscribe((users) => {
                const managers = _.filter(users, (user) => user.role_code != 'member')
                managers.forEach((v) => {
                    calendar.calendar_user.id == v.id ? (this.curStaff = v) : null
                })
            })
        })
    }
}
