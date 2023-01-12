import { Injectable } from '@angular/core'
import { HttpEvent, HttpEventType } from '@angular/common/http'
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { forkJoin, of } from 'rxjs'
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators'

import { CenterChatRoomService, SendMessageReqBody } from '@services/center-chat-room.service'
import { CommonCommunityService } from '@services/helper/common-community.service'

import { File as ServiceFile } from '@schemas/file'
import { ChatRoomLoadingMessage } from '@schemas/chat-room-message'

import _ from 'lodash'
import dayjs from 'dayjs'

import { showToast } from '@appStore/actions/toast.action'

import * as CommunityActions from '../actions/sec.community.actions'
import * as CommunitySelector from '../selectors/sec.community.selector'
import * as CommunityReducer from '../reducers/sec.community.reducer'
import { IsTmepRoom } from '@schemas/chat-room'
import { deleteChatRoomUserByWSAfterEffect } from '../actions/sec.community.actions'

@Injectable()
export class CommunityEffect {
    constructor(
        private centerChatRoomApi: CenterChatRoomService,
        private commonCommunityService: CommonCommunityService,
        private actions$: Actions,
        private store: Store
    ) {}

    public createChatRoom$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.startCreateChatRoom),
            mergeMap(({ centerId, reqBody, spot }) =>
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
            mergeMap(({ centerId, spot, curUserId }) =>
                this.centerChatRoomApi.getChatRoom(centerId).pipe(
                    switchMap((chatRooms) => {
                        const myChatRoomIdx = chatRooms.findIndex((v) => v.type_code == 'chat_room_type_chat_with_me')
                        const isMyChatRooomExist = myChatRoomIdx != -1
                        if (isMyChatRooomExist) {
                            this.store.dispatch(
                                CommunityActions.startJoinChatRoom({
                                    centerId,
                                    chatRoom: chatRooms[myChatRoomIdx],
                                    spot,
                                })
                            )
                            return [CommunityActions.finishGetChatRooms({ chatRooms, spot })]
                        } else {
                            return [
                                CommunityActions.finishGetChatRooms({ chatRooms, spot }),
                                CommunityActions.startCreateChatRoom({
                                    centerId,
                                    spot,
                                    reqBody: {
                                        type_code: 'chat_room_type_chat_with_me',
                                        center_user_ids: [curUserId],
                                    },
                                }),
                            ]
                        }
                    })
                )
            ),
            catchError((err: string) => of(CommunityActions.error({ error: err })))
        )
    )

    public joinChatRoom$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.startJoinChatRoom),
            concatLatestFrom(({ spot }) => {
                return [
                    spot == 'main'
                        ? this.store.select(CommunitySelector.mainPreChatRoom)
                        : this.store.select(CommunitySelector.drawerPreChatRoom),
                ]
            }),
            switchMap(([{ centerId, chatRoom, spot }, curChatRoom]) => {
                if (!_.isEmpty(curChatRoom) && curChatRoom.id == chatRoom.id) {
                    return [CommunityActions.skipFinishJoinChatRoom({ spot })]
                } else {
                    return forkJoin([
                        this.centerChatRoomApi.getChatRoomMessage(
                            centerId,
                            chatRoom.id,
                            1,
                            CommunityReducer.messagePageSize
                        ),
                        this.centerChatRoomApi.getChatRoomMember(centerId, chatRoom.id, true),
                    ]).pipe(
                        switchMap(([chatRoomMesgs, chatRoomUsers]) => {
                            return [
                                CommunityActions.finishJoinChatRoom({
                                    centerId,
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
    public afterJoinChagRoom$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(CommunityActions.finishJoinChatRoom),
                switchMap(({ centerId, chatRoom }) => {
                    return this.centerChatRoomApi.readChatRoomMessage(centerId, chatRoom.id)
                }),
                catchError((err: string) => of(CommunityActions.error({ error: err })))
            ),
        { dispatch: false }
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
            concatLatestFrom(({ spot }) => [
                spot == 'main'
                    ? this.store.select(CommunitySelector.mainPreChatRoom)
                    : this.store.select(CommunitySelector.drawerPreChatRoom),
                this.store.select(CommunitySelector.chatRoomList),
                this.store.select(CommunitySelector.mainPreChatRoom),
                this.store.select(CommunitySelector.drawerPreChatRoom),
            ]),
            switchMap(([{ centerId, spot }, curChatRoom, chatRoomList, mainCurChatRoom, drawerCurChatRoom]) =>
                this.centerChatRoomApi.leaveChatRoom(centerId, curChatRoom.id).pipe(
                    switchMap((__) => {
                        return [
                            showToast({ text: `채팅방 나가기가 완료되었습니다.` }),
                            CommunityActions.finishLeaveChatRoom({
                                spot: mainCurChatRoom?.id == drawerCurChatRoom?.id ? 'both' : spot,
                            }),
                            CommunityActions.startJoinChatRoom({
                                centerId,
                                spot: mainCurChatRoom?.id == drawerCurChatRoom?.id ? 'both' : spot,
                                chatRoom: chatRoomList.find((v) => v.type_code == 'chat_room_type_chat_with_me'),
                            }),
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
                        center_user_ids: invitedMembers.map((v) => v.id),
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
            mergeMap(([{ centerId, reqBody, spot }, curChatRoom]) =>
                this.centerChatRoomApi.sendMeesageToChatRoom(centerId, curChatRoom.id, reqBody).pipe(
                    switchMap((chatRoomMessage) => {
                        return [CommunityActions.finishSendMessage({ spot, chatRoomMessage })]
                    })
                )
            ),
            catchError((err: string) => of(CommunityActions.error({ error: err })))
        )
    )

    public sendMessageWithFileToChatRoom$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.startSendMessageWithFile),
            concatLatestFrom(({ spot }) =>
                spot == 'main'
                    ? this.store.select(CommunitySelector.mainCurChatRoom)
                    : this.store.select(CommunitySelector.drawerCurChatRoom)
            ),
            mergeMap(([{ centerId, text, fileList, spot, user }, curChatRoom]) =>
                this.commonCommunityService.createChatFilesWithReport(fileList, centerId, curChatRoom.id).pipe(
                    map((event: HttpEvent<any>) => ({
                        event,
                        msgId: fileList[0].file.name.slice(0, 10) + fileList[0].file.lastModified,
                    })),
                    switchMap((res) => {
                        switch (res.event.type) {
                            case HttpEventType.Sent:
                                // msgId = fileList[0].file.name.slice(0, 10) + fileList[0].file.lastModified
                                const message: ChatRoomLoadingMessage = {
                                    id: res.msgId,
                                    center_user_id: user.id,
                                    center_user_email: user.email,
                                    center_user_name: user.name,
                                    center_user_picture: user.picture,
                                    center_user_background: user.background,
                                    center_user_color: user.color,
                                    type_code: 'chat_room_message_type_file',
                                    type_code_name: '임시 메시지 - 파일',
                                    text: text,
                                    url: fileList[0].result,
                                    originalname: fileList[0].file.name,
                                    contentType: fileList[0].contentType,
                                    size: fileList[0].file.size,
                                    unread_center_user_ids: [], // !! 추후에 필요에 따라 수정 필요
                                    unread_center_user_emails: [],
                                    created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                                    deleted_at: null,
                                    gauge: {
                                        id: res.msgId,
                                        value: 0,
                                    },
                                }
                                this.store.dispatch(CommunityActions.addChatRoomLoadingMsgs({ msg: message, spot }))
                                return []

                            case HttpEventType.UploadProgress:
                                const gauge = Math.floor((res.event.loaded / res.event.total) * 100)
                                this.store.dispatch(
                                    CommunityActions.updateChatRoomLoadingMsg({ msgId: res.msgId, spot, gauge })
                                )
                                return []

                            case HttpEventType.Response:
                                const _flieList: Array<ServiceFile> = res.event.body.dataset.map((data, idx) => {
                                    // 썸네일 여부 확인 코드 필요
                                    return {
                                        ...data,
                                        thumbnail: '',
                                    }
                                })
                                const reqBody: SendMessageReqBody = {
                                    type_code: 'chat_room_message_type_file',
                                    text: text,
                                    url: _flieList[0].url,
                                    originalname: _flieList[0].originalname,
                                    contentType: _flieList[0].contentType,
                                    size: _flieList[0].size,
                                }

                                return this.centerChatRoomApi
                                    .sendMeesageToChatRoom(centerId, curChatRoom.id, reqBody)
                                    .pipe(
                                        switchMap((chatRoomMessage) => {
                                            return [
                                                CommunityActions.finishSendMessage({ spot, chatRoomMessage }),
                                                CommunityActions.removeChatRoomLoadingMsgs({
                                                    loadingMsgId: res.msgId,
                                                    spot,
                                                }),
                                            ]
                                        })
                                    )
                            default:
                                return []
                        }
                    })
                )
            ),
            catchError((err: string) => of(CommunityActions.error({ error: err })))
        )
    )

    /*
            this.centerChatRoomApi.sendMeesageToChatRoom(centerId, curChatRoom.id, reqBody).pipe(
                    switchMap((chatRoomMessage) => {
                        return [CommunityActions.finishSendMessage({ spot, chatRoomMessage })]
                    })
                )
    */

    public getMoreChatRoomMessages = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.startGetMoreChatRoomMsgs),
            concatLatestFrom(({ spot }) => [
                spot == 'main'
                    ? this.store.select(CommunitySelector.mainCurChatRoom)
                    : this.store.select(CommunitySelector.drawerCurChatRoom),
                spot == 'main'
                    ? this.store.select(CommunitySelector.mainChatRoomMsgs)
                    : this.store.select(CommunitySelector.drawerChatRoomMsgs),
                spot == 'main'
                    ? this.store.select(CommunitySelector.mainChatRoomMsgEnd)
                    : this.store.select(CommunitySelector.drawerChatRoomMsgEnd),
            ]),
            switchMap(([{ centerId, spot }, curChatRoom, chatRoomMsgs, chatRoomMsgEnd]) => {
                if (chatRoomMsgEnd) {
                    return []
                }
                const msgCount = _.filter(chatRoomMsgs, (v) => v.type_code != 'fe_chat_room_message_type_date').length
                const page = _.floor(msgCount / CommunityReducer.messagePageSize) + 1
                return this.centerChatRoomApi
                    .getChatRoomMessage(centerId, curChatRoom.id, page, CommunityReducer.messagePageSize)
                    .pipe(
                        switchMap((chatRoomMsgs) => {
                            return [
                                CommunityActions.finishGetMoreChatRoomMsgs({
                                    spot,
                                    chatRoomMsgs,
                                    chatRoomMsgEnd: chatRoomMsgs.length < CommunityReducer.messagePageSize,
                                }),
                            ]
                        })
                    )
            }),
            catchError((err: string) => of(CommunityActions.error({ error: err })))
        )
    )

    // for temp room

    public startSendMessageToTempRoom$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.startSendMessageToTempRoom),
            mergeMap(({ centerId, reqBody, spot }) =>
                this.centerChatRoomApi.createChatRoom(centerId, reqBody.createRoom).pipe(
                    switchMap((chatRoom) =>
                        forkJoin([
                            this.centerChatRoomApi.getChatRoomMessage(centerId, chatRoom.id),
                            this.centerChatRoomApi.sendMeesageToChatRoom(centerId, chatRoom.id, reqBody.sendMsg),
                        ]).pipe(
                            switchMap(([existingMsgs, chatRoomMessage]) => {
                                const chatRoomMessages = _.sortBy(_.uniqBy([...existingMsgs, chatRoomMessage], 'id'), [
                                    (o) => {
                                        return -dayjs(o.created_at).unix()
                                    },
                                ])
                                return [
                                    CommunityActions.finishSendMessageToTempRoom({ spot, chatRoomMessages, chatRoom }),
                                ]
                            })
                        )
                    )
                )
            ),
            catchError((err: string) => of(CommunityActions.error({ error: err })))
        )
    )

    public startSendMessageWithFileToTempRoom$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.startSendMessageWithFileToTempRoom),
            mergeMap(({ centerId, text, fileList, user_ids, spot, user }) =>
                this.centerChatRoomApi
                    .createChatRoom(centerId, { type_code: 'chat_room_type_general', center_user_ids: user_ids })
                    .pipe(
                        switchMap((chatRoom) =>
                            this.commonCommunityService.createChatFilesWithReport(fileList, centerId, chatRoom.id).pipe(
                                map((event: HttpEvent<any>) => ({
                                    event,
                                    msgId: fileList[0].file.name.slice(0, 10) + fileList[0].file.lastModified,
                                })),
                                switchMap((res) => {
                                    switch (res.event.type) {
                                        case HttpEventType.Sent:
                                            // msgId = fileList[0].file.name.slice(0, 10) + fileList[0].file.lastModified
                                            const message: ChatRoomLoadingMessage = {
                                                id: res.msgId,
                                                center_user_id: user.id,
                                                center_user_email: user.email,
                                                center_user_name: user.name,
                                                center_user_picture: user.picture,
                                                center_user_background: user.background,
                                                center_user_color: user.color,
                                                type_code: 'chat_room_message_type_file',
                                                type_code_name: '임시 메시지 - 파일',
                                                text: text,
                                                url: fileList[0].result,
                                                originalname: fileList[0].file.name,
                                                contentType: fileList[0].contentType,
                                                size: fileList[0].file.size,
                                                unread_center_user_ids: [], // !! 추후에 필요에 따라 수정 필요
                                                unread_center_user_emails: [],
                                                created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                                                deleted_at: null,
                                                gauge: {
                                                    id: res.msgId,
                                                    value: 0,
                                                },
                                            }
                                            this.store.dispatch(
                                                CommunityActions.addChatRoomLoadingMsgs({ msg: message, spot })
                                            )
                                            return []

                                        case HttpEventType.UploadProgress:
                                            const gauge = Math.floor((res.event.loaded / res.event.total) * 100)
                                            this.store.dispatch(
                                                CommunityActions.updateChatRoomLoadingMsg({
                                                    msgId: res.msgId,
                                                    spot,
                                                    gauge,
                                                })
                                            )
                                            return []

                                        case HttpEventType.Response:
                                            const _flieList: Array<ServiceFile> = res.event.body.dataset.map(
                                                (data, idx) => {
                                                    // 썸네일 여부 확인 코드 필요
                                                    return {
                                                        ...data,
                                                        thumbnail: '',
                                                    }
                                                }
                                            )
                                            const reqBody: SendMessageReqBody = {
                                                type_code: 'chat_room_message_type_file',
                                                text: text,
                                                url: _flieList[0].url,
                                                originalname: _flieList[0].originalname,
                                                contentType: _flieList[0].contentType,
                                                size: _flieList[0].size,
                                            }

                                            return forkJoin([
                                                this.centerChatRoomApi.getChatRoomMessage(centerId, chatRoom.id),
                                                this.centerChatRoomApi.sendMeesageToChatRoom(
                                                    centerId,
                                                    chatRoom.id,
                                                    reqBody
                                                ),
                                            ]).pipe(
                                                switchMap(([existingMsgs, chatRoomMessage]) => {
                                                    const chatRoomMessages = _.sortBy(
                                                        _.uniqBy([...existingMsgs, chatRoomMessage], 'id'),
                                                        [
                                                            (o) => {
                                                                return -dayjs(o.created_at).unix()
                                                            },
                                                        ]
                                                    )
                                                    return [
                                                        CommunityActions.finishSendMessageToTempRoom({
                                                            spot,
                                                            chatRoomMessages,
                                                            chatRoom,
                                                        }),
                                                        CommunityActions.removeChatRoomLoadingMsgs({
                                                            loadingMsgId: res.msgId,
                                                            spot,
                                                        }),
                                                    ]
                                                })
                                            )

                                        // return this.centerChatRoomApi
                                        //     .sendMeesageToChatRoom(centerId, chatRoom.id, reqBody)
                                        //     .pipe(
                                        //         switchMap((chatRoomMessage) => {
                                        //             return [
                                        //                 CommunityActions.finishSendMessage({ spot, chatRoomMessage }),
                                        //                 CommunityActions.removeChatRoomLoadingMsgs({
                                        //                     loadingMsgId: res.msgId,
                                        //                     spot,
                                        //                 }),
                                        //             ]
                                        //         })
                                        //     )
                                        default:
                                            return []
                                    }
                                })
                            )
                        )
                    )
            ),
            catchError((err: string) => of(CommunityActions.error({ error: err })))
        )
    )

    // web socket effects
    public createChatRoomMsgByWS$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.startCreateChatRoomMsgByWS),
            concatLatestFrom(() => [
                this.store.select(CommunitySelector.chatRoomList),
                this.store.select(CommunitySelector.isLoading),
            ]),
            mergeMap(([{ ws_data }, chatRoomList, isLoading]) => {
                // if (_.isEmpty(chatRoomList) || isLoading != 'done') return []
                const chatRoomIdx = chatRoomList.findIndex((v) => v.id == ws_data.info.chat_room_id)
                if (chatRoomIdx != -1) {
                    return [
                        CommunityActions.finishCreateChatRoomMsgByWS({
                            ws_data,
                            chatRoomIdx,
                            chatRoomList: undefined,
                        }),
                    ]
                } else {
                    return this.centerChatRoomApi.getChatRoom(ws_data.info.center_id).pipe(
                        mergeMap((_chatRoomList) => {
                            const cr = _.find(_chatRoomList, (v) => v.id == ws_data.info.chat_room_id)
                            const ctlWoCr = _.filter(_chatRoomList, (v) => v.id != ws_data.info.chat_room_id)
                            const tempChatRooms = chatRoomList.filter(
                                (v) =>
                                    _.includes(v.id, IsTmepRoom) &&
                                    _.differenceBy(v.chat_room_users, cr.chat_room_users, 'id').length != 0
                            )
                            const ctl = [cr, ...tempChatRooms, ...ctlWoCr]
                            const chatRoomIdx = ctl.findIndex((v) => v.id == ws_data.info.chat_room_id)

                            return [
                                CommunityActions.finishCreateChatRoomMsgByWS({
                                    ws_data,
                                    chatRoomIdx,
                                    chatRoomList: ctl,
                                }),
                            ]
                        })
                    )
                }
            }),
            catchError((err: string) => of(CommunityActions.error({ error: err })))
        )
    )

    public readChatMsgsByWS$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(CommunityActions.startCreateChatRoomMsgByWS),
                concatLatestFrom(() => [
                    this.store.select(CommunitySelector.drawerCurChatRoom),
                    this.store.select(CommunitySelector.mainCurChatRoom),
                ]),
                switchMap(([{ ws_data }, curDrawerChatRoom, curMainChatRoom]) => {
                    if (
                        curDrawerChatRoom?.id == ws_data.info.chat_room_id ||
                        curMainChatRoom?.id == ws_data.info.chat_room_id
                    ) {
                        return this.centerChatRoomApi.readChatRoomMessage(
                            ws_data.info.center_id,
                            ws_data.info.chat_room_id
                        )
                    } else {
                        return []
                    }
                }),
                catchError((err: string) => of(CommunityActions.error({ error: err })))
            ),
        { dispatch: false }
    )

    public deleteChatRoomByWs$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.deleteChatRoomUserByWS),
            concatLatestFrom(() => [
                this.store.select(CommunitySelector.chatRoomList),
                this.store.select(CommunitySelector.mainCurChatRoom),
                this.store.select(CommunitySelector.drawerCurChatRoom),
            ]),
            mergeMap(([{ ws_data, cur_center_user }, chatRoomList, mainCurChatRoom, drawerCurChatRoom]) => {
                const chatRoomIdx = chatRoomList.findIndex((v) => v.id == ws_data.info.chat_room_id)
                if (chatRoomIdx == -1) {
                    return []
                } else if (ws_data.info.center_user_id == cur_center_user.id) {
                    const newChatRoomList = _.filter(chatRoomList, (v, i) => {
                        return v.id != chatRoomList[chatRoomIdx].id
                    })
                    return [
                        CommunityActions.deleteChatRoomUserByWSAfterEffect({
                            ws_data,
                            cur_center_user,
                            deletedChatRoomIdx: chatRoomIdx,
                            newChatRoomList,
                        }),
                        CommunityActions.startJoinChatRoom({
                            centerId: ws_data.info.center_id,
                            chatRoom: newChatRoomList.find((v) => v.type_code == 'chat_room_type_chat_with_me'),
                            spot: mainCurChatRoom.id == drawerCurChatRoom?.id ? 'both' : 'main',
                        }),
                    ]
                } else {
                    return [
                        CommunityActions.deleteChatRoomUserByWSAfterEffect({
                            ws_data,
                            cur_center_user,
                            deletedChatRoomIdx: chatRoomIdx,
                            newChatRoomList: undefined,
                        }),
                    ]
                }
            })
        )
    )

    // by dashboard
    public getChatRoomsByDashboard$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CommunityActions.startGetChatRoomsByDashboard),
            mergeMap(({ openSpot, centerId, cb }) =>
                this.centerChatRoomApi.getChatRoom(centerId).pipe(
                    switchMap((chatRooms) => {
                        // cb ? cb(chatRooms) : null
                        return [
                            CommunityActions.finishGetChatRoomsByDashboard({
                                openSpot,
                                chatRooms,
                                cb,
                            }),
                        ]
                    })
                )
            ),
            catchError((err: string) => of(CommunityActions.error({ error: err })))
        )
    )
}
