import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { UserLocker } from '@schemas/user-locker'
@Component({
    selector: 'db-user-detail-locker-item',
    templateUrl: './user-detail-locker-item.component.html',
    styleUrls: ['./user-detail-locker-item.component.scss'],
})
export class UserDetailLockerItemComponent implements OnInit {
    @Input() locker: UserLocker

    @Output() onRegisterML = new EventEmitter<void>()
    constructor() {}

    ngOnInit(): void {}
}
