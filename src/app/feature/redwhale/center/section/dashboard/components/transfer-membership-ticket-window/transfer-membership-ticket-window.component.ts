import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'

import { ClassItem } from '@schemas/class-item'
import _ from 'lodash'
import dayjs from 'dayjs'

import { StorageService } from '@services/storage.service'

import { PriceType, MembershipTicket } from '@schemas/center/dashboard/transfer-m-fullmodal'
import { User } from '@schemas/user'
import { Center } from '@schemas/center'
import { CenterUser } from '@schemas/center-user'
import { MembershipItem } from '@schemas/membership-item'

@Component({
    selector: 'db-transfer-membership-ticket-window',
    templateUrl: './transfer-membership-ticket-window.component.html',
    styleUrls: ['./transfer-membership-ticket-window.component.scss'],
})
export class TransferMembershipTicketWindowComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() membershipState: MembershipTicket
    @Input() instructors: Array<CenterUser>
    @Input() membershipItems: Array<MembershipItem>

    @Output() onModifyMlItem = new EventEmitter<MembershipTicket>()
    @Output() onModifyTotalPrice = new EventEmitter<MembershipTicket>()

    public selectedLessons: Array<ClassItem> = []
    public selectedLessonText = ''

    public datepickFlag: { start: boolean; end: boolean } = { start: false, end: false }
    public dayDiff = ''

    public staffSelect_list: Array<{ name: string; value: CenterUser }> = []
    public center: Center
    public user: User
    public centerUser: CenterUser

    constructor(private storageService: StorageService) {}

    ngOnInit(): void {
        this.center = this.storageService.getCenter()
        this.user = this.storageService.getUser()
        this.centerUser = this.storageService.getCenterUser()
    }
    ngAfterViewInit(): void {
        // _.forEach(this.selectedMembershipTicket.lesson_item_list, (value) => {
        //     this.lessonItemList.push({ selected: false, item: value })
        // })
        this.dayDiff = String(this.getDayDiff(this.membershipState.date))
        this.getSelectedLessonList()
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['instructors']) {
            this.center = this.storageService.getCenter()
            this.user = this.storageService.getUser()
            this.centerUser = this.storageService.getCenterUser()
            this.staffSelect_list = []
            this.instructors.forEach((v) => {
                this.staffSelect_list.push({
                    name: v.name,
                    value: v,
                })

                if (!this.membershipState.assignee) {
                    if (this.centerUser.id == v.id) {
                        this.membershipState.assignee = { name: v.name, value: v }
                    }
                }
            })
        }
    }

    // datepicker method
    onDatePickerButtonClick(type: 'start' | 'end') {
        if (type == 'start') {
            this.datepickFlag.start = !this.datepickFlag.start
            this.datepickFlag.end = false
        } else if (type == 'end') {
            if (this.datepickFlag.end == false) {
                this.modifyTransferMembership()
            }
            this.datepickFlag.end = !this.datepickFlag.end
            this.datepickFlag.start = false
        }
    }
    onDatePickerClickOutside(type: 'start' | 'end') {
        if (type == 'start') {
            if (this.datepickFlag.start == true) {
                this.modifyTransferMembership()
            }
            this.datepickFlag.start = false
        } else if (type == 'end') {
            if (this.datepickFlag.end == true) {
                this.modifyTransferMembership()
            }
            this.datepickFlag.end = false
        }
    }

    public isStartDateClicked = false
    onDatePickRangeChange(event: { startDate: string; endDate: string }, type: 'start' | 'end') {
        this.membershipState.date = event
        this.dayDiff = String(this.getDayDiff(this.membershipState.date))
        this.isStartDateClicked = type == 'start'
    }

    getDayDiff(date: { startDate: string; endDate: string }) {
        const date1 = dayjs(date.startDate)
        const date2 = dayjs(date.endDate)

        return date2.diff(date1, 'day') + 1
    }

    // input medthod
    onPriceKeyup(event, type: PriceType) {
        if (event.code == 'Enter') return
        if (type != undefined) {
            this.membershipState.price[type] = this.membershipState.price[type]
                .replace(/[^0-9]/gi, '')
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        } else {
            this.membershipState.amount.normalAmount = this.membershipState.amount.normalAmount
                .replace(/[^0-9]/gi, '')
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }

        this.membershipState.amount.paymentAmount = '0'
        let _total = 0
        const priceKeys = _.keys(this.membershipState.price)
        priceKeys.forEach((key) => {
            _total += Number(this.membershipState.price[key].replace(/[^0-9]/gi, ''))
        })
        this.membershipState.amount.paymentAmount = String(_total)
        this.membershipState.amount.paymentAmount = this.membershipState.amount.paymentAmount
            .replace(/[^0-9]/gi, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        this.modifyTotalPrice()
    }
    onCountKeyup(event) {
        if (event.code == 'Enter') return
        this.membershipState.count.count = this.membershipState.count.count.replace(/[^0-9]/gi, '')
    }

    onCheckInfinite() {
        this.membershipState.count.infinite = !this.membershipState.count.infinite
        this.modifyTransferMembership()
    }

    // state method
    modifyTransferMembership() {
        const itemObj: MembershipTicket = _.cloneDeep({ ...this.membershipState })
        this.onModifyMlItem.emit(itemObj)
    }
    modifyTotalPrice() {
        const itemObj: MembershipTicket = _.cloneDeep({ ...this.membershipState })
        this.onModifyTotalPrice.emit(itemObj)
    }

    // status method
    checkMatchTotalPrice(): boolean {
        return true
        // return this.membershipState.amount.normalAmount == this.membershipState.amount.paymentAmount ? true : false
    }
    checkDateIsSet(): boolean {
        return !!(this.membershipState.date.startDate && this.membershipState.date.endDate)
    }
    isLessonSelected() {
        return true
        return _.some(this.membershipState.lessonList, ['selected', true])
    }

    checkCount() {
        return !(
            (this.membershipState.count.count == '0' || !this.membershipState.count.count) &&
            !this.membershipState.count.infinite
        )
    }

    // selected lesson item method
    getSelectedLessonList() {
        this.selectedLessons = _.map(
            _.filter(this.membershipState.lessonList, ['selected', true]),
            (lessonObj) => lessonObj.item
        )
        if (this.selectedLessons.length == 0) return
        this.selectedLessonText =
            this.selectedLessons.length == 1
                ? `${this.selectedLessons[0].name}`
                : `${this.selectedLessons[0].name} 외 ${this.selectedLessons.length - 1}건`
    }
}
