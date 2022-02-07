import { Injectable } from '@angular/core'
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router'

import { StorageService } from '@services/storage.service'

@Injectable({
    providedIn: 'root',
})
export class RegPhoneGuard implements CanActivate {
    constructor(private router: Router, private storageService: StorageService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const user = this.storageService.getUser()

        if (!user) {
            this.router.navigateByUrl('/auth/login')
            return false
        } else if (user && user.phone_number_verified) {
            this.router.navigateByUrl('/redwhale-home')
            return false
        } else if (user && !user.phone_number_verified) {
            return true
        } else {
            return false
        }
    }
}
