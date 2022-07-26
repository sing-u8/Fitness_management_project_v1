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
        const isUserEmpty = this.storageService.isUserEmpty()
        if (!isUserEmpty) {
            if (!user.service_terms || !user.privacy) {
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
            if (url[1] == 'auth') {
                return true
            } else {
                this.router.navigateByUrl('/auth/login')
                return false
            }
        }
    }
}
