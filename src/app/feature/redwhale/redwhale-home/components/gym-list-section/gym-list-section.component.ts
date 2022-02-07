import { Component, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core'
import { Router } from '@angular/router'

import { StorageService } from '@services/storage.service'

// rxjs
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

// ngrx
import { Store } from '@ngrx/store'
import { debugLog } from '@appStore/actions/log.action'

import { User } from '@schemas/user'
import { Gym } from '@schemas/gym'
import { Loading } from '@schemas/componentStore/loading'

// component store
import { GymsStore } from './componentStore/gyms.store'
import { Observable } from 'rxjs'

@Component({
    selector: 'gym-list-section',
    templateUrl: './gym-list-section.component.html',
    styleUrls: ['./gym-list-section.component.scss'],
    providers: [GymsStore],
})
export class GymListSectionComponent implements OnInit, AfterViewInit, OnDestroy {
    public user: User
    public gyms$: Observable<Array<Gym>>
    public gymsLoading$: Observable<Loading>

    public unsubscriber$ = new Subject<void>()

    // @ViewChild('gym_list_container') gym_list_container: ElementRef

    constructor(
        private router: Router,
        private storageService: StorageService,
        private nxStore: Store,
        private cmpStore: GymsStore
    ) {
        this.storageService.removeGym()
        this.gyms$ = this.cmpStore.gyms$
        this.gymsLoading$ = this.cmpStore.loading$

        this.cmpStore.getGyms()
    }

    ngOnInit(): void {
        this.user = this.storageService.getUser()
        this.nxStore.dispatch(debugLog({ log: ['user', this.user] }))
    }
    ngAfterViewInit(): void {}
    ngOnDestroy(): void {
        this.unsubscriber$.next()
        this.unsubscriber$.complete()
    }

    goRouterLink(url: string) {
        this.router.navigateByUrl(url)
    }

    // --------------------------- gym methods -------------------------->//

    // <--------------------------- gym methods --------------------------//
    // center list item  output listener
    onGymleft(gymId: string) {
        this.cmpStore.leaveGymEffect(gymId)
    }
    // detect last row center item
    public gridCols: number
    public lastItemIdx: number
    @HostListener('window:resize', ['$event'])
    detectLastRowOnResize(e) {
        this.setGymItemDropUp()
    }

    setGymItemDropUp() {
        this.gyms$.pipe(takeUntil(this.unsubscriber$)).subscribe((gymList) => {
            if (window.innerWidth <= 587) {
                if (this.gridCols !== 1 && gymList.length > 1) {
                    this.gridCols = 1
                    this.lastItemIdx = gymList.length - 1
                }
            } else if (window.innerWidth <= 888) {
                if (this.gridCols !== 2 && gymList.length > 2) {
                    this.gridCols = 2
                    this.lastItemIdx =
                        gymList.length % 2 == 0 ? gymList.length - 2 : gymList.length - (gymList.length % 2)
                }
            } else if (window.innerWidth <= 1160) {
                if (this.gridCols !== 3 && gymList.length > 3) {
                    this.gridCols = 3
                    this.lastItemIdx =
                        gymList.length % 3 == 0 ? gymList.length - 3 : gymList.length - (gymList.length % 3)
                }
            } else if (this.gridCols !== 4 && gymList.length > 4) {
                this.gridCols = 4
                this.lastItemIdx = gymList.length % 4 == 0 ? gymList.length - 4 : gymList.length - (gymList.length % 4)
            }
        })
    }
}
