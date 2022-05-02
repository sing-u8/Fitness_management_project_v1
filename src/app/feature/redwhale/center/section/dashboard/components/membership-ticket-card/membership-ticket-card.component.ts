import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core'

import { MembershipItem } from '@schemas/membership-item'

@Component({
    selector: 'db-membership-ticket-card',
    templateUrl: './membership-ticket-card.component.html',
    styleUrls: ['./membership-ticket-card.component.scss'],
})
export class MembershipTicketCardComponent implements OnInit, AfterViewInit {
    @Input() cardInfo: MembershipItem
    @Input() isInWindow: boolean
    @Output() onCardClick = new EventEmitter<MembershipItem>()

    emitCardInfo() {
        this.onCardClick.emit(this.cardInfo)
    }
    constructor() {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.isInWindow = this.isInWindow ?? false
    }
}
