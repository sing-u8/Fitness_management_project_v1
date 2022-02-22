import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'

import { StorageService } from '@services/storage.service'

import { CenterService } from '@services/center.service'
import { UsersCenterService } from '@services/users-center.service'

import { User } from '@schemas/user'
import { Center } from '@schemas/center'

// rxjs
import { Observable, Subscription } from 'rxjs'

// ngrx
import { Store, select } from '@ngrx/store'
import { drawerSelector } from '@appStore/selectors'
import { showModal } from '@appStore/actions/modal.action'
import { openDrawer, closeDrawer } from '@appStore/actions/drawer.action'

import { Drawer } from '@schemas/store/app/drawer.interface'

@Component({
    selector: 'rw-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    TAG = 'Header'

    url: string
    drawer$: Observable<Drawer>
    user: User

    gymList: Array<Center>
    invitedGymList: Array<Center>

    popupGymListVisible: boolean
    avatarMenuVisible: boolean

    constructor(
        private router: Router,
        private storageService: StorageService,
        private gymService: CenterService,
        private usersCenterService: UsersCenterService,
        private activatedRoute: ActivatedRoute,
        private nxStore: Store
    ) {}

    ngOnInit(): void {
        this.url = this.router.url
        this.drawer$ = this.nxStore.pipe(select(drawerSelector))
        this.user = this.storageService.getUser()

        this.getCenterList()
    }

    goRouterLink(link: string) {
        this.hidePopupGymList()
        this.hideAvatarMenu()
        this.router.navigateByUrl(link)
    }

    getCenterList() {
        this.usersCenterService.getCenterList(this.user.id).subscribe({
            next: (gymList) => {
                this.gymList = gymList

                if (!this.user.selected_gym) {
                    this.checkSelectedGym()
                }
            },
            error: (e) => {
                this.nxStore.dispatch(showModal({ data: { text: this.TAG, subText: e.message } }))
            },
        })
    }

    checkSelectedGym() {
        const address = this.router.url.split('/')[1]
        this.gymList
            .filter((gym, index) => {
                return address == gym.address
            })
            .map((gym, index) => {
                this.storageService.setCenter(gym)
                this.user = this.storageService.getUser()
            })
    }

    changeGym(gym: Center) {
        if (this.user.selected_gym.address == gym.address) return
        this.gymService.getCenter(gym.id).subscribe({
            next: (gym) => {
                this.storageService.setCenter(gym)
                const url = `${window.location.origin}/${gym.address}/community`
                window.open(url, '_self')
            },
            error: (e) => {
                this.nxStore.dispatch(showModal({ data: { text: this.TAG, subText: e.message } }))
            },
        })
    }

    showPopupGymList(event) {
        event.stopPropagation()
        this.hideAvatarMenu()
        if (this.popupGymListVisible) {
            this.hidePopupGymList()
        } else {
            this.popupGymListVisible = true
        }
    }

    hidePopupGymList() {
        this.popupGymListVisible = false
    }

    openDrawer(tabName: 'member' | 'community' | 'notification' | 'general-schedule' | 'lesson-schedule') {
        let drawer: Drawer = undefined
        const drSubscription: Subscription = this.nxStore.pipe(select(drawerSelector)).subscribe((_drawer) => {
            drawer = _drawer
        })
        if (drawer.tabName == tabName) {
            this.nxStore.dispatch(closeDrawer())
        } else {
            this.nxStore.dispatch(openDrawer({ tabName: tabName }))
        }
        drSubscription.unsubscribe()
    }

    goInvitedGym() {
        this.router.navigateByUrl('/redwhale-home/invited-gym')
    }

    goTouchPad() {
        this.router.navigate(['./touch-pad'], { relativeTo: this.activatedRoute })
    }

    showAvatarMenu(event) {
        event.stopPropagation()
        this.hidePopupGymList()
        if (this.avatarMenuVisible) {
            this.hideAvatarMenu()
        } else {
            this.avatarMenuVisible = true
        }
    }

    hideAvatarMenu() {
        this.avatarMenuVisible = false
    }

    async logout() {
        // await this.storageService.removeUser()
        // this.router.navigateByUrl('/auth/login')
        await this.storageService.logout()
    }
}
