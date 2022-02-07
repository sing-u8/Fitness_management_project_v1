import { Injectable } from '@angular/core'
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router'

import { StorageService } from '@services/storage.service'

import { ROLE } from '@services/auth.service'

import { Gym } from '@schemas/gym'

@Injectable({
    providedIn: 'root',
})
export class GymEmployeeGuard implements CanActivate {
    constructor(private router: Router, private storageService: StorageService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const gym: Gym = this.storageService.getGym()
        if (!gym || gym.role_code == ROLE.MEMBER) {
            this.router.navigateByUrl('/redwhale-home')
            return false
        } else {
            return true
        }
    }
}
