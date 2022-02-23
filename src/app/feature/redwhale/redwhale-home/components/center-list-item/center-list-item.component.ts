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
} from '@angular/core'

import { Router } from '@angular/router'

import { StorageService } from '@services/storage.service'

import { GymConfirmModalService } from '@services/home/gym-confirm-modal.service'

import { Center } from '@schemas/center'

@Component({
    selector: 'center-list-item',
    templateUrl: './center-list-item.component.html',
    styleUrls: ['./center-list-item.component.scss'],
})
export class CenterListItemComponent implements OnInit, AfterViewInit {
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

    constructor(
        private centerModalService: GymConfirmModalService,
        private storageService: StorageService,
        private renderer: Renderer2,
        private router: Router
    ) {
        this.doShowDropDown = false
        this.doShowModal = false
        this.centerModalData = this.centerModalService.initModal('leaveCenter')
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.initCenterAvatar()
        this.initCenterBackground()
    }
    initCenterAvatar() {
        if (!this.center.picture) {
            this.centerAvatar = this.center.name.slice(0, 1)
            this.renderer.setStyle(this.list_avatar.nativeElement, 'backgroundColor', this.center.color)
        } else {
            this.centerAvatar = this.center.picture
            this.renderer.setStyle(this.list_avatar.nativeElement, 'backgroundImage', `url(${this.centerAvatar})`)
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
        return this.doShowDropDown == true ? true : false
    }
}

/*
    ADMIN: 'administrator', - 운영자
    MANAGER: 'manager',  - 관리자
    STAFF: 'staff',  - 직원
    MEMBER: 'member',  - 회원
*/
