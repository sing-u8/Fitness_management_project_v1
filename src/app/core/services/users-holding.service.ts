import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import handleError from './handleError'
import { environment } from '@environments/environment'
import { Response } from '@schemas/response'

import { Center } from '@schemas/center'

@Injectable({
    providedIn: 'root',
})
export class UsersCenterService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/users`

    constructor(private http: HttpClient) {}

    addCenterToUser(userId: string, reqBody: AddCenterToUserReqBody) {
        const url = this.SERVER + `/${userId}/center`

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

    getCenterList(userId: string, page = '', pageSize = ''): Observable<Array<Center>> {
        const url = this.SERVER + `/${userId}/center?page=${page}&pageSize=${pageSize}`

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

    leave(userId: string, centerId: string): Observable<Response> {
        const url = this.SERVER + `/${userId}/center/${centerId}/leave`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.put<Response>(url, {}, options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }
}

export interface AddCenterToUserReqBody {
    center_id: string
}
