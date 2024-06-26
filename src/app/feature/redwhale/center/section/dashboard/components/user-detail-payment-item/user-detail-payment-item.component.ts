import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core'
import { CenterPermissionHelperService } from '@services/helper/center-permission-helper.service'

import _ from 'lodash'
import { originalOrder } from '@helpers/pipe/keyvalue'

import { Payment } from '@schemas/payment'

// ngrx
import { Store, select } from '@ngrx/store'
import { curCenter } from '@centerStore/selectors/center.common.selector'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'

@Component({
    selector: 'db-user-detail-payment-item',
    templateUrl: './user-detail-payment-item.component.html',
    styleUrls: ['./user-detail-payment-item.component.scss'],
})
export class UserDetailPaymentItemComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() payment: Payment

    @Output() onUpdatePayment = new EventEmitter<Payment>()
    @Output() onUpdateTransfer = new EventEmitter<Payment>()
    @Output() onUpdateRefund = new EventEmitter<Payment>()
    @Output() onRemovePayment = new EventEmitter<Payment>()

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
        removePayment: {
            name: '결제 내역 삭제',
            color: 'var(--red)',
            visible: true,
            func: () => {
                this.onRemovePayment.emit(this.payment)
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

    public isRemovePaymentApproved = false

    public unSubscriber$ = new Subject<void>()

    constructor(private centerPermissionHelperService: CenterPermissionHelperService, private nxStore: Store) {}

    ngOnInit(): void {
        this.nxStore.pipe(select(curCenter), takeUntil(this.unSubscriber$)).subscribe((cc) => {
            if (!_.isEmpty(cc)) {
                this.isRemovePaymentApproved = this.centerPermissionHelperService.getRemovePaymentHistoryPermission()
            }
        })
        this.menuDropDownItemObj.removePayment.visible = this.isRemovePaymentApproved
    }
    ngAfterViewInit(): void {
        this.pricesObj.cash.value = String(this.payment.cash)
        this.pricesObj.card.value = String(this.payment.card)
        this.pricesObj.trans.value = String(this.payment.trans)
        this.pricesObj.unpaid.value = String(this.payment.unpaid)

        this.total = this.payment.card + this.payment.cash + this.payment.trans + this.payment.unpaid

        this.setMenuDropdownShow()
    }
    ngOnDestroy(): void {
        this.unSubscriber$.next()
        this.unSubscriber$.complete()
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

        // 결제 내역 삭제는 권한이 있는 경우만
    }
}
