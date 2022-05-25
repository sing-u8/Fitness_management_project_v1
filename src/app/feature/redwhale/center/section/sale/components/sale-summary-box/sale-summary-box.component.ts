import { Component, OnInit, Input, AfterViewInit } from '@angular/core'
import dayjs from 'dayjs'
import _ from 'lodash'

import { GymSaleService } from '@services/gym-sale.service'
import { StorageService } from '@services/storage.service'

import { TheDaySummary, TheMonthSummary } from '@schemas/sale'
import { Center } from '@schemas/center'

type SaleSummary = {
    // !! cash --> ca_sh 순서를 현금, 카드, 계좌이체, 미수금으로 나열하기 위해서 네이밍 수정
    prev: { ca_sh: number; card: number; trans: number; unpaid: number }
    cur: { ca_sh: number; card: number; trans: number; unpaid: number }
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

    public theSummary: TheMonthSummary | TheDaySummary
    public prevTotal = 0
    public curTotal = 0

    public SaleSummary: SaleSummary

    public summaryDescText = ''
    public title = ''

    public isContentOpen: boolean
    // !! cash --> ca_sh 순서를 현금, 카드, 계좌이체, 미수금으로 나열하기 위해서 네이밍 수정
    public detailTitle = { ca_sh: '현금', card: '카드', trans: '계좌이체', unpaid: '미수금' }

    constructor(private gymSaleService: GymSaleService, private storageService: StorageService) {
        this.center = this.storageService.getCenter()
    }

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.initBoxTexts()
        this.getSaleDashboard(dayjs().format('YYYY-MM-DD'), this.type)
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

    getSaleDashboard(date: string, type: 'day' | 'month') {
        // date format : 'YYYY-MM-DD'
        this.gymSaleService.getSaleDashborad(this.center.id, date).subscribe((saleBoard) => {
            switch (type) {
                case 'day':
                    this.SaleSummary = {
                        prev: {
                            ca_sh: Number(saleBoard.yesterday_cash),
                            trans: Number(saleBoard.yesterday_trans),
                            card: Number(saleBoard.yesterday_card),
                            unpaid: Number(saleBoard.yesterday_unpaid),
                        },
                        cur: {
                            ca_sh: Number(saleBoard.today_cash),
                            trans: Number(saleBoard.today_trans),
                            card: Number(saleBoard.today_card),
                            unpaid: Number(saleBoard.today_unpaid),
                        },
                    }

                    this.curTotal = Number(saleBoard.today_total)
                    this.prevTotal = Number(saleBoard.yesterday_total)

                    break
                case 'month':
                    this.SaleSummary = {
                        prev: {
                            ca_sh: Number(saleBoard.last_month_cash),
                            trans: Number(saleBoard.last_month_trans),
                            card: Number(saleBoard.last_month_card),
                            unpaid: Number(saleBoard.last_month_unpaid),
                        },
                        cur: {
                            ca_sh: Number(saleBoard.this_month_cash),
                            trans: Number(saleBoard.this_month_trans),
                            card: Number(saleBoard.this_month_card),
                            unpaid: Number(saleBoard.this_month_unpaid),
                        },
                    }

                    this.curTotal = Number(saleBoard.this_month_total)
                    this.prevTotal = Number(saleBoard.last_month_total)

                    break
            }
        })
    }
}
