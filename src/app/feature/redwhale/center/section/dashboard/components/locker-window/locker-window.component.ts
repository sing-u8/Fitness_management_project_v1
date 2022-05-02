import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'
import _ from 'lodash'
import dayjs from 'dayjs'

import { StorageService } from '@services/storage.service'

import { Locker, PriceType, MembershipLockerItem } from '@schemas/center/dashboard/register-ml-fullmodal'
import { User } from '@schemas/user'
import { Center } from '@schemas/center'
import { CenterUser } from '@schemas/center-user'

@Component({
    selector: 'rw-locker-window',
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
    public StaffSelectValue: { name: string; value: CenterUser }

    public dayDiff = ''

    public gym: Center
    public user: User

    constructor(private storageService: StorageService) {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.StaffSelectValue = this.lockerState.assignee
        this.dayDiff = String(this.getDayDiff(this.lockerState.date))
        if (this.lockerState.status == 'modify') {
            this.gym = this.storageService.getCenter()
            this.user = this.storageService.getUser()
        }
    }
    ngOnChanges(changes: SimpleChanges): void {
        console.log('locker-window on chagnes : ', changes)
        if (changes['Instructors']) {
            this.Instructors.forEach((v) => {
                this.staffSelect_list.push({
                    name: v.center_user_name,
                    value: v,
                })

                if (!this.StaffSelectValue) {
                    this.user.id == v.id ? (this.StaffSelectValue = { name: v.center_user_name, value: v }) : null
                }
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
    onPriceKeyup(event, type: PriceType) {
        if (event.code == 'Enter') return
        this.lockerState.price[type] = this.lockerState.price[type]
            .replace(/[^0-9]/gi, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    // state method
    onRemoveItem() {
        this.onRemoveMlItem.emit(this.index)
    }
    onSaveItem() {
        const itemObj: Locker = {
            type: 'locker',
            date: this.lockerState.date,
            price: this.lockerState.price,
            assignee: _.cloneDeep(this.StaffSelectValue),
            locker: _.cloneDeep(this.lockerState.locker),
            lockerCategory: _.cloneDeep(this.lockerState.lockerCategory),
            status: 'done',
        }

        this.onSaveMlItem.emit({ index: this.index, item: itemObj })
    }
    onModify() {
        const itemObj: Locker = {
            type: 'locker',
            locker: _.cloneDeep(this.lockerState.locker),
            lockerCategory: _.cloneDeep(this.lockerState.lockerCategory),
            assignee: _.cloneDeep(this.StaffSelectValue),
            status: 'modify',
        }

        this.onModifyMlItem.emit({ index: this.index, item: itemObj })
    }

    // status method
    statusToDone() {
        if (this.lockerState.date.startDate && this.lockerState.date.endDate) {
            // !! need to be modified
            // this.lockerState.price = this.lockerState.price ?? '0'
            this.onSaveItem()
        }
    }
    statusToModify() {
        this.onModify()
    }
}
