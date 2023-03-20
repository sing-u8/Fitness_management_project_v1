import { Component, OnInit, Input } from '@angular/core'

import { PaymentItem } from '@schemas/components/payment-item'

@Component({
    selector: 'rw-payment-item',
    templateUrl: './payment-item.component.html',
    styleUrls: ['./payment-item.component.scss'],
})
export class PaymentItemComponent implements OnInit {
    @Input() data: PaymentItem
    @Input() selected = false
    constructor() {}

    ngOnInit(): void {}
}
