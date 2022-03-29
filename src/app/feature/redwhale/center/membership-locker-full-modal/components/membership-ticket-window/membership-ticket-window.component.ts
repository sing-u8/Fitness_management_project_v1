import { Component, OnInit, Input, AfterViewInit } from '@angular/core'

import { LessonItem } from '@schemas/lesson-item'
import * as _ from 'lodash'
import * as dayjs from 'dayjs'

import { GymUserService } from '@services/gym-user.service'
import { StorageService } from '@services/storage.service'
import {
    GymRegisterMembershipLockerStateService,
    MembershipTicket,
} from '@services/etc/gym-register-membership-locker-state.service'

import { User } from '@schemas/user'
import { GymUser } from '@schemas/gym-user'
import { Gym } from '@schemas/gym'

@Component({
    selector: 'rw-membership-ticket-window',
    templateUrl: './membership-ticket-window.component.html',
    styleUrls: ['./membership-ticket-window.component.scss'],
})
export class MembershipTicketWindowComponent implements OnInit, AfterViewInit {
    @Input() index: number
    @Input() membershipState: MembershipTicket

    public lessonItemList: Array<{ selected: boolean; item: LessonItem }>
    public selectedLessons: Array<LessonItem> = []
    public selectedLessonText = ''

    public datepickFlag: { start: boolean; end: boolean } = { start: false, end: false }
    public dayDiff = ''

    public staffSelect_list: Array<{ name: string; value: GymUser }> = []
    public StaffSelectValue: { name: string; value: GymUser } = { name: '', value: undefined }

    public gym: Gym
    public user: User
    // public status: 'modify' | 'done' = 'modify'

    constructor(
        private gymUserService: GymUserService,
        private storageService: StorageService,
        private gymRegisterMlState: GymRegisterMembershipLockerStateService
    ) {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.StaffSelectValue = this.membershipState.assignee
        if (this.membershipState.status == 'modify') {
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
        // _.forEach(this.selectedMembershipTicket.lesson_item_list, (value) => {
        //     this.lessonItemList.push({ selected: false, item: value })
        // })
        this.dayDiff = String(this.getDayDiff(this.membershipState.date))
        this.lessonItemList = this.membershipState.lessonList
        this.getSelectedLessonList()
        console.log('this.lessonItemList: ', this.lessonItemList)
    }

    // datepicker method
    public isStartDateClicked = false
    onDatePickRangeChange(event: { startDate: string; endDate: string }, type: 'start' | 'end') {
        this.membershipState.date = event
        this.dayDiff = String(this.getDayDiff(this.membershipState.date))
        if (type == 'start') {
            this.isStartDateClicked = true
            this.datepickFlag.start = false
            this.datepickFlag.end = true
        } else {
            this.isStartDateClicked = false
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
        this.membershipState.price = this.membershipState.price
            .replace(/[^0-9]/gi, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    onCountKeyup(event) {
        if (event.code == 'Enter') return
        this.membershipState.count.count = this.membershipState.count.count.replace(/[^0-9]/gi, '')
    }

    // state method
    onRemoveItem() {
        this.gymRegisterMlState.remove(this.index)
    }

    onSaveItem() {
        const itemObj: MembershipTicket = {
            date: this.membershipState.date,
            price: this.membershipState.price,
            assignee: this.StaffSelectValue,
            count: this.membershipState.count,
            membershipItem: this.membershipState.membershipItem,
            lessonList: this.lessonItemList,

            status: 'done',
        }

        this.gymRegisterMlState.modify(this.index, itemObj)
    }
    onModify() {
        const itemObj: MembershipTicket = {
            membershipItem: this.membershipState.membershipItem,
            lessonList: this.lessonItemList,

            status: 'modify',
        }

        this.gymRegisterMlState.modify(this.index, itemObj)
    }

    // status method
    statusToDone() {
        if (
            this.membershipState.date.startDate &&
            this.membershipState.date.endDate &&
            this.isLessonSelected() &&
            this.checkCount()
        ) {
            this.membershipState.price = this.membershipState.price ?? '0'
            // this.getSelectedLessonList()
            this.onSaveItem()
        }
    }
    statusToModify() {
        this.onModify()
    }

    isLessonSelected() {
        return _.some(this.lessonItemList, ['selected', true])
    }

    checkCount() {
        if (
            (this.membershipState.count.count == '0' || !this.membershipState.count.count) &&
            !this.membershipState.count.infinite
        )
            return false
        return true
    }

    // selected lesson item method
    getSelectedLessonList() {
        this.selectedLessons = _.map(_.filter(this.lessonItemList, ['selected', true]), (lessonObj) => lessonObj.item)
        if (this.selectedLessons.length == 0) return
        this.selectedLessonText =
            this.selectedLessons.length == 1
                ? `${this.selectedLessons[0].name}`
                : `${this.selectedLessons[0].name} 외 ${this.selectedLessons.length - 1}건`
    }
}
