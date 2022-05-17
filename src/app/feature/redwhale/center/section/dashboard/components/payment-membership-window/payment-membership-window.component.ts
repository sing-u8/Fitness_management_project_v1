import { Component, OnInit, Input, Output, OnChanges, SimpleChanges } from '@angular/core'

import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { Payment } from '@schemas/payment'

@Component({
    selector: 'db-payment-membership-window',
    templateUrl: './payment-membership-window.component.html',
    styleUrls: ['./payment-membership-window.component.scss'],
})
export class PaymentMembershipWindowComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
