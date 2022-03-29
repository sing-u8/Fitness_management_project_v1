import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core'

import * as _ from 'lodash'
import * as dayjs from 'dayjs'

import { GymUserService } from '@services/gym-user.service'

import { LockerPaymentsItem, PaymentStatement } from '@schemas/gym-dashboard'
import { GymUser } from '@schemas/gym-user'

@Component({
    selector: 'rw-pm-locker-ticket-window',
    templateUrl: './pm-locker-ticket-window.component.html',
    styleUrls: ['./pm-locker-ticket-window.component.scss'],
})
export class PmLockerTicketWindowComponent implements OnInit, AfterViewInit {
    @Input() lockerPayment: { status: string; item: LockerPaymentsItem; payment: PaymentStatement }
    @Output() onDone = new EventEmitter<{ status: string; item: LockerPaymentsItem; payment: PaymentStatement }>()
    @Output() onPriceChange = new EventEmitter<{
        status: string
        item: LockerPaymentsItem
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
        const lockerNameList = _.split(this.lockerPayment.item.content_name.slice(1), ']')
        this.lockerCategory = _.trim(lockerNameList[0])
        this.lockerName = _.trim(lockerNameList[1])
        this.price = String(this.lockerPayment.item.price)
            .replace(/[^0-9]/gi, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        console.log('lockerCategory, lockerName: ', this.lockerCategory, ', ', this.lockerName)
        this.dayDiff = String(
            this.getDayDiff({
                startDate: this.lockerPayment.item.start_date,
                endDate: this.lockerPayment.item.end_date,
            })
        )
        if (this.lockerPayment.status == 'modify') {
            this.gymUserService
                .getUserList(this.lockerPayment.payment.gym_id, '', 'administrator, manager, staff')
                .subscribe((managers) => {
                    managers.forEach((v) => {
                        this.staffSelect_list.push({
                            name: v.gym_user_name ?? v.given_name,
                            value: v,
                        })

                        if (!this.StaffSelectValue) {
                            this.lockerPayment.item.assignee_id == v.id
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
        this.onPriceChange.emit(this.lockerPayment)
    }

    // status method
    statusToDone() {
        this.setPayment('done')
        this.onDone.emit(this.lockerPayment)
    }
    setPayment(status: 'done' | 'modify') {
        this.lockerPayment.item.price = Number(this.price.replace(/[^0-9]/gi, '')) ?? 0
        this.lockerPayment.item.assignee_id = this.StaffSelectValue.value.id
        this.lockerPayment.item.assignee_name = this.StaffSelectValue.name
        this.lockerPayment.status = status
    }

    statusToModify() {
        this.lockerPayment.status = 'modify'
        this.onDone.emit(this.lockerPayment)
    }
}
