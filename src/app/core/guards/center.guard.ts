import { Injectable } from '@angular/core'
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router'
import { Observable, of, forkJoin } from 'rxjs'
import { catchError, map, take } from 'rxjs/operators'
import _ from 'lodash'

import { Center } from '@schemas/center'

import { CenterService } from '@services/center.service'
import { StorageService } from '@services/storage.service'

// ngrx
import { Store, select } from '@ngrx/store'
import * as CenterCommonActions from '@centerStore/actions/center.common.actions'
import { curCenterRefreshed } from '@centerStore/selectors/center.common.selector'
import { CenterUser } from '@schemas/center-user'

@Injectable({
    providedIn: 'root',
})
export class CenterGuard implements CanActivate {
    public addrData = {
        addr: '',
        isChecked: false,
    }

    constructor(
        private router: Router,
        private CenterService: CenterService,
        private storageService: StorageService,
        private nxStore: Store
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const address = route.params['address']
        const center: Center = this.storageService.getCenter()
        const centerUser: CenterUser = this.storageService.getCenterUser()

        if (address == this.addrData.addr && this.addrData.isChecked && !_.isEmpty(centerUser)) {
            this.nxStore.dispatch(CenterCommonActions.startGetCenterPermission({ centerId: center.id }))
            return of(true)
        } else {
            return this.CenterService.checkMemeber(address).pipe(
                map((cu) => {
                    this.storageService.setCenterUser(cu)
                    this.addrData.addr = address
                    this.addrData.isChecked = true

                    this.nxStore.dispatch(CenterCommonActions.setCurCenter({ center }))
                    this.nxStore.dispatch(CenterCommonActions.startGetInstructors({ centerId: center.id }))
                    this.nxStore.dispatch(CenterCommonActions.startGetMembers({ centerId: center.id }))
                    this.nxStore.dispatch(CenterCommonActions.startGetCenterPermission({ centerId: center.id }))

                    this.nxStore.pipe(select(curCenterRefreshed), take(1)).subscribe((ccr) => {
                        if (!ccr) {
                            this.nxStore.dispatch(CenterCommonActions.startGetCurCenter({ centerId: center.id }))
                        }
                    })
                    return true
                }),
                catchError((error: any) => {
                    this.addrData.addr = ''
                    this.addrData.isChecked = false
                    this.router.navigateByUrl('/redwhale-home')
                    return of(false)
                })
            )
        }
    }
}
