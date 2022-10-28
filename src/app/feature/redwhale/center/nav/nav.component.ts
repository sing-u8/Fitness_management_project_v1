import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'

import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'

import { StorageService } from '@services/storage.service'
import { CenterService } from '@services/center.service'
import { CenterPermissionHelperService } from '@services/helper/center-permission-helper.service'

import { Center, RoleCode } from '@schemas/center'
import { User } from '@schemas/user'

import { Permission } from '@centerStore/reducers/center.common.reducer'
import * as CenterCommonSelector from '@centerStore/selectors/center.common.selector'
import { select, Store } from '@ngrx/store'

@Component({
    selector: 'rw-centerNav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
    TAG = 'Nav'

    public center: Center
    public user: User
    public address: string

    public centerApiData: Center
    public unSubscriber$ = new Subject<void>()

    public isLoading = false

    public permissions: Permission = {
        administrator: [],
        instructor: [],
    }
    public showNavs = {
        sale: true,
    }

    constructor(
        private nxStore: Store,
        private router: Router,
        private storageService: StorageService,
        private centerService: CenterService,
        private centerPermissionHelperService: CenterPermissionHelperService
    ) {
        this.nxStore.pipe(select(CenterCommonSelector.curCenter), takeUntil(this.unSubscriber$)).subscribe((cc) => {
            this.center = cc
        })
        this.nxStore
            .pipe(select(CenterCommonSelector.centerPermission), takeUntil(this.unSubscriber$))
            .subscribe((cp) => {
                this.permissions = {
                    administrator: cp.administrator,
                    instructor: cp.instructor,
                }
                this.showNavs.sale = this.centerPermissionHelperService.getReceiveSalePermission()
            })

        this.user = this.storageService.getUser()
        this.getCenterAddress()
    }

    ngOnInit(): void {}
    ngOnDestroy(): void {
        this.unSubscriber$.next()
        this.unSubscriber$.complete()
    }

    getCenterAddress() {
        if (this.center) {
            this.address = this.center.address
        } else {
            this.address = this.router.url.split('/')[1]
        }
    }
    goRouterLink(link: string) {
        this.router.navigateByUrl(`/${this.address}/${link}`)
    }
}
