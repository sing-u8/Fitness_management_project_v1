import { Component, OnInit, Input } from '@angular/core'

import { Locker } from '@schemas/center/dashboard/register-ml-fullmodal'

@Component({
    selector: 'db-locker-window-registered',
    templateUrl: './locker-window-registered.component.html',
    styleUrls: ['./locker-window-registered.component.scss'],
})
export class LockerWindowRegisteredComponent implements OnInit {
    @Input() lockerState: Locker

    constructor() {}

    ngOnInit(): void {}
}
