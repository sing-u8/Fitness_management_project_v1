import { Injectable } from '@angular/core'
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router'

import { StorageService } from '@services/storage.service'

import * as _ from 'lodash'

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private storageService: StorageService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const url = state.url.split('/')
        const user = this.storageService.getUser()
        // console.log('in auth guard : ', url, user, !_.isEmpty(user))
        if (!_.isEmpty(user)) {
            console.log('in user data exist')
            if (!user.terms_eula || !user.terms_privacy) {
                this.router.navigateByUrl('/auth/terms')
                return false
            } else if (!user.phone_number_verified) {
                this.router.navigateByUrl('/auth/registration/phone')
                return false
            } else if (url[1] == 'auth') {
                this.router.navigateByUrl('/redwhale-home')
                return false
            } else {
                return true
            }
        } else {
            // console.log('in user data do not exist', url)
            if (url[1] == 'auth') {
                return true
            } else {
                this.router.navigateByUrl('/auth/login')
                return false
            }
        }
    }
}
