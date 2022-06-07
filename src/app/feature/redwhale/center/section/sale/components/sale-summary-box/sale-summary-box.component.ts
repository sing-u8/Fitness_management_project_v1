import { Component, OnInit, Input, AfterViewInit } from '@angular/core'
import dayjs from 'dayjs'
import _ from 'lodash'

import { CenterStatsService } from '@services/center-stats.service'
import { StorageService } from '@services/storage.service'

import { Center } from '@schemas/center'

import { originalOrder } from '@helpers/pipe/keyvalue'

type SaleSummary = {
    prev: { cash: number; card: number; trans: number; unpaid: number }
    cur: { cash: number; card: number; trans: number; unpaid: number }
}

@Component({
    selector: 'rw-sale-summary-box',
    templateUrl: './sale-summary-box.component.html',
    styleUrls: ['./sale-summary-box.component.scss'],
})

// input() 의 타입은 나중에 서버 반환값을 보고 고치기
export class SaleSummaryBoxComponent implements OnInit, AfterViewInit {
    @Input() type: 'day' | 'month'

    public center: Center
    public originalOrder = originalOrder

    public prevTotal = 0
    public curTotal = 0

    public SaleSummary: SaleSummary

    public summaryDescText = ''
    public title = ''

    public isContentOpen: boolean
    public detailTitle = { cash: '현금', card: '카드', trans: '계좌이체', unpaid: '미수금' }

    constructor(private centerStatsService: CenterStatsService, private storageService: StorageService) {
        this.center = this.storageService.getCenter()
    }

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.initBoxTexts()
        this.getSaleDashboard(this.type)
    }

    initBoxTexts() {
        if (this.type == 'day') {
            this.title = '당일 총 매출'
            this.summaryDescText = '어제 대비'
        } else {
            this.title = '당월 총 매출'
            this.summaryDescText = '전월 대비'
        }
    }

    toggleContent() {
        this.isContentOpen = !this.isContentOpen
    }

    getSaleDashboard(type: 'day' | 'month') {
        // date format : 'YYYY-MM-DD'
        this.centerStatsService.getStatsSalesSummary(this.center.id).subscribe((saleBoard) => {
            switch (type) {
                case 'day':
                    this.SaleSummary = {
                        prev: {
                            cash: Number(saleBoard.yesterday.cash),
                            trans: Number(saleBoard.yesterday.trans),
                            card: Number(saleBoard.yesterday.card),
                            unpaid: Number(saleBoard.yesterday.unpaid),
                        },
                        cur: {
                            cash: Number(saleBoard.today.cash),
                            trans: Number(saleBoard.today.trans),
                            card: Number(saleBoard.today.card),
                            unpaid: Number(saleBoard.today.unpaid),
                        },
                    }

                    this.curTotal = _.reduce(_.values(saleBoard.today), (acc, cur) => acc + Number(cur), 0)
                    this.prevTotal = _.reduce(_.values(saleBoard.yesterday), (acc, cur) => acc + Number(cur), 0)

                    break
                case 'month':
                    this.SaleSummary = {
                        prev: {
                            cash: Number(saleBoard.last_month.cash),
                            trans: Number(saleBoard.last_month.trans),
                            card: Number(saleBoard.last_month.card),
                            unpaid: Number(saleBoard.last_month.unpaid),
                        },
                        cur: {
                            cash: Number(saleBoard.this_month.cash),
                            trans: Number(saleBoard.this_month.trans),
                            card: Number(saleBoard.this_month.card),
                            unpaid: Number(saleBoard.this_month.unpaid),
                        },
                    }

                    this.curTotal = _.reduce(_.values(saleBoard.this_month), (acc, cur) => acc + Number(cur), 0)
                    this.prevTotal = _.reduce(_.values(saleBoard.last_month), (acc, cur) => acc + Number(cur), 0)

                    break
            }
        })
    }
}
