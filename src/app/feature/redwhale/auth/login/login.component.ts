import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, Subject } from 'rxjs'
import { catchError, takeUntil } from 'rxjs/operators'

declare let Kakao: any

import {
    Auth,
    signInWithPopup,
    GoogleAuthProvider,
    OAuthProvider,
    authState,
    signInWithCustomToken,
    UserCredential,
} from '@angular/fire/auth'

import { environment } from '@environments/environment'

import { StorageService } from '@services/storage.service'
import { AuthService } from '@services/auth.service'

// ngrx
import { Store } from '@ngrx/store'

import { showModal } from '@appStore/actions/modal.action'
import { removeRegistration } from '@appStore/actions/registration.action'

// components
import { ClickEmitterType } from '@schemas/components/button'
import _ from 'lodash'

@Component({
    selector: 'rw-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    public TAG = '로그인'
    public signInMethod: string
    public unsubscriber$ = new Subject<boolean>()

    constructor(
        private fireAuth: Auth,
        private router: Router,
        private nxStore: Store,
        private storageService: StorageService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.nxStore.dispatch(removeRegistration())

        if (!Kakao.isInitialized()) {
            Kakao.init(`${environment.kakao['appKey']['javascript']}`)
        }
    }

    ngOnDestroy() {
        this.unsubscriber$.next(true)
        this.unsubscriber$.complete()
    }

    signInWithGoogle(btLoadingFns: ClickEmitterType) {
        btLoadingFns.showLoading()
        this.signInMethod = 'google'
        signInWithPopup(this.fireAuth, new GoogleAuthProvider())
            .then((userCredential) => {
                this.loginWithSocial(userCredential, btLoadingFns)
            })
            .finally(() => {
                btLoadingFns.hideLoading()
            })
    }

    signInWithApple(btLoadingFns: ClickEmitterType) {
        btLoadingFns.showLoading()
        this.signInMethod = 'apple'
        signInWithPopup(this.fireAuth, new OAuthProvider('apple.com'))
            .then((userCredential) => {
                this.loginWithSocial(userCredential, btLoadingFns)
            })
            .finally(() => {
                btLoadingFns.hideLoading()
            })
    }

    public kakaoBtLoadingFns: ClickEmitterType
    signInWithKakao(btLoadingFns: ClickEmitterType) {
        // btLoadingFns.showLoading()
        this.kakaoBtLoadingFns = btLoadingFns
        // this.kakaoBtLoadingFns.showLoading()
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
                always: function () {},
                persistAccessToken: false,
                persistRefreshToken: false,
            })
        })

        kakao$.subscribe({
            next: (user) => {
                const accessToken = user['access_token']

                this.authService.signInWithKakao({ accessToken }).subscribe((user) => {
                    signInWithCustomToken(this.fireAuth, String(user.custom_token)).then(() => {
                        this.storageService.setSignInMethod(this.signInMethod)
                        this.router.navigateByUrl('/redwhale-home')
                        // btLoadingFns.hideLoading()
                    })
                })
            },
            error: (e) => {
                // btLoadingFns.hideLoading()
                this.nxStore.dispatch(showModal({ data: { text: this.TAG, subText: e.message } }))
            },
        })
    }

    // helper
    loginWithSocial(uc: UserCredential, btLoadingFns?: ClickEmitterType) {
        uc.user.getIdToken().then((accessToken) => {
            this.authService.signInWithFirebase({ accessToken }).subscribe({
                next: (user) => {
                    this.storageService.setSignInMethod(this.signInMethod)
                    this.router.navigateByUrl('/redwhale-home')
                    if (!_.isEmpty(btLoadingFns)) {
                        btLoadingFns.hideLoading()
                    }
                },
                error: (e) => {
                    this.nxStore.dispatch(showModal({ data: { text: this.TAG, subText: e.message } }))
                    if (!_.isEmpty(btLoadingFns)) {
                        btLoadingFns.hideLoading()
                    }
                },
            })
        })
    }
}

/*
        authState(this.fireAuth)
            .pipe(takeUntil(this.unsubscriber$))
            .subscribe((user) => {
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
            */
