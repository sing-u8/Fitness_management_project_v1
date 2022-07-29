import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'
import _ from 'lodash'

import { StorageService } from '@services/storage.service'

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
    @Input() changeTicketMethod: (arg: LockerTicket) => void

    @Output() onPriceChange = new EventEmitter<LockerTicket>()
    @Output() onSelectChange = new EventEmitter<LockerTicket>()

    public staffSelect_list: Array<{ name: string; value: CenterUser; id: string }> = []

    constructor(private storageService: StorageService) {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {}
    ngOnChanges(changes: SimpleChanges): void {
        if (
            !_.isEmpty(changes['lockerTicket']) &&
            changes['lockerTicket'].currentValue.status == 'done' &&
            _.isEmpty(changes['lockerTicket'].currentValue.assignee.value)
        ) {
            this.lockerTicket.assignee.value = _.find(this.instructors, (v) => v.id == this.lockerTicket.assignee.id)
            this.changeTicketMethod(this.lockerTicket)
            console.log('changes in membershipTicket : ', changes)
        }
        if (changes['instructors']) {
            this.staffSelect_list = []
            this.instructors.forEach((v) => {
                this.staffSelect_list.push({
                    name: v.center_user_name,
                    value: v,
                    id: v.id,
                })
            })
        }
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
