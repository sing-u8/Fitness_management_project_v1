import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import { Location } from '@angular/common'

import _ from 'lodash'
import { CenterUser } from '@schemas/center-user'
import { ContractTypeCode } from '@schemas/contract'
import { UserLocker } from '@schemas/user-locker'

@Injectable({
    providedIn: 'root',
})
export class DashboardModifyLockerGuard implements CanActivate {
    public routerState: any
    constructor(private location: Location, private router: Router) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.isActivate()) {
            return true
        } else {
            const addr = route.params['address']
            this.router.navigateByUrl(`/${addr}/dashboard`)
            return false
        }
    }

    isActivate() {
        this.routerState = this.router.getCurrentNavigation().extras.state
        const centerUser: CenterUser = this.routerState?.centerUser
        const userLocker: UserLocker = this.routerState?.userLocker

        return !_.isEmpty(centerUser) && !_.isEmpty(userLocker)
    }
}
