import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import handleError from './handleError'
import { environment } from '@environments/environment'
import { Response } from '@schemas/response'

import { UserLocker } from '@schemas/user-locker'

@Injectable({
    providedIn: 'root',
})
export class UsersLockerService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/users`

    private options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    }

    constructor(private http: HttpClient) {}

    getUserLockers(userId: string): Observable<Array<UserLocker>> {
        const url = this.SERVER + `/${userId}`

        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }
}
