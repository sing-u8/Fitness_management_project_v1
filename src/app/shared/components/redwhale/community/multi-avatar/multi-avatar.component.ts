import { Component, OnInit, Input, AfterViewInit, OnChanges } from '@angular/core'

import { CenterUser } from '@schemas/center-user'

@Component({
    selector: 'rw-multi-avatar',
    templateUrl: './multi-avatar.component.html',
    styleUrls: ['./multi-avatar.component.scss'],
})
export class MultiAvatarComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() hideUserPicture: boolean
    @Input() userList: CenterUser[]
    public users: CenterUser[] = []
    public hideUserPictureList: boolean[] = []
    constructor() {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.setUserList()
        this.setShowUserPictureList()
    }
    ngOnChanges() {
        this.setUserList()
        this.setShowUserPictureList()
    }

    setUserList() {
        if (this.userList.length >= 4) {
            this.users = this.userList.slice(0, 4)
        } else {
            this.users = this.userList
        }
    }

    setShowUserPictureList() {
        if (this.userList.length >= 4) {
            this.hideUserPictureList = this.userList
                .slice(0, 4)
                .map((user) => user.role_code == 'member' && this.hideUserPicture)
        } else {
            this.hideUserPictureList = this.userList.map((user) => user.role_code == 'member' && this.hideUserPicture)
        }
    }
}
