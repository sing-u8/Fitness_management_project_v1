import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, forkJoin } from 'rxjs'
import { catchError, switchMap, tap, map, find } from 'rxjs/operators'

import _ from 'lodash'

import { Center } from '@schemas/center'
import { CenterUser } from '@schemas/center-user'

import { CenterUserListService } from '@services/helper/center-user-list.service'

import * as centerCommonActions from '@centerStore/actions/center.common.actions'

@Injectable()
export class CenterCommonEffect {
    constructor(private centerUserListApi: CenterUserListService, private store: Store, private actions$: Actions) {}

    public getInstructors$ = createEffect(() =>
        this.actions$.pipe(
            ofType(centerCommonActions.startGetInstructors),
            switchMap(({ centerId }) =>
                this.centerUserListApi.getCenterInstructorList(centerId).pipe(
                    map((instructors) => {
                        return centerCommonActions.finishGetInstructors({ instructors })
                    })
                )
            )
        )
    )
}
