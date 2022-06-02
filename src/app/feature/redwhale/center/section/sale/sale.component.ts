import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, ViewChild, ElementRef } from '@angular/core'
import _ from 'lodash'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)
import { Subscription } from 'rxjs'

import { Center } from '@schemas/center'
// import { SalesData, Statistics } from '@schemas/sale'

// import { GymSaleStateService, Inputs, TypeCheck, Filters, SelectedDate } from '@services/etc/gym-sale-state.service'
// import { GymSaleService, getSaleByContentOption } from '@services/gym-sale.service'

import { StorageService } from '@services/storage.service'

// rxjs
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

// ngrx and store
import { Store, select } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'

import * as FromSale from '@centerStore/reducers/sec.sale.reducer'
// import * as SaleSelector from '@centerStore/selectors/sec.sale.selector'
import * as SaleActions from '@centerStore/actions/sec.sale.actions'

@Component({
    selector: 'sale',
    templateUrl: './sale.component.html',
    styleUrls: ['./sale.component.scss'],
})
export class SaleComponent implements OnInit {
    // public selectorDate: SelectedDate

    public showEmptyTableFlag: 'register' | 'reFilter' | 'none'
    // public isFiltered: Record<Filters, boolean>
    public isFilteredSubscription: Subscription
    public filterTagList: Array<{
        query: string
        queryCateg: string
        type: string
        value: string
        cancelFn: () => void
    }>

    public center: Center
    public tableOption

    public resizeUnlistener: () => void
    @ViewChild('sale') sale: ElementRef

    constructor(
        private renderer: Renderer2,

        private storageService: StorageService
    ) {
        this.showEmptyTableFlag = 'none'
        this.filterTagList = []
        this.center = this.storageService.getCenter()

        // this.isFilteredSubscription = this.selectFilter()
    }

    ngOnInit(): void {}
    ngOnDestroy(): void {
        // this.isFilteredSubscription.unsubscribe()
        this.resizeUnlistener()
    }

    ngAfterViewInit(): void {
        this.resizeUnlistener = this.renderer.listen('window', 'resize', (event) => {
            if (event.target.innerWidth >= 1180 && event.target.innerWidth <= 1440) {
                this.renderer.setStyle(this.sale.nativeElement, 'minWidth', `${event.target.innerWidth - 64}px`)
            }
        })
    }

    // helpers
    typeMatcher(type: FromSale.TypeCheckString) {
        switch (type) {
            case 'membership':
                return '회원권'
            case 'locker':
                return '락커'
        }
    }

    filterMatcher(filter: FromSale.Filters) {
        switch (filter) {
            case 'member':
                return '회원명'
            case 'membershipLocker':
                return '회원권/락커명'
            case 'personInCharge':
                return '결제 담당자'
            case 'type':
                return '구분'
        }
    }

    queryMatcher(filter: FromSale.Filters) {
        switch (filter) {
            case 'member':
                return 'user_keyword'
            case 'membershipLocker':
                return 'keyword'
            case 'personInCharge':
                return 'assignee_name'
            case 'type':
                return 'category'
        }
    }
}
