import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'

import { UsersService } from '@services/users.service'
import { StorageService } from '@services/storage.service'

import { User } from '@schemas/user'

@Component({
    selector: 'remove-account',
    templateUrl: './remove-account.component.html',
    styleUrls: ['./remove-account.component.scss'],
})
export class RemoveAccountComponent implements OnInit {
    public user: User

    public removeInput: string

    public removeModalVisible: boolean

    constructor(
        private usersService: UsersService,
        private storageService: StorageService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.user = this.storageService.getUser()
        this.removeInput = ''
        this.removeModalVisible = false
    }

    ngOnInit(): void {}

    toggleRemoveModal() {
        this.removeModalVisible = !this.removeModalVisible
    }

    onRemoveAccountCancel() {
        this.toggleRemoveModal()
    }
    onRemoveAccountConfirm() {
        this.toggleRemoveModal()
        this.usersService.deleteUser(this.user.id).subscribe({
            next: async (_) => {
                console.log('delte')
                await this.storageService.removeUser()
                this.goToRemoveComplete()
            },
            error: (err) => {
                console.log('err in delete user: ', err)
            },
        })
    }

    goRouterLink(url: string) {
        this.router.navigateByUrl(url)
    }
    goToRemoveComplete() {
        this.router.navigate(['remove-complete'], { relativeTo: this.activatedRoute })
    }
}
