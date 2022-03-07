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
export class CenterUsersService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/center`

    constructor(private http: HttpClient) {}

    createUser(centerId: string, requestBody: CreateUserRequestBody): Observable<CreateUserResponse> {
        const url = this.SERVER + `/${centerId}/users`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.post<Response>(url, requestBody, options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // !! 현재 미구현 상태
    registerByEmail(centerId: string, requestBody: registrationByEmailRequestBody): Observable<CreateUserResponse> {
        const url = this.SERVER + `/${centerId}/users/registrationByEmail`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.post<Response>(url, requestBody, options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    getUserList(
        centerId: string,
        search = '',
        role_code = '',
        created_date = '',
        page = '',
        pageSize = ''
    ): Observable<Array<CenterUser>> {
        // created_date ==> YYYY-MM-DD
        const url =
            this.SERVER +
            `/${centerId}/users?search=${search}&role_code=${role_code}&created_date=${created_date}&page=${page}&pageSize=${pageSize}`

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

    updateUser(centerId: string, userId: string, requestBody: UpdateUserRequestBody) {
        const url = this.SERVER + `/${centerId}/users/${userId}`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.put<Response>(url, requestBody, options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }
}

class CreateUserRequestBody {
    phone_number?: string
    name?: string
    picture?: string
    sex?: string
    email?: string
}

class registrationByEmailRequestBody {
    email: string
    given_name: string
    phone_number: string
    sex: string
    birth_date: string
}
class CreateUserResponse {
    id: string
}

class UpdateUserRequestBody {
    role_code?: string
    center_user_name?: string
    center_user_memo?: string
}
