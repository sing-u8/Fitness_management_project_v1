import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import handleError from './handleError'
import { environment } from '@environments/environment'
import { Response } from '@schemas/response'
import { UserMembership } from '@schemas/user-membership'
import { ClassItem } from '@schemas/class-item'
import { Payment } from '@schemas/payment'
import { UserMembershipHistory } from '@schemas/user-membership-history'
import { Holding } from '@schemas/holding'

@Injectable({
    providedIn: 'root',
})
export class CenterUsersMembershipService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/center`

    private options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    }
    constructor(private http: HttpClient) {}

    // 회원권 생성
    createMembershipTicket(
        centerId: string,
        userId: string,
        reqBody: CreateMembershipTicketReqBody
    ): Observable<UserMembership> {
        const url = this.SERVER + `/${centerId}/users/${userId}/membership`

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
    // 회원권 조회
    getMembershipTickets(centerId: string, userId: string): Observable<Array<UserMembership>> {
        const url = this.SERVER + `/${centerId}/users/${userId}/membership`

        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }
    // 회원권 정보수정
    updateMembershipTicket(
        centerId: string,
        userId: string,
        membershipId: string,
        reqBody: UpdateMembershipTicketReqBody
    ): Observable<UserMembership> {
        const url = this.SERVER + `/${centerId}/users/${userId}/membership/${membershipId}`

        return this.http.put<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
    // 회원권 삭제
    deletteMembershipTicket(centerId: string, userId: string, membershipId: string): Observable<Response> {
        const url = this.SERVER + `/${centerId}/users/${userId}/membership/${membershipId}`

        return this.http.delete<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
    // // 회원권 일시정지       // !!
    // stopMembershipTicket(
    //     centerId: string,
    //     userId: string,
    //     membershipId: string,
    //     reqBody: StopMembershipTicketReqBody
    // ): Observable<Response> {
    //     const url = this.SERVER + `/${centerId}/users/${userId}/membership/${membershipId}/pause`

    //     return this.http.post<Response>(url, reqBody, this.options).pipe(
    //         map((res) => {
    //             return res.dataset[0]
    //         }),
    //         catchError(handleError)
    //     )
    // }
    // // 회원권 재개       // !!
    // resumeMembershipTicket(centerId: string, userId: string, membershipId: string): Observable<Response> {
    //     const url = this.SERVER + `/${centerId}/users/${userId}/membership/${membershipId}/resume`

    //     return this.http.post<Response>(url, {}, this.options).pipe(
    //         map((res) => {
    //             return res.dataset[0]
    //         }),
    //         catchError(handleError)
    //     )
    // }
    // 회원권 연장
    extendMembershipTicket(
        centerId: string,
        userId: string,
        membershipId: string,
        reqBody: ExtendMembershipTicketReqBody
    ): Observable<UserMembership> {
        const url = this.SERVER + `/${centerId}/users/${userId}/membership/${membershipId}/extension`

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
    // 회원권 환불
    refundMembershipTicket(
        centerId: string,
        userId: string,
        membershipId: string,
        reqBody: RefundMembershipTicketReqBody
    ): Observable<Response> {
        const url = this.SERVER + `/${centerId}/users/${userId}/membership/${membershipId}/refund`

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
    // 회원권 양도
    transferMembershipTicket(
        centerId: string,
        userId: string,
        membershipId: string,
        reqBody: TransferMembershipTicketReqBody
    ): Observable<Response> {
        const url = this.SERVER + `/${centerId}/users/${userId}/membership/${membershipId}/transfer`

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
    // 회원권 결제 생성
    createMembershipTicketPayment(
        centerId: string,
        userId: string,
        membershipId: string,
        reqBody: CreateMembershipTicketPaymentReqBody
    ): Observable<Payment> {
        const url = this.SERVER + `/${centerId}/users/${userId}/membership/${membershipId}/payment`

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
    // 회원권 결제 조회
    getMembershipTicketPayments(centerId: string, userId: string, membershipId: string): Observable<Array<Payment>> {
        const url = this.SERVER + `/${centerId}/users/${userId}/membership/${membershipId}/payment`

        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
    // 회원권 결제 정보수정
    updateMembershipTicketPayment(
        centerId: string,
        userId: string,
        membershipId: string,
        paymentId: string,
        reqBody: UpdateMembershipTicketPaymentReqBody
    ): Observable<Payment> {
        const url = this.SERVER + `/${centerId}/users/${userId}/membership/${membershipId}/payment/${paymentId}`

        return this.http.put<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
    // 회원권 결제 삭제
    removeMembershipTicketPayment(
        centerId: string,
        userId: string,
        membershipId: string,
        paymentId: string
    ): Observable<Response> {
        const url = this.SERVER + `/${centerId}/users/${userId}/membership/${membershipId}/payment/${paymentId}`

        return this.http.delete<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    //  회원권 - 홀딩
    holdingMembershipTicket(
        centerId: string,
        userId: string,
        membershipId: string,
        reqBody: HoldingMembershipTicketReqBody
    ): Observable<Holding> {
        const url = this.SERVER + `/${centerId}/users/${userId}/membership/${membershipId}/holding`

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    //  회원권 - 홀딩수정
    modifyHoldingMembershipTicket(
        centerId: string,
        userId: string,
        membershipId: string,
        holdingId: string,
        reqBody: UpdateHoldingMembershipTicketReqBody
    ): Observable<Response> {
        const url = this.SERVER + `/${centerId}/users/${userId}/membership/${membershipId}/holding/${holdingId}`

        return this.http.put<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    //  회원권 - 홀딩 삭제
    removeHoldingMembershipTicket(
        centerId: string,
        userId: string,
        membershipId: string,
        holdingId: string
    ): Observable<Response> {
        const url = this.SERVER + `/${centerId}/users/${userId}/membership/${membershipId}/holding/${holdingId}`

        return this.http.delete<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // 회원권 수업 조회
    getMembershipTicketClasses(centerId: string, userId: string, membershipId: string): Observable<Array<ClassItem>> {
        const url = this.SERVER + `/${centerId}/users/${userId}/membership/${membershipId}/class`
        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }
}

export interface CreateMembershipTicketReqBody {
    membership_item_id: string
    // category_name: string
    // name: string
    start_date: string
    end_date: string
    count: number
    unlimited: boolean
    color: string
    class_item_ids: string[]
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

export interface UpdateMembershipTicketReqBody {
    start_date?: string
    end_date?: string
    count?: number
    unlimited?: boolean
    color?: string
    class_item_ids?: string[]
}

// export interface ResumeMembershipTicketReqBody {}

export interface ExtendMembershipTicketReqBody {
    end_date: string
    count: number
    unlimited: boolean
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

export interface RefundMembershipTicketReqBody {
    payment: {
        card: number
        trans: number
        vbank: number
        phone: number
        cash: number
        memo: string
        responsibility_user_id: string
    }
}

export interface TransferMembershipTicketReqBody {
    transferee_user_id: string
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

export interface CreateMembershipTicketPaymentReqBody {
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

export interface UpdateMembershipTicketPaymentReqBody {
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

export interface HoldingMembershipTicketReqBody {
    start_date: string
    end_date: string
}
export interface UpdateHoldingMembershipTicketReqBody {
    start_date: string
    end_date: string
}
