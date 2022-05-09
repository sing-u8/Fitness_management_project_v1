import { Component, OnInit, Input, Output } from '@angular/core'

@Component({
    selector: 'db-user-detail-reservation-item',
    templateUrl: './user-detail-reservation-item.component.html',
    styleUrls: ['./user-detail-reservation-item.component.scss'],
})
export class UserDetailReservationItemComponent implements OnInit {
    @Input() reservation: any
    constructor() {}

    ngOnInit(): void {}
}
