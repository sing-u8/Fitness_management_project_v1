import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import handleError from './handleError'
import { environment } from '@environments/environment'
import { Response } from '@schemas/response'

@Injectable({
    providedIn: 'root',
})
export class CenterHoldingService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/center`

    private options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    }
    constructor(private http: HttpClient) {}

    centerHolding(centerId: string, reqBody: CenterHoldingReqBody): Observable<Response> {
        const url = this.SERVER + `/${centerId}/holding`

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
}

export interface CenterHoldingReqBody {
    start_date: string
    end_date: string
    center_user_ids: Array<string>
    user_locker_included: boolean
}
