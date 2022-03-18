import { Component, OnInit, Input } from '@angular/core'

@Component({
    selector: 'rw-locker-tip-dropdown',
    templateUrl: './locker-tip-dropdown.component.html',
    styleUrls: ['./locker-tip-dropdown.component.scss'],
})
export class LockerTipDropdownComponent implements OnInit {
    @Input() title: string

    public isDropDownOpen: boolean
    constructor() {}

    ngOnInit(): void {}

    toggleDropdown() {
        this.isDropDownOpen = !this.isDropDownOpen
    }
}
