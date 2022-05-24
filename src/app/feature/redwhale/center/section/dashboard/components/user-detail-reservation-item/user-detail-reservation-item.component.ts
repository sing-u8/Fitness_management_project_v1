import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core'

import _ from 'lodash'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
dayjs.extend(isSameOrAfter)

import { originalOrder } from '@helpers/pipe/keyvalue'

import { Booking } from '@schemas/booking'

@Component({
    selector: 'db-user-detail-reservation-item',
    templateUrl: './user-detail-reservation-item.component.html',
    styleUrls: ['./user-detail-reservation-item.component.scss'],
})
export class UserDetailReservationItemComponent implements OnInit, AfterViewInit {
    @Input() reservation: Booking

    @Output() onCancelBooking = new EventEmitter<Booking>()

    public isBookCancelable = false
    public isBooked = false
    public isBookCancelUnavailableText = '회원의 예약 취소 기간이 마감됨'
    constructor() {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.isBooked = this.reservation.state_code == 'user_membership_class_booking_state_booked'
        this.isBookCancelable =
            dayjs(this.reservation.cancel_booking).isSameOrAfter(dayjs(), 'm') &&
            this.reservation.state_code == 'user_membership_class_booking_state_booked'
    }

    CancelBooking() {
        this.onCancelBooking.emit(this.reservation)
    }
}
