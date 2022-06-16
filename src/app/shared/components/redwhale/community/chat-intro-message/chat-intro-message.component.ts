import { Component, OnInit, Input, OnChanges } from '@angular/core'

import { ChatRoom } from '@schemas/chat-room'
import { ChatRoomMessage } from '@schemas/chat-room-message'
import { User } from '@schemas/user'

@Component({
    selector: 'rw-chat-intro-message',
    templateUrl: './chat-intro-message.component.html',
    styleUrls: ['./chat-intro-message.component.scss'],
})
export class ChatIntroMessageComponent implements OnInit, OnChanges {
    @Input() isSideBar: boolean
    @Input() selectedRoom: ChatRoom
    @Input() msgList: Array<ChatRoomMessage>
    @Input() isTempRoom: boolean
    @Input() user: User

    constructor() {}

    public isNewRoom = false

    ngOnInit(): void {}
    ngOnChanges(): void {
        this.updateIsNewRoom()
    }

    updateIsNewRoom() {
        this.isNewRoom = this.msgList.length == 0 ? true : false
    }
    // || (this.msgList.length == 1 && this.msgList[0].type == 'date')
}
