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

import { MembershipTicket } from '@schemas/gym-dashboard'

// !! 아직 구현 불가능

@Component({
    selector: 'rw-membership-ticket-modal',
    templateUrl: './membership-ticket-modal.component.html',
    styleUrls: ['./membership-ticket-modal.component.scss'],
})
export class MembershipTicketModalComponent implements AfterViewChecked, OnChanges, AfterViewInit {
    @Input() visible: boolean
    @Input() membershipTicket: MembershipTicket

    @Output() onHoldClick = new EventEmitter<MembershipTicket>()
    onHold() {
        this.onHoldClick.emit(this.membershipTicket)
    }
    @Output() onRemoveClick = new EventEmitter<MembershipTicket>()
    onRemove() {
        this.onRemoveClick.emit(this.membershipTicket)
    }
    @Output() onModifyClick = new EventEmitter<MembershipTicket>()
    onModify() {
        this.onModifyClick.emit(this.membershipTicket)
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
        expired: '만료',
    }

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.isMouseModalDown = false
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
        if (this.membershipTicket) {
            this.date = { startDate: this.membershipTicket.start_date, endDate: this.membershipTicket.end_date }
        }
    }

    ngAfterViewInit() {}

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
