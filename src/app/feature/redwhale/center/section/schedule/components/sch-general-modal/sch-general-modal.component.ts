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

import { CalendarTask } from '@schemas/calendar-task'
import { Calendar } from '@schemas/calendar'
import { CenterUser } from '@schemas/center-user'
import { CalendarTaskOverview } from '@schemas/calendar-task-overview'
import { Loading } from '@schemas/store/loading'
import { CenterCalendarService } from '@services/center-calendar.service'
import { StorageService } from '@services/storage.service'
import { Center } from '@schemas/center'

@Component({
    selector: 'rw-sch-general-modal',
    templateUrl: './sch-general-modal.component.html',
    styleUrls: ['./sch-general-modal.component.scss'],
})
export class SchGeneralModalComponent implements AfterViewChecked, OnChanges {
    @Input() visible: boolean
    @Input() generalData: CalendarTaskOverview
    @Input() calendarId: string

    @ViewChild('modalBackgroundElement') modalBackgroundElement: ElementRef
    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<void>()
    @Output() delete = new EventEmitter<CalendarTask>()
    @Output() modify = new EventEmitter<CalendarTask>()

    public date: string
    public time: string

    changed: boolean

    public isMouseModalDown: boolean

    public curStaffs: CenterUser[] = []

    public center: Center
    public generalTask: CalendarTask
    public isGeneralTaskLoading: Loading = 'idle'
    getLessonTask(cto: CalendarTaskOverview) {
        this.isGeneralTaskLoading = 'pending'
        this.centerCalendarService
            .getCalendarTasksDetail(this.center.id, this.calendarId, cto.id)
            .subscribe((calTask) => {
                this.generalTask = calTask
                this.isGeneralTaskLoading = 'done'
                this.curStaffs = _.orderBy(calTask.responsibility, 'name')
            })
    }

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private centerCalendarService: CenterCalendarService,
        private storageService: StorageService
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

        if (this.generalData) {
            let isAnotherTask = false
            if (
                (!changes['generalData']?.previousValue && changes['generalData']?.currentValue) ||
                (changes['generalData']?.previousValue &&
                    changes['generalData'].previousValue?.id != changes['generalData'].currentValue?.id)
            ) {
                isAnotherTask = true
                this.getLessonTask(this.generalData)
            }
            this.initDate()
            this.initTime()
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
        this.cancel.emit()
    }
    onDelete() {
        if (this.isGeneralTaskLoading != 'done') return
        this.delete.emit(this.generalTask)
    }
    onModify() {
        if (this.isGeneralTaskLoading != 'done') return
        this.modify.emit(this.generalTask)
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
        return `(${timeDiff}분)`
    }
}
