import { Component, OnInit, Input, AfterViewInit, OnChanges } from '@angular/core'

import { CenterUser } from '@schemas/center-user'
import { ChatRoomUser } from '@schemas/chat-room-user'

@Component({
    selector: 'rw-multi-avatar',
    templateUrl: './multi-avatar.component.html',
    styleUrls: ['./multi-avatar.component.scss'],
})
export class MultiAvatarComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() userList: ChatRoomUser[]
    public users: ChatRoomUser[] = []
    constructor() {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.setUserList()
    }
    ngOnChanges() {
        this.setUserList()
    }

    setUserList() {
        if (this.userList.length >= 4) {
            this.users = this.userList.slice(0, 4)
        } else {
            this.users = this.userList
        }
    }
}
