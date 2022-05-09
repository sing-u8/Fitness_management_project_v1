import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { Payment } from '@schemas/payment'
@Component({
    selector: 'db-user-detail-payment',
    templateUrl: './user-detail-payment.component.html',
    styleUrls: ['./user-detail-payment.component.scss'],
})
export class UserDetailPaymentComponent implements OnInit {
    @Input() payments: Payment[]

    @Output() onRegisterML = new EventEmitter<void>()
    constructor() {}

    ngOnInit(): void {}
}
