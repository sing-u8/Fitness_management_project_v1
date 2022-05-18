import { Component, OnInit, Input, Output, OnChanges, AfterViewInit, SimpleChanges, EventEmitter } from '@angular/core'

import _ from 'lodash'

import { StorageService } from '@services/storage.service'

import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { Payment } from '@schemas/payment'

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

    @Output() onPriceChange = new EventEmitter<MembershipTicket>()
    @Output() onSelectChange = new EventEmitter<MembershipTicket>()

    public selectedLessonText = ''

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

    onStaffSelectChange() {
        this.onSelectChange.emit(this.membershipTicket)
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
