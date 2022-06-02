import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, EMPTY } from 'rxjs'
import { catchError, switchMap, tap, map, filter } from 'rxjs/operators'

import * as SaleActions from '../actions/sec.sale.actions'
import * as SaleReducer from '../reducers/sec.sale.reducer'

import { showToast } from '@appStore/actions/toast.action'

import _ from 'lodash'

@Injectable()
export class SaleEffect {
    constructor(private actions$: Actions, private store: Store) {}
}
