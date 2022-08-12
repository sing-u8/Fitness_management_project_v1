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

import { Center } from '@schemas/center'
import { PermissionCategory } from '@schemas/permission-category'
import { SettingTermConfirmOutput } from '@shared/components/common/setting-terms-modal/setting-terms-modal.component'

import _ from 'lodash'

import { showRoleModal } from '@appStore/actions/modal.action'
import { roleModalSelector } from '@appStore/selectors'
import { Store, select } from '@ngrx/store'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

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
    public centerPermission: Array<PermissionCategory> = []
    public centerTerms: string = undefined

    public unSubscriber$ = new Subject<void>()

    constructor(
        private centerModalService: GymConfirmModalService,
        private storageService: StorageService,
        private renderer: Renderer2,
        private router: Router,
        private nxStore: Store,
        private centerRolePermissionService: CenterRolePermissionService,
        private centerService: CenterService
    ) {
        this.doShowDropDown = false
        this.doShowModal = false
        this.centerModalData = this.centerModalService.initModal('leaveCenter')
    }

    ngOnInit(): void {}
    ngOnDestroy(): void {
        this.unSubscriber$.next()
        this.unSubscriber$.complete()
    }

    ngAfterViewInit(): void {
        this.initCenterRoleName()
        this.initCenterAvatar()
        this.initCenterBackground()
        this.centerTerms = this.center.contract_terms

        this.centerRolePermissionService
            .getCenterRolePermission(this.center.id, 'instructor')
            .subscribe((permissionCategs) => {
                this.centerPermission = permissionCategs
            })
        this.nxStore.pipe(select(roleModalSelector), takeUntil(this.unSubscriber$)).subscribe((roleModal) => {
            if (roleModal.center?.id == this.center.id) {
                this.centerPermission = _.cloneDeep(roleModal).permissionCateg
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
        } else {
            this.centerAvatar = this.center.picture
            this.renderer.setStyle(this.list_avatar.nativeElement, 'backgroundImage', `url(${this.centerAvatar})`)
            this.renderer.setStyle(this.list_avatar.nativeElement, 'backgroundColor', 'var(--white)')
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
        this.nxStore.dispatch(showRoleModal({ center: this.center, instPermissionCategs: this.centerPermission }))
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
        subText: `센터 운영자는 운영자 권한 양도 후에
                센터 나가기가 가능합니다.`,
    }
    showOwerModal() {
        this.doShowOwnerModal = true
    }
    hideOwnerModal() {
        this.doShowOwnerModal = false
    }

    leaveGymIfNotOnwer() {
        if (this.center.role_code != 'owner') {
            this.leaveGym()
        } else {
            this.handleModalCancel()
            this.showOwerModal()
        }
    }
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
