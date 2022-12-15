import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'
import { Response } from '@schemas/response'
import { SMSCaller } from '@schemas/sms-caller'
import { SMSPoint } from '@schemas/sms-point'
import { SMSHistoryGroup } from '@schemas/sms-history-group'
import { SMSHistory } from '@schemas/sms-history'
import { SMSAutoSend } from '@schemas/sms-auto-send'

@Injectable({
    providedIn: 'root',
})
export class CenterSMSService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/center`
    private options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    }

    constructor(private http: HttpClient) {}

    /**
     * 포인트 조회
     * @param centerId
     * @returns
     */
    getSMSPoint(centerId: string): Observable<{ sms_point: number }> {
        const url = this.SERVER + `/${centerId}/sms/point`

        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    /**
     * 포인트 수정
     * for test
     * @param centerId
     * @param reqBody
     */
    updateSMSPoint(centerId: string, reqBody: UpdateSMSPointReqBody) {
        const url = this.SERVER + `/${centerId}/sms/point`

        return this.http.put<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    /**
     * 발신 조회
     * @param centerId
     */
    getSMSCallerId(centerId: string): Observable<Array<SMSCaller>> {
        const url = this.SERVER + `/${centerId}/sms/caller_id`

        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    /**
     * 발신번호 등록
     * for test
     * @param centerId
     * @param reqBody
     */
    registerSMSCallerId(centerId: string, reqBody: RegisterSMSCallerIdReqBody): Observable<Response> {
        const url = this.SERVER + `/${centerId}/sms/caller_id`

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    /**
     * 문자 전송
     * @param centerId
     * @param reqBody
     */
    sendSMSMessage(centerId: string, reqBody: SendSMSMessageReqBody): Observable<SMSPoint> {
        const url = this.SERVER + `/${centerId}/sms/send_message`

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    /**
     * 문자 전송 내역 그룹 조회
     * @param centerId
     * @param page
     * @param pageSize
     */
    getSMSHistoryGroup(
        centerId: string,
        start_date: string,
        end_date: string,
        page?: number,
        pageSize?: number
    ): Observable<Array<SMSHistoryGroup>> {
        const url =
            this.SERVER +
            `/${centerId}/sms/history_group` +
            `?start_date=${start_date}&end_date=${end_date}` +
            (page ? `&page=${page}&` : '') +
            (pageSize ? `&pageSize=${pageSize}` : '')

        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    /**
     * 문자 전송 내역 조회
     * @param centerId
     * @param historyGroupId
     * @param page
     * @param pageSize
     */
    getSMSHistoryGroupDetail(
        centerId: string,
        historyGroupId: string,
        page?: number,
        pageSize?: number
    ): Observable<Array<SMSHistory>> {
        const url =
            this.SERVER +
            `/${centerId}/sms/history_group/${historyGroupId}` +
            (page ? `?page=${page}&` : '') +
            (pageSize ? `pageSize=${pageSize}` : '')

        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    updateMembershipAutoSend(centerId: string, reqBody: UpdateMLAutoSendReqBody): Observable<Response> {
        const url = this.SERVER + `/${centerId}/sms/auto_send/membership_to_expire`

        return this.http.put<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
    getMembershipAutoSend(centerId: string): Observable<SMSAutoSend> {
        const url = this.SERVER + `/${centerId}/sms/auto_send/membership_to_expire`

        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    updateLockerAutoSend(centerId: string, reqBody: UpdateMLAutoSendReqBody): Observable<Response> {
        const url = this.SERVER + `/${centerId}/sms/auto_send/locker_to_expire`

        return this.http.put<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
    getLockerAutoSend(centerId: string): Observable<SMSAutoSend> {
        const url = this.SERVER + `/${centerId}/sms/auto_send/locker_to_expire`

        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
}

export interface UpdateSMSPointReqBody {
    sms_point: number
}
export interface RegisterSMSCallerIdReqBody {
    phone_number: string
}
export interface SendSMSMessageReqBody {
    sender_phone_number: string
    reservation_datetime?: string
    text: string
    receiver_center_user_ids: string[]
}
export interface UpdateMLAutoSendReqBody {
    phone_number?: string
    text?: string
    auto_send_yn?: boolean
    days?: number
    time?: string
}
