import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import _ from 'lodash'
import { originalOrder } from '@helpers/pipe/keyvalue'

import { Booking } from '@schemas/booking'

@Component({
    selector: 'db-user-detail-reservation-item',
    templateUrl: './user-detail-reservation-item.component.html',
    styleUrls: ['./user-detail-reservation-item.component.scss'],
})
export class UserDetailReservationItemComponent implements OnInit {
    @Input() reservation: Booking

    @Output() onCancelBooking = new EventEmitter<Booking>()
    constructor() {}

    ngOnInit(): void {}
}
