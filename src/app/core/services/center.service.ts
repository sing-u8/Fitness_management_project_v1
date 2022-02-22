import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'
import { StorageService } from '@services/storage.service'

import { Response } from '@schemas/response'
import { Center } from '@schemas/center'

@Injectable({
    providedIn: 'root',
})
export class CenterService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/gym`

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

    getCenter(gymId: string): Observable<Center> {
        const url = this.SERVER + `/${gymId}`

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

    updateCenter(gymId: string, requestBody: UpdateCenterRequestBody): Observable<Center> {
        const url = this.SERVER + `/${gymId}`

        const options = {
            headers: new HttpHeaders({
                Accept: 'application/json',
            }),
        }

        return this.http.put<Response>(url, requestBody, options).pipe(
            map((res) => {
                const gym: Center = Object.assign({}, this.storageService.getCenter(), res.dataset[0])
                this.storageService.setCenter(gym)
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    deleteCenter(gymId: string): Observable<Response> {
        const url = this.SERVER + `/${gymId}`

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

    checkMemeber(address: string): Observable<Response> {
        const url = this.SERVER + `/${address}/check-member`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.get<Response>(url, options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    delegate(gymId: string, requestBody: DelegateRequestBody): Observable<Response> {
        const url = this.SERVER + `/${gymId}/delegate`

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

class CreateCenterRequestBody {
    name: string
    address: string
}

class UpdateCenterRequestBody {
    name?: string
    address?: string
    picture?: string
    color?: string
    background?: string
    operating_days?: Array<string> // // all (매일 반복) , weekdays (평일마다 반복), weekend (주말마다 반복), ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    operating_start_time?: string
    operating_end_time?: string
}

class DelegateRequestBody {
    user_id: string
}
