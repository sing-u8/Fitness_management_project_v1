import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import handleError from './handleError'
import { environment } from '@environments/environment'
import { Response } from '@schemas/response'
import { Payment } from '@schemas/payment'

@Injectable({
    providedIn: 'root',
})
export class CenterUsersPaymentService {
    constructor(private http: HttpClient) {}
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/center`

    private options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    }
    // 회원권 - 락커 결제 생성
    createMembershipAndLockerPayment(
        centerId: string,
        userId: string,
        reqBody: CreateMLPaymentReqBody
    ): Observable<Response> {
        const url = this.SERVER + `/${centerId}/users/${userId}/payment`

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
    // 결제 내역 조회
    getPayments(centerId: string, userId: string): Observable<Array<Payment>> {
        const url = this.SERVER + `/${centerId}/users/${userId}/payment`

        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }
}

export interface CreateMLPaymentReqBody {
    user_memberships: Array<{
        start_date: string
        end_date: string
        count: number
        unlimited: boolean
        class_item_ids: string[]
        membership_item_id: string
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
    }>
    user_lockers: Array<{
        locker_item_id: string
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
    }>
}
