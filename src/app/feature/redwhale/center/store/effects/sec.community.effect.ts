import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, EMPTY, iif, forkJoin } from 'rxjs'
import { catchError, switchMap, tap, map, exhaustMap, mapTo } from 'rxjs/operators'

import { CenterChatRoomService } from '@services/center-chat-room.service'

import _ from 'lodash'

import * as CommunityActions from '../actions/sec.community.actions'
import * as CommunityReducer from '../reducers/sec.community.reducer'

@Injectable()
export class CommunityEffect {
    constructor(private centerChatRoomApi: CenterChatRoomService, private actions$: Actions) {}

    // public createChatRoom$ = createEffect(() => this.actions$.pipe(ofType(CommunityActions.startCreateChatRoom)))
}
