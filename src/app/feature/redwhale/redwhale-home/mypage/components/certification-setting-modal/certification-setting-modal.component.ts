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
    ViewChild,
    OnDestroy,
    OnInit,
} from '@angular/core'

import { modalType } from '@schemas/home/setting-account-modal'
import { User } from '@schemas/user'

import { AuthService } from '@services/auth.service'
import { StorageService } from '@services/storage.service'

// ngrx
import { Store } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'

@Component({
    selector: 'rw-certification-setting-modal',
    templateUrl: './certification-setting-modal.component.html',
    styleUrls: ['./certification-setting-modal.component.scss'],
})
export class CertificationSettingModalComponent implements OnChanges, AfterViewChecked, OnDestroy, OnInit {
    @ViewChild('phoneVerifRef') phoneVerifRef
    @ViewChild('newPhoneRef') newPhoneRef

    @ViewChild('emailVerifRef') emailVerifRef
    @ViewChild('newEmailRef') newEmailRef

    @Input() visible: boolean
    @Input() data: any
    @Input() activatedModalType: modalType

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<any>()

    public newInfoStr: string
    public newInfoStrErr: string
    public verificationCode: number
    public verificationCodeErr: string

    public timeLeft: number
    public interval: any

    public user: User

    public isMouseModalDown: boolean

    public triedVerifCode: boolean

    changed: boolean

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private authService: AuthService,
        private storageService: StorageService,
        private nxStore: Store
    ) {
        this.isMouseModalDown = false
        this.triedVerifCode = false
    }
    ngOnInit() {
        this.user = this.storageService.getUser()
        this.timeLeft = -1
    }
    ngOnChanges(changes: SimpleChanges) {
        if (!changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
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

    ngOnDestroy() {
        this.stopTimer()
    }

    onCancel(): void {
        this.resetAllVariables()
        this.cancel.emit({})
    }

    onConfirm(): void {
        this.confirm.emit(this.newInfoStr)
    }

    resetAllVariables() {
        this.newInfoStr = ''
        this.newInfoStrErr = ''
        this.verificationCode = null
        this.verificationCodeErr = ''

        clearInterval(this.interval)
        this.timeLeft = -1
    }

    // time methods
    startTimer() {
        this.verificationCodeErr = ''

        this.timeLeft = 3 * 60
        this.interval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--
            } else {
                this.stopTimer()
            }
        }, 1000)
    }

    stopTimer() {
        this.verificationCodeErr =
            this.activatedModalType == 'EMAIL'
                ? '입력 시간이 초과되었어요. [인증메일 받기] 버튼을 눌러주세요!'
                : this.activatedModalType == 'PHONE'
                ? '입력 시간이 초과되었어요. [인증번호 받기] 버튼을 눌러주세요!'
                : ''
        clearInterval(this.interval)
    }

    // phone methods

    checkDigit(event) {
        const code = event.which ? event.which : event.keyCode
        if (code < 48 || code > 57) {
            return false
        }
        return true
    }

    phoneFormCheck() {
        let isValid = false
        if (this.triedVerifCode) {
            return false
        }
        const verificationCode = this.verificationCode + ''
        if (this.newPhoneRef.valid && verificationCode && verificationCode.length == 4 && this.timeLeft > 0) {
            isValid = true
        }

        return isValid
    }

    sendVerificationCodeSMSChange() {
        if (this.newPhoneRef.invalid) {
            return
        }
        this.phoneVerifRef.valueAccessor._elementRef.nativeElement.focus()

        this.authService.sendVerificationCodeSMSChange({ phone_number: this.newInfoStr }).subscribe({
            next: (v) => {
                this.nxStore.dispatch(showToast({ text: '인증번호 문자가 전송되었습니다.' }))
                if (this.interval) {
                    this.stopTimer()
                }
                this.startTimer()
            },
            error: (e) => {
                this.nxStore.dispatch(showToast({ text: e.message }))
            },
        })
    }

    finishPhoneChange() {
        this.authService
            .checkVerificationCodeSMSChange({
                verification_code: this.verificationCode,
            })
            .subscribe({
                next: (v) => {
                    this.user.phone_number = this.newInfoStr
                    this.user.phone_number_verified = true
                    this.storageService.setUser(this.user)
                    this.onConfirm()
                    this.nxStore.dispatch(showToast({ text: '전화번호가 변경되었습니다.' }))
                    this.resetAllVariables()
                },
                error: (e) => {
                    this.triedVerifCode = true
                    this.verificationCodeErr = '인증번호를 잘못 입력하셨습니다.'
                },
            })
    }

    // email methods

    emailFormCheck() {
        let isValid = false
        if (this.triedVerifCode) {
            return false
        }
        const verificationCode = this.verificationCode + ''
        if (this.newEmailRef.valid && verificationCode && verificationCode.length == 4 && this.timeLeft > 0) {
            isValid = true
        }
        return isValid
    }

    sendVerificationCodeEmailChange() {
        if (!this.newEmailRef.valid) {
            return
        }

        this.emailVerifRef.valueAccessor._elementRef.nativeElement.focus()

        this.authService.sendVerificationCodeMailChange({ email: this.newInfoStr }).subscribe({
            next: (v) => {
                this.nxStore.dispatch(showToast({ text: '인증번호 메일이 전송되었습니다.' }))
                if (this.interval) {
                    this.stopTimer()
                }
                this.startTimer()
            },
            error: (e) => {
                this.nxStore.dispatch(showToast({ text: e.message }))
            },
        })
    }

    finishEmailChange() {
        this.authService
            .checkVerificationCodeMailChange({
                verification_code: this.verificationCode,
            })
            .subscribe({
                next: (v) => {
                    this.user.email = this.newInfoStr
                    this.user.email_verified = true
                    this.storageService.setUser(this.user)
                    this.onConfirm()
                    this.nxStore.dispatch(showToast({ text: '이메일이 변경되었습니다.' }))
                    this.resetAllVariables()
                },
                error: (e) => {
                    this.triedVerifCode = true
                    this.verificationCodeErr = '인증번호를 잘못 입력하셨습니다.'
                },
            })
    }

    // common
    onKeyup(event, type) {
        if (event.key == 'Enter' && this.triedVerifCode) {
            return
        } else if (this.triedVerifCode) {
            this.triedVerifCode = false
            this.verificationCodeErr = ''
        }
        if (type == 'phoneNumber') {
            if (event.key == 'Enter' && this.newPhoneRef.valid) {
                this.sendVerificationCodeSMSChange()
            }
        } else if (type == 'email') {
            if (event.key == 'Enter' && this.newEmailRef.valid) {
                this.sendVerificationCodeEmailChange()
            }
        } else if (type == 'verificationCode') {
            if (event.key == 'Enter') {
                if (this.activatedModalType == 'PHONE' && this.phoneFormCheck()) {
                    this.finishPhoneChange()
                } else if (this.activatedModalType == 'EMAIL' && this.emailFormCheck()) {
                    this.finishEmailChange()
                }
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

// 이메일 중복 확인을 해야하는지 나중에 확인하기
