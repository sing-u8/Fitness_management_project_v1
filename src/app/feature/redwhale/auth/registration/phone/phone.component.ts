import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'

import { StorageService } from '@services/storage.service'
import { RouterService } from '@services/auth/router.service'
import { AuthService } from '@services/auth.service'

import { User } from '@schemas/user'
import { Registration } from '@schemas/store/app/registration.interface'

// ngrx
import { select, Store } from '@ngrx/store'
import { setRegistration } from '@appStore/actions/registration.action'
import { registrationSelector } from '@appStore/selectors'
import { showToast } from '@appStore/actions/toast.action'

@Component({
    selector: 'phone',
    templateUrl: './phone.component.html',
    styleUrls: ['./phone.component.scss'],
})
export class PhoneComponent implements OnInit, AfterViewInit, OnDestroy {
    TAG = '회원가입'

    @ViewChild('phoneNumberRef')
    phoneNumberRef: ElementRef

    @ViewChild('verificationCodeRef')
    verificationCodeRef: any

    user: User

    registration: Registration

    phoneNumber: string
    phoneNumberValid: boolean
    phoneNumberError: string
    verificationCode: number

    timeLeft: number
    interval: NodeJS.Timeout

    routerSubscription: Subscription
    isSocial: boolean

    constructor(
        private router: Router,
        private nxStore: Store,
        private storageService: StorageService,
        private authService: AuthService,
        private routerService: RouterService
    ) {
        this.routerSubscription = this.routerService.initUserDataWhenPopstate()
    }

    ngOnInit(): void {
        this.user = this.storageService.getUser()
        this.isSocial = this.user == null || (this.user != null && this.user.provider == 'redwhale.xyz') ? false : true
        this.timeLeft = 0

        this.nxStore.pipe(select(registrationSelector)).subscribe((reg) => {
            this.registration = reg
        })
        if (this.registration) {
            this.nxStore.dispatch(
                setRegistration({
                    registration: {
                        regCompleted: true,
                    },
                })
            )
        }
    }
    ngAfterViewInit() {
        this.phoneNumberRef.nativeElement.focus()
    }
    ngOnDestroy() {
        this.stopTimer()
        this.routerSubscription.unsubscribe()
    }

    async backToLogin() {
        await this.routerService.backToLogin()
    }

    startTimer() {
        this.phoneNumberError = ''

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
        this.phoneNumberError = '입력 시간이 초과되었어요. [인증번호 받기] 버튼을 다시 눌러주세요!'
        clearInterval(this.interval)
    }

    checkDigit(event) {
        const code = event.which ? event.which : event.keyCode
        if (code < 48 || code > 57) {
            return false
        }
        return true
    }

    checkPhoneNumber() {
        const phoneNumberRegex = /^\d{10,11}$/
        if (phoneNumberRegex.test(this.phoneNumber)) {
            this.phoneNumberValid = true
        } else {
            this.phoneNumberValid = false
        }
    }

    formCheck() {
        let isValid = false

        const verificationCode = this.verificationCode + ''
        if (this.phoneNumberValid && verificationCode && verificationCode.length == 4 && this.timeLeft > 0) {
            isValid = true
        }

        return isValid
    }

    sendVerificationCodeSMSChange() {
        if (!this.phoneNumberValid) {
            return
        }

        this.verificationCodeRef.valueAccessor._elementRef.nativeElement.focus()

        this.authService.sendVerificationCodeSMSChange({ phone_number: this.phoneNumber }).subscribe({
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

    next() {
        this.authService.checkVerificationCodeSMSChange({ verification_code: this.verificationCode }).subscribe({
            next: (v) => {
                this.user.phone_number = this.phoneNumber
                this.user.phone_number_verified = true
                this.storageService.setUser(this.user)

                this.router.navigateByUrl('/auth/registration/completed')
            },
            error: (e) => {
                this.phoneNumberError = '인증번호를 잘못 입력하셨습니다.' // e.message
            },
        })
    }

    onKeyup(event, type) {
        if (type == 'phoneNumber') {
            if (event.key == 'Enter') {
                if (this.phoneNumberValid) {
                    this.sendVerificationCodeSMSChange()
                }
            } else {
                this.checkPhoneNumber()
            }
        } else if (type == 'verificationCode') {
            if (event.key == 'Enter') {
                if (this.formCheck()) {
                    this.next()
                }
            }
        }
    }
}
