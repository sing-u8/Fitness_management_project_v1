import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'
import _ from 'lodash'
import dayjs from 'dayjs'

import { StorageService } from '@services/storage.service'

import { Locker, PriceType } from '@schemas/center/dashboard/register-ml-fullmodal'
import { User } from '@schemas/user'
import { Center } from '@schemas/center'
import { CenterUser } from '@schemas/center-user'

@Component({
    selector: 'db-locker-window',
    templateUrl: './locker-window.component.html',
    styleUrls: ['./locker-window.component.scss'],
})
export class LockerWindowComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() index: number
    @Input() lockerState: Locker
    @Input() Instructors: Array<CenterUser>

    @Output() onRemoveMlItem = new EventEmitter<number>()
    @Output() onSaveMlItem = new EventEmitter<{ index: number; item: Locker }>()
    @Output() onModifyMlItem = new EventEmitter<{ index: number; item: Locker }>()

    public datepickFlag: { end: boolean } = { end: false }
    public staffSelect_list: Array<{ name: string; value: CenterUser }> = []

    public dayDiff = ''

    public gym: Center
    public user: User

    constructor(private storageService: StorageService) {}

    ngOnInit(): void {
        this.gym = this.storageService.getCenter()
        this.user = this.storageService.getUser()
    }
    ngAfterViewInit(): void {
        this.dayDiff = String(this.getDayDiff(this.lockerState.date))
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['Instructors']) {
            this.gym = this.storageService.getCenter()
            this.user = this.storageService.getUser()
            this.Instructors.forEach((v) => {
                this.staffSelect_list.push({
                    name: v.name,
                    value: v,
                })

                if (!this.lockerState.assignee) {
                    if (this.user.id == v.id) this.lockerState.assignee = { name: v.name, value: v }
                }
            })
        }
    }

    // datepicker method
    onDatePickRangeChange(event: { startDate: string; endDate: string }) {
        this.lockerState.date = event
        this.dayDiff = String(this.getDayDiff(this.lockerState.date))
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
            this.lockerState.price[type] = this.lockerState.price[type]
                .replace(/[^0-9]/gi, '')
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        } else {
            this.lockerState.amount.normalAmount = this.lockerState.amount.normalAmount
                .replace(/[^0-9]/gi, '')
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }

        this.lockerState.amount.paymentAmount = '0'
        let _total = 0
        const priceKeys = _.keys(this.lockerState.price)
        priceKeys.forEach((key) => {
            _total += Number(this.lockerState.price[key].replace(/[^0-9]/gi, ''))
        })
        this.lockerState.amount.paymentAmount = String(_total)
        this.lockerState.amount.paymentAmount = this.lockerState.amount.paymentAmount
            .replace(/[^0-9]/gi, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    // state method
    onRemoveItem() {
        this.onRemoveMlItem.emit(this.index)
    }
    onSaveItem() {
        const itemObj: Locker = _.cloneDeep({ ...this.lockerState, ...{ status: 'done' } })
        this.onSaveMlItem.emit({ index: this.index, item: itemObj })
    }
    onModify() {
        const itemObj: Locker = _.cloneDeep({ ...this.lockerState, ...{ status: 'modify' } })
        this.onModifyMlItem.emit({ index: this.index, item: itemObj })
    }

    // status method
    checkMatchTotalPrice(): boolean {
        return true
        // return this.lockerState.amount.normalAmount == this.lockerState.amount.paymentAmount ? true : false
    }
    checkDateIsSet(): boolean {
        return !!(this.lockerState.date.startDate && this.lockerState.date.endDate)
    }
    statusToDone() {
        if (this.checkDateIsSet() && this.checkMatchTotalPrice()) {
            this.onSaveItem()
        }
    }
    statusToModify() {
        this.onModify()
    }
}
