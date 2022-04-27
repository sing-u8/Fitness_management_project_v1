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
    AfterViewInit,
    ViewChild,
} from '@angular/core'

import _ from 'lodash'
import dayjs from 'dayjs'

// import { MembershipTicket, LockerTicket } from '@schemas/gym-dashboard'
@Component({
    selector: 'rw-hold-all-modal',
    templateUrl: './hold-all-modal.component.html',
    styleUrls: ['./hold-all-modal.component.scss'],
})
export class HoldAllModalComponent implements AfterViewChecked, OnChanges, AfterViewInit {
    @Input() visible: boolean
    @Input() holdNumber: number
    @Input() lockerTicket: LockerTicket
    @Input() membershipTicket: MembershipTicket
    @Input() type: 'user' | 'ticket'

    @ViewChild('modalBackgroundElement') modalBackgroundElement: ElementRef
    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    @ViewChild('rw_datepicker') rw_datepicker: ElementRef

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<any>()

    changed: boolean

    public isMouseModalDown: boolean

    public holdWithLocker = true
    public doShowDatePick = false
    public datepick = {
        startDate: '',
        endDate: '',
    }
    public dayDiff = ''
    public lockerName = ''
    public membershipName = ''

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.isMouseModalDown = false
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && !changes['visible']?.firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
        if (this.lockerTicket) {
            this.lockerName =
                `[${this.lockerTicket.locker_category_name}] ${this.lockerTicket.locker_item_name}`.length > 15
                    ? `[${this.lockerTicket.locker_category_name}] ${this.lockerTicket.locker_item_name}`.slice(0, 15) +
                      '...'
                    : `[${this.lockerTicket.locker_category_name}] ${this.lockerTicket.locker_item_name}`
        } else if (this.membershipTicket) {
            this.membershipName =
                this.membershipTicket.name.length > 15
                    ? this.membershipTicket.name.slice(0, 15) + '...'
                    : this.membershipTicket.name
        }
    }

    ngAfterViewInit() {
        this.type = this.type ?? 'user'
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
        this.holdWithLocker = true
        this.doShowDatePick = false
        this.datepick.startDate = ''
        this.datepick.endDate = ''
    }

    onConfirm(): void {
        if (this.type == 'user' || !this.type) {
            this.confirm.emit({
                date: {
                    startDate: this.datepick.startDate,
                    endDate: this.datepick.endDate != '' ? this.datepick.endDate : this.datepick.startDate,
                },
                holdWithLocker: this.holdWithLocker,
            })
        } else if (this.type == 'ticket') {
            if (this.lockerTicket && !this.membershipTicket) {
                this.confirm.emit({
                    lockerName: this.lockerName,
                    lockerTicket: this.lockerTicket,
                    date: {
                        startDate: this.datepick.startDate,
                        endDate: this.datepick.endDate != '' ? this.datepick.endDate : this.datepick.startDate,
                    },
                })
            } else if (!this.lockerTicket && this.membershipTicket) {
                this.confirm.emit({
                    membershipName: this.membershipName,
                    membershipTicket: this.membershipTicket,
                    date: {
                        startDate: this.datepick.startDate,
                        endDate: this.datepick.endDate != '' ? this.datepick.endDate : this.datepick.startDate,
                    },
                })
            }
        }
        this.holdWithLocker = true
        this.doShowDatePick = false
        this.datepick.startDate = ''
        this.datepick.endDate = ''
    }

    toggleHoldWithLocker() {
        this.holdWithLocker = !this.holdWithLocker
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }

    // datepick method

    toggleShowDatePicker() {
        this.doShowDatePick = !this.doShowDatePick
    }
    closeShowDatePicker() {
        this.doShowDatePick = false
    }
    checkClickDatePickOutside(event) {
        _.some(event.path, this.rw_datepicker.nativeElement) ? null : this.closeShowDatePicker()
    }
    onDatePickRangeChange() {
        if (this.datepick.endDate) {
            this.dayDiff = String(this.getDayDiff(this.datepick))
        }
    }

    getDayDiff(date: { startDate: string; endDate: string }) {
        const date1 = dayjs(date.startDate)
        const date2 = dayjs(date.endDate)

        return date2.diff(date1, 'day') + 1
    }
}
