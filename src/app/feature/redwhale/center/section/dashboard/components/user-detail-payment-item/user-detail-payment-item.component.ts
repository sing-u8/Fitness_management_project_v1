import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core'

import _ from 'lodash'
import { originalOrder } from '@helpers/pipe/keyvalue'

import { Payment } from '@schemas/payment'

@Component({
    selector: 'db-user-detail-payment-item',
    templateUrl: './user-detail-payment-item.component.html',
    styleUrls: ['./user-detail-payment-item.component.scss'],
})
export class UserDetailPaymentItemComponent implements OnInit, AfterViewInit {
    @Input() payment: Payment

    @Output() onUpdatePayment = new EventEmitter<Payment>()
    @Output() onUpdateTransfer = new EventEmitter<Payment>()
    @Output() onUpdateRefund = new EventEmitter<Payment>()

    public originalOrder = originalOrder

    public showMenuDropDown = false
    toggleMenuDropDown() {
        this.showMenuDropDown = !this.showMenuDropDown
    }
    hideMenuDropDown() {
        this.showMenuDropDown = false
    }

    public menuDropDownItemObj = {
        updatePayment: {
            name: '결제 정보 수정',
            color: 'var(--font-color)',
            visible: true,
            func: () => {
                this.onUpdatePayment.emit(this.payment)
            },
        },
        updateTransfer: {
            name: '양도 정보 수정',
            color: 'var(--font-color)',
            visible: true,
            func: () => {
                this.onUpdateTransfer.emit(this.payment)
            },
        },
        updateRefund: {
            name: '환불 정보 수정',
            color: 'var(--font-color)',
            visible: true,
            func: () => {
                this.onUpdateRefund.emit(this.payment)
            },
        },
    }

    public pricesObj = {
        cash: {
            name: '현금',
            value: '0',
        },
        card: {
            name: '카드',
            value: '0',
        },
        trans: {
            name: '계좌',
            value: '0',
        },
        unpaid: {
            name: '미수',
            value: '0',
        },
    }
    public total = 0

    public name = ''

    constructor() {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.pricesObj.cash.value = String(this.payment.cash)
        this.pricesObj.card.value = String(this.payment.card)
        this.pricesObj.trans.value = String(this.payment.trans)
        this.pricesObj.unpaid.value = String(this.payment.unpaid)

        this.total = this.payment.card + this.payment.cash + this.payment.trans + this.payment.unpaid

        this.name = this.payment.user_membership_id
            ? '[회원권] ' + this.payment.user_membership_name
            : '[락커] ' + this.payment.user_locker_name

        this.setMenuDropdownShow()
    }

    setMenuDropdownShow() {
        if (this.payment.type_code == 'payment_type_payment') {
            this.menuDropDownItemObj.updateRefund.visible = false
            this.menuDropDownItemObj.updateTransfer.visible = false
        } else if (this.payment.type_code == 'payment_type_refund') {
            this.menuDropDownItemObj.updatePayment.visible = false
            this.menuDropDownItemObj.updateTransfer.visible = false
        } else {
            this.menuDropDownItemObj.updatePayment.visible = false
            this.menuDropDownItemObj.updateRefund.visible = false
        }
    }
}
