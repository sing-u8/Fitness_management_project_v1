import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'

import { LockerItem } from '@schemas/locker-item'
import { UserLocker } from '@schemas/user-locker'

@Component({
    selector: 'rw-dashboard-locker-item',
    templateUrl: './dashboard-locker-item.component.html',
    styleUrls: ['./dashboard-locker-item.component.scss'],
})
export class DashboardLockerItemComponent implements OnInit, OnChanges {
    @Input() lockerItem: LockerItem
    @Input() shiftedLockerTicket: UserLocker
    @Input() isSameCategWithSelectedTicket: boolean

    @Output() onLockerItemClick = new EventEmitter()

    public selected: boolean
    constructor() {}

    ngOnInit(): void {}
    ngOnChanges(): void {
        this.selected =
            this.isSameCategWithSelectedTicket && this.shiftedLockerTicket.locker_item_id == this.lockerItem.id
                ? true
                : false
    }

    onItemClick() {
        if (this.lockerItem.state_code == 'locker_item_state_empty') {
            this.onLockerItemClick.emit(this.lockerItem)
        }
    }
}
