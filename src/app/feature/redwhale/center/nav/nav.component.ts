import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'

import { takeUntil } from 'rxjs/operators'
import { Subject, Observable, Subscription } from 'rxjs'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'
import { CenterService } from '@services/center.service'

import { Center } from '@schemas/center'
import { User } from '@schemas/user'

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

    public isGymChanged: Observable<boolean>
    public centerChangedSubscription: Subscription

    constructor(
        private router: Router,
        private storageService: StorageService,
        private centerService: CenterService,
        private globalService: GlobalService
    ) {
        this.center = this.storageService.getCenter()
        this.user = this.storageService.getUser()
        this.getCenterAddress()
        this.centerService
            .getCenter(this.center.id)
            .pipe(takeUntil(this.unSubscriber$))
            .subscribe((centerData) => {
                this.centerApiData = centerData
                this.isLoading = true
            })

        this.centerChangedSubscription = this.globalService
            .selectIsGymChangedForNav()
            .subscribe((centerDataChanged) => {
                if (centerDataChanged == true) {
                    this.center = this.storageService.getCenter()
                    this.centerApiData = this.center
                    this.globalService.setIsGymChangedForNav(false)
                }
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
