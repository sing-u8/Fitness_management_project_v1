import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { UserLocker } from '@schemas/user-locker'
@Component({
    selector: 'db-user-detail-locker',
    templateUrl: './user-detail-locker.component.html',
    styleUrls: ['./user-detail-locker.component.scss'],
})
export class UserDetailLockerComponent implements OnInit {
    @Input() lockers: UserLocker[]

    @Output() onRegisterML = new EventEmitter<void>()
    constructor() {}

    ngOnInit(): void {}
}
