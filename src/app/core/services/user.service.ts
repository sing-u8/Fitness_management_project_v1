import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'

import { StorageService } from '@services/storage.service'

import { Response } from '@schemas/response'
import { User } from '@schemas/user'

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/users`

    constructor(private http: HttpClient, private storageService: StorageService) {}

    getUser(userId: string): Observable<User> {
        const url = this.SERVER + `/${userId}`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.get<Response>(url, options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    updateUser(userId: string, requestBody: UpdateUserRequestBody): Observable<User> {
        const url = this.SERVER + `/${userId}`

        const options = {
            headers: new HttpHeaders({
                Accept: 'application/json',
            }),
        }

        return this.http.put<Response>(url, requestBody, options).pipe(
            map((res) => {
                const user: User = this.storageService.getUser()
                this.storageService.setUser({
                    ...user,
                    family_name: res.dataset[0]['family_name'],
                    given_name: res.dataset[0]['given_name'],
                    picture: res.dataset[0]['picture'],
                    sex: res.dataset[0]['sex'],
                    birth_date: res.dataset[0]['birth_date'],
                    fcm_token: res.dataset[0]['fcm_token'],
                    color: res.dataset[0]['color'],
                    terms_eula: res.dataset[0]['terms_eula'],
                    terms_privacy: res.dataset[0]['terms_privacy'],
                    marketing_sms: res.dataset[0]['marketing_sms'],
                    marketing_email: res.dataset[0]['marketing_email'],
                    notification_yn: res.dataset[0]['notification_yn'],
                })
                return this.storageService.getUser()
            }),
            catchError(handleError)
        )
    }

    deleteUser(userId: string): Observable<Response> {
        const url = this.SERVER + `/${userId}`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.delete<Response>(url, options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    checkPasswrod(userId: string, requestBody: { password: string }): Observable<Response> {
        const url = this.SERVER + `/${userId}/check-password`
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

    changePassword(userId: string, requestBody: ChangePasswordRequestBody): Observable<Response> {
        const url = this.SERVER + `/${userId}/change-password`

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

class UpdateUserRequestBody {
    family_name?: string
    given_name?: string
    picture?: string
    sex?: string
    birth_date?: string
    fcm_token?: string
    color?: string
    terms_eula?: number
    terms_privacy?: number
    marketing_sms?: number
    marketing_email?: number
    notification_yn?: number
}

class ChangePasswordRequestBody {
    password: string
    new_password: string
}
