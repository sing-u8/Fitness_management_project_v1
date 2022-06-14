import { Component, OnInit, Input, AfterViewInit, OnChanges } from '@angular/core'

import { ChatRoom } from '@schemas/chat-room'
import { ChatRoomUser } from '@schemas/chat-room-user'

@Component({
    selector: 'rw-chatting-room-card',
    templateUrl: './chatting-room-card.component.html',
    styleUrls: ['./chatting-room-card.component.scss'],
})
export class ChattingRoomCardComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() userId: string
    @Input() room: ChatRoom
    @Input() selectedRoom: ChatRoom

    public userList: ChatRoomUser[] = []

    constructor() {}

    ngOnInit(): void {
        this.initUserListInScreen()
    }
    ngAfterViewInit(): void {}
    ngOnChanges(): void {}

    initUserListInScreen() {
        this.userList =
            this.room.type_code == 'chat_room_type_chat_with_me'
                ? [this.room.chat_room_users.find((v) => v.id == this.userId)]
                : this.room.chat_room_users.filter((v) => v.id != this.userId).map((v) => v)
    }
}
