import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import * as dayjs from 'dayjs'

import { GlobalService } from '@services/global.service'
import { GymDashboardService } from '@services/gym-dashboard.service'

import { PaymentStatement, GetUserReturn, MembershipPaymentsItem, LockerPaymentsItem } from '@schemas/gym-dashboard'

import { MembershipItem } from '@schemas/membership-item'
import { LockerItem } from '@schemas/locker-item'
import { LockerCategory } from '@schemas/locker-category'
import _ from 'lodash'

@Component({
    selector: 'app-modify-payment-statement',
    templateUrl: './modify-payment-statement.component.html',
    styleUrls: ['./modify-payment-statement.component.scss'],
})
export class ModifyPaymentStatementComponent implements OnInit, OnDestroy, AfterViewInit {
    public payment: PaymentStatement

    public today = dayjs().format('YYYY.MM.DD')

    public totalPriceInput = {
        cash: { price: '', name: '현금' },
        card: { price: '', name: '카드' },
        trans: { price: '', name: '계좌이체' },
        unpaid: { price: '', name: '미수금' },
    }

    public selectedMembershipTicket: MembershipItem
    public selectedLocker: LockerItem
    public selectedLockerCategory: LockerCategory

    public itemList: Array<{
        status: string
        item: MembershipPaymentsItem | LockerPaymentsItem
        payment: PaymentStatement
    }> = []
    public registerMlListSubscription: Subscription

    public totalPay = 0

    public samePrice = false
    public allItemDone = false

    public routerState: { payment: PaymentStatement; user: GetUserReturn }
    public user: GetUserReturn

    // list 만들기

    constructor(
        // private gymRegisterMlState: GymRegisterMembershipLockerStateService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private gymDashboardService: GymDashboardService,
        private globalService: GlobalService
    ) {
        console.log(
            'this.router.getCurrentNavigation().extras.state?.user as GetUserReturn: ',
            this.router.getCurrentNavigation()
        )

        this.routerState = this.router.getCurrentNavigation().extras.state as {
            payment: PaymentStatement
            user: GetUserReturn
        }
        this.initInputs(this.routerState.payment)
    }

    ngOnInit(): void {
        if (!this.routerState) {
            this.backToDashboard()
        } else {
            this.payment = this.routerState.payment
            this.user = this.routerState.user
            this.initPmItem()
        }
    }
    ngAfterViewInit(): void {}
    ngOnDestroy(): void {}

    // onDone
    onDone(
        data: { status: string; item: MembershipPaymentsItem | LockerPaymentsItem; payment: PaymentStatement },
        idx: number
    ) {
        this.itemList[idx] = data
        this.totalPay = 0
        let doneNum = 0
        _.forEach(this.itemList, (item) => {
            doneNum += item.status == 'done' ? 1 : 0
            this.totalPay += item.item.price
        })
        this.allItemDone = doneNum == this.itemList.length ? true : false
        this.checkTotalPriceSame()
    }

    // onPriceChange
    onPriceChange(
        data: { status: string; item: MembershipPaymentsItem | LockerPaymentsItem; payment: PaymentStatement },
        idx: number
    ) {
        this.itemList[idx] = data
        this.totalPay = 0
        let doneNum = 0
        _.forEach(this.itemList, (item) => {
            doneNum += item.status == 'done' ? 1 : 0
            this.totalPay += item.item.price
        })
        this.allItemDone = doneNum == this.itemList.length ? true : false
    }

    // --------------------------------------
    initInputs(payment: PaymentStatement) {
        this.totalPriceInput['card'].price = String(payment.pay_card)
        this.totalPriceInput['cash'].price = String(payment.pay_cash)
        this.totalPriceInput['trans'].price = String(payment.pay_trans)
        this.totalPriceInput['unpaid'].price = String(payment.unpaid)

        this.totalPay = 0
        _.forEach(_.keys(this.totalPriceInput), (key) => {
            this.totalPay += Number(this.totalPriceInput[key].price)
        })
        console.log('this.totalPay in initInputs : ', this.totalPay)
        this.checkTotalPriceSame()
    }

    initPmItem() {
        this.itemList = _.map(this.payment.items, (pmItem) => {
            return {
                status: pmItem.category == 'membership' ? 'modify' : 'done',
                item: pmItem,
                payment: this.payment,
            }
        })
    }

    // price input method
    restrictToNumber(event) {
        const code = event.which ? event.which : event.keyCode
        if (code < 48 || code > 57) {
            return false
        }
    }

    onInputKeyup(event, type: 'cash' | 'card' | 'unpaid' | 'trans') {
        if (event.code == 'Enter') return
        this.totalPriceInput[type].price = this.totalPriceInput[type].price
            .replace(/[^0-9]/gi, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')

        this.checkTotalPriceSame()
    }

    checkTotalPriceSame() {
        let _total = 0
        _.forIn(this.totalPriceInput, (value) => {
            _total += value.price ? Number(value.price.replace(/[^0-9]/gi, '')) : 0
        })
        this.samePrice = _total == this.totalPay ? true : false
    }

    // routing function
    backToDashboard() {
        this.router.navigate(['../../'], { relativeTo: this.activatedRoute })
    }

    // register function
    modifyPayment() {
        const reqBody = {
            pay_cash: Number(this.totalPriceInput.cash.price.replace(/[^0-9]/gi, '')),
            pay_card: Number(this.totalPriceInput.card.price.replace(/[^0-9]/gi, '')),
            pay_trans: Number(this.totalPriceInput.trans.price.replace(/[^0-9]/gi, '')),
            unpaid: Number(this.totalPriceInput.unpaid.price.replace(/[^0-9]/gi, '')),
            paid_date: this.today.split('.').reduce((pre, cur, idx) => {
                return idx == 0 ? pre + cur : pre + '-' + cur
            }, ''),
            membership: _.map(
                _.filter(this.itemList, (item) => item.item.category == 'membership'),
                (item) => {
                    return {
                        sales_by_content_id: item.item.id,
                        assignee_id: item.item.assignee_id,
                        price: item.item.price,
                    }
                }
            ),
            locker: _.map(
                _.filter(this.itemList, (item) => item.item.category == 'locker'),
                (item) => {
                    return {
                        sales_by_content_id: item.item.id,
                        assignee_id: item.item.assignee_id,
                        price: item.item.price,
                    }
                }
            ),
        }

        this.gymDashboardService
            .modifySales(this.payment.gym_id, this.user.id, String(this.payment.id), reqBody)
            .subscribe((_) => {
                console.log('modifySales')
                this.router.navigate(['../../'], { relativeTo: this.activatedRoute, state: { modifyPayment: true } })
                this.globalService.showToast(`${this.user.gym_user_name}님의 결제 정보가 수정되었습니다.`)
            })
    }
}
