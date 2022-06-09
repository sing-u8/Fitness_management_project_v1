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
import { resetAllState } from '@centerStore/actions/sec.center.all.actions'
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

    centerList: Array<Center> = []
    invitedGymList: Array<Center>

    popupGymListVisible: boolean
    avatarMenuVisible: boolean

    constructor(
        private router: Router,
        private storageService: StorageService,
        private centerService: CenterService,
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
            next: (centerList) => {
                this.centerList = centerList

                if (!this.user.selected_center) {
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
        this.centerList
            .filter((center, index) => {
                return address == center.address
            })
            .map((center, index) => {
                this.storageService.setCenter(center)
                this.user = this.storageService.getUser()
            })
    }

    changeGym(center: Center) {
        if (this.user.selected_center.address == center.address) return
        this.resetCenterState()
        this.centerService.getCenter(center.id).subscribe({
            next: (center) => {
                this.storageService.setCenter(center)
                const url = `${window.location.origin}/${center.address}/community`
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

    goTouchPad() {
        this.router.navigate(['./touch-pad'], { relativeTo: this.activatedRoute })
    }

    goSettingCenter() {
        this.router.navigate(['redwhale-home', 'set-center', this.user.selected_center.id])
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
        this.resetCenterState()
        await this.storageService.logout()
    }

    resetCenterState() {
        resetAllState(this.nxStore)
    }
}
