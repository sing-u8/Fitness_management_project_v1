import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import { Location } from '@angular/common'

@Injectable({
    providedIn: 'root',
})
export class DashboardRegisterMlGuard implements CanActivate {
    constructor(private location: Location, private router: Router) {
        console.log('DB registerML guard -- router : ', this.router.getCurrentNavigation().extras.state)
    }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        console.log('DB registerML guard -- router :', this.location.getState())
        return true
    }
}
