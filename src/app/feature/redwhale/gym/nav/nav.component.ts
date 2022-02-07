import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'

import { takeUntil } from 'rxjs/operators'
import { Subject, Observable, Subscription } from 'rxjs'

import { GlobalService } from '@services/global.service'
import { StorageService } from '@services/storage.service'
import { GymService } from '@services/gym.service'

import { Gym } from '@schemas/gym'
import { User } from '@schemas/user'

@Component({
    selector: 'rw-gymNav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
    TAG = 'Nav'

    public gym: Gym
    public user: User
    public address: string

    public gymApiData: Gym
    public unSubscriber$ = new Subject<void>()

    public isLoading = false

    public isGymChanged: Observable<boolean>
    public gymChangedSubscription: Subscription

    constructor(
        private router: Router,
        private storageService: StorageService,
        private gymService: GymService,
        private globalService: GlobalService
    ) {
        this.gym = this.storageService.getGym()
        this.user = this.storageService.getUser()
        this.getCenterAddress()
        this.gymService
            .getGym(this.gym.id)
            .pipe(takeUntil(this.unSubscriber$))
            .subscribe((gymData) => {
                this.gymApiData = gymData
                this.isLoading = true
                console.log('rw-gymNav gymApiData: ', this.gymApiData)
            })

        this.gymChangedSubscription = this.globalService.selectIsGymChangedForNav().subscribe((gymDataChanged) => {
            if (gymDataChanged == true) {
                this.gym = this.storageService.getGym()
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
