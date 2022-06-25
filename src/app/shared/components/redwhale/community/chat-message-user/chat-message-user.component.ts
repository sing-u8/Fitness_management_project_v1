import { Component, OnInit, Input, Output, AfterViewInit } from '@angular/core'

import { ChatRoomMessage } from '@schemas/chat-room-message'

@Component({
    selector: 'rw-chat-message-user',
    templateUrl: './chat-message-user.component.html',
    styleUrls: ['./chat-message-user.component.scss'],
})
export class ChatMessageUserComponent implements OnInit, AfterViewInit {
    @Input() message: ChatRoomMessage
    @Input() showUserInfo: boolean
    @Input() isSidebar: boolean
    // @Input() currentUser: CenterUser

    constructor() {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {}
}
