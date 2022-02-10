import {
    Component,
    Input,
    ElementRef,
    Renderer2,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    AfterViewChecked,
    OnInit,
    ViewChild,
} from '@angular/core'

import { UserService } from '@services/user.service'
import { StorageService } from '@services/storage.service'

import { modalType } from '@schemas/home/setting-account-modal'
import { User } from '@schemas/user'

// ngrx
import { Store } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'

@Component({
    selector: 'rw-setting-modal',
    templateUrl: './setting-modal.component.html',
    styleUrls: ['./setting-modal.component.scss'],
})
export class SettingModalComponent implements OnChanges, AfterViewChecked, OnInit {
    @Input() visible: boolean
    @Input() data: any
    @Input() activatedModalType: modalType
    @Input() userData: any

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @ViewChild('name') name
    @ViewChild('birth_date') birth_date

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<any>()

    public user: User

    public initUserData: any

    public toast_menu_text: string

    public isMouseModalDown: boolean

    nameValid: boolean

    changed: boolean

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private userService: UserService,
        private storageService: StorageService,
        private nxStore: Store
    ) {
        this.user = this.storageService.getUser()
        this.isMouseModalDown = false
        this.nameValid = false
    }
    ngOnInit() {}
    ngOnChanges(changes: SimpleChanges) {
        this.initUserData = this.userData // 저장된 데이터 백업

        if (!changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true

                console.log('setting modal userdata : ', this.userData)
            }
        }
    }
    ngAfterViewChecked() {
        if (this.changed) {
            this.changed = false

            if (this.visible) {
                this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'display-block')
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
            }
        }
    }

    onCancel(): void {
        this.userData = this.initUserData // 수정 안됐을 때 복구
        this.resetMouseModalDown()
        this.cancel.emit({})
    }

    onConfirm(): void {
        this.confirm.emit(this.userData)
    }

    // input methods

    // --- sex method
    onMale() {
        this.userData = 'male'
    }
    onFemale() {
        this.userData = 'female'
    }

    // -- marketing-agree
    onSMS() {
        this.userData.sms = this.userData.sms ? false : !this.userData.sms ? true : null
    }
    onEmail() {
        this.userData.email = this.userData.email ? false : !this.userData.email ? true : null
    }
    // user update service and object

    getUpdateReqBody(activeModalType: modalType, userData) {
        switch (activeModalType) {
            case 'NAME':
                this.toast_menu_text = '이름이'
                return { nick_name: userData }
            case 'SEX':
                this.toast_menu_text = '성별이'
                return { sex: userData }
            case 'MARKETING_AGREE':
                this.toast_menu_text = '마케팅 수신 동의가'
                return { sms_marketing: userData.sms, email_marketing: userData.email }
            case 'PUSH_NOTICE':
                this.toast_menu_text = '푸시 알림 설정이'
                const onOffFlag = userData ? true : false
                return { push_notification: onOffFlag }
            case 'BIRTH_DATE':
                this.toast_menu_text = '생년월일이'
                return { birth_date: userData }
            default: 
                return {}
        }
    }

    getUpdateUserData() {
        const reqBody = this.getUpdateReqBody(this.activatedModalType, this.userData)
        this.userService.updateUser(this.user.id, reqBody).subscribe({
            next: (user) => {
                this.storageService.setUser(user)
                this.onConfirm()
                this.nxStore.dispatch(showToast({ text: this.toast_menu_text + ' ' + '변경되었습니다.' }))
            },
            error: (err) => {
                console.log('user update err in setting modal: ', err)
            },
        })
    }

    //  keypress methods
    birthdateCheck(event) {
        const code = event.which ? event.which : event.keyCode
        this.matchBirthdateForm(event)
        if (code < 48 || code > 57) {
            return false
        }
        return true
    }
    nameCheck(event) {
        const reg = /^[가-힣|a-z|A-Z]$/
        if (!reg.test(event.key)) {
            return false
        }
        return true
    }

    // matching check

    matchBirthdateForm(event) {
        const userDataSize = this.userData.length
        const lastStr = this.userData[userDataSize - 1]
        const digitReg = /[\d]/g
        const dotReg = /[.]/g

        if (userDataSize == 5) {
            if (digitReg.test(lastStr)) {
                this.userData = this.userData.slice(0, 4) + '.' + this.userData.slice(4)
            } else if (dotReg.test(lastStr)) {
                this.userData = this.userData.slice(0, 4)
            }
        } else if (userDataSize == 8) {
            if (digitReg.test(lastStr)) {
                this.userData = this.userData.slice(0, 7) + '.' + this.userData.slice(7)
            } else if (dotReg.test(lastStr)) {
                this.userData = this.userData.slice(0, 7)
            }
        }
    }
    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
}

//   "NAME" | "SEX" | "MARKETING_AGREE" | "PUSH_NOTICE" | "BIRTH_DATE"
