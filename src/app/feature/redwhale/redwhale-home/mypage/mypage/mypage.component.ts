import { Component, OnInit, ViewChild, ElementRef, OnChanges } from '@angular/core'
import { Location } from '@angular/common'
import { Router } from '@angular/router'

import { StorageService } from '@services/storage.service'
import { GlobalSettingAccountService } from '@services/home/global-setting-account.service'

import { User } from '@schemas/user'

type navigationOption = 'journal' | 'mission' | 'ticket' | 'reservation' | 'setting-account'

@Component({
    selector: 'rw-mypage',
    templateUrl: './mypage.component.html',
    styleUrls: ['./mypage.component.scss'],
})
export class MypageComponent implements OnInit, OnChanges {
    public currentNavigation: navigationOption
    public user: User

    public accountUserData: { name: string; avatar: string; email: string }

    @ViewChild('userAvatar') userAvatarEl: ElementRef

    constructor(
        private location: Location,
        private router: Router,
        private storageService: StorageService,
        private globalSettingAccountService: GlobalSettingAccountService
    ) {
        this.initCurrentNavigation()
    }

    ngOnInit(): void {
        this.user = this.storageService.getUser()

        this.globalSettingAccountService.setUserName(this.user.nick_name ?? this.user.name)
        this.globalSettingAccountService.setUserAvatar(this.user.picture[0]?.url)
        this.globalSettingAccountService.setUserEmail(this.user.email)
        // console.log('global setting data: ', this.globalSettingAccountService.getUserData())
        this.accountUserData = this.globalSettingAccountService.getUserData()
    }

    ngOnChanges(): void {
        // console.log('onchange in mypage -- glabal flag: ', this.globalSettingAccountService.changeFlag)
    }

    goRouterLink(url: string) {
        this.router.navigateByUrl(url)
    }

    goBack() {
        this.location.back()
    }
    // ----------------------  methods related to user ----------------------//

    // ----------------------  methods related to navigation ----------------------//
    // 라우팅 명에 의존성이 있음

    initCurrentNavigation() {
        const urlFrag = this.router.url.split('/')
        const optionConvertor = {
            'exercise-journal': 'journal',
            'mission-management': 'mission',
            membership: 'ticket',
            reservation: 'reservation',
            'setting-account': 'setting-account',
        }
        this.currentNavigation = optionConvertor[urlFrag[urlFrag.length - 1]]
    }

    onClickNavigation(navigationType: navigationOption) {
        const urlConverter = {
            journal: '/redwhale-home/mypage/exercise-journal',
            mission: '/redwhale-home/mypage/mission-management',
            ticket: '/redwhale-home/mypage/membership',
            reservation: '/redwhale-home/mypage/reservation',
            'setting-account': '/redwhale-home/mypage/setting-account',
        }
        this.currentNavigation = navigationType
        this.goRouterLink(urlConverter[navigationType])
    }

    // ----------------------  methods related to eula ----------------------//

    termsEULAVisible: boolean
    termsPrivacyVisible: boolean

    showModal(name: string) {
        if (name == 'termsEULA') {
            this.termsEULAVisible = true
        } else if (name == 'termsPrivacy') {
            this.termsPrivacyVisible = true
        }
    }

    hideModal(name: string) {
        if (name == 'termsEULA') {
            this.termsEULAVisible = false
        } else if (name == 'termsPrivacy') {
            this.termsPrivacyVisible = false
        }
    }
}
