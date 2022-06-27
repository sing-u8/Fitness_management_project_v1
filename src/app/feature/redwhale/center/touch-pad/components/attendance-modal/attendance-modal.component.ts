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

import { UserLocker } from '@schemas/user-locker'
import { UserMembership } from '@schemas/user-membership'

import { TimeService } from '@services/helper/time.service'

@Component({
    selector: 'rw-attendance-modal',
    templateUrl: './attendance-modal.component.html',
    styleUrls: ['./attendance-modal.component.scss'],
})
export class AttendanceModalComponent implements AfterViewChecked, OnChanges {
    @Input() visible: boolean
    @Input() memberName: string
    @Input() lockerList: Array<UserLocker>
    @Input() membershipList: Array<UserMembership>

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<any>()

    public timeOutCount: number
    public timeOutId

    public DayJs = dayjs

    changed: boolean

    public isMouseModalDown: boolean

    constructor(private el: ElementRef, private renderer: Renderer2, private timeService: TimeService) {
        this.isMouseModalDown = false
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && !changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
                if (this.visible) {
                    this.initCloseCount()
                }
            }

            console.log('AttendanceModalComponent: ', this.memberName, this.lockerList, this.membershipList)
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
    }

    onConfirm(): void {
        this.confirm.emit({})
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }

    // close number function
    initCloseCount() {
        this.timeOutCount = 3
        this.timeOutId = setInterval(() => {
            this.timeOutCount = this.timeOutCount - 1
            if (this.timeOutCount == 0) {
                this.onCancel()
                clearInterval(this.timeOutId)
            }
        }, 1000)
    }
}
