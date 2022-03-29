import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { DeviceDetectorService } from 'ngx-device-detector'

import { AuthService } from '@services/auth.service'

import { User } from '@schemas/user'

// ngrx
import { Store } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'

@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
    TAG = '비밀번호 변경'

    token: string
    isTokenValid: boolean

    password: string
    passwordVisible: boolean
    passwordError: string
    passwordValid: boolean
    confirmPassword: string
    confirmPasswordVisible: boolean
    confirmPasswordError: string
    confirmPasswordValid: boolean

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private nxStore: Store,
        private deviceService: DeviceDetectorService
    ) {
        this.password = ''
        this.confirmPassword = ''
    }

    ngOnInit() {
        this.token = this.activatedRoute.snapshot.queryParams['token']
        if (this.deviceService.isMobile()) {
            this.router.navigate(['auth/m.reset-password'], {
                queryParams: { token: this.token },
            })
        } else {
            if (!this.token) {
                this.isTokenValid = false
            } else {
                this.checkResetPasswordLinkMail()
            }
        }
    }

    changePasswordVisible(passwordVisible: boolean) {
        this.passwordVisible = passwordVisible
    }

    changeConfirmPasswordVisible(confirmPasswordVisible: boolean) {
        this.confirmPasswordVisible = confirmPasswordVisible
    }

    formCheck() {
        let isValid = false

        if (
            this.isTokenValid &&
            this.checkPasswordPattern(this.password) &&
            this.checkPasswordPattern(this.confirmPassword) &&
            this.password == this.confirmPassword
        ) {
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

        this.checkConfrimPassword()
    }

    checkConfrimPassword() {
        const pattern1 = /[0-9]/
        const pattern2 = /[a-zA-Z]/
        const pattern3 = /[~!@#$%^&*()_+|<>?:{}]/
        const pattern4 = /\s/

        if (this.confirmPassword.length == 0) {
            this.confirmPasswordError = ''
            this.confirmPasswordValid = false
        } else if (pattern4.test(this.confirmPassword)) {
            this.confirmPasswordError = '공백을 포함할 수 없어요.'
            this.confirmPasswordValid = false
        } else if (this.confirmPassword.length < 8) {
            this.confirmPasswordError = '비밀번호가 너무 짧아요. (8자 이상)'
            this.confirmPasswordValid = false
        } else if (
            !pattern1.test(this.confirmPassword) ||
            !pattern2.test(this.confirmPassword) ||
            !pattern3.test(this.confirmPassword)
        ) {
            this.confirmPasswordError = '영어, 숫자, 특수문자가 모두 포함되어야 해요.'
            this.confirmPasswordValid = false
        } else if (this.password != this.confirmPassword) {
            this.confirmPasswordError = '비밀번호가 일치하지 않아요.'
            this.confirmPasswordValid = false
        } else {
            this.confirmPasswordError = ''
            this.confirmPasswordValid = true
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

    checkResetPasswordLinkMail() {
        this.authService.checkResetPasswordLinkMail({ token: this.token }).subscribe({
            next: (v) => {
                this.isTokenValid = true
            },
            error: (e) => {
                this.isTokenValid = false
                if (e.code == 'FUNCTION_AUTH_008') {
                    this.nxStore.dispatch(showToast({ text: '만료된 비밀번호 재설정 링크입니다.' }))
                } else if (e.code == 'FUNCTION_AUTH_011') {
                    this.nxStore.dispatch(showToast({ text: '유효하지 않은 토큰입니다.' }))
                }
                this.router.navigateByUrl('/auth/forgot-password')
            },
        })
    }

    changePassword() {
        this.authService.changePassword({ token: this.token, new_password: this.password }).subscribe({
            next: (user: User) => {
                this.nxStore.dispatch(showToast({ text: '비밀번호가 변경되었습니다.' }))
                this.router.navigateByUrl('/redwhale-home')
            },
            error: (e) => {
                if (e.code == 'FUNCTION_AUTH_008') {
                    this.nxStore.dispatch(showToast({ text: '만료된 비밀번호 재설정 링크입니다.' }))
                } else if (e.code == 'FUNCTION_AUTH_011') {
                    this.nxStore.dispatch(showToast({ text: '유효하지 않은 토큰입니다.' }))
                }

                this.nxStore.dispatch(showToast({ text: e.message }))
            },
        })
    }

    onKeyup(event, type) {
        if (event.key == 'Enter') {
            if (this.formCheck()) {
                this.changePassword()
            }
        } else {
            if (event.key != 'Tab' && type == 'password') {
                this.checkPassword()
            } else if (event.key != 'Tab' && type == 'confirmPassword') {
                this.checkConfrimPassword()
            }
        }
    }
}
