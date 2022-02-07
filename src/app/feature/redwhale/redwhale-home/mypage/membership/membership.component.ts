import { Component, OnInit } from '@angular/core'

import { StorageService } from '@services/storage.service'
import { UserGymService } from '@services/user-gym.service'

import { User } from '@schemas/user'
import { Gym } from '@schemas/gym'
@Component({
    selector: 'rw-membership',
    templateUrl: './membership.component.html',
    styleUrls: ['./membership.component.scss'],
})
export class MembershipComponent implements OnInit {
    public user: User = undefined
    public userGymList: Array<{ name: string; value: Gym }> = []
    public selectedUserGym: { name: string; value: Gym } = { name: undefined, value: undefined }

    public isLoaded = false

    constructor(private userGymService: UserGymService, private storageService: StorageService) {
        this.user = this.storageService.getUser()
        this.userGymService.getGymList(this.user.id).subscribe((gymList) => {
            if (gymList.length == 0) {
                this.isLoaded = true
                return
            }
            this.userGymList = gymList.map((gym) => ({ name: gym.name, value: gym }))
            this.selectedUserGym = { name: gymList[0].name, value: gymList[0] }
            this.isLoaded = true
        })
        this.userGymService.getGymList(this.user.id)
    }

    ngOnInit(): void {}
}
