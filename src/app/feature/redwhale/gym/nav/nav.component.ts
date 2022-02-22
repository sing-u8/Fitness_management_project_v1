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
    selector: 'rw-gymNav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
    TAG = 'Nav'

    public gym: Center
    public user: User
    public address: string

    public gymApiData: Center
    public unSubscriber$ = new Subject<void>()

    public isLoading = false

    public isGymChanged: Observable<boolean>
    public gymChangedSubscription: Subscription

    constructor(
        private router: Router,
        private storageService: StorageService,
        private centerService: CenterService,
        private globalService: GlobalService
    ) {
        this.gym = this.storageService.getCenter()
        this.user = this.storageService.getUser()
        this.getCenterAddress()
        this.centerService
            .getCenter(this.gym.id)
            .pipe(takeUntil(this.unSubscriber$))
            .subscribe((gymData) => {
                this.gymApiData = gymData
                this.isLoading = true
                console.log('rw-gymNav gymApiData: ', this.gymApiData)
            })

        this.gymChangedSubscription = this.globalService.selectIsGymChangedForNav().subscribe((gymDataChanged) => {
            if (gymDataChanged == true) {
                this.gym = this.storageService.getCenter()
                this.gymApiData = this.gym
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
        if (this.gym) {
            this.address = this.gym.address
        } else {
            this.address = this.router.url.split('/')[1]
        }
    }
}
