import { Component, OnInit, Input } from '@angular/core'

@Component({
    selector: 'rw-membership-locker-card',
    templateUrl: './membership-locker-card.component.html',
    styleUrls: ['./membership-locker-card.component.scss'],
})
export class MembershipLockerCardComponent implements OnInit {
    @Input() type // locker | membership
    constructor() {}

    ngOnInit(): void {}
}
