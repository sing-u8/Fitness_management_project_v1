import { Injectable } from '@angular/core'
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router'

import { StorageService } from '@services/storage.service'

@Injectable({
    providedIn: 'root',
})
export class TermsGuard implements CanActivate {
    constructor(private router: Router, private storageService: StorageService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const user = this.storageService.getUser()

        if (user && user.service_terms && user.privacy) {
            this.router.navigateByUrl('/redwhale-home')
            return false
        } else {
            return true
        }
    }
}
