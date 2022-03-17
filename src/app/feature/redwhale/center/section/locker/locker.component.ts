import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'locker',
    templateUrl: './locker.component.html',
    styleUrls: ['./locker.component.scss'],
})
export class LockerComponent implements OnInit {
    // <----
    public isEditMode = false

    // ----->

    constructor() {}

    ngOnInit(): void {}
}
