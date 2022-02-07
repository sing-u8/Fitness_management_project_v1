import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
// import { AngularFireAuth } from '@angular/fire/auth'
import { Auth, authState, signInWithCustomToken } from '@angular/fire/auth'
import { Subscription } from 'rxjs'

import { StorageService } from '@services/storage.service'

import { AuthService } from '@services/auth.service'
import { SystemService } from '@services/system.service'

import * as _ from 'lodash'

// ngrx
import { Store } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'

@Component({
    selector: 'email',
    templateUrl: './emailLogin.component.html',
    styleUrls: ['./emailLogin.component.scss'],
})
export class EmailLoginComponent implements OnInit, OnDestroy {
    TAG = '로그인'

    email: string
    emailChecked: boolean
    password: string
    passwordVisible: boolean

    signInMethod: string
    subscription: Subscription

    // button loading status
    public loginLoading = false

    constructor(
        private router: Router,
        private fireAuth: Auth,
        private storageService: StorageService,
        private authService: AuthService,
        private systemService: SystemService,
        private nxStore: Store
    ) {}

    ngOnInit() {
        const email = localStorage.getItem('email')
        if (email) {
            this.email = email
            this.emailChecked = true
        }
        this.password = ''

        this.subscription = authState(this.fireAuth).subscribe({
            next: (firebaseUser) => {
                const user = this.storageService.getUser()
                // console.log('fire subscription : ', firebaseUser)
                if (firebaseUser && !_.isEmpty(user)) {
                    this.storageService.setSignInMethod(this.signInMethod)
                    this.router.navigateByUrl('/redwhale-home')
                }
            },
        })
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }

    async signInWithEmail() {
        const isBot = await this.systemService.isBot('emailLogin')
        if (isBot) {
            return
        }

        this.loginLoading = true

        this.signInMethod = 'email'
        this.authService.signInWithEmail({ email: this.email, password: this.password }).subscribe({
            next: (user) => {
                if (this.emailChecked) {
                    localStorage.setItem('email', this.email)
                } else {
                    localStorage.removeItem('email')
                }
                signInWithCustomToken(this.fireAuth, user.custom_token).finally(() => {
                    this.loginLoading = false
                })
            },
            error: (e) => {
                this.nxStore.dispatch(showToast({ text: '입력하신 정보를 다시 확인해주세요.' }))
                this.loginLoading = false
            },
        })
    }

    changePasswordVisible(passwordVisible: boolean) {
        this.passwordVisible = passwordVisible
    }

    toggleRememberMe() {
        this.emailChecked = !this.emailChecked
    }

    formCheck() {
        let isValid = false

        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
        if (emailRegex.test(this.email) && this.checkPasswordPattern(this.password)) {
            isValid = true
        }

        return isValid
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
}
