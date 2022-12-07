import { Component, OnInit, Input, Output, OnChanges, AfterViewInit, SimpleChanges, EventEmitter } from '@angular/core'

import _ from 'lodash'

import { StorageService } from '@services/storage.service'

import { CenterUser } from '@schemas/center-user'

// component store
import { MembershipTicket, PriceType } from '@schemas/center/dashboard/modify-payment-fullmodal'

@Component({
    selector: 'db-payment-membership-window',
    templateUrl: './payment-membership-window.component.html',
    styleUrls: ['./payment-membership-window.component.scss'],
})
export class PaymentMembershipWindowComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() membershipTicket: MembershipTicket
    @Input() instructors: Array<CenterUser>
    @Input() changeTicketMethod: (arg: MembershipTicket) => void

    @Output() onPriceChange = new EventEmitter<MembershipTicket>()
    @Output() onSelectChange = new EventEmitter<MembershipTicket>()

    public selectedLessonText = ''

    public staffSelect_list: Array<{ name: string; value: CenterUser; id: string }> = []

    constructor(private storageService: StorageService) {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        // this.getSelectedLessonList()
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (
            !_.isEmpty(changes['membershipTicket']) &&
            changes['membershipTicket'].currentValue.status == 'done' &&
            _.isEmpty(changes['membershipTicket'].currentValue.assignee.value)
        ) {
            this.membershipTicket.assignee.value = _.find(
                this.instructors,
                (v) => v.id == this.membershipTicket.assignee.id
            )
            this.changeTicketMethod(this.membershipTicket)
            console.log('changes in membershipTicket : ', changes)
        }
        if (changes['instructors']) {
            this.staffSelect_list = []
            this.instructors.forEach((v) => {
                this.staffSelect_list.push({
                    name: v.name,
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
            this.membershipTicket.price[type] = this.membershipTicket.price[type]
                .replace(/[^0-9]/gi, '')
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        } else {
            this.membershipTicket.amount.normalAmount = this.membershipTicket.amount.normalAmount
                .replace(/[^0-9]/gi, '')
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
        this.membershipTicket.amount.paymentAmount = '0'
        let _total = 0
        const priceKeys = _.keys(this.membershipTicket.price)
        priceKeys.forEach((key) => {
            _total += Number(this.membershipTicket.price[key].replace(/[^0-9]/gi, ''))
        })
        this.membershipTicket.amount.paymentAmount = String(_total)
        this.membershipTicket.amount.paymentAmount = this.membershipTicket.amount.paymentAmount
            .replace(/[^0-9]/gi, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')

        this.onPriceChange.emit(this.membershipTicket)
    }
}
