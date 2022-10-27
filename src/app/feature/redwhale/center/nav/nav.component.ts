import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'

import { takeUntil } from 'rxjs/operators'
import { Subject, Observable, Subscription } from 'rxjs'
import _ from 'lodash'

import { StorageService } from '@services/storage.service'
import { CenterService } from '@services/center.service'

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
    updateShowNavs(permissions: Permission, roleCode: RoleCode) {
        switch (roleCode) {
            case 'owner':
                this.showNavs.sale = true
                break
            case 'instructor':
            case 'administrator':
                this.showNavs.sale = this.permissions[roleCode]
                    .find((v) => v.code == 'stats_sales')
                    .items.find((vi) => vi.code == 'read_stats_sales').approved
                break
            default:
                this.showNavs.sale = false
                break
        }
    }

    constructor(
        private nxStore: Store,
        private router: Router,
        private storageService: StorageService,
        private centerService: CenterService
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
                this.updateShowNavs(this.permissions, this.center.role_code)
            })

        this.user = this.storageService.getUser()
        this.getCenterAddress()
        this.centerService
            .getCenter(this.center.id)
            .pipe(takeUntil(this.unSubscriber$))
            .subscribe((centerData) => {
                this.centerApiData = centerData
                this.isLoading = true
            })
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
