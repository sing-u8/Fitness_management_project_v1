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

import { LockerTicket } from '@schemas/gym-dashboard'

// !! 아직 구현 불가능
@Component({
    selector: 'rw-locker-ticket-modal',
    templateUrl: './locker-ticket-modal.component.html',
    styleUrls: ['./locker-ticket-modal.component.scss'],
})
export class LockerTicketModalComponent implements AfterViewChecked, OnChanges {
    @Input() visible: boolean
    @Input() lockerTicket: LockerTicket

    @Output() onHoldClick = new EventEmitter<LockerTicket>()
    onHold() {
        this.onHoldClick.emit(this.lockerTicket)
    }
    @Output() onRemoveClick = new EventEmitter<LockerTicket>()
    onRemove() {
        this.onRemoveClick.emit(this.lockerTicket)
    }
    @Output() onModifyClick = new EventEmitter<LockerTicket>()
    onModify() {
        this.onModifyClick.emit(this.lockerTicket)
    }
    @Output() onShiftClick = new EventEmitter<LockerTicket>()
    onShift() {
        this.onShiftClick.emit(this.lockerTicket)
    }

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<any>()

    changed: boolean

    public isMouseModalDown: boolean

    public date: {
        startDate: string
        endDate: string
    }

    public statusMather = {
        holding: '홀딩중',
        use: '사용중',
        expired: '기간초과',
    }

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.isMouseModalDown = false
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.visible.firstChange) {
            if (changes.visible.previousValue != changes.visible.currentValue) {
                this.changed = true
            }
        }
        if (this.lockerTicket) {
            this.date = { startDate: this.lockerTicket.start_date, endDate: this.lockerTicket.end_date }
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
}
