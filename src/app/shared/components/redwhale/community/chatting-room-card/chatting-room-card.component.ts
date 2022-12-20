import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core'

import { ChatRoom } from '@schemas/chat-room'
import { ChatRoomUser } from '@schemas/chat-room-user'
import { User } from '@schemas/user'
import { Loading } from '@schemas/store/loading'

import { StorageService } from '@services/storage.service'

import _ from 'lodash'

@Component({
    selector: 'rw-chatting-room-card',
    templateUrl: './chatting-room-card.component.html',
    styleUrls: ['./chatting-room-card.component.scss'],
})
export class ChattingRoomCardComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() curUser: User
    @Input() room: ChatRoom
    @Input() selectedRoom: ChatRoom
    @Input() isLoading: Loading

    @Output() onCardClick = new EventEmitter<ChatRoom>()
    onClick() {
        if (this.isLoading == 'done') {
            this.onCardClick.emit(this.room)
        }
    }

    public userList: ChatRoomUser[] = []
    public chatRoomName = ''

    constructor(private storageService: StorageService) {}

    ngOnInit(): void {
        this.initUserListInScreen()
    }
    ngAfterViewInit(): void {
        this.limitChatRoomName()
    }
    ngOnChanges(): void {}

    initUserListInScreen() {
        this.userList =
            this.room.type_code == 'chat_room_type_chat_with_me'
                ? [
                      {
                          id: this.curUser.id,
                          name: this.curUser.name,
                          email: this.curUser.email,
                          permission_code: undefined,
                          permission_code_name: undefined,
                          color: this.curUser.color,
                          picture: this.curUser.picture,
                          background: this.curUser.background,
                      },
                  ]
                : this.room.chat_room_users.filter((v) => v.id != this.curUser.id).map((v) => v)
    }

    limitChatRoomName() {
        if (this.room.chat_room_users.length == 1) {
            this.chatRoomName = _.filter(this.room.chat_room_users, (v) => v.id != this.curUser.id)[0].name
        } else {
            const userNames = _.split(this.room.name, ', ', 3)
            this.chatRoomName = userNames.length > 2 ? `${userNames[0]}, ${userNames[1]}, ...` : this.room.name
        }
    }
}
