import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { Auth, authState, signInWithCustomToken } from '@angular/fire/auth'

import { StorageService } from '@services/storage.service'
import { AuthService } from '@services/auth.service'

import { User } from '@schemas/user'
import { Registration } from '@schemas/store/app/registration.interface'

// rxjs
import { BehaviorSubject, Subscription } from 'rxjs'
import { distinctUntilChanged, debounceTime, filter } from 'rxjs/operators'
// ngrx
import { Store, select } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'
import { showModal } from '@appStore/actions/modal.action'
import { registrationSelector } from '@appStore/selectors'

type InputName = 'one' | 'two' | 'three' | 'four'

@Component({
    selector: 'email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.scss'],
})
export class EmailComponent implements OnInit, AfterViewInit, OnDestroy {
    TAG = '회원가입'

    @ViewChild('one')
    one: ElementRef

    public registration: Registration

    public email: string
    public verificationCodeOne = ''
    public verificationCodeTwo = ''
    public verificationCodeThree = ''
    public verificationCodeFour = ''
    public error: string
    public isNumberValid = false
    public verficationCode: number
    public veriNumberSubject: BehaviorSubject<string> = new BehaviorSubject('')
    public veriNumberSelector = this.veriNumberSubject.asObservable().pipe(
        distinctUntilChanged(),
        debounceTime(300),
        filter((v) => v.length == 4 && this.email.length > 0)
    )
    public veriNumberSubscription: Subscription

    public timeLeft: number
    public interval: NodeJS.Timeout

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

        this.veriNumberSubscription = this.veriNumberSelector.subscribe({
            next: (v) => {
                this.verficationCode = Number(v)
                this.authService
                    .checkVerificationCodeMail({
                        email: this.email,
                        verification_code: Number(this.verficationCode),
                    })
                    .subscribe({
                        next: () => {
                            this.isNumberValid = true
                        },
                        error: () => {
                            this.error = '인증번호를 잘못 입력하셨습니다.'
                        },
                    })
            },
        })
    }

    ngAfterViewInit() {
        this.one.nativeElement.focus()
    }
    ngOnDestroy(): void {
        this.veriNumberSubscription.unsubscribe()
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
        if (code < 48 || code > 57) {
            return false
        } else {
            return true
        }
    }

    nextNumber(event: KeyboardEvent, name: InputName, currentElement: HTMLInputElement, nextElement: HTMLInputElement) {
        if (event.key == 'Backspace') return
        if (event.key == 'Enter') {
            if (this.formCheck()) this.next()
            return
        }

        if (!this.checkDigit(event)) {
            return
        }

        this.error = ''
        this.isNumberValid = false
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

        this.veriNumberSubject.next(
            `${this.verificationCodeOne}${this.verificationCodeTwo}${this.verificationCodeThree}${this.verificationCodeFour}`
        )
    }

    prevNumber(name: InputName, prevElement: HTMLInputElement) {
        if (name == 'one') {
            this.verificationCodeOne = ''
        } else if (name == 'two') {
            this.verificationCodeTwo = ''
        } else if (name == 'three') {
            this.verificationCodeThree = ''
        } else if (name == 'four') {
            this.verificationCodeFour = ''
        }

        this.error = ''
        this.isNumberValid = false
        if (prevElement) prevElement.focus()
    }

    formCheck() {
        let isValid = false

        if (
            this.checkRegistration() &&
            this.verificationCodeOne &&
            this.verificationCodeTwo &&
            this.verificationCodeThree &&
            this.verificationCodeFour &&
            this.isNumberValid
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
        const body = {
            name: this.registration.name,
            email: this.registration.email,
            verification_code: this.verficationCode,
            password: this.registration.password,
            privacy: this.registration.privacy,
            service_terms: this.registration.service_terms,
            sms_marketing: this.registration.sms_marketing,
            email_marketing: this.registration.email_marketing,
        }

        this.authService.registration(body).subscribe({
            next: (user: User) => {
                signInWithCustomToken(this.fireAuth, user.custom_token)
                this.router.navigateByUrl('/auth/registration/phone')
            },
            error: (e) => {
                // this.error = e.message
                // this.error = "인증번호를 잘못 입력하셨습니다.";
            },
        })
    }

    checkRegistration() {
        let isValid = false

        if (
            this.registration &&
            this.registration.service_terms &&
            this.registration.privacy &&
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

    // modal vars / funcs
    public emailModalTextObj = {
        text: '',
        subText: '',
    }
    public emailModalVisible = false

    showEmailModal(text: string, subText: string) {
        this.emailModalTextObj = {
            text,
            subText,
        }
        this.emailModalVisible = true
    }
    hideEmailModal() {
        this.emailModalVisible = true
    }
}
