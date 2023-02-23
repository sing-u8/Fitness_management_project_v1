import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'
import { StorageService } from '@services/storage.service'

import { Response } from '@schemas/response'
import { Center } from '@schemas/center'
import { CenterUser } from '@schemas/center-user'

@Injectable({
    providedIn: 'root',
})
export class CenterService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/center`

    constructor(private http: HttpClient, private storageService: StorageService) {}

    createCenter(requestBody: CreateCenterRequestBody): Observable<Center> {
        const url = this.SERVER

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

    getCenter(centerId: string): Observable<Center> {
        const url = this.SERVER + `/${centerId}`

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

    updateCenter(centerId: string, requestBody: UpdateCenterRequestBody): Observable<Center> {
        const url = this.SERVER + `/${centerId}`

        const options = {
            headers: new HttpHeaders({
                Accept: 'application/json',
            }),
        }

        return this.http.put<Response>(url, requestBody, options).pipe(
            map((res) => {
                const center: Center = Object.assign({}, this.storageService.getCenter(), res.dataset[0])
                this.storageService.setCenter(center)
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    deleteCenter(centerId: string): Observable<Response> {
        const url = this.SERVER + `/${centerId}`

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

    checkMemeber(address: string): Observable<CenterUser> {
        const url = this.SERVER + `/${address}/check-member`

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

    delegate(centerId: string, requestBody: DelegateRequestBody): Observable<Response> {
        const url = this.SERVER + `/${centerId}/delegate`

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

export interface CreateCenterRequestBody {
    name: string
    address: string
    free_trial_terms: boolean
}

export interface UpdateCenterRequestBody {
    name?: string
    address?: string
    open_time?: string
    close_time?: string
    all_day?: boolean
    day_of_the_week?: Array<number> // [0sun ~ 6sat]
    color?: string
    notice?: string
    contract_terms?: string
}

export interface DelegateRequestBody {
    center_user_id: string
}
