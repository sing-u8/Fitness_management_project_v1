import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core'
import dayjs from 'dayjs'
import _ from 'lodash'

import { CenterStatsService } from '@services/center-stats.service'
import { StorageService } from '@services/storage.service'

import { Center } from '@schemas/center'

import { Store, select } from '@ngrx/store'

import { originalOrder } from '@helpers/pipe/keyvalue'

import * as FromSale from '@centerStore/reducers/sec.sale.reducer'
import * as SaleSelector from '@centerStore/selectors/sec.sale.selector'

// rxjs
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
    selector: 'rw-sale-summary-box',
    templateUrl: './sale-summary-box.component.html',
    styleUrls: ['./sale-summary-box.component.scss'],
})

// input() 의 타입은 나중에 서버 반환값을 보고 고치기
export class SaleSummaryBoxComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() type: 'day' | 'month'

    public center: Center
    public originalOrder = originalOrder

    public prevTotal = 0
    public curTotal = 0

    public SaleSummary: FromSale.SaleSummary

    public summaryDescText = ''
    public title = ''

    public isContentOpen: boolean
    public detailTitle = { cash: '현금', card: '카드', trans: '계좌이체', unpaid: '미수금' }

    public isLoading$ = this.nxStore.select(SaleSelector.saleSummaryLoading)
    public unsubscriber$ = new Subject<void>()

    constructor(
        private centerStatsService: CenterStatsService,
        private storageService: StorageService,
        private nxStore: Store
    ) {
        this.center = this.storageService.getCenter()
    }

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.initBoxTexts()
        this.getSaleDashboard(this.type)
    }
    ngOnDestroy(): void {
        this.unsubscriber$.next()
        this.unsubscriber$.complete()
    }

    initBoxTexts() {
        if (this.type == 'day') {
            this.title = '오늘 총 매출'
            this.summaryDescText = '어제 대비'
        } else {
            this.title = `${dayjs().format('M')}월 총 매출`
            this.summaryDescText = '전월 대비'
        }
    }

    toggleContent() {
        this.isContentOpen = !this.isContentOpen
    }

    getSaleDashboard(type: 'day' | 'month') {
        this.nxStore.pipe(select(SaleSelector.saleSummaryData), takeUntil(this.unsubscriber$)).subscribe((v) => {
            console.log('getSaleDashboard -- ', v)
            if (type == 'day') {
                this.SaleSummary = {
                    cur: {
                        cash: v.saleSummary.day.cur.cash,
                        card: v.saleSummary.day.cur.card,
                        trans: v.saleSummary.day.cur.trans,
                        unpaid: v.saleSummary.day.cur.unpaid,
                    },
                    prev: {
                        cash: v.saleSummary.day.prev.cash,
                        card: v.saleSummary.day.prev.card,
                        trans: v.saleSummary.day.prev.trans,
                        unpaid: v.saleSummary.day.prev.unpaid,
                    },
                }
                this.prevTotal = v.totalSummary.day.prev
                this.curTotal = v.totalSummary.day.cur
            } else {
                this.SaleSummary = {
                    cur: {
                        cash: v.saleSummary.month.cur.cash,
                        card: v.saleSummary.month.cur.card,
                        trans: v.saleSummary.month.cur.trans,
                        unpaid: v.saleSummary.month.cur.unpaid,
                    },
                    prev: {
                        cash: v.saleSummary.month.prev.cash,
                        card: v.saleSummary.month.prev.card,
                        trans: v.saleSummary.month.prev.trans,
                        unpaid: v.saleSummary.month.prev.unpaid,
                    },
                }
                this.prevTotal = v.totalSummary.month.prev
                this.curTotal = v.totalSummary.month.cur
            }
        })

        // date format : 'YYYY-MM-DD'
    }
}
