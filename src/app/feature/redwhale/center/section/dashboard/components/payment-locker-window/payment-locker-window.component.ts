import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'
import _ from 'lodash'

import { StorageService } from '@services/storage.service'

import { User } from '@schemas/user'
import { Center } from '@schemas/center'
import { CenterUser } from '@schemas/center-user'

// component store
import { LockerTicket, PriceType } from '@schemas/center/dashboard/modify-payment-fullmodal'

@Component({
    selector: 'db-payment-locker-window',
    templateUrl: './payment-locker-window.component.html',
    styleUrls: ['./payment-locker-window.component.scss'],
})
export class PaymentLockerWindowComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() lockerTicket: LockerTicket
    @Input() instructors: Array<CenterUser>

    @Output() onPriceChange = new EventEmitter<LockerTicket>()
    @Output() onSelectChange = new EventEmitter<LockerTicket>()

    public staffSelect_list: Array<{ name: string; value: CenterUser }> = []
    public center: Center

    constructor(private storageService: StorageService) {}

    ngOnInit(): void {
        this.center = this.storageService.getCenter()
    }
    ngAfterViewInit(): void {
        // this.getSelectedLessonList()
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['instructors']) {
            // console.log('changes in payment-membership-window : ', changes) // !! 생각보다 자주 바뀜 문제시 수정 필요, 상태를음좀 더 나눠야할 수 있음
            this.center = this.storageService.getCenter()

            this.staffSelect_list = []
            this.instructors.forEach((v) => {
                this.staffSelect_list.push({
                    name: v.center_user_name,
                    value: v,
                })
            })
        }
    }

    nStaffSelectChange() {
        this.onSelectChange.emit(this.lockerTicket)
    }

    // input medthod
    onPriceKeyup(event, type: PriceType) {
        if (event.code == 'Enter') return
        if (type != undefined) {
            this.lockerTicket.price[type] = this.lockerTicket.price[type]
                .replace(/[^0-9]/gi, '')
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        } else {
            this.lockerTicket.amount.normalAmount = this.lockerTicket.amount.normalAmount
                .replace(/[^0-9]/gi, '')
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
        this.lockerTicket.amount.paymentAmount = '0'
        let _total = 0
        const priceKeys = _.keys(this.lockerTicket.price)
        priceKeys.forEach((key) => {
            _total += Number(this.lockerTicket.price[key].replace(/[^0-9]/gi, ''))
        })
        this.lockerTicket.amount.paymentAmount = String(_total)
        this.lockerTicket.amount.paymentAmount = this.lockerTicket.amount.paymentAmount
            .replace(/[^0-9]/gi, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')

        this.onPriceChange.emit(this.lockerTicket)
    }
}
