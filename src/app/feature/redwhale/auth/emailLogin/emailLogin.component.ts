import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
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

// components 
import {ButtonComponent} from '@shared/components/common/button/button.component'

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
    @ViewChild('login_button_el') login_button_el : ButtonComponent

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

    signInWithEmail() {
        // const isBot = await this.systemService.isBot('emailLogin')
        // if (isBot) {
        //     return
        // }

        this.login_button_el.showLoading()

        this.signInMethod = 'email'
        this.authService.signInWithEmail({ email: this.email, password: this.password }).subscribe({
            next: (user) => {
                if (this.emailChecked) {
                    localStorage.setItem('email', this.email)
                } else {
                    localStorage.removeItem('email')
                }
                signInWithCustomToken(this.fireAuth, user.custom_token).finally(() => {
                    this.login_button_el.hideLoading()
                })
            },
            error: (e) => {
                this.nxStore.dispatch(showToast({ text: '입력하신 정보를 다시 확인해주세요.' }))
                this.login_button_el.hideLoading()
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
