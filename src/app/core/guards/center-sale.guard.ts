import { Injectable } from '@angular/core'
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Location } from '@angular/common'
import { Observable, EMPTY, of } from 'rxjs'

import { StorageService } from '@services/storage.service'

import { Center } from '@schemas/center'
import { take } from 'rxjs/operators'

import { Permission } from '@centerStore/reducers/center.common.reducer'
import * as CenterCommonSelector from '@centerStore/selectors/center.common.selector'
import { select, Store } from '@ngrx/store'

@Injectable({
    providedIn: 'root',
})
export class CenterSaleGuard implements CanActivate {
    public center: Center

    constructor(
        private router: Router,
        private storageService: StorageService,
        private nxStore: Store,
        private location: Location
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        this.center = this.storageService.getCenter()
        let permissions: Permission = {
            administrator: [],
            instructor: [],
        }
        let canEnter = false

        this.nxStore.pipe(select(CenterCommonSelector.centerPermission), take(1)).subscribe((cp) => {
            permissions = {
                administrator: cp.administrator,
                instructor: cp.instructor,
            }
            switch (this.center.role_code) {
                case 'owner':
                    canEnter = true
                    break
                case 'instructor':
                case 'administrator':
                    canEnter = permissions[this.center.role_code]
                        .find((v) => v?.code == 'stats_sales')
                        ?.items?.find((vi) => vi.code == 'read_stats_sales').approved
                    break
                default:
                    canEnter = false
                    break
            }
        })

        if (!canEnter) this.location.back()

        return of(canEnter)
    }
}
