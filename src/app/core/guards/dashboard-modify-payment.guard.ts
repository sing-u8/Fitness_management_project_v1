import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import { Location } from '@angular/common'

import _ from 'lodash'
import { CenterUser } from '@schemas/center-user'
import { UserMembership } from '@schemas/user-membership'
import { UserLocker } from '@schemas/user-locker'
import { Payment } from '@schemas/payment'

@Injectable({
    providedIn: 'root',
})
export class DashboardModifyPaymentGuard implements CanActivate {
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
        const curUser: CenterUser = this.routerState?.curUser
        const userPayment: Payment = this.routerState?.userPayment
        const userLocker: UserLocker = this.routerState?.userLocker
        const userMembership: UserMembership = this.routerState?.userMembership

        return !_.isEmpty(curUser) && !_.isEmpty(userPayment)
    }
}
