import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'

import { ClassItem } from '@schemas/class-item'
import _ from 'lodash'
import dayjs from 'dayjs'

import { StorageService } from '@services/storage.service'

import { MembershipTicket, PriceType, MembershipLockerItem } from '@schemas/center/dashboard/register-ml-fullmodal'
import { User } from '@schemas/user'
import { Center } from '@schemas/center'
import { CenterUser } from '@schemas/center-user'

@Component({
    selector: 'rw-membership-ticket-window',
    templateUrl: './membership-ticket-window.component.html',
    styleUrls: ['./membership-ticket-window.component.scss'],
})
export class MembershipTicketWindowComponent implements OnInit, AfterViewInit {
    @Input() index: number
    @Input() membershipState: MembershipTicket
    @Input() instructors: Array<CenterUser>

    @Output() onRemoveMlItem = new EventEmitter<number>()
    @Output() onSaveMlItem = new EventEmitter<{ index: number; item: MembershipTicket }>()
    @Output() onModifyMlItem = new EventEmitter<{ index: number; item: MembershipTicket }>()

    public lessonItemList: Array<{ selected: boolean; item: ClassItem }>
    public selectedLessons: Array<ClassItem> = []
    public selectedLessonText = ''

    public datepickFlag: { start: boolean; end: boolean } = { start: false, end: false }
    public dayDiff = ''

    public staffSelect_list: Array<{ name: string; value: CenterUser }> = []
    public StaffSelectValue: { name: string; value: CenterUser } = { name: '', value: undefined }

    public center: Center
    public user: User
    // public status: 'modify' | 'done' = 'modify'

    constructor(private storageService: StorageService) {}

    ngOnInit(): void {
        this.center = this.storageService.getCenter()
        this.user = this.storageService.getUser()
    }
    ngAfterViewInit(): void {
        this.StaffSelectValue = this.membershipState.assignee
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
    }
    onCountKeyup(event) {
        if (event.code == 'Enter') return
        this.membershipState.count.count = this.membershipState.count.count.replace(/[^0-9]/gi, '')
    }

    // state method
    onRemoveItem() {
        this.onRemoveMlItem.emit(this.index)
    }

    onSaveItem() {
        const itemObj: MembershipTicket = _.cloneDeep({ ...this.membershipState, ...{ status: 'done' } })
        this.onSaveMlItem.emit({ index: this.index, item: itemObj })
    }
    onModify() {
        const itemObj: MembershipTicket = _.cloneDeep({ ...this.membershipState, ...{ status: 'modify' } })
        this.onModifyMlItem.emit({ index: this.index, item: itemObj })
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
