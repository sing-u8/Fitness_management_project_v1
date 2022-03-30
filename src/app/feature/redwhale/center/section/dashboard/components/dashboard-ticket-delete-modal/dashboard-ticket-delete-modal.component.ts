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

import { LockerTicket, MembershipTicket } from '@schemas/gym-dashboard'

// !! 아직 적용 불가

@Component({
    selector: 'rw-dashboard-ticket-delete-modal',
    templateUrl: './dashboard-ticket-delete-modal.component.html',
    styleUrls: ['./dashboard-ticket-delete-modal.component.scss'],
})
export class DashboardTicketDeleteModalComponent implements AfterViewChecked, OnChanges {
    @Input() visible: boolean
    @Input() lockerTicket: LockerTicket
    @Input() membershipTicket: MembershipTicket

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<{
        ticketName: string
        ticket: LockerTicket | MembershipTicket
        price: number
    }>()
    onLockerDelete() {
        this.confirm.emit({
            ticketName: this.ticketName,
            ticket: this.lockerTicket,
            price: Number(this.price.replace(/[^0-9]/gi, '')),
        })
    }
    onMembershipDelete() {
        this.confirm.emit({
            ticketName: this.ticketName,
            ticket: this.membershipTicket,
            price: Number(this.price.replace(/[^0-9]/gi, '')),
        })
    }

    changed: boolean

    public isMouseModalDown: boolean

    public userNameInit: string

    public ticketName = ''
    public deleteText = ''
    public price = ''

    public modalTitle = ''

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.isMouseModalDown = false
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.visible && !changes.visible?.firstChange) {
            if (changes.visible.previousValue != changes.visible.currentValue) {
                this.changed = true
            }
        }
        if (this.lockerTicket) {
            this.ticketName =
                `[${this.lockerTicket.locker_category_name}] ${this.lockerTicket.locker_item_name}`.length > 15
                    ? `[${this.lockerTicket.locker_category_name}] 락커 ${this.lockerTicket.locker_item_name}`.slice(
                          0,
                          15
                      ) + '...'
                    : `[${this.lockerTicket.locker_category_name}] 락커 ${this.lockerTicket.locker_item_name}`

            this.deleteText = '락커 비우기'
            this.modalTitle = this.ticketName + '를 비우시겠어요?'
        } else if (this.membershipTicket) {
            this.ticketName =
                this.membershipTicket.name.length > 15
                    ? this.membershipTicket.name.slice(0, 15) + '...'
                    : this.membershipTicket.name

            this.deleteText = '회원권 삭제하기'
            this.modalTitle = this.ticketName + '를 삭제하시겠어요?'
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

    //

    onCancel(): void {
        this.resetMouseModalDown()
        this.cancel.emit({})
    }

    onConfirm(): void {
        if (this.lockerTicket) {
            this.onLockerDelete()
        } else if (this.membershipTicket) {
            this.onMembershipDelete()
        }

        this.price = ''
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }

    // input helper functions
    restrictToNumber(event) {
        const code = event.which ? event.which : event.keyCode
        if (code < 48 || code > 57) {
            return false
        }
    }
    onInputKeyup(event) {
        if (event.code == 'Enter') return
        this.price = this.price.replace(/[^0-9]/gi, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
}
