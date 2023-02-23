import {
    Component,
    OnInit,
    AfterViewInit,
    Input,
    Renderer2,
    ViewChild,
    ElementRef,
    Output,
    EventEmitter,
    OnDestroy,
} from '@angular/core'

import { Router } from '@angular/router'

import { StorageService } from '@services/storage.service'
import { GymConfirmModalService } from '@services/home/gym-confirm-modal.service'
import { CenterRolePermissionService } from '@services/center-role-permission.service'
import { CenterService } from '@services/center.service'
import { FreeTrialHelperService } from '@services/helper/free-trial-helper.service'

import { Center } from '@schemas/center'
import { SettingTermConfirmOutput } from '@shared/components/common/setting-terms-modal/setting-terms-modal.component'

import _ from 'lodash'

import { showRoleModal } from '@appStore/actions/modal.action'
import { roleModalSelector } from '@appStore/selectors'
import { Store, select } from '@ngrx/store'
import { forkJoin, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { Permission } from '@schemas/store/app/modal.interface'
import { SettingNoticeConfirmOutput } from '@shared/components/common/setting-notice-modal/setting-notice-modal.component'
import { showToast } from '@appStore/actions/toast.action'

@Component({
    selector: 'center-list-item',
    templateUrl: './center-list-item.component.html',
    styleUrls: ['./center-list-item.component.scss'],
})
export class CenterListItemComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() userId: string
    @Input() center: Center
    @Input() centerList: Array<Center>
    @Input() dropDownUp: boolean

    @Output() onLeaveCenter = new EventEmitter<string>()
    onLeaveCenterEmiiter(centerId: string) {
        this.onLeaveCenter.emit(centerId)
    }

    @ViewChild('list_header') list_header: ElementRef
    @ViewChild('list_avatar') list_avatar: ElementRef
    @ViewChild('toolbar_right') toolbar_right: ElementRef

    public centerAvatar: string

    public doShowDropDown: boolean
    public doShowModal: boolean
    public centerModalData
    public centerPermissionObj: Permission = {
        visible: false,
        administrator: [],
        instructor: [],
    }
    public centerTerms: string = undefined

    public unSubscriber$ = new Subject<void>()

    public centerTag = ''

    constructor(
        private centerModalService: GymConfirmModalService,
        private storageService: StorageService,
        private renderer: Renderer2,
        private router: Router,
        private nxStore: Store,
        private centerRolePermissionService: CenterRolePermissionService,
        private centerService: CenterService,
        private freeTrialHelperService: FreeTrialHelperService
    ) {
        this.doShowDropDown = false
        this.doShowModal = false
        this.centerModalData = this.centerModalService.initModal('leaveCenter')
    }

    ngOnInit(): void {
        this.centerTag = this.freeTrialHelperService.getPeriodAlertTag(this.center)
        const c1 = _.cloneDeep(this.center)
        c1.free_trial_end_date = '2023-02-28'
        const c2 = _.cloneDeep(this.center)
        c2.free_trial_end_date = '2023-02-26'
        const c3 = _.cloneDeep(this.center)
        c3.free_trial_end_date = '2023-02-23'
        const c4 = _.cloneDeep(this.center)
        c4.free_trial_end_date = '2023-02-22'
        console.log(
            'center list item : ',
            this.centerTag,
            this.freeTrialHelperService.getPeriodAlertTag(c1),
            this.freeTrialHelperService.getPeriodAlertTag(c2),
            this.freeTrialHelperService.getPeriodAlertTag(c3),
            this.freeTrialHelperService.getHeaderPeriodAlertText(c1),
            this.freeTrialHelperService.getHeaderPeriodAlertText(c2),
            this.freeTrialHelperService.getHeaderPeriodAlertText(c3),
            this.freeTrialHelperService.getHeaderPeriodAlertText(c4)
        )
    }
    ngOnDestroy(): void {
        this.unSubscriber$.next()
        this.unSubscriber$.complete()
    }

    ngAfterViewInit(): void {
        this.initCenterRoleName()
        this.initCenterAvatar()
        // this.initCenterBackground()
        this.centerTerms = this.center.contract_terms
        this.centerNoticeText = this.center.notice

        this.nxStore.pipe(select(roleModalSelector), takeUntil(this.unSubscriber$)).subscribe((roleModal) => {
            if (roleModal.center?.id == this.center.id) {
                this.centerPermissionObj = _.cloneDeep(roleModal).permissionCategObj
            }
        })
        forkJoin([
            this.centerRolePermissionService.getCenterRolePermission(this.center.id, 'administrator'),
            this.centerRolePermissionService.getCenterRolePermission(this.center.id, 'instructor'),
        ]).subscribe(([adminPCList, instPCList]) => {
            this.centerPermissionObj = {
                visible: this.centerPermissionObj.visible,
                administrator: adminPCList,
                instructor: instPCList,
            }
        })

        // this.centerRolePermissionService.getCenterRoles(this.center.id).subscribe((role) => {
        //     console.log('center - ', this.center, ' -- ', 'role : ', role)
        // })
        // this.centerRolePermissionService
        //     .modifyCenterRolePermission(this.center.id, 'instructor', 'read_stats_sales', {
        //         approved: false,
        //     })
        //     .subscribe()
    }
    initCenterAvatar() {
        if (!this.center.picture) {
            this.centerAvatar = _.trim(this.center.name).slice(0, 1)
            this.renderer.setStyle(this.list_avatar.nativeElement, 'backgroundColor', this.center.color)
            this.renderer.setStyle(this.list_header.nativeElement, 'backgroundColor', this.center.color)
        } else {
            this.centerAvatar = this.center.picture
            this.renderer.setStyle(this.list_avatar.nativeElement, 'backgroundImage', `url(${this.centerAvatar})`)
            this.renderer.setStyle(this.list_avatar.nativeElement, 'backgroundColor', 'var(--white)')
            this.renderer.setStyle(this.list_header.nativeElement, 'backgroundImage', `url(${this.centerAvatar})`)
            this.renderer.setStyle(this.list_header.nativeElement, 'opacity', '1')
        }
    }
    initCenterBackground() {
        if (!this.center.background) {
            this.renderer.setStyle(this.list_header.nativeElement, 'backgroundColor', this.center.color)
        } else {
            this.renderer.setStyle(this.list_header.nativeElement, 'backgroundImage', `url(${this.center.background})`)
            this.renderer.setStyle(this.list_header.nativeElement, 'opacity', '1')
        }
    }

    public centerRoleName = ''
    initCenterRoleName() {
        if (this.center.role_code == 'owner') {
            this.centerRoleName = '운영자'
        } else if (this.center.role_code == 'member') {
            this.centerRoleName = '회원'
        }
    }

    public showSettingDropdown = false
    toggleSettingDropdown() {
        this.showSettingDropdown = !this.showSettingDropdown
    }
    closeSettingDropdown() {
        this.showSettingDropdown = false
    }

    // set terms vars and methods
    public showSettingTermsModal = false
    openSettingTermsModal() {
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
            this.centerNoticeText = e.centerNoticeText
            this.showSettingNoticeModal = false
            this.nxStore.dispatch(showToast({ text: '센터 공지사항이 수정되었습니다.' }))
            e.loadingFns.hideLoading()
        })
    }

    // ---------------------center service------------------>//
    leaveGym() {
        this.handleModalConfirm()
        this.onLeaveCenterEmiiter(this.center.id)
    }
    goGym(event) {
        if (this.isSideToolbarPressed(event)) return
        this.storageService.setCenter(this.center)
        this.router.navigateByUrl(`/${this.center.address}`, {
            state: { centerList: this.centerList },
        })
    }
    goGymSetting(event) {
        event.stopPropagation()
        event.preventDefault()
        this.router.navigate(['redwhale-home', 'set-center', this.center.id])
    }

    openRoleModal(event) {
        event.stopPropagation()
        event.preventDefault()
        this.nxStore.dispatch(
            showRoleModal({
                center: this.center,
                permissionCategObj: {
                    ...this.centerPermissionObj,
                    visible: true,
                },
            })
        )
    }
    // <---------------------center service------------------//

    toggleDropDown(event) {
        event.stopPropagation()
        this.doShowDropDown = !this.doShowDropDown
    }
    hideDropDown() {
        this.doShowDropDown = false
    }

    toggleConfirmModal(flag: boolean) {
        this.doShowModal = flag
    }

    handleModalCancel() {
        this.doShowModal = false
    }
    handleModalConfirm() {
        this.doShowModal = false
    }

    reloadPage() {
        window.location.reload()
    }

    isSideToolbarPressed(event) {
        return this.doShowDropDown == true
    }

    // owner modal
    public doShowOwnerModal = false
    public onwerModaldata = {
        text: '운영자는 센터를 나가실 수 없어요.',
        subText: `운영자 권한을 양도하거나 등록된 회원을
            모두 삭제한 후에 센터 나가기가 가능합니다.`,
    }
    showOwnerModal() {
        this.doShowOwnerModal = true
    }
    hideOwnerModal() {
        this.doShowOwnerModal = false
    }

    leaveGymIfNotOwner() {
        if (this.center.role_code != 'owner') {
            this.leaveGym()
        } else {
            this.handleModalCancel()
            this.showOwnerModal()
        }
    }
    // ------------------------------------------------------------------------------------------
}

/*
    Owner: 'owner', - 운영자
    // MANAGER: 'manager',  - 관리자
    // STAFF: 'staff',  - 직원
    Member: 'member',  - 회원
*/

/*

이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.

이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.이용약관 입니다.
 */
