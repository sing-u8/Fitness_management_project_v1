import { Component, OnInit } from '@angular/core'

import { StorageService } from '@services/storage.service'
import { UsersCenterService } from '@services/users-center.service'

import { User } from '@schemas/user'
import { Center } from '@schemas/center'
@Component({
    selector: 'rw-membership',
    templateUrl: './membership.component.html',
    styleUrls: ['./membership.component.scss'],
})
export class MembershipComponent implements OnInit {
    public user: User = undefined
    public userCenterList: Array<{ name: string; value: Center }> = []
    public selectedUserCenter: { name: string; value: Center } = { name: undefined, value: undefined }

    public isLoaded = false

    constructor(private usersCenterService: UsersCenterService, private storageService: StorageService) {
        this.user = this.storageService.getUser()
        this.usersCenterService.getCenterList(this.user.id).subscribe((centerList) => {
            if (centerList.length == 0) {
                this.isLoaded = true
                return
            }
            this.userCenterList = centerList.map((center) => ({ name: center.name, value: center }))
            this.selectedUserCenter = { name: centerList[0].name, value: centerList[0] }
            this.isLoaded = true
        })
        this.usersCenterService.getCenterList(this.user.id)
    }

    ngOnInit(): void {}
}
