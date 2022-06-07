import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, EMPTY } from 'rxjs'
import { catchError, switchMap, tap, map, filter } from 'rxjs/operators'

import { CenterStatsService } from '@services/center-stats.service'

import * as SaleActions from '../actions/sec.sale.actions'
import * as SaleReducer from '../reducers/sec.sale.reducer'

import { showToast } from '@appStore/actions/toast.action'

import _ from 'lodash'

@Injectable()
export class SaleEffect {
    constructor(private actions$: Actions, private nxStore: Store, private centerStatApi: CenterStatsService) {}

    // sale data
    public getSaleData = createEffect(() =>
        this.actions$.pipe(
            ofType(SaleActions.startGetSaleData),
            switchMap(({ centerId, start_date, end_date, option }) =>
                this.centerStatApi.getStatsSales(centerId, start_date, end_date, option).pipe(
                    map((saleData) => SaleActions.finishGetSaleData({ saleData })),
                    catchError((err: string) => of(SaleActions.setError({ error: err })))
                )
            )
        )
    )
}
