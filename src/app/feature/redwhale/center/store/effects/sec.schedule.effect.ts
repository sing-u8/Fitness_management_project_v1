import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, EMPTY } from 'rxjs'
import { catchError, switchMap, tap, map, filter } from 'rxjs/operators'

import * as ScheduleActions from '../actions/sec.schedule.actions'
import * as ScheduleSelector from '../selectors/sec.schedule.selector'

import { showToast } from '@appStore/actions/toast.action'

import _ from 'lodash'

@Injectable()
export class ScheduleEffect {
    constructor(private actions$: Actions, private store: Store) {}
}
