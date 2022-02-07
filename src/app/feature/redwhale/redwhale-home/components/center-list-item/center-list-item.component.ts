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

import { Gym } from '@schemas/gym'

@Component({
    selector: 'center-list-item',
    templateUrl: './center-list-item.component.html',
    styleUrls: ['./center-list-item.component.scss'],
})
export class CenterListItemComponent implements OnInit, AfterViewInit {
    @Input() userId: string
    @Input() gym: Gym
    @Input() gymList: Array<Gym>
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
        if (!this.gym.picture) {
            this.centerAvatar = this.gym.name.slice(0, 1)
            this.renderer.setStyle(this.list_avatar.nativeElement, 'backgroundColor', this.gym.color)
        } else {
            this.centerAvatar = this.gym.picture
            this.renderer.setStyle(this.list_avatar.nativeElement, 'backgroundImage', `url(${this.centerAvatar})`)
        }
    }
    initCenterBackground() {
        if (!this.gym.background) {
            this.renderer.setStyle(this.list_header.nativeElement, 'backgroundColor', this.gym.color)
        } else {
            this.renderer.setStyle(this.list_header.nativeElement, 'backgroundImage', `url(${this.gym.background})`)
            this.renderer.setStyle(this.list_header.nativeElement, 'opacity', '1')
        }
    }

    // ---------------------gym service------------------>//
    leaveGym() {
        this.handleModalConfirm()
        this.onLeaveCenterEmiiter(this.gym.id)
    }
    goGym(event) {
        if (this.isSideToolbarPressed(event)) return
        this.storageService.setGym(this.gym)
        this.router.navigateByUrl(`/${this.gym.address}`, {
            state: { gymList: this.gymList },
        })
    }
    goGymSetting(event) {
        event.stopPropagation()
        event.preventDefault()
    }
    // <---------------------gym service------------------//

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
