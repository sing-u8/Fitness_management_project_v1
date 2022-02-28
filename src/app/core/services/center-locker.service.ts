import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'

import { Response } from '@schemas/response'
import { LockerCategory } from '@schemas/locker-category'
import { LockerItem } from '@schemas/locker-item'

@Injectable({
    providedIn: 'root',
})
export class CenterLockerService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/center`

    constructor(private http: HttpClient) {}

    createCategory(gymId: string, requestBody: CreateCategoryRequestBody): Observable<LockerCategory> {
        const url = this.SERVER + `/${gymId}/locker`

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

    getCategoryList(gymId: string): Observable<Array<LockerCategory>> {
        const url = this.SERVER + `/${gymId}/locker`

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

    updateCategory(gymId: string, categoryId: string, requestBody: UpdateCategoryRequestBody): Observable<Response> {
        const url = this.SERVER + `/${gymId}/locker/${categoryId}`

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

    deleteCategory(gymId: string, categoryId: string): Observable<Response> {
        const url = this.SERVER + `/${gymId}/locker/${categoryId}`

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

    createItem(gymId: string, categoryId: string, requestBody: CreateItemRequestBody): Observable<Response> {
        const url = this.SERVER + `/${gymId}/locker/${categoryId}/item`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.post<Response>(url, requestBody, options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    getItemList(gymId: string, categoryId: string): Observable<Array<LockerItem>> {
        const url = this.SERVER + `/${gymId}/locker/${categoryId}/item`

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

    // getItem(gymId: string, categoryId: string, itemId: string): Observable<LockerItem> {
    //     const url = this.SERVER + `/${gymId}/locker/${categoryId}/item/${itemId}`

    //     const options = {
    //         headers: new HttpHeaders({
    //             'Content-Type': 'application/json',
    //         }),
    //     }

    //     return this.http.get<Response>(url, options).pipe(
    //         map((res) => {
    //             return res.dataset[0]
    //         }),
    //         catchError(handleError)
    //     )
    // }

    updateItem(
        gymId: string,
        categoryId: string,
        itemId: string,
        requestBody: UpdateItemRequestBody
    ): Observable<Response> {
        const url = this.SERVER + `/${gymId}/locker/${categoryId}/item/${itemId}`

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

    deleteItem(gymId: string, categoryId: string, itemId: string): Observable<Response> {
        const url = this.SERVER + `/${gymId}/locker/${categoryId}/item/${itemId}`

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

    // restartItem(gymId: string, categoryId: string, itemId: string): Observable<Response> {
    //     const url = this.SERVER + `/${gymId}/locker/${categoryId}/item/${itemId}/restart`

    //     const options = {
    //         headers: new HttpHeaders({
    //             'Content-Type': 'application/json',
    //         }),
    //     }

    //     return this.http.put<Response>(url, {}, options).pipe(
    //         map((res) => {
    //             return res
    //         }),
    //         catchError(handleError)
    //     )
    // }

    // stopItem(gymId: string, categoryId: string, itemId: string): Observable<Response> {
    //     const url = this.SERVER + `/${gymId}/locker/${categoryId}/item/${itemId}/stop`

    //     const options = {
    //         headers: new HttpHeaders({
    //             'Content-Type': 'application/json',
    //         }),
    //     }

    //     return this.http.put<Response>(url, {}, options).pipe(
    //         map((res) => {
    //             return res
    //         }),
    //         catchError(handleError)
    //     )
    // }

    // getLockerHistory(gymId: string, categoryId: string, itemId: string): Observable<Array<LockerTicketHistory>> {
    //     const url = this.SERVER + `/${gymId}/locker/${categoryId}/item/${itemId}/history`

    //     const options = {
    //         headers: new HttpHeaders({
    //             'Content-Type': 'application/json',
    //         }),
    //     }

    //     return this.http.get<Response>(url, options).pipe(
    //         map((res) => {
    //             return res.dataset
    //         }),
    //         catchError(handleError)
    //     )
    // }
}

class CreateCategoryRequestBody {
    name: string
}

class UpdateCategoryRequestBody {
    name: string
}

class CreateItemRequestBody {
    name: string
    x?: number
    y?: number
    rows?: number
    cols?: number
}

class UpdateItemRequestBody {
    name?: string
    x?: number
    y?: number
    rows?: number
    cols?: number
}
