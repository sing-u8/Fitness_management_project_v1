import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core'
import { Router, ActivatedRoute, NavigationStart, Event as NavigationEvent } from '@angular/router'

import { StorageService } from '@services/storage.service'
import { CenterService } from '@services/center.service'
import { UsersCenterService } from '@services/users-center.service'
import { WsChatService } from '@services/web-socket/ws-chat.service'
import { CenterRolePermissionService } from '@services/center-role-permission.service'
import { CenterPermissionHelperService } from '@services/helper/center-permission-helper.service'
import { FreeTrialHelperService } from '@services/helper/free-trial-helper.service'

import { User } from '@schemas/user'
import { Center } from '@schemas/center'
import { Drawer } from '@schemas/store/app/drawer.interface'

import _ from 'lodash'

import { SettingTermConfirmOutput } from '@shared/components/common/setting-terms-modal/setting-terms-modal.component'
import { SettingNoticeConfirmOutput } from '@shared/components/common/setting-notice-modal/setting-notice-modal.component'

// rxjs
import { Observable, Subscription } from 'rxjs'

// ngrx
import { Store, select } from '@ngrx/store'
import { resetAllState } from '@centerStore/actions/sec.center.all.actions'
import { drawerSelector } from '@appStore/selectors'
import { openDrawer, closeDrawer } from '@appStore/actions/drawer.action'
import { setCenterPermissionModal } from '@centerStore/actions/center.common.actions'
import { PermissionObj } from '@centerStore/reducers/center.common.reducer'
import { centerPermission, curCenter, curCenterAndPermission } from '@centerStore/selectors/center.common.selector'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { showModal } from '@appStore/actions/modal.action'
import { showToast } from '@appStore/actions/toast.action'

