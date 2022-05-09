import { Component, OnInit, Input, Output } from '@angular/core'

import { Payment } from '@schemas/payment'

@Component({
    selector: 'db-user-detail-payment-item',
    templateUrl: './user-detail-payment-item.component.html',
    styleUrls: ['./user-detail-payment-item.component.scss'],
})
export class UserDetailPaymentItemComponent implements OnInit {
    @Input() payment: Payment
    constructor() {}

    ngOnInit(): void {}
}
