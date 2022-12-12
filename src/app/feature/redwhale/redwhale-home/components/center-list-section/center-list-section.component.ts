import { Component, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core'
import { Router } from '@angular/router'

import { StorageService } from '@services/storage.service'

// rxjs
import { Subject } from 'rxjs'
import { takeUntil, filter } from 'rxjs/operators'

// ngrx
import { Store } from '@ngrx/store'
import { debugLog } from '@appStore/actions/log.action'

import { User } from '@schemas/user'
import { Center } from '@schemas/center'
import { Loading } from '@schemas/componentStore/loading'

// component store
import { GymsStore } from './componentStore/gyms.store'
import { Observable } from 'rxjs'

@Component({
    selector: 'center-list-section',
    templateUrl: './center-list-section.component.html',
    styleUrls: ['./center-list-section.component.scss'],
    providers: [GymsStore],
})
export class CenterListSectionComponent implements OnInit, AfterViewInit, OnDestroy {
    public user: User
    public centers$: Observable<Array<Center>>
    public centersLoading$: Observable<Loading>

    public unsubscriber$ = new Subject<void>()

    // @ViewChild('center_list_container') center_list_container: ElementRef

    constructor(
        private router: Router,
        private storageService: StorageService,
        private nxStore: Store,
        private cmpStore: GymsStore
    ) {
        this.storageService.removeCenter()
        this.centers$ = this.cmpStore.centers$
        this.centersLoading$ = this.cmpStore.loading$

        this.cmpStore.getCenters()
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

    // --------------------------- center methods -------------------------->//

    // <--------------------------- center methods --------------------------//
    // center list item  output listener
    onGymleft(centerId: string) {
        this.cmpStore.leaveGymEffect(centerId)
    }
    // detect last row center item
    public gridCols: number
    public lastItemIdx: number
    @HostListener('window:resize', ['$event'])
    detectLastRowOnResize(e) {
        this.setCenterItemDropUp()
    }

    setCenterItemDropUp() {
        this.centers$.pipe(takeUntil(this.unsubscriber$)).subscribe((centerList) => {
            //
            if (window.innerWidth <= 587) {
                if (this.gridCols !== 1 && centerList.length > 1) {
                    this.gridCols = 1
                    this.lastItemIdx = centerList.length - 1
                }
            } else if (window.innerWidth <= 888) {
                if (this.gridCols !== 2 && centerList.length > 2) {
                    this.gridCols = 2
                    this.lastItemIdx =
                        centerList.length % 2 == 0 ? centerList.length - 2 : centerList.length - (centerList.length % 2)
                }
            } else if (window.innerWidth <= 1160) {
                if (this.gridCols !== 3 && centerList.length > 3) {
                    this.gridCols = 3
                    this.lastItemIdx =
                        centerList.length % 3 == 0 ? centerList.length - 3 : centerList.length - (centerList.length % 3)
                }
            } else if (this.gridCols !== 4 && centerList.length > 4) {
                this.gridCols = 4
                this.lastItemIdx =
                    centerList.length % 4 == 0 ? centerList.length - 4 : centerList.length - (centerList.length % 4)
            }
        })
    }
}
