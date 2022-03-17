import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import handleError from './handleError'
import { environment } from '@environments/environment'
import { Response } from '@schemas/response'

import { UserLocker } from '@schemas/user-locker'
import { Unpaid } from '@schemas/unpaid'

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

    createLockerTicket(centerId: string, userId: string, reqBody: CreateLockerTicketReqBody): Observable<UserLocker> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker`

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    getLockerTickets(centerId: string, userId: string): Observable<Array<UserLocker>> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker`

        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

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

    deleteLockerTicket(centerId: string, userId: string, lockerId: string): Observable<Response> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker/${lockerId}`

        return this.http.delete<Response>(url, this.options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

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

    getLockerTicketUnpaids(centerId: string, userId: string, lockerId: string): Observable<Array<Unpaid>> {
        const url = this.SERVER + `/${centerId}/users/${userId}/locker/${lockerId}/unpaid`

        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

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
    }
}

export interface UpdateLockerTicketReqBody {
    locker_item_id?: string
    start_date?: string
    end_date?: string
    payment?: {
        pay_method_code:
            | 'payment_item_pay_method_card'
            | 'payment_item_pay_method_trans'
            | 'payment_item_pay_method_vbank'
            | 'payment_item_pay_method_phone'
            | 'payment_item_pay_method_cash'
        amount: number
    }
}

export interface ExtendLockerTicketReqBody {
    locker_item_id?: string
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
    amout: string
}

export interface CreateLockerTicketUnpaidReqBody {
    memo?: string
    amout: number
}

export interface UpdateLockerTicketUnpaidReqBody {
    memo?: string
    amout?: number
}
