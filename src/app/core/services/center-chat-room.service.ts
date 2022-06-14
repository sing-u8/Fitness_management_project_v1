import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'

import { Response } from '@schemas/response'
import { ChatRoom } from '@schemas/chat-room'
import { ChatRoomUser } from '@schemas/chat-room-user'

import _ from 'lodash'
import { ChatRoomMessage } from '@schemas/chat-room-message'

@Injectable({
    providedIn: 'root',
})
export class CenterChatRoomService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/center`

    constructor(private http: HttpClient) {}

    // 채팅방 생성
    createChatRoom(centerId: string, reqBody: CreateChatRoomReqBody): Observable<ChatRoom> {
        const url = this.SERVER + `/${centerId}/chat_room`
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }
        return this.http.post<Response>(url, reqBody, options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // 채팅방 조회
    getChatRoom(centerId: string): Observable<Array<ChatRoom>> {
        const url = this.SERVER + `/${centerId}/chat_room`
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }
        return this.http.get<Response>(url, options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    // 채팅방 수정
    updateChatRoom(centerId: string, chatRoomId: string, reqBody: UpdateCenterRoomReqBody): Observable<ChatRoom> {
        const url = this.SERVER + `/${centerId}/chat_room/${chatRoomId}`
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }
        return this.http.put<Response>(url, reqBody, options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // 채팅방 나가기
    leaveChatRoom(centerId: string, chatRoomId: string): Observable<Response> {
        const url = this.SERVER + `/${centerId}/chat_room/${chatRoomId}`
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }
        return this.http.delete<Response>(url, options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    // 채팅방 회원 초대
    inviteMemberToChatRoom(
        centerId: string,
        chatRoomId: string,
        reqBody: InviteMemberToChatRoomReqBody
    ): Observable<Array<ChatRoomUser>> {
        const url = this.SERVER + `/${centerId}/chat_room/${chatRoomId}/users`
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }
        return this.http.post<Response>(url, reqBody, options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    // 채팅방 회원 조회
    getChatRoomMember(centerId: string, chatRoomId: string): Observable<Array<ChatRoomUser>> {
        const url = this.SERVER + `/${centerId}/chat_room/${chatRoomId}/users`
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }
        return this.http.get<Response>(url, options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    // 채팅방 메시지 보내기
    sendMeesageToChatRoom(
        centerId: string,
        chatRoomId: string,
        reqBody: SendMessageReqBody
    ): Observable<Array<ChatRoomMessage>> {
        const url = this.SERVER + `/${centerId}/chat_room/${chatRoomId}/message`
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }
        return this.http.post<Response>(url, reqBody, options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    // 채팅방 메시지 조회
    getChatRoomMessage(centerId: string, chatRoomId: string): Observable<Array<ChatRoomMessage>> {
        const url = this.SERVER + `/${centerId}/chat_room/${chatRoomId}/message`
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }
        return this.http.get<Response>(url, options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    // 채팅방 메시지 삭제
    deleteChatRoomMessage(centerId: string, chatRoomId: string, messageId: string): Observable<Response> {
        const url = this.SERVER + `/${centerId}/chat_room/${chatRoomId}/message/${messageId}`
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }
        return this.http.delete<Response>(url, options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }
}

export interface CreateChatRoomReqBody {
    type_code: 'chat_room_type_chat_with_me' | 'chat_room_type_general'
    user_ids: Array<string>
}

export interface UpdateCenterRoomReqBody {
    name: string
}

export interface InviteMemberToChatRoomReqBody {
    user_ids: Array<string>
}

export interface SendMessageReqBody {
    name: string
}
