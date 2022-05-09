import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
    selector: 'db-user-detail-reservation',
    templateUrl: './user-detail-reservation.component.html',
    styleUrls: ['./user-detail-reservation.component.scss'],
})
export class UserDetailReservationComponent implements OnInit {
    @Input() reservations: any

    @Output() onRegisterML = new EventEmitter<void>()
    constructor() {}

    ngOnInit(): void {}
}
