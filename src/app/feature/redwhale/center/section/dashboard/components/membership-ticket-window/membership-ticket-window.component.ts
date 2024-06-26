import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'

import { ClassItem } from '@schemas/class-item'
import _ from 'lodash'
import dayjs from 'dayjs'

import { StorageService } from '@services/storage.service'
import { CenterMembershipService } from '@services/center-membership.service'

import { MembershipTicket, PriceType } from '@schemas/center/dashboard/register-ml-fullmodal'
import { User } from '@schemas/user'
import { Center } from '@schemas/center'
import { CenterUser } from '@schemas/center-user'
import { MembershipItem } from '@schemas/membership-item'
import { Store } from '@ngrx/store'

@Component({
    selector: 'db-membership-ticket-window',
    templateUrl: './membership-ticket-window.component.html',
    styleUrls: ['./membership-ticket-window.component.scss'],
})
export class MembershipTicketWindowComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() index: number
    @Input() membershipState: MembershipTicket
    @Input() instructors: Array<CenterUser>
    @Input() membershipItems: Array<MembershipItem>

    @Output() onRemoveMlItem = new EventEmitter<number>()
    @Output() onSaveMlItem = new EventEmitter<{ index: number; item: MembershipTicket }>()
    @Output() onModifyMlItem = new EventEmitter<{ index: number; item: MembershipTicket }>()

    @Output() onGetLinkedClassFinish = new EventEmitter<{ index: number; item: MembershipTicket }>()

    public selectedLessons: Array<ClassItem> = []
    public selectedLessonText = ''

    public datepickFlag: { start: boolean; end: boolean } = { start: false, end: false }
    public dayDiff = ''

    public staffSelect_list: Array<{ name: string; value: CenterUser }> = []
    public center: Center
    public user: User
    public centerUser: CenterUser
    // public status: 'modify' | 'done' = 'modify'

    constructor(
        private storageService: StorageService,
        private centerMembershipApi: CenterMembershipService,
        private nxStore: Store
    ) {}

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
        this.getLinkedClassForNewLoading()
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

                if (_.isEmpty(this.membershipState.assignee) && this.centerUser.id == v.id) {
                    this.membershipState.assignee = { name: v.name, value: v }
                }
            })
        }
    }

    // get linked class for loading new type
    getLinkedClassForNewLoading() {
        if (this.membershipState?.loadingType == 'new') {
            this.centerMembershipApi
                .getLinkedClass(
                    this.center.id,
                    this.membershipState.membershipItem.category_id,
                    this.membershipState.membershipItem.id
                )
                .subscribe((linkedClass) => {
                    const item = _.cloneDeep(this.membershipState)
                    item.loadingType = 'new-done'
                    item.lessonList = _.map(linkedClass, (value) => {
                        return { selected: true, item: value }
                    }).reverse()
                    this.onGetLinkedClassFinish.emit({ index: this.index, item })
                })
        }
    }

    // datepicker method
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
    statusToDone() {
        if (this.checkMatchTotalPrice() && this.checkDateIsSet() && this.isLessonSelected() && this.checkCount()) {
            this.onSaveItem()
        }
    }
    statusToModify() {
        this.onModify()
    }

    // selected lesson item method
    getSelectedLessonList() {
        if (this.membershipState?.loadingType == 'new') return
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
