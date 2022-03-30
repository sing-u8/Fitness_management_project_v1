import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core'

import * as dayjs from 'dayjs'
import 'dayjs/locale/ko'
dayjs.locale('ko')

import { Reservation } from '@schemas/gym-dashboard'
// !! 아직 적용 불가

@Component({
    selector: 'rw-dashboard-reservation-card',
    templateUrl: './dashboard-reservation-card.component.html',
    styleUrls: ['./dashboard-reservation-card.component.scss'],
})
export class DashboardReservationCardComponent implements OnInit, OnChanges {
    @Input() reservation: Reservation
    @Output() onCancel = new EventEmitter<Reservation>()
    cancelReservation() {
        this.onCancel.emit(this.reservation)
    }

    public reservation_dateTime: string
    public imageBackground = 'var(--lightgrey)'

    constructor() {}

    ngOnInit(): void {}
    ngOnChanges(): void {
        console.log('DashboardReservationCardComponent reservation: ', this.reservation)
        if (this.reservation) {
            this.reservation_dateTime =
                dayjs(this.reservation.task.start).format('YYYY.MM.DD (dd) HH:mm') +
                ' - ' +
                dayjs(this.reservation.task.end).format('HH:mm')
        }
    }
}
