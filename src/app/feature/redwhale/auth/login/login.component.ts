import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, Subscription } from 'rxjs'

declare let Kakao: any

import {
    Auth,
    signInWithPopup,
    onAuthStateChanged,
    GoogleAuthProvider,
    FacebookAuthProvider,
    OAuthProvider,
    authState,
    signInWithCustomToken,
} from '@angular/fire/auth'

import { environment } from '@environments/environment'

import { StorageService } from '@services/storage.service'
import { AuthService } from '@services/auth.service'

// ngrx
import { Store } from '@ngrx/store'

import { showModal } from '@appStore/actions/modal.action'
import { removeRegistration } from '@appStore/actions/registration.action'

// components 
import {ClickEmitterType} from '@shared/components/common/button/button.component'

@Component({
    selector: 'rw-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    public TAG = '로그인'
    public signInMethod: string
    public subscription: Subscription

    constructor(
        private fireAuth: Auth,
        private router: Router,
        private nxStore: Store,
        private storageService: StorageService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.nxStore.dispatch(removeRegistration())

        this.subscription = authState(this.fireAuth).subscribe((user) => {
            if (user) {
                if (this.signInMethod == 'google' || this.signInMethod == 'apple') {
                    user.getIdToken().then((accessToken) => {
                        this.authService.signInWithFirebase({ accessToken }).subscribe({
                            next: (user) => {
                                this.storageService.setSignInMethod(this.signInMethod)
                                this.router.navigateByUrl('/redwhale-home')
                            },
                            error: (e) => {
                                this.nxStore.dispatch(showModal({ data: { text: this.TAG, subText: e.message } }))
                            },
                        })
                    })
                } else {
                    this.storageService.setSignInMethod(this.signInMethod)
                    this.router.navigateByUrl('/redwhale-home')
                }
            }
        })
        if (!Kakao.isInitialized()) {
            Kakao.init(`${environment.kakao['appKey']['javascript']}`)
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }

    signInWithGoogle(btLoadingFns:ClickEmitterType) {
        btLoadingFns.showLoading()
        this.signInMethod = 'google'
        signInWithPopup(this.fireAuth, new GoogleAuthProvider()).then(() => {
            btLoadingFns.hideLoading()
        })
    }

    signInWithApple(btLoadingFns:ClickEmitterType) {
        btLoadingFns.showLoading()
        this.signInMethod = 'apple'
        signInWithPopup(this.fireAuth, new OAuthProvider('apple.com')).then(() => {
            btLoadingFns.hideLoading()
        })
    }

    signInWithKakao(btLoadingFns:ClickEmitterType) {
        btLoadingFns.showLoading()
        this.signInMethod = 'kakao'
        const kakao$ = new Observable(function subscribe(observer) {
            Kakao.Auth.loginForm({
                success: function (response) {
                    observer.next(response)
                    observer.complete()
                },
                fail: function (error) {
                    observer.error(error)
                },
                persistAccessToken: false,
                persistRefreshToken: false,
            })
        })

        kakao$.subscribe({
            next: (user) => {
                const accessToken = user['access_token']
                this.authService.signInWithKakao({ accessToken }).subscribe((user) => {
                    signInWithCustomToken(this.fireAuth, String(user.custom_token)).then(() => {
                        btLoadingFns.hideLoading()
                    })
                })
            },
            error: (e) => {
                btLoadingFns.hideLoading()
                this.nxStore.dispatch(showModal({ data: { text: this.TAG, subText: e.message } }))
            },
        })
    }
}
