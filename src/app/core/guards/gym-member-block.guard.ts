import { Injectable } from '@angular/core'
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Observable } from 'rxjs'

import { GymService } from '@services/gym.service'
import { StorageService } from '@services/storage.service'

import { Gym } from '@schemas/gym'
import { map } from 'rxjs/operators'
@Injectable({
    providedIn: 'root',
})
export class GymMemberBlockGuard implements CanActivate {
    public gym: Gym

    constructor(private router: Router, private storageService: StorageService, private gymService: GymService) {
        this.gym = this.storageService.getGym()
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const urls = state.url.split('/')
        return this.gymService.getGym(this.gym.id).pipe(
            map((gymData) => {
                if (gymData.role_code == 'member') {
                    this.router.navigateByUrl(`/${urls[1]}/community`)
                    return false
                } else {
                    return true
                }
            })
        )
    }
}
