import { Injectable } from '@angular/core'
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Observable, EMPTY } from 'rxjs'

import { CenterService } from '@services/center.service'
import { StorageService } from '@services/storage.service'

import { Center } from '@schemas/center'
import { map, catchError } from 'rxjs/operators'
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
        return this.centerService.getCenter(this.center.id).pipe(
            map((centerData) => {
                if (centerData.role_code == 'member') {
                    this.router.navigateByUrl(`/${urls[1]}/community`)
                    return false
                } else {
                    return true
                }
            })
        )
    }
}
