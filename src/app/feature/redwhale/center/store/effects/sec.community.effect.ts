import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, EMPTY, iif, forkJoin } from 'rxjs'
import { catchError, switchMap, tap, map, exhaustMap, mapTo } from 'rxjs/operators'

import { CenterChatRoomService } from '@services/center-chat-room.service'

import _ from 'lodash'

import * as CommunityActions from '../actions/sec.community.actions'
import * as CommunitySelector from '../selectors/sec.community.selector'
import * as CommunityReducer from '../reducers/sec.community.reducer'

@Injectable()
export class CommunityEffect {
    constructor(private centerChatRoomApi: CenterChatRoomService, private actions$: Actions, private store: Store) {}

    public createChatRoom$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.startCreateChatRoom),
            switchMap(({ centerId, reqBody, spot }) =>
                this.centerChatRoomApi.createChatRoom(centerId, reqBody).pipe(
                    switchMap((chatRoom) => {
                        return [CommunityActions.finishCreateChatRoom({ chatRoom, spot })]
                    })
                )
            ),
            catchError((err: string) => of(CommunityActions.error({ error: err })))
        )
    )

    public getChatRoom$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.startGetChatRooms),
            switchMap(({ centerId }) =>
                this.centerChatRoomApi.getChatRoom(centerId).pipe(
                    switchMap((chatRooms) => {
                        return [CommunityActions.finishGetChatRooms({ chatRooms })]
                    })
                )
            ),
            catchError((err: string) => of(CommunityActions.error({ error: err })))
        )
    )

    public joinChatRoom = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.startJoinChatRoom),
            concatLatestFrom(({ spot }) =>
                spot == 'main'
                    ? this.store.select(CommunitySelector.mainCurChatRoom)
                    : this.store.select(CommunitySelector.drawerCurChatRoom)
            ),
            switchMap(([{ centerId, chatRoom, spot }, curChatRoom]) => {
                if (!_.isEmpty(curChatRoom) && curChatRoom.id == chatRoom.id) {
                    return []
                } else {
                    return forkJoin({
                        chatMsgs: this.centerChatRoomApi.getChatRoomMessage(centerId, chatRoom.id),
                        chatUsers: this.centerChatRoomApi.getChatRoomMember(centerId, chatRoom.id),
                    }).pipe(
                        switchMap(({ chatMsgs, chatUsers }) => {
                            return [
                                CommunityActions.finishJoinChatRoom({
                                    chatRoom,
                                    chatRoomMesgs: chatMsgs,
                                    chatRoomUsers: chatUsers,
                                    spot,
                                    isSameRoom: false,
                                }),
                            ]
                        })
                    )
                }
            }),
            catchError((err: string) => of(CommunityActions.error({ error: err })))
        )
    )

    public updateChatRoomName$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.startUpdateChatRoomName),
            concatLatestFrom(({ spot }) =>
                spot == 'main'
                    ? this.store.select(CommunitySelector.mainCurChatRoom)
                    : this.store.select(CommunitySelector.drawerCurChatRoom)
            ),
            switchMap(([{ centerId, reqBody, spot }, curChatRoom]) =>
                this.centerChatRoomApi.updateChatRoom(centerId, curChatRoom.id, reqBody).pipe(
                    switchMap((chatRoom) => {
                        return [CommunityActions.finishUpdateChatRoomName({ chatRoom, spot })]
                    })
                )
            ),
            catchError((err: string) => of(CommunityActions.error({ error: err })))
        )
    )
}
