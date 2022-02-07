import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'
import { StorageService } from '@services/storage.service'

import { Response } from '@schemas/response'
import { Gym } from '@schemas/gym'

@Injectable({
    providedIn: 'root',
})
export class GymService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/gym`

    constructor(private http: HttpClient, private storageService: StorageService) {}

    createGym(requestBody: CreateGymRequestBody): Observable<Gym> {
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

    getGym(gymId: string): Observable<Gym> {
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

    updateGym(gymId: string, requestBody: UpdateGymRequestBody): Observable<Gym> {
        const url = this.SERVER + `/${gymId}`

        const options = {
            headers: new HttpHeaders({
                Accept: 'application/json',
            }),
        }

        return this.http.put<Response>(url, requestBody, options).pipe(
            map((res) => {
                const gym: Gym = Object.assign({}, this.storageService.getGym(), res.dataset[0])
                this.storageService.setGym(gym)
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    deleteGym(gymId: string): Observable<Response> {
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

class CreateGymRequestBody {
    name: string
    address: string
}

class UpdateGymRequestBody {
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