@Component({
    selector: 'rw-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
    TAG = 'Header'

    url: string
    drawer$: Observable<Drawer>
    user: User
    center: Center

    centerList: Array<Center> = []
    invitedGymList: Array<Center>

    centerPermissionObj: PermissionObj

    popupGymListVisible: boolean
    avatarMenuVisible: boolean

    public isSettingApproved = false

    public unSubscriber$ = new Subject<void>()

    public centerHeaderTag = ''
    public isSubOver = {
        freeTrial: false,
        subscription: false,
    }

    constructor(
        private router: Router,
        private storageService: StorageService,
        private centerService: CenterService,
        private usersCenterService: UsersCenterService,
        private activatedRoute: ActivatedRoute,
        private nxStore: Store,
        private wsChatService: WsChatService,
        private centerPermissionHelperService: CenterPermissionHelperService,
        private centerRolePermissionService: CenterRolePermissionService,
        private freeTrialHelperService: FreeTrialHelperService
    ) {}

    ngOnInit(): void {
        this.url = this.router.url
        this.drawer$ = this.nxStore.pipe(select(drawerSelector))
        this.user = this.storageService.getUser()
        this.center = this.storageService.getCenter()
        this.centerTerms = this.center?.contract_terms ?? ''
        this.centerNoticeText = this.center?.notice ?? ''

        this.getCenterList()

        this.nxStore.pipe(select(curCenterAndPermission), takeUntil(this.unSubscriber$)).subscribe((obj) => {
            if (!_.isEmpty(obj.curCenter)) {
                this.isSettingApproved = this.centerPermissionHelperService.getSettingPermission()
            }
        })
        this.nxStore.pipe(select(centerPermission), takeUntil(this.unSubscriber$)).subscribe((po) => {
            this.centerPermissionObj = po
        })
        this.centerHeaderTag = this.freeTrialHelperService.getHeaderPeriodAlertText(this.center)
    }
    ngAfterViewInit() {
        this.checkDoShowSubOverModal()
        this.router.events.pipe(takeUntil(this.unSubscriber$)).subscribe((event: NavigationEvent) => {
            if (event instanceof NavigationStart) {
                this.center = this.storageService.getCenter()
                this.checkDoShowSubOverModal()
                console.log('in header event url : ', event.url, ' - ', event, ' - ', this.isSubOver)
            }
        })
    }

    ngOnDestroy(): void {
        this.unSubscriber$.next()
        this.unSubscriber$.complete()
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

    openRoleModal() {
        this.nxStore.dispatch(setCenterPermissionModal({ visible: true }))
        this.closeSettingDropdown()
        this.hidePopupGymList()
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
                const url = `${window.location.origin}/${center.address}`
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
            this.nxStore.dispatch(closeDrawer({ tabName: 'none' }))
        } else {
            this.nxStore.dispatch(openDrawer({ tabName: tabName }))
        }
        drSubscription.unsubscribe()
    }

    goTouchPad() {
        this.router.navigate(['./touch-pad'], { relativeTo: this.activatedRoute })
    }

    public showSettingDropdown = false
    toggleSettingDropdown() {
        this.showSettingDropdown = !this.showSettingDropdown
    }
    closeSettingDropdown() {
        this.showSettingDropdown = false
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
        this.wsChatService.closeChatWs()
    }

    resetCenterState() {
        resetAllState(this.nxStore)
    }

    // setting terms vars and methods
    public centerTerms = ''
    public showSettingTermsModal = false
    openSettingTermsModal() {
        this.closeSettingDropdown()
        this.hidePopupGymList()
        this.showSettingTermsModal = true
    }
    cancelSettingTermsModal() {
        this.showSettingTermsModal = false
        this.centerTerms = this.center.contract_terms
    }
    confirmSettingTermsModal(e: SettingTermConfirmOutput) {
        e.loadingFns.showLoading()
        this.centerService.updateCenter(this.center.id, { contract_terms: e.centerTerm }).subscribe((center) => {
            this.center = center
            this.storageService.setCenter(this.center)
            this.centerTerms = center.contract_terms
            this.showSettingTermsModal = false
            this.nxStore.dispatch(showToast({ text: '센터 약관 설정이 수정되었습니다.' }))
            e.loadingFns.hideLoading()
        })
    }

    // setting notice modal vars and methods
    public centerNoticeText = ''
    public showSettingNoticeModal = false
    openSettingNoticeModal() {
        this.closeSettingDropdown()
        this.hidePopupGymList()
        this.showSettingNoticeModal = true
    }
    cancelSettingNoticeModal() {
        this.showSettingNoticeModal = false
        this.centerNoticeText = this.center.notice
    }
    confirmSettingNoticeModal(e: SettingNoticeConfirmOutput) {
        e.loadingFns.showLoading()
        this.centerService.updateCenter(this.center.id, { notice: e.centerNoticeText }).subscribe((center) => {
            this.center = center
            this.storageService.setCenter(this.center)
            this.centerNoticeText = e.centerNoticeText
            this.showSettingNoticeModal = false
            this.nxStore.dispatch(showToast({ text: '센터 공지사항이 수정되었습니다.' }))
            e.loadingFns.hideLoading()
        })
    }

    // subscription over modal
    public showSubOverModal = false
    openSubOverModal() {
        this.showSubOverModal = true
    }
    closeSubOverModal() {
        this.showSubOverModal = false
    }
    public subOverData = {
        text: '',
        subText: ``,
        cancelButtonText: '뒤로 가기',
        confirmButtonText: '결제하기',
    }
    onCancelSubOver() {
        this.showSubOverModal = false
        this.router.navigate(['redwhale-home'])
    }
    onConfirmSubOver() {
        this.showSubOverModal = false
    }
    setSubOverData() {
        if (this.isSubOver.freeTrial) {
            this.subOverData.text = '무료 체험 기간이 종료되었습니다.'
            this.subOverData.subText = `무료 체험 기간 종료일로부터 14일 이내에
                접속 이력이 없다면 센터의 모든 정보가 삭제됩니다.
                계속 이용하고자 할 경우, 결제를 진행해주세요.`
        } else if (this.isSubOver.subscription) {
            this.subOverData.text = '이용권이 만료되었습니다.'
            this.subOverData.subText = `이용권이 만료되어 기능을 사용하실 수 없어요.
                계속 이용하고자 할 경우, 결제를 진행해주세요.`
        }
    }
    checkDoShowSubOverModal() {
        // console.log('checkDoShowSubOverModal -- ', _.isEmpty(this.center))
        this.closeSubOverModal()
        if (_.isEmpty(this.center)) return
        this.isSubOver = this.freeTrialHelperService.isSubscriptionOver(this.center)
        this.setSubOverData()
        if (this.isSubOver.freeTrial || this.isSubOver.subscription) {
            this.openSubOverModal()
        }
        console.log('checkDoShowSubOverModal -- ', this.showSubOverModal, this.subOverData)
    }
}
