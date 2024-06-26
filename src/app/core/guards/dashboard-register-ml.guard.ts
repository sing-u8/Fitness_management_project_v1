import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import { Location } from '@angular/common'

import { CenterUser } from '@schemas/center-user'
import { ContractTypeCode } from '@schemas/contract'
import { UserMembership } from '@schemas/user-membership'

import _ from 'lodash'

@Injectable({
    providedIn: 'root',
})
export class DashboardRegisterMlGuard implements CanActivate {
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
        const type: ContractTypeCode = this.routerState?.type
        const rerUserMembership: UserMembership = this.routerState?.rerUserMembership
        console.log('DB registerML guard -- in isActivate : ', this.router.getCurrentNavigation().extras.state)

        if (!_.isEmpty(curUser) && type == 'contract_type_new') {
            return true
        } else return !_.isEmpty(curUser) && type == 'contract_type_renewal' && !_.isEmpty(rerUserMembership)
    }
}
