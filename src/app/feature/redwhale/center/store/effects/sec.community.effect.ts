import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, EMPTY, iif, forkJoin } from 'rxjs'
import { catchError, switchMap, tap, map, exhaustMap, mapTo } from 'rxjs/operators'

import { CenterChatRoomService } from '@services/center-chat-room.service'

import _ from 'lodash'

import { showToast } from '@appStore/actions/toast.action'

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
            concatLatestFrom(({ spot }) => {
                return spot == 'main'
                    ? this.store.select(CommunitySelector.mainPreChatRoom)
                    : this.store.select(CommunitySelector.drawerPreChatRoom)
            }),
            switchMap(([{ centerId, chatRoom, spot }, curChatRoom]) => {
                if (!_.isEmpty(curChatRoom) && curChatRoom.id == chatRoom.id) {
                    return []
                } else {
                    return forkJoin({
                        chatRoomMesgs: this.centerChatRoomApi.getChatRoomMessage(centerId, chatRoom.id),
                        chatRoomUsers: this.centerChatRoomApi.getChatRoomMember(centerId, chatRoom.id),
                    }).pipe(
                        switchMap(({ chatRoomMesgs, chatRoomUsers }) => {
                            return [
                                CommunityActions.finishJoinChatRoom({
                                    chatRoom,
                                    chatRoomMesgs,
                                    chatRoomUsers,
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
                        return [
                            CommunityActions.finishUpdateChatRoomName({ chatRoom, spot }),
                            showToast({ text: `채팅방의 이름이 변경되었습니다.` }),
                        ]
                    })
                )
            ),
            catchError((err: string) => of(CommunityActions.error({ error: err })))
        )
    )

    public leaveChatRoom$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.startLeaveChatRoom),
            concatLatestFrom(({ spot }) =>
                spot == 'main'
                    ? this.store.select(CommunitySelector.mainPreChatRoom)
                    : this.store.select(CommunitySelector.drawerPreChatRoom)
            ),
            switchMap(([{ centerId, spot }, curChatRoom]) =>
                this.centerChatRoomApi.leaveChatRoom(centerId, curChatRoom.id).pipe(
                    switchMap((__) => {
                        return [
                            showToast({ text: `채팅방 나가기가 완료되었습니다.` }),
                            CommunityActions.finishLeaveChatRoom({ spot }),
                        ]
                    })
                )
            ),
            catchError((err: string) => of(CommunityActions.error({ error: err })))
        )
    )

    public inviteMembers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.startInviteMembers),
            concatLatestFrom(({ spot }) =>
                spot == 'main'
                    ? this.store.select(CommunitySelector.mainCurChatRoom)
                    : this.store.select(CommunitySelector.drawerCurChatRoom)
            ),
            switchMap(([{ centerId, invitedMembers, spot }, curChatRoom]) =>
                this.centerChatRoomApi
                    .inviteMemberToChatRoom(centerId, curChatRoom.id, {
                        user_ids: invitedMembers.map((v) => v.id),
                    })
                    .pipe(
                        switchMap((__) =>
                            this.centerChatRoomApi.getChatRoom(centerId).pipe(
                                map((chatRooms) => chatRooms.find((v) => v.id == curChatRoom.id)),
                                switchMap((chatRoom) => {
                                    return [
                                        CommunityActions.finishiInviteMembers({
                                            spot,
                                            chatRoom,
                                        }),
                                    ]
                                })
                            )
                        )
                    )
            ),
            catchError((err: string) => of(CommunityActions.error({ error: err })))
        )
    )

    public sendMessageToChatRoom$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.startSendMessage),
            concatLatestFrom(({ spot }) =>
                spot == 'main'
                    ? this.store.select(CommunitySelector.mainCurChatRoom)
                    : this.store.select(CommunitySelector.drawerCurChatRoom)
            ),
            switchMap(([{ centerId, reqBody, spot }, curChatRoom]) =>
                this.centerChatRoomApi.sendMeesageToChatRoom(centerId, curChatRoom.id, reqBody).pipe(
                    switchMap((chatRoomMessage) => {
                        return [CommunityActions.finishSendMessage({ spot, chatRoomMessage })]
                    })
                )
            ),
            catchError((err: string) => of(CommunityActions.error({ error: err })))
        )
    )
}
