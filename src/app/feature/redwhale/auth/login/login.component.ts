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
            console.log('authState user : ', user)
            if (user) {
            }
        })
        this.subscription = authState(this.fireAuth).subscribe((user) => {
            if (user) {
                if (this.signInMethod == 'google' || this.signInMethod == 'facebook' || this.signInMethod == 'apple') {
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
                    console.log('singin: ', this.signInMethod)
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

    signInWithGoogle() {
        this.signInMethod = 'google'
        signInWithPopup(this.fireAuth, new GoogleAuthProvider())
    }

    signInWithFacebook() {
        this.signInMethod = 'facebook'
        signInWithPopup(this.fireAuth, new FacebookAuthProvider())
    }

    signInWithApple() {
        this.signInMethod = 'apple'
        signInWithPopup(this.fireAuth, new OAuthProvider('apple.com'))
    }

    signInWithKakao() {
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
                console.log('kakao user: ', user)
                const accessToken = user['access_token']
                this.authService.signInWithKakao({ accessToken }).subscribe((user) => {
                    signInWithCustomToken(this.fireAuth, String(user.custom_token))
                })
            },
            error: (e) => {
                this.nxStore.dispatch(showModal({ data: { text: this.TAG, subText: e.message } }))
            },
        })
    }
}
