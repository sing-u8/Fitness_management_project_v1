import { Component, OnInit, Input, AfterViewInit } from '@angular/core'
import * as _ from 'lodash'
import * as dayjs from 'dayjs'

import { GymUserService } from '@services/gym-user.service'
import { StorageService } from '@services/storage.service'
import {
    GymRegisterMembershipLockerStateService,
    Locker,
} from '@services/etc/gym-register-membership-locker-state.service'

import { User } from '@schemas/user'
import { GymUser } from '@schemas/gym-user'
import { Gym } from '@schemas/gym'
@Component({
    selector: 'rw-locker-window',
    templateUrl: './locker-window.component.html',
    styleUrls: ['./locker-window.component.scss'],
})
export class LockerWindowComponent implements OnInit, AfterViewInit {
    @Input() index: number
    @Input() lockerState: Locker

    public datepickFlag: { end: boolean } = { end: false }
    public staffSelect_list: Array<{ name: string; value: GymUser }> = []
    public StaffSelectValue: { name: string; value: GymUser }

    public dayDiff = ''

    public gym: Gym
    public user: User

    constructor(
        private gymUserService: GymUserService,
        private storageService: StorageService,
        private gymRegisterMlState: GymRegisterMembershipLockerStateService
    ) {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.StaffSelectValue = this.lockerState.assignee
        this.dayDiff = String(this.getDayDiff(this.lockerState.date))
        if (this.lockerState.status == 'modify') {
            this.gym = this.storageService.getGym()
            this.user = this.storageService.getUser()
            this.gymUserService.getUserList(this.gym.id, '', 'administrator, manager, staff').subscribe((managers) => {
                managers.forEach((v) => {
                    this.staffSelect_list.push({
                        name: v.gym_user_name ?? v.given_name,
                        value: v,
                    })

                    if (!this.StaffSelectValue) {
                        this.user.id == v.id
                            ? (this.StaffSelectValue = { name: v.gym_user_name ?? v.given_name, value: v })
                            : null
                    }
                })
            })
        }
    }

    // datepicker method
    onDatePickRangeChange(event: { startDate: string; endDate: string }) {
        console.log('onDateChange: ', event)
        this.lockerState.date = event
        this.dayDiff = String(this.getDayDiff(this.lockerState.date))
    }
    getDayDiff(date: { startDate: string; endDate: string }) {
        const date1 = dayjs(date.startDate)
        const date2 = dayjs(date.endDate)

        return date2.diff(date1, 'day') + 1
    }

    // input medthod
    onPriceKeyup(event) {
        if (event.code == 'Enter') return
        this.lockerState.price = this.lockerState.price.replace(/[^0-9]/gi, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    // state method
    onRemoveItem() {
        this.gymRegisterMlState.remove(this.index)
    }
    onSaveItem() {
        const itemObj: Locker = {
            date: this.lockerState.date,
            price: this.lockerState.price,
            assignee: _.cloneDeep(this.StaffSelectValue),
            locker: _.cloneDeep(this.lockerState.locker),
            lockerCategory: _.cloneDeep(this.lockerState.lockerCategory),
            status: 'done',
        }

        this.gymRegisterMlState.modify(this.index, itemObj)
    }
    onModify() {
        const itemObj: Locker = {
            locker: _.cloneDeep(this.lockerState.locker),
            lockerCategory: _.cloneDeep(this.lockerState.lockerCategory),
            assignee: _.cloneDeep(this.StaffSelectValue),
            status: 'modify',
        }

        this.gymRegisterMlState.modify(this.index, itemObj)
    }

    // status method
    statusToDone() {
        if (this.lockerState.date.startDate && this.lockerState.date.endDate) {
            this.lockerState.price = this.lockerState.price ?? '0'
            this.onSaveItem()
        }
    }
    statusToModify() {
        this.onModify()
    }
}
