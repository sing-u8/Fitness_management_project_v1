import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { CenterUser } from '@schemas/center-user'

@Component({
    selector: 'rw-chat-room-list-dropdown',
    templateUrl: './chat-room-list-dropdown.component.html',
    styleUrls: ['./chat-room-list-dropdown.component.scss'],
})
export class ChatRoomListDropdownComponent implements OnInit {
    @Input() myId: string
    @Input() userList: CenterUser[]
    @Input() isRoomHost: boolean
    @Output() clickInviteUser = new EventEmitter()

    onInviteUserClick() {
        this.clickInviteUser.emit({})
    }
    constructor() {}

    ngOnInit(): void {}
}
