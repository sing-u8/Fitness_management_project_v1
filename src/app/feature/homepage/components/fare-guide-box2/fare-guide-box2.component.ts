import { Component, OnInit, Input } from '@angular/core'
import { PaymentItem } from '@schemas/components/payment-item'

@Component({
    selector: 'hp-fare-guide-box2',
    templateUrl: './fare-guide-box2.component.html',
    styleUrls: ['./fare-guide-box2.component.scss'],
})
export class FareGuideBox2Component implements OnInit {
    @Input() data: PaymentItem

    constructor() {}

    ngOnInit(): void {}
}
