import { Component, OnInit, Input, AfterViewInit, OnChanges } from '@angular/core'

import { UserGymRoomFE } from '@schemas/firestore/user-gym-room'

import { CenterUser } from '@schemas/center-user'

@Component({
    selector: 'rw-chatting-room-card',
    templateUrl: './chatting-room-card.component.html',
    styleUrls: ['./chatting-room-card.component.scss'],
})
export class ChattingRoomCardComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() userId: string
    @Input() isNoticeRoom: boolean
    @Input() room: UserGymRoomFE
    @Input() selectedRoom: UserGymRoomFE
    @Input() currentUser: CenterUser
    @Input() messengerGetter: (id: string) => CenterUser

    public userList: CenterUser[] = []

    public hideUserCount = false
    public hideUserPicture = false

    constructor() {}

    ngOnInit(): void {
        this.initUserListInScreen()
        this.setHideUserPicture()
        this.setHideUserCount()
    }
    ngAfterViewInit(): void {}
    ngOnChanges(): void {}

    initUserListInScreen() {
        this.userList = this.room.doChatWithMe
            ? [this.room.userList[0]].map((userId) => this.messengerGetter(userId))
            : this.room.userList.filter((userId) => userId != this.userId).map((userId) => this.messengerGetter(userId))
    }
    setHideUserCount() {
        this.hideUserCount = this.currentUser.role_code == 'member' && this.isNoticeRoom
    }
    setHideUserPicture() {
        this.hideUserPicture = this.currentUser.role_code == 'member'
    }
}
