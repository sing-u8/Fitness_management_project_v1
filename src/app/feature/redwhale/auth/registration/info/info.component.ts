import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, fromEvent, Subscription } from 'rxjs'
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators'

import { AuthService } from '@services/auth.service'

// ngrx
import { select, Store } from '@ngrx/store'
import { setRegistration } from '@appStore/actions/registration.action'
import { registrationSelector } from '@appStore/selectors'

@Component({
    selector: 'info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit, AfterViewInit {
    TAG = '회원가입'

    @ViewChild('emailInput')
    emailInput: ElementRef
    keyup$: Observable<any>

    registration: any

    name: string
    email: string
    emailError: string
    emailValid: boolean
    password: string
    passwordVisible: boolean
    passwordError: string
    passwordValid: boolean

    constructor(private router: Router, private nxStore: Store, private authService: AuthService) {}

    ngOnInit(): void {
        this.password = ''

        this.nxStore.pipe(select(registrationSelector)).subscribe((reg) => {
            this.registration = reg
        })
        if (this.registration) {
            this.name = this.registration.name
            this.email = this.registration.email
            this.emailValid = this.registration.emailValid
            this.password = this.registration.password ? this.registration.password : ''
            this.passwordValid = this.registration.passwordValid

            this.formCheck()
        }
    }

    ngAfterViewInit() {
        this.keyup$ = fromEvent(this.emailInput.nativeElement, 'keyup').pipe(
            debounceTime(300),
            map((event) => {
                return {
                    key: event['key'],
                    email: event['target']['value'].trim(),
                }
            }),
            distinctUntilChanged()
        )

        this.keyup$.subscribe((v) => {
            this.checkDuplicateMail(v.key, v.email)
        })
    }

    changePasswordVisible(passwordVisible: boolean) {
        this.passwordVisible = passwordVisible
    }

    formCheck() {
        let isValid = false

        if (this.checkRegistration() && this.name && this.emailValid && this.checkPasswordPattern(this.password)) {
            isValid = true
        }

        return isValid
    }

    checkEmailPattern() {
        let isValid = false

        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
        if (emailRegex.test(this.email)) {
            isValid = true
        }

        return isValid
    }

    checkPassword() {
        const pattern1 = /[0-9]/
        const pattern2 = /[a-zA-Z]/
        const pattern3 = /[~!@#$%^&*()_+|<>?:{}]/
        const pattern4 = /\s/

        if (this.password.length == 0) {
            this.passwordError = ''
            this.passwordValid = false
        } else if (pattern4.test(this.password)) {
            this.passwordError = '공백을 포함할 수 없어요.'
            this.passwordValid = false
        } else if (this.password.length < 8) {
            this.passwordError = '비밀번호가 너무 짧아요. (8자 이상)'
            this.passwordValid = false
        } else if (!pattern1.test(this.password) || !pattern2.test(this.password) || !pattern3.test(this.password)) {
            this.passwordError = '영어, 숫자, 특수문자가 모두 포함되어야 해요.'
            this.passwordValid = false
        } else {
            this.passwordError = ''
            this.passwordValid = true
        }
    }

    checkPasswordPattern(password: string) {
        let isValid = false

        const pattern1 = /[0-9]/
        const pattern2 = /[a-zA-Z]/
        const pattern3 = /[~!@#$%^&*()_+|<>?:{}]/
        const pattern4 = /\s/

        if (
            pattern1.test(password) &&
            pattern2.test(password) &&
            pattern3.test(password) &&
            !pattern4.test(password) &&
            8 <= password.length &&
            password.length <= 15
        ) {
            isValid = true
        }

        return isValid
    }

    checkDuplicateMail(key: string, email: string) {
        if (key == 'Tab') {
            return
        }

        if (key == 'Enter') {
            if (this.formCheck()) {
                this.next()
            }
            return
        }

        this.emailError = ''
        if (!this.checkEmailPattern()) {
            this.emailValid = false
            return
        }

        this.authService.checkDuplicateMail({ email: email }).subscribe(
            (v) => {
                this.emailValid = true
            },
            (e) => {
                this.emailError = '이미 사용중인 이메일입니다.'
            }
        )
    }

    next() {
        this.nxStore.dispatch(
            setRegistration({
                registration: {
                    name: this.name.trim(),
                    email: this.email,
                    emailValid: this.emailValid,
                    password: this.password,
                    passwordValid: this.passwordValid,
                },
            })
        )

        this.router.navigateByUrl('/auth/registration/email')
    }

    onKeyup(event, type) {
        if (event.key == 'Enter') {
            if (this.formCheck()) {
                this.next()
            }
        } else {
            if (event.key != 'Tab' && type == 'password') {
                this.checkPassword()
            }
        }
    }

    checkRegistration() {
        let isValid = false

        if (this.registration && this.registration.termsEULA && this.registration.termsPrivacy) {
            isValid = true
        }

        return isValid
    }
}
