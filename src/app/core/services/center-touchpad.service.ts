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
export class CenterTouchpadService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/center`

    private options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    }
    constructor(private http: HttpClient) {}

    callEmployee(centerId: string): Observable<Response> {
        const url = this.SERVER + `/${centerId}/touchpad/call`

        return this.http.post<Response>(url, {}, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    checkIn(centerId: string, reqBody: CheckInReqBody): Observable<CenterUser> {
        const url = this.SERVER + `/${centerId}/touchpad/check_in`

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
}

export interface CheckInReqBody {
    membership_number: string
}
