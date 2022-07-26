import { Injectable } from '@angular/core'
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Observable, EMPTY, of } from 'rxjs'

import { CenterService } from '@services/center.service'
import { StorageService } from '@services/storage.service'

import { Center } from '@schemas/center'
import { map, catchError } from 'rxjs/operators'

import _ from 'lodash'
@Injectable({
    providedIn: 'root',
})
export class CenterMemberBlockGuard implements CanActivate {
    public center: Center

    constructor(private router: Router, private storageService: StorageService, private centerService: CenterService) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        this.center = this.storageService.getCenter()
        const urls = state.url.split('/')

        if (_.isEmpty(this.center) || this.center?.role_code == 'member') {
            return of(false)
        } else {
            return of(true)
        }

        // if (this.center.role_code == 'member') {
        //     this.router.navigateByUrl(`/${urls[1]}/community`)
        //     return false
        // } else {
        //     return true
        // }
    }
}
