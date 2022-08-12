import { Component, OnInit, Input } from '@angular/core'

import { Locker } from '@schemas/center/dashboard/register-ml-fullmodal'
import { ContractUserLocker } from '@schemas/contract-user-locker'

@Component({
    selector: 'db-locker-window-registered',
    templateUrl: './locker-window-registered.component.html',
    styleUrls: ['./locker-window-registered.component.scss'],
})
export class LockerWindowRegisteredComponent implements OnInit {
    @Input() type: 'register' | 'contract' = 'register'
    @Input() lockerState: Locker
    @Input() contractUserLocker: ContractUserLocker

    constructor() {}

    ngOnInit(): void {}
}
