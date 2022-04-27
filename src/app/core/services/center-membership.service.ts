import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'

import { Response } from '@schemas/response'
import { MembershipCategory } from '@schemas/membership-category'
import { MembershipItem } from '@schemas/membership-item'
import { ClassItem } from '@schemas/class-item'

@Injectable({
    providedIn: 'root',
})
export class CenterMembershipService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/center`

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

    getItems(gymId: string, categoryId: string): Observable<Array<MembershipItem>> {
        const url = this.SERVER + `/${gymId}/membership/${categoryId}/item`

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

    linkClass(
        centerId: string,
        categoryId: string,
        ItemId: string,
        reqBody: LinkClassRequestBody
    ): Observable<ClassItem> {
        const url = this.SERVER + `/${centerId}/membership/${categoryId}/item/${ItemId}/class`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.post<Response>(url, reqBody, options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    getLinkedClass(centerId: string, categoryId: string, ItemId: string): Observable<Array<ClassItem>> {
        const url = this.SERVER + `/${centerId}/membership/${categoryId}/item/${ItemId}/class`

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

    removeLinkedClass(centerId: string, categoryId: string, ItemId: string, classItemId: string): Observable<Response> {
        const url = this.SERVER + `/${centerId}/membership/${categoryId}/item/${ItemId}/class/${classItemId}`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.delete<Response>(url, options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
}

export interface CreateCategoryRequestBody {
    name: string
}

export interface UpdateCategoryRequestBody {
    name: string
}

export interface CreateItemRequestBody {
    name: string
    sequence_number: number
}

export interface UpdateItemRequestBody {
    name?: string
    days?: number
    count?: number
    unlimited?: boolean
    price?: number
    color?: string
    memo?: string
    class_item_ids?: Array<string>
}

export interface MoveItemRequestBody {
    target_category_id: string
    target_item_sequence_number: number
}

export interface LinkClassRequestBody {
    class_item_id: string
}
