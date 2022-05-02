import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import handleError from './handleError'
import { environment } from '@environments/environment'
import { Response } from '@schemas/response'

import { UserLocker } from '@schemas/user-locker'
import { Unpaid } from '@schemas/unpaid'
import { Payment } from '@schemas/payment'
import { UserLockerHistory } from '@schemas/user-locker-history'

@Injectable({
    providedIn: 'root',
})
export class CenterUsersLockerService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/center`

    private options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    }

    constructor(private http: HttpClient) {}

    // 락커 이용권 생성
    createLockerTicket(centerId: string, userId: string, reqBody: CreateLockerTicketReqBody): Observable<UserLocker> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker`

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // 락커 이용권 조회
    getLockerTickets(centerId: string, userId: string): Observable<Array<UserLocker>> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker`

        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    // 락커 이용권 정보수정
    updateLockerTicket(
        centerId: string,
        userId: string,
        lockerId: string,
        reqBody: UpdateLockerTicketReqBody
    ): Observable<UserLocker> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker/${lockerId}`

        return this.http.put<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // 락커 이용권 삭제
    deleteLockerTicket(centerId: string, userId: string, lockerId: string): Observable<Response> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker/${lockerId}`

        return this.http.delete<Response>(url, this.options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    // 락커 이용권 - 락커 연결
    startLockerTicket(
        centerId: string,
        userId: string,
        lockerId: string,
        reqBody: StartLockerTicketReqBody
    ): Observable<Response> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker/${lockerId}/start`

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // 락커 이용권 - 락커 연결 해제
    stopLockerTicket(centerId: string, userId: string, lockerId: string): Observable<Response> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker/${lockerId}/stop`
        const reqBody = {}

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    // 락커 이용권 - 일시정지
    pauseLockerTicket(
        centerId: string,
        userId: string,
        lockerId: string,
        reqBody: PauseLockerTicketReqBody
    ): Observable<Response> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker/${lockerId}/pause`

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    // 락커 이용권 - 재개
    resumeLockerTicket(centerId: string, userId: string, lockerId: string): Observable<Response> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker/${lockerId}/resume`
        const reqBody = {}

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    // 락커 이용권 - 연장
    extendLockerTicket(
        centerId: string,
        userId: string,
        lockerId: string,
        reqBody: ExtendLockerTicketReqBody
    ): Observable<UserLocker> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker/${lockerId}/extension`

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // 락커 이용권 - 환불
    refundLockerTicket(
        centerId: string,
        userId: string,
        lockerId: string,
        reqBody: RefundLockerTicketReqBody
    ): Observable<Response> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker/${lockerId}/refund`

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    // 락커 이용권 - 만료
    expireLockerTicket(
        centerId: string,
        userId: string,
        lockerId: string,
        reqBody: ExpireLockerTicketReqBody
    ): Observable<Response> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker/${lockerId}/expiration`

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    // 락커 이용권 결제 생성
    createLockerTicketPayment(
        centerId: string,
        userId: string,
        lockerId: string,
        reqBody: ExpireLockerTicketReqBody
    ): Observable<Payment> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker/${lockerId}/payment`

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // 락커 이용권 결제 조회
    getLockerTicketPayment(centerId: string, userId: string, lockerId: string): Observable<Payment> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker/${lockerId}/payment`

        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // 락커 이용권 결제 수정
    updateLockerTicketPayment(
        centerId: string,
        userId: string,
        lockerId: string,
        paymentId: string,
        reqBody: UpdateLockerTicektPaymentReqBody
    ): Observable<Response> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker/${lockerId}/payment/${paymentId}`

        return this.http.put<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    // 락커 이용권 결제 삭제
    deleteLockerTicketPayment(
        centerId: string,
        userId: string,
        lockerId: string,
        paymentId: string
    ): Observable<Payment> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker/${lockerId}/payment/${paymentId}`

        return this.http.delete<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // 락커 이용권 미납금 생성
    createLockerTicketUnpaid(
        centerId: string,
        userId: string,
        lockerId: string,
        reqBody: CreateLockerTicketUnpaidReqBody
    ): Observable<Unpaid> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker/${lockerId}/unpaid`

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // 락커 이용권 미납금 조회
    getLockerTicketUnpaids(centerId: string, userId: string, lockerId: string): Observable<Array<Unpaid>> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker/${lockerId}/unpaid`

        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    // 락커 이용권 미납금 정보수정
    updateLockerTicketUnpaid(
        centerId: string,
        userId: string,
        lockerId: string,
        unpaidId: string,
        reqBody: UpdateLockerTicketUnpaidReqBody
    ): Observable<Response> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker/${lockerId}/unpaid/${unpaidId}`

        return this.http.put<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    // 락커 이용권 미납금 삭제
    deleteLockerTicketUnpaid(
        centerId: string,
        userId: string,
        lockerId: string,
        unpaidId: string
    ): Observable<Response> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker/${lockerId}/unpaid/${unpaidId}`

        return this.http.delete<Response>(url, this.options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    // 락커 이용권 사용내역 조회
    getLockerHistory(centerId: string, userId: string, lockerId: string): Observable<Array<UserLockerHistory>> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker/${lockerId}/history`

        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }
}

export interface CreateLockerTicketReqBody {
    locker_item_id?: string
    start_date: string
    end_date: string
    payment: {
        card: number
        trans: number
        vbank: number
        phone: number
        cash: number
        unpaid: number
        memo: string
        responsibility_user_id: string
    }
}

export interface UpdateLockerTicketReqBody {
    start_date?: string
    end_date?: string
}

export interface StartLockerTicketReqBody {
    locker_item_id: string
}

export interface PauseLockerTicketReqBody {
    pause_start_date: string
    pause_end_date: string
}

export interface ExtendLockerTicketReqBody {
    start_date: string
    end_date: string
    payment: {
        pay_method_code:
            | 'payment_item_pay_method_card'
            | 'payment_item_pay_method_trans'
            | 'payment_item_pay_method_vbank'
            | 'payment_item_pay_method_phone'
            | 'payment_item_pay_method_cash'
        amount: number
    }
}

export interface RefundLockerTicketReqBody {
    memo?: string
    amount: string
}

export interface ExpireLockerTicketReqBody {
    payment: {
        card: number
        trans: number
        vbank: number
        phone: number
        cash: number
    }
}

export interface CreateLockerTicketPaymentReqBody {
    payment: {
        card: number
        trans: number
        vbank: number
        phone: number
        cash: number
    }
}

export interface UpdateLockerTicektPaymentReqBody {
    payment: {
        card: number
        trans: number
        vbank: number
        phone: number
        cash: number
    }
}

export interface CreateLockerTicketUnpaidReqBody {
    memo?: string
    amount: number
}

export interface UpdateLockerTicketUnpaidReqBody {
    memo?: string
    amount?: number
}
