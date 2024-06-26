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

import { CenterUser } from '@schemas/center-user'

import { TimeService } from '@services/helper/time.service'

import _ from 'lodash'
import dayjs from 'dayjs'

@Component({
    selector: 'rw-attendance-toast',
    templateUrl: './attendance-toast.component.html',
    styleUrls: ['./attendance-toast.component.scss'],
})
export class AttendanceToastComponent implements OnChanges, AfterViewChecked {
    @Input() visible: boolean
    @Input() member: CenterUser
    @Input() timeOutCount = 3
    @Input() dateToExpired = 7

    @ViewChild('attendanceElement') attendanceElement: ElementRef

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()

    changed: boolean
    timerId = undefined
    _timeOutCount = 0

    imminentDateObj = {
        isImminent: false,
        imminentDate: 0,
    }

    constructor(private el: ElementRef, private renderer: Renderer2, private timeService: TimeService) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && !changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
        if (changes['member'] && !changes['member'].firstChange) {
            if (changes['member'].previousValue != changes['member'].currentValue && this.visible) {
                const remainDate = this.timeService.getRestPeriod(
                    dayjs().format(),
                    this.member.user_membership_in_use_end_date
                )
                if (remainDate <= this.dateToExpired) {
                    this.imminentDateObj = {
                        isImminent: true,
                        imminentDate: remainDate,
                    }
                } else {
                    this.imminentDateObj = {
                        isImminent: false,
                        imminentDate: 0,
                    }
                }
                this.changed = true
            }
        }
    }

    ngAfterViewChecked() {
        if (this.changed) {
            this.changed = false
            clearInterval(this.timerId)

            if (this.visible) {
                this.renderer.addClass(this.attendanceElement.nativeElement, 'display-flex')
                this.setPosition()
                setTimeout(() => {
                    this.renderer.addClass(this.attendanceElement.nativeElement, 'rw-toast-show')
                }, 0)
                this._timeOutCount = this.timeOutCount
                this.timerId = setInterval(() => {
                    this._timeOutCount = this._timeOutCount - 1
                    if (this._timeOutCount <= 0) {
                        this.onCancel()
                        clearInterval(this.timerId)
                    }
                }, 1000)
            } else {
                this.renderer.removeClass(this.attendanceElement.nativeElement, 'rw-toast-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.attendanceElement.nativeElement, 'display-flex')
                }, 200)
                if (!_.isEmpty(this.timerId)) {
                    clearInterval(this.timerId)
                }
            }
        }
    }

    setPosition() {
        const hostPos = document.body.getBoundingClientRect()
        const toastPos = this.attendanceElement.nativeElement.getBoundingClientRect()
        const x = hostPos.width / 2 - toastPos.width / 2
        this.renderer.setStyle(this.attendanceElement.nativeElement, 'left', `${x}px`)
    }

    onCancel(): void {
        this.cancel.emit({})
    }
}
