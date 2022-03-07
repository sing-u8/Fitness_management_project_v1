import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Auth, signOut } from '@angular/fire/auth'

declare let Kakao: any

import { User } from '@schemas/user'
import { Center } from '@schemas/center'

import * as _ from 'lodash'

type UserOrEmpty = User | { sign_in_method: string }

@Injectable({ providedIn: 'root' })
export class StorageService {
    private storage = sessionStorage
    private userKey = 'redwhale:authUser'

    constructor(private fireAuth: Auth, private router: Router) {}

    getUser(): User {
        return JSON.parse(this.storage.getItem(this.userKey))
    }
    setUser(user: UserOrEmpty): void {
        this.storage.setItem(this.userKey, JSON.stringify(user))
    }
    isUserEmpty(): boolean {
        const user = JSON.parse(this.storage.getItem(this.userKey))
        return (
            (Object.keys(user).length == 1 && !!Object.keys(user).find((key) => key == 'sign_in_method')) ||
            _.isEmpty(user)
        )
    }

    async removeUser() {
        if (Kakao.Auth && Kakao.Auth.getAccessToken()) {
            const logout = new Promise((resolve, reject) => {
                Kakao.Auth.logout(() => {
                    resolve(null)
                })
            })
            await logout
        }
        await signOut(this.fireAuth)
        this.storage.removeItem(this.userKey)
    }

    async logout() {
        await this.removeUser()
        this.router.navigateByUrl('/auth/login')
    }

    setSignInMethod(signInMethod: string): void {
        const user = this.getUser() ?? { sign_in_method: '' }
        user.sign_in_method = signInMethod
        this.setUser(user)
    }

    getCenter(): Center {
        const user: User = this.getUser()
        if (user.selected_center) {
            return user.selected_center
        } else {
            return null
        }
    }
    setCenter(center: Center): void {
        const user: User = this.getUser()
        user.selected_center = center
        this.setUser(user)
    }
    removeCenter(): void {
        const user: User = this.getUser()
        user.selected_center = null
        this.setUser(user)
    }
}
