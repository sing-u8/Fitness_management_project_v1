import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'

import { Response } from '@schemas/response'
import { MembershipCategory } from '@schemas/membership-category'
import { MembershipItem } from '@schemas/membership-item'

@Injectable({
    providedIn: 'root',
})
export class GymMembershipService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/gym`

    constructor(private http: HttpClient) {}

    createCategory(gymId: string, requestBody: CreateCategoryRequestBody): Observable<MembershipCategory> {
        const url = this.SERVER + `/${gymId}/membership`

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

    getCategoryList(gymId: string): Observable<Array<MembershipCategory>> {
        const url = this.SERVER + `/${gymId}/membership`

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
        const url = this.SERVER + `/${gymId}/membership/${categoryId}`

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
        const url = this.SERVER + `/${gymId}/membership/${categoryId}`

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

    createItem(gymId: string, categoryId: string, requestBody: CreateItemRequestBody): Observable<MembershipItem> {
        const url = this.SERVER + `/${gymId}/membership/${categoryId}/item`

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

    getItem(gymId: string, categoryId: string, itemId: string): Observable<MembershipItem> {
        const url = this.SERVER + `/${gymId}/membership/${categoryId}/item/${itemId}`

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

    updateItem(
        gymId: string,
        categoryId: string,
        itemId: string,
        requestBody: UpdateItemRequestBody
    ): Observable<Response> {
        const url = this.SERVER + `/${gymId}/membership/${categoryId}/item/${itemId}`

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
        const url = this.SERVER + `/${gymId}/membership/${categoryId}/item/${itemId}`

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

    moveItem(
        gymId: string,
        categoryId: string,
        ItemId: string,
        requestBody: MoveItemRequestBody
    ): Observable<Response> {
        const url = this.SERVER + `/${gymId}/membership/${categoryId}/item/${ItemId}/move`

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

class CreateCategoryRequestBody {
    name: string
}

class UpdateCategoryRequestBody {
    name: string
}

class CreateItemRequestBody {
    name: string
    sequence_number: number
}

export class UpdateItemRequestBody {
    name?: string
    days?: number
    count?: number
    infinity_yn?: number
    price?: number
    color?: string
    memo?: string
    lesson_item_id_list?: Array<string>
}

class MoveItemRequestBody {
    target_category_id: string
    target_item_index: number
}
