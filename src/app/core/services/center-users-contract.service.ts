import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import handleError from './handleError'
import { environment } from '@environments/environment'
import { Response } from '@schemas/response'

import { Center } from '@schemas/center'
import { Contract } from '@schemas/contract'

@Injectable({
    providedIn: 'root',
})
export class CenterUsersCenterService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/center`

    constructor(private http: HttpClient) {}

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

    // !! return type need to be modified
    getContractDetail(centerId: string, userId: string, contractId: string): Observable<Array<Contract>> {
        const url = this.SERVER + `/${centerId}/users/${userId}/contract/${contractId}`

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

export interface AddCenterToUserReqBody {
    center_id: string
}
