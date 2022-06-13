import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, EMPTY, iif, forkJoin } from 'rxjs'
import { catchError, switchMap, tap, map, exhaustMap, mapTo } from 'rxjs/operators'

import _ from 'lodash'

@Injectable()
export class CommunityEffect {
    constructor() {}
}
