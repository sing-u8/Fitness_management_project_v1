import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import dayjs from 'dayjs'
import _ from 'lodash'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'
import { GymDashboardService } from '@services/gym-dashboard.service'
import { GymUserLockerTicketService } from '@services/gym-user-locker-ticket.service'

import { GetUserReturn, LockerTicket } from '@schemas/gym-dashboard'

import { Center } from '@schemas/center'

type RouterState = { user: GetUserReturn; ticket: LockerTicket }

@Component({
    selector: 'app-modify-locker-ticket',
    templateUrl: './modify-locker-ticket.component.html',
    styleUrls: ['./modify-locker-ticket.component.scss'],
})
export class ModifyLockerTicketComponent implements OnInit, OnDestroy, AfterViewInit {
    public routerState: RouterState
    public datepickFlag: { end: boolean } = { end: false }
    public date = { startDate: '', endDate: '' }
    public dayDiff = ''

    public center: Center

    doShowCargeModal = false

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private gymUserLockerTicketService: GymUserLockerTicketService,
        private storageService: StorageService,
        private globalService: GlobalService
    ) {
        this.routerState = this.router.getCurrentNavigation().extras.state as RouterState
        this.center = this.storageService.getCenter()
    }

    ngOnInit(): void {
        if (this.routerState) {
            this.date = { startDate: this.routerState.ticket.start_date, endDate: this.routerState.ticket.end_date }
            this.dayDiff = String(this.getDayDiff(this.date))
            console.log('this.date: ', this.date)
        }
    }
    ngOnDestroy(): void {}
    ngAfterViewInit(): void {
        if (!this.routerState) {
            this.backToDashboard()
        }
    }

    // routing function
    backToDashboard() {
        this.router.navigate(['../../'], { relativeTo: this.activatedRoute })
    }
    // datepicker method
    onDatePickRangeChange(event: { startDate: string; endDate: string }) {
        console.log('onDateChange: ', event)
        this.date = event
        this.dayDiff = String(this.getDayDiff(this.date))
    }

    getDayDiff(date: { startDate: string; endDate: string }) {
        const date1 = dayjs(date.startDate)
        const date2 = dayjs(date.endDate)

        return date2.diff(date1, 'day') + 1
    }
    // save function
    onSaveClick() {
        this.doShowCargeModal = true
    }

    changeDate(chargeData: {
        pay_card: number
        pay_cash: number
        pay_trans: number
        unpaid: number
        pay_date: string
        assignee_id: string
    }) {
        // const reqBody: ModifyLockerTicketRequestBody = {
        //     end_date: this.date.endDate,
        //     // total_price: String(chargeData.pay_cash + chargeData.pay_card + chargeData.pay_trans + chargeData.unpaid),
        //     cash: String(chargeData.pay_cash),
        //     card: String(chargeData.pay_card),
        //     trans: String(chargeData.pay_trans),
        //     unpaid: String(chargeData.unpaid),
        //     paid_date: chargeData.pay_date,
        // }
        const _reqBody = {
            locker_item_id: Number(this.routerState.ticket.locker_item_id),
            start_date: this.date.startDate,
            end_date: this.date.endDate,
            pay_card: chargeData.pay_card,
            pay_cash: chargeData.pay_cash,
            pay_trans: chargeData.pay_trans,
            unpaid: chargeData.unpaid,
            assignee_id: chargeData.assignee_id,
            pay_date: chargeData.pay_date,
        }

        this.doShowCargeModal = false
        this.gymUserLockerTicketService
            .modifyLockerTicket(
                this.routerState.ticket.gym_id,
                this.routerState.ticket.user_id,
                this.routerState.ticket.id,
                _reqBody
            )
            .subscribe((__) => {
                this.router.navigate(['../../'], { relativeTo: this.activatedRoute, state: { modifyTicket: true } })
                this.globalService.showToast(
                    `[${this.routerState.ticket.locker_category_name}] ${this.routerState.ticket.locker_item_name} 정보가 수정되었습니다.`
                )
            })
    }
}
