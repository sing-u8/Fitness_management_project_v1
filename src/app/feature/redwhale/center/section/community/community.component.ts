import { Component, OnInit } from '@angular/core'

import { CenterUser } from '@schemas/center-user'

@Component({
    selector: 'community',
    templateUrl: './community.component.html',
    styleUrls: ['./community.component.scss'],
})
export class CommunityComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}

    // addfile button vars and func
    public addBtSrcObj = { leave: 'assets/icons/etc/plus-grey.svg', hover: 'assets/icons/etc/plus-red.svg' }
    public addBtSrc = 'assets/icons/etc/plus-grey.svg'
    addFileBtMouseLeave() {
        this.addBtSrc = this.addBtSrcObj.leave
    }
    addFileBtMouseHover() {
        this.addBtSrc = this.addBtSrcObj.hover
    }
    // <-----------------------------------

    // <-----------------------------------

    // modal vars and fucntions
    public doShowCreateRoomModal = false
    showCreateRoomModal() {
        this.doShowCreateRoomModal = true
    }
    hideCreateRoomModal() {
        this.doShowCreateRoomModal = false
    }
    onCreateRoomConfirm(members: Array<CenterUser>) {
        this.hideCreateRoomModal()
        // members.length == 1 ? this.createDmRoom(members) : this.createGroupRoom(members)
    }

    public doShowInviteUserModal = false
    showInviteUserModal() {
        this.doShowInviteUserModal = true
    }
    hideInviteUserModal() {
        this.doShowInviteUserModal = false
    }
    onInviteUserConfirm(members: Array<CenterUser>) {
        console.log('onInviteUserConfirm: ', members)
        this.hideInviteUserModal()
        // const addedUserIdList = this.addUserToSelectedRoom(members).map((roomUser) => roomUser.userId)
        // const mergedUserIdList = [...this.selectedRoom.value.userList, ...addedUserIdList]
        // this.sendInviteInfoMessage(members, this.selectedRoom.value.userList)
        // this.selectedRoom.value.userList.forEach((userId) => {
        //     this.firestoreService.updateUserRoom(userId, this.gym.id, this.selectedRoom.value.id, {
        //         userList: mergedUserIdList,
        //     })
        // })
        // this.selectedRoom.value.userList = mergedUserIdList
    }
    // <---------------------
}
