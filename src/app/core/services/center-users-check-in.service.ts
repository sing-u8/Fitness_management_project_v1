import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import handleError from './handleError'
import { environment } from '@environments/environment'
import { Response } from '@schemas/response'
import { CenterUser } from '@schemas/center-user'

@Injectable({
    providedIn: 'root',
})
export class CenterUsersCheckInService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/center`

    private options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    }
    constructor(private http: HttpClient) {}

    checkIn(centerId: string, userId: string): Observable<Response> {
        const url = this.SERVER + `/${centerId}/users/${userId}/check_in`

        return this.http.post<Response>(url, {}, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    removeCheckIn(centerId: string, userId: string): Observable<Response> {
        const url = this.SERVER + `/${centerId}/users/${userId}/check_in`

        return this.http.delete<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
}

export interface CheckInReqBody {
    center_membership_number: string
}
