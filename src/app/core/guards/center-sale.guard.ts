import { Injectable } from '@angular/core'
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Observable, EMPTY, of } from 'rxjs'

import { CenterService } from '@services/center.service'
import { StorageService } from '@services/storage.service'

import { Center } from '@schemas/center'
import { map, catchError, take, takeUntil } from 'rxjs/operators'

import { Permission } from '@centerStore/reducers/center.common.reducer'
import * as CenterCommonSelector from '@centerStore/selectors/center.common.selector'
import { select, Store } from '@ngrx/store'

import _ from 'lodash'
@Injectable({
    providedIn: 'root',
})
export class CenterSaleGuard implements CanActivate {
    public center: Center

    constructor(private router: Router, private storageService: StorageService, private nxStore: Store) {}

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
            if (this.center.role_code == 'owner') {
                canEnter = true
            } else {
                canEnter = permissions[this.center.role_code]
                    .find((v) => v.code == 'stats_sales')
                    .items.find((vi) => vi.code == 'read_stats_sales').approved
            }

            console.log('CenterSaleGuard -- ', canEnter)
        })

        return of(canEnter)
    }
}
