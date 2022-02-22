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

    getCenterList(userId: string, page = '', pageSize = ''): Observable<Array<Center>> {
        const url = this.SERVER + `/${userId}/gym?page=${page}&pageSize=${pageSize}`

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

    leave(userId: string, gymId: string): Observable<Response> {
        const url = this.SERVER + `/${userId}/gym/${gymId}/leave`

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
