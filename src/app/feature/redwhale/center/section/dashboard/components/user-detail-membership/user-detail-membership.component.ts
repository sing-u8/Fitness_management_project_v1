import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { UserMembership } from '@schemas/user-membership'

@Component({
    selector: 'db-user-detail-membership',
    templateUrl: './user-detail-membership.component.html',
    styleUrls: ['./user-detail-membership.component.scss'],
})
export class UserDetailMembershipComponent implements OnInit {
    @Input() memberships: UserMembership[]

    @Output() onRegisterML = new EventEmitter<void>()

    constructor() {}
    // //
    ngOnInit(): void {}
}
