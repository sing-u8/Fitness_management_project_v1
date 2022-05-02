import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { LockerItem } from '@schemas/locker-item'

@Component({
    selector: 'db-ml-locker-item',
    templateUrl: './ml-locker-item.component.html',
    styleUrls: ['./ml-locker-item.component.scss'],
})
export class MlLockerItemComponent implements OnInit {
    @Input() lockerItem: LockerItem
    @Input() selectedItem: LockerItem

    @Output() onLockerItemClick = new EventEmitter()

    public selected: boolean
    constructor() {}

    ngOnInit(): void {}

    onItemClick() {
        if (this.lockerItem.state_code == 'locker_item_state_empty') {
            this.onLockerItemClick.emit(this.lockerItem)
        }
    }
}
