import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, EMPTY, iif } from 'rxjs'
import { catchError, switchMap, tap, map, exhaustMap, mapTo } from 'rxjs/operators'

import _ from 'lodash'

import * as DashboardActions from '../actions/sec.dashboard.actions'
import * as DashboardSelector from '../selectors/sec.dashoboard.selector'
import * as DashboardReducer from '../reducers/sec.dashboard.reducer'

import { CenterUsersService } from '@services/center-users.service' // !! 나중에 멤버 데이터 API를 바꿀 수 있음

import { CenterUser } from '@schemas/center-user'

@Injectable()
export class DashboardEffect {
    constructor(private centerUsersApi: CenterUsersService, private store: Store, private actions$: Actions) {}

    public loadMemberList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DashboardActions.startLoadMemberList),
            switchMap(({ centerId }) =>
                this.centerUsersApi.getUserList(centerId).pipe(
                    map((memberlist) => {
                        const usersSelectCateg = _.cloneDeep(DashboardReducer.UsersSelectCategInit)
                        const usersList = _.cloneDeep(DashboardReducer.UsersListInit)
                        usersList['member'] = memberlist.map((v) => ({
                            user: v,
                            holdSelected: false,
                        }))
                        usersSelectCateg.member.userSize = usersList['member'].length
                        return DashboardActions.finishLoadMemberList({
                            usersList,
                            usersSelectCateg,
                        })
                    }),
                    catchError((err: string) => of(DashboardActions.error({ error: err })))
                )
            )
        )
    )
}
