import { Component, OnInit, Input, Output, AfterViewInit } from '@angular/core'

import { Message } from '@schemas/firestore/message'
import { CenterUser } from '@schemas/center-user'

// !! 이후에 수정 필요 (Message, 상태관리 관련 코드들)
@Component({
    selector: 'rw-chat-message-user',
    templateUrl: './chat-message-user.component.html',
    styleUrls: ['./chat-message-user.component.scss'],
})
export class ChatMessageUserComponent implements OnInit, AfterViewInit {
    @Input() message: Message
    @Input() showUserInfo: boolean
    @Input() isSidebar: boolean
    @Input() currentUser: CenterUser
    @Input() messengerGetter: (id: string) => CenterUser

    public messenger: CenterUser = undefined
    public hideMessengerPicture = false

    constructor() {}

    ngOnInit(): void {
        this.getMessageUser()
        this.setShowMessengerPicture()
    }
    ngAfterViewInit(): void {
        // console.log('message in chat MSG comp: ', this.message)
    }

    getMessageUser() {
        this.messenger = this.messengerGetter(this.message.user._id)
    }
    setShowMessengerPicture() {
        this.hideMessengerPicture = this.currentUser.role_code == 'member' && this.messenger.role_code == 'member'
    }
}
