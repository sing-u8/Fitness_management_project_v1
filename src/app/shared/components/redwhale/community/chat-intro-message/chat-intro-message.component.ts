import { Component, OnInit, Input, OnChanges } from '@angular/core'

import { UserGymRoomFE } from '@schemas/firestore/user-gym-room'
import { User } from '@schemas/user'

@Component({
    selector: 'rw-chat-intro-message',
    templateUrl: './chat-intro-message.component.html',
    styleUrls: ['./chat-intro-message.component.scss'],
})
export class ChatIntroMessageComponent implements OnInit, OnChanges {
    @Input() isSideBar: boolean
    @Input() selectedRoom: UserGymRoomFE
    @Input() msgList: Array<any>
    @Input() user: User
    @Input() showIntroMessage: boolean

    constructor() {}

    public isNewRoom = false

    ngOnInit(): void {}
    ngOnChanges(): void {
        this.updateIsNewRoom()
    }

    updateIsNewRoom() {
        this.isNewRoom =
            (this.msgList.length == 0 || (this.msgList.length == 1 && this.msgList[0].type == 'date')) &&
            this.showIntroMessage
                ? true
                : false
    }
}
