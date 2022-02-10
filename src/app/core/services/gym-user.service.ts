import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'

import { Response } from '@schemas/response'
import { GymUser } from '@schemas/backup/gym-user'

@Injectable({
    providedIn: 'root',
})
export class GymUserService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/gym`

    constructor(private http: HttpClient) {}

    createUser(gymId: string, requestBody: CreateUserRequestBody): Observable<CreateUserResponse> {
        const url = this.SERVER + `/${gymId}/users`

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

    registerByEmail(gymId: string, requestBody: registrationByEmailRequestBody): Observable<CreateUserResponse> {
        const url = this.SERVER + `/${gymId}/users/registrationByEmail`

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

    getUserList(gymId: string, q = '', role_code = '', type = ''): Observable<Array<GymUser>> {
        const url = this.SERVER + `/${gymId}/users?q=${q}&role_code=${role_code}&type=${type}`

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

    updateUser(gymId: string, userId: string, requestBody: UpdateUserRequestBody) {
        const url = this.SERVER + `/${gymId}/users/${userId}`

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
    phone_number: string
    verification_code: number
    family_name: string
    given_name: string
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
    memo?: string
    gym_user_name?: string
    picture?: string
}
