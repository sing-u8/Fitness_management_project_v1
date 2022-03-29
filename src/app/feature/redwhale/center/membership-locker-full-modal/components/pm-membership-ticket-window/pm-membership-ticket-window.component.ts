import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core'

import * as _ from 'lodash'
import * as dayjs from 'dayjs'

import { GymUserService } from '@services/gym-user.service'
import { StorageService } from '@services/storage.service'

import { MembershipPaymentsItem, PaymentStatement } from '@schemas/gym-dashboard'
import { GymUser } from '@schemas/gym-user'

@Component({
    selector: 'rw-pm-membership-ticket-window',
    templateUrl: './pm-membership-ticket-window.component.html',
    styleUrls: ['./pm-membership-ticket-window.component.scss'],
})
export class PmMembershipTicketWindowComponent implements OnInit, AfterViewInit {
    @Input() membershipPayment: { status: string; item: MembershipPaymentsItem; payment: PaymentStatement }
    @Output() onDone = new EventEmitter<{ status: string; item: MembershipPaymentsItem; payment: PaymentStatement }>()
    @Output() onPriceChange = new EventEmitter<{
        status: string
        item: MembershipPaymentsItem
        payment: PaymentStatement
    }>()

    public staffSelect_list: Array<{ name: string; value: GymUser }> = []
    public StaffSelectValue: { name: string; value: GymUser }

    public lockerCategory = ''
    public lockerName = ''

    public dayDiff = ''

    public price = ''

    constructor(private gymUserService: GymUserService) {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.price = String(this.membershipPayment.item.price)
            .replace(/[^0-9]/gi, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        console.log('lockerCategory, lockerName: ', this.lockerCategory, ', ', this.lockerName)
        this.dayDiff = String(
            this.getDayDiff({
                startDate: this.membershipPayment.item.start_date,
                endDate: this.membershipPayment.item.end_date,
            })
        )
        if (this.membershipPayment.status == 'modify') {
            this.gymUserService
                .getUserList(this.membershipPayment.payment.gym_id, '', 'administrator, manager, staff')
                .subscribe((managers) => {
                    managers.forEach((v) => {
                        this.staffSelect_list.push({
                            name: v.gym_user_name ?? v.given_name,
                            value: v,
                        })

                        if (!this.StaffSelectValue) {
                            this.membershipPayment.item.assignee_id == v.id
                                ? (this.StaffSelectValue = { name: v.gym_user_name ?? v.given_name, value: v })
                                : null
                        }
                    })
                })
        }
    }

    getDayDiff(date: { startDate: string; endDate: string }) {
        const date1 = dayjs(date.startDate)
        const date2 = dayjs(date.endDate)

        return date2.diff(date1, 'day') + 1
    }

    // input medthod
    onPriceKeyup(event) {
        if (event.code == 'Enter') return
        this.price = this.price.replace(/[^0-9]/gi, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        this.setPayment('modify')
        this.onPriceChange.emit(this.membershipPayment)
    }
    // status method
    statusToDone() {
        this.setPayment('done')
        this.onDone.emit(this.membershipPayment)
        console.log('status to done called ')
    }

    setPayment(status: 'done' | 'modify') {
        this.membershipPayment.item.price = Number(this.price.replace(/[^0-9]/gi, '')) ?? 0
        this.membershipPayment.item.assignee_id = this.StaffSelectValue.value.id
        this.membershipPayment.item.assignee_name = this.StaffSelectValue.name
        this.membershipPayment.status = status
    }

    statusToModify() {
        this.membershipPayment.status = 'modify'
        this.onDone.emit(this.membershipPayment)
    }
}
