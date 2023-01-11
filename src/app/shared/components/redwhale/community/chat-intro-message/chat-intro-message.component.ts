import { Component, OnInit, Input, OnChanges } from '@angular/core'

import { ChatRoom } from '@schemas/chat-room'
import { ChatRoomMessage } from '@schemas/chat-room-message'
import { CenterUser } from '@schemas/center-user'
import { Loading } from '@schemas/store/loading'

import _ from 'lodash'

@Component({
    selector: 'rw-chat-intro-message',
    templateUrl: './chat-intro-message.component.html',
    styleUrls: ['./chat-intro-message.component.scss'],
})
export class ChatIntroMessageComponent implements OnInit, OnChanges {
    @Input() isSideBar: boolean
    @Input() selectedRoom: ChatRoom
    @Input() preSelectedRoom: ChatRoom
    @Input() joinRoomLoading: Loading
    @Input() msgList: Array<ChatRoomMessage>
    @Input() isTempRoom: boolean
    @Input() centerUser: CenterUser

    constructor() {}

    public isNewRoom = false

    public dmChatRoomName = undefined
    public dmPreChatRoomName = undefined

    ngOnInit(): void {}
    ngOnChanges(): void {
        this.updateIsNewRoom()
        this.initDmChatRoomName()
    }

    updateIsNewRoom() {
        this.isNewRoom = this.msgList.length == 0
    }

    initDmChatRoomName() {
        if (this.selectedRoom.chat_room_users.length == 1) {
            this.dmChatRoomName = this.selectedRoom.chat_room_users.find((v) => v.id != this.centerUser.id).name
        }
        if (!_.isEmpty(this.preSelectedRoom) && this.selectedRoom.chat_room_users.length == 1) {
            this.dmPreChatRoomName = this.preSelectedRoom.chat_room_users.find((v) => v.id != this.centerUser.id).name
        }
    }
    // || (this.msgList.length == 1 && this.msgList[0].type == 'date')
}
