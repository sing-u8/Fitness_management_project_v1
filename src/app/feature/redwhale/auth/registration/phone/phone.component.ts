import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core'
import { Router } from '@angular/router'

import { StorageService } from '@services/storage.service'
import { RouterService } from '@services/auth/router.service'
import { AuthService } from '@services/auth.service'
import { AuthErrors } from '@schemas/errors/auth-errors'

import { User } from '@schemas/user'
import { Registration } from '@schemas/store/app/registration.interface'

// rxjs
import { BehaviorSubject, Subscription } from 'rxjs'
import { distinctUntilChanged, debounceTime, filter } from 'rxjs/operators'

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
    public verificationCodeRef: any

    public user: User

    public registration: Registration

    public phoneNumber: string
    public phoneNumberValid: boolean
    public phoneNumberError: string
    public verificationCode: string
    public isVerifValid = false
    public veriNumberSubject: BehaviorSubject<string> = new BehaviorSubject('')
    public veriNumberSelector = this.veriNumberSubject.asObservable().pipe(
        distinctUntilChanged(),
        debounceTime(300),
        filter((v) => v.length == 4)
    )
    public veriNumberSubscription: Subscription

    public timeLeft: number
    public interval: NodeJS.Timeout

    public routerSubscription: Subscription
    public isSocial: boolean

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
        this.timeLeft = -1

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

        this.veriNumberSubscription = this.veriNumberSelector.subscribe({
            next: (verificationCode) => {
                this.authService
                    .checkVerificationCodeSMSChange({
                        verification_code: Number(verificationCode),
                    })
                    .subscribe({
                        next: (v) => {
                            this.user.phone_number = this.phoneNumber
                            this.user.phone_number_verified = true
                            this.isVerifValid = true
                        },
                        error: (e) => {
                            this.phoneNumberError = '인증번호를 잘못 입력하셨습니다.'
                        },
                    })
            },
        })
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

    public isTimeOut = false
    startTimer() {
        this.verificationCode = ''
        this.phoneNumberError = ''
        this.isTimeOut = false

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
        this.isTimeOut = true
        this.verificationCode = ''
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
        if (
            this.phoneNumberValid &&
            verificationCode &&
            verificationCode.length == 4 &&
            this.timeLeft > 0 &&
            this.isVerifValid
        ) {
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
                this.nxStore.dispatch(showToast({ text: '카톡으로 인증번호가 전송되었습니다.' }))
                if (this.interval) {
                    this.stopTimer()
                }
                this.startTimer()
            },
            error: (e) => {
                this.nxStore.dispatch(showToast({ text: AuthErrors[e.code].message }))
            },
        })
    }

    next() {
        this.storageService.setUser(this.user)
        this.router.navigateByUrl('/auth/registration/completed')
    }

    onKeyup(event, type) {
        if (!this.isTimeOut) {
            this.phoneNumberError = ''
        }

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

            this.isVerifValid = false
            this.user.phone_number_verified = false
            this.veriNumberSubject.next(this.verificationCode)
        }
    }
}
