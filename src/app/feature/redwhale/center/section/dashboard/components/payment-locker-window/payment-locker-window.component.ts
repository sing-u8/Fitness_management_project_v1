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

    public staffSelect_list: Array<{ name: string; value: CenterUser; id: string }> = []
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
            this.center = this.storageService.getCenter()
            const user = this.storageService.getUser()

            this.staffSelect_list = []
            this.instructors.forEach((v) => {
                this.lockerTicket.assignee =
                    v.id == user.id
                        ? {
                              name: v.center_user_name,
                              value: v,
                              id: v.id,
                          }
                        : this.lockerTicket.assignee
                // v.id == this.lockerTicket.assignee?.id
                //     ? {
                //           name: v.center_user_name,
                //           value: v,
                //           id: v.id,
                //       }
                //     : this.lockerTicket.assignee
                this.staffSelect_list.push({
                    name: v.center_user_name,
                    value: v,
                    id: v.id,
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
