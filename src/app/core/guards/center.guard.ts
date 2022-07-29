import { Injectable } from '@angular/core'
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router'
import { Observable, of, forkJoin } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { Center } from '@schemas/center'

import { CenterService } from '@services/center.service'
import { StorageService } from '@services/storage.service'

// ngrx
import { Store, select } from '@ngrx/store'
import * as CenterCommonActions from '@centerStore/actions/center.common.actions'

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
        if (address == this.addrData.addr && this.addrData.isChecked) {
            return of(true)
        } else {
            return this.CenterService.checkMemeber(address).pipe(
                map((res) => {
                    this.addrData.addr = address
                    this.addrData.isChecked = true

                    const center: Center = this.storageService.getCenter()
                    console.log('CenterGuard center : ', center)
                    this.nxStore.dispatch(CenterCommonActions.setCurCenter({ center }))
                    this.nxStore.dispatch(CenterCommonActions.startGetInstructors({ centerId: center.id }))
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
