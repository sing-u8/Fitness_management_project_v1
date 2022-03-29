import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core'
import { Subscription } from 'rxjs'
import * as dayjs from 'dayjs'

import { LockerItem } from '@schemas/locker-item'

@Component({
    selector: 'rw-ml-locker-item',
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
        if (this.lockerItem.status == 'empty') {
            this.onLockerItemClick.emit(this.lockerItem)
        }
    }
}
