import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { Router } from '@angular/router'
import { Auth, authState, signInWithCustomToken } from '@angular/fire/auth'

import { StorageService } from '@services/storage.service'
import { AuthService } from '@services/auth.service'

import { User } from '@schemas/user'
import { Registration } from '@schemas/store/app/registration.interface'

// rxjs
import { Subscription } from 'rxjs'
// ngrx
import { Store, select } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'
import { showModal } from '@appStore/actions/modal.action'
import { registrationSelector } from '@appStore/selectors'

@Component({
    selector: 'email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.scss'],
})
export class EmailComponent implements OnInit, AfterViewInit {
    TAG = '회원가입'

    @ViewChild('one')
    one: ElementRef

    registration: Registration

    email: string
    verificationCodeOne: string
    verificationCodeTwo: string
    verificationCodeThree: string
    verificationCodeFour: string
    error: string

    timeLeft: number
    interval: any

    subscription: Subscription

    constructor(
        private router: Router,
        private nxStore: Store,
        private authService: AuthService,
        private fireAuth: Auth,
        private storageService: StorageService
    ) {}

    ngOnInit(): void {
        this.nxStore.pipe(select(registrationSelector)).subscribe((reg) => {
            this.registration = reg
        })
        if (this.checkRegistration()) {
            this.email = this.registration.email
            this.sendVerificationCodeMail(false)
        } else {
            this.email = ''
        }

        this.timeLeft = 0

        this.subscription = authState(this.fireAuth).subscribe((firebaseUser) => {
            if (firebaseUser) {
                this.storageService.setSignInMethod('email')
            }
        })
    }

    ngAfterViewInit() {
        this.one.nativeElement.focus()
    }

    startTimer() {
        this.error = ''

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
        this.error = '입력 시간이 초과되었어요. 아래 [재전송 요청하기] 버튼을 눌러주세요!'
        this.verificationCodeOne = ''
        this.verificationCodeTwo = ''
        this.verificationCodeThree = ''
        this.verificationCodeFour = ''

        clearInterval(this.interval)
    }

    checkDigit(event) {
        const code = event.which ? event.which : event.keyCode
        if ((code < 48 || code > 57) && (code < 96 || code > 105)) {
            return false
        } else {
            return true
        }
    }

    nextNumber(event, name, currentElement, nextElement) {
        if (event.key == 'Enter') {
            if (this.formCheck()) {
                this.next()
            }
            return
        }

        if (!this.checkDigit(event)) {
            return
        }

        currentElement.value = event.key

        if (name == 'one') {
            this.verificationCodeOne = event.key
        } else if (name == 'two') {
            this.verificationCodeTwo = event.key
        } else if (name == 'three') {
            this.verificationCodeThree = event.key
        } else if (name == 'four') {
            this.verificationCodeFour = event.key
        }

        if (nextElement) {
            nextElement.focus()
        }
    }

    formCheck() {
        let isValid = false

        if (
            this.checkRegistration() &&
            this.verificationCodeOne &&
            this.verificationCodeTwo &&
            this.verificationCodeThree &&
            this.verificationCodeFour
        ) {
            isValid = true
        }

        return isValid
    }

    sendVerificationCodeMail(isShowModal: boolean) {
        this.authService.sendVerificationCodeMail({ email: this.email }).subscribe({
            next: (v) => {
                if (isShowModal) {
                    this.nxStore.dispatch(
                        showModal({
                            data: {
                                text: this.email,
                                subText: `새로운 인증번호를 발송해드렸어요!
                    확인 후 인증번호를 입력해주세요.`,
                            },
                        })
                    )
                }

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
        const verificationCode = Number(
            `${this.verificationCodeOne}${this.verificationCodeTwo}${this.verificationCodeThree}${this.verificationCodeFour}`
        )

        const body = {
            email: this.registration.email,
            verification_code: verificationCode,
            password: this.registration.password,
            given_name: this.registration.name,
            terms_eula: this.registration.termsEULA ? 1 : 0,
            terms_privacy: this.registration.termsPrivacy ? 1 : 0,
            marketing_sms: this.registration.marketingSMS ? 1 : 0,
            marketing_email: this.registration.marketingEmail ? 1 : 0,
        }

        this.authService.registration(body).subscribe(
            (user: User) => {
                signInWithCustomToken(this.fireAuth, user.custom_token)
                this.router.navigateByUrl('/auth/registration/phone')
            },
            (e) => {
                this.error = e.message
            }
        )
    }

    checkRegistration() {
        let isValid = false

        if (
            this.registration &&
            this.registration.termsEULA &&
            this.registration.termsPrivacy &&
            this.registration.name &&
            this.registration.email &&
            this.registration.emailValid &&
            this.registration.password &&
            this.registration.passwordValid
        ) {
            isValid = true
        }

        return isValid
    }
}
