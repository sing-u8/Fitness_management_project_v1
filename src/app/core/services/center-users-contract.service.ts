import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import handleError from './handleError'
import { environment } from '@environments/environment'
import { Response } from '@schemas/response'

import { Center } from '@schemas/center'
import { Contract } from '@schemas/contract'
import { ContractUserLocker } from '@schemas/contract-user-locker'
import { ContractUserMembership } from '@schemas/contract-user-membership'
import { ContractPayment } from '@schemas/contract-payment'

@Injectable({
    providedIn: 'root',
})
export class CenterContractService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/center`

    constructor(private http: HttpClient) {}

    /**
     * @todo 계약 조회
     * @param centerId
     * @param userId
     * @param page
     * @param pageSize
     */
    getContract(centerId: string, userId: string, page?: number, pageSize?: number): Observable<Array<Contract>> {
        const url =
            this.SERVER +
            `/${centerId}/users/${userId}/contract` +
            (page && pageSize ? `?page=${page}&pageSize=${pageSize}` : '')

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

    /**
     * @todo 계약 락커 조회
     * @param centerId
     * @param userId
     * @param contractId
     * @return Observable<ContractUserLocker[]>
     */
    getContractLocker(centerId: string, userId: string, contractId: string): Observable<Array<ContractUserLocker>> {
        const url = this.SERVER + `/${centerId}/users/${userId}/contract/${contractId}/locker`

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

    /**
     * @todo 계약 회원권 조회
     * @param centerId
     * @param userId
     * @param contractId
     * @return Observable<ContractUserMembership[]>
     */
    getContractMembership(
        centerId: string,
        userId: string,
        contractId: string
    ): Observable<Array<ContractUserMembership>> {
        const url = this.SERVER + `/${centerId}/users/${userId}/contract/${contractId}/membership`

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

    /**
     * @todo 계약 결제 조회
     * @param centerId
     * @param userId
     * @param contractId
     * @return Observable<ContractPayment[]>
     */
    getContractPayment(centerId: string, userId: string, contractId: string): Observable<Array<ContractPayment>> {
        const url = this.SERVER + `/${centerId}/users/${userId}/contract/${contractId}/payment`

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
}
