import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core'
import * as dayjs from 'dayjs'

import { PaymentStatement } from '@schemas/gym-dashboard'

// !! 아직 모듈 임포트 불가
@Component({
    selector: 'rw-dashboard-payment-statement-card',
    templateUrl: './dashboard-payment-statement-card.component.html',
    styleUrls: ['./dashboard-payment-statement-card.component.scss'],
})
export class DashboardPaymentStatementCardComponent implements OnInit, AfterViewInit {
    @Input() payment: PaymentStatement
    @Output() onModifyClick = new EventEmitter<PaymentStatement>()

    public payDate: string
    public total: number

    constructor() {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.payDate = dayjs(this.payment.paid_date).format('YYYY.MM.DD')
        this.total = this.payment.pay_card + this.payment.pay_cash + this.payment.pay_trans + this.payment.unpaid
        // - this.payment.refund
    }

    onModifyButtonClick() {
        this.onModifyClick.emit(this.payment)
    }
}
