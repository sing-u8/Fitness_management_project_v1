import { Component, OnInit, Input } from '@angular/core'

@Component({
    selector: 'db-user-flip-list',
    templateUrl: './user-flip-list.component.html',
    styleUrls: ['./user-flip-list.component.scss'],
})
export class UserFlipListComponent implements OnInit {
    @Input() type: string

    public isOpen: boolean
    constructor() {}

    ngOnInit(): void {
        this.isOpen = true
    }

    toggleOpen() {
        this.isOpen = !this.isOpen
    }
}
