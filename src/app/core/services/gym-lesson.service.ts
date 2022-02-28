import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'

import { Response } from '@schemas/response'
import { ClassCategory } from '@schemas/class-category'
import { ClassItem } from '@schemas/class-item'

@Injectable({
    providedIn: 'root',
})
export class GymLessonService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/center`

    constructor(private http: HttpClient) {}

    createCategory(centerId: string, requestBody: CreateCategoryRequestBody): Observable<ClassCategory> {
        const url = this.SERVER + `/${centerId}/lesson`

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

    getCategoryList(centerId: string): Observable<Array<ClassCategory>> {
        const url = this.SERVER + `/${centerId}/lesson`

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

    updateCategory(centerId: string, categoryId: string, requestBody: UpdateCategoryRequestBody): Observable<Response> {
        const url = this.SERVER + `/${centerId}/lesson/${categoryId}`

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

    deleteCategory(centerId: string, categoryId: string): Observable<Response> {
        const url = this.SERVER + `/${centerId}/lesson/${categoryId}`

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

    createItem(centerId: string, categoryId: string, requestBody: CreateItemRequestBody): Observable<ClassItem> {
        const url = this.SERVER + `/${centerId}/lesson/${categoryId}/item`

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

    getItem(centerId: string, categoryId: string, itemId: string): Observable<ClassItem> {
        const url = this.SERVER + `/${centerId}/lesson/${categoryId}/item/${itemId}`

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
        centerId: string,
        categoryId: string,
        itemId: string,
        requestBody: UpdateItemRequestBody
    ): Observable<Response> {
        const url = this.SERVER + `/${centerId}/lesson/${categoryId}/item/${itemId}`

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

    deleteItem(centerId: string, categoryId: string, itemId: string): Observable<Response> {
        const url = this.SERVER + `/${centerId}/lesson/${categoryId}/item/${itemId}`

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
        centerId: string,
        categoryId: string,
        ItemId: string,
        requestBody: MoveItemRequestBody
    ): Observable<Response> {
        const url = this.SERVER + `/${centerId}/lesson/${categoryId}/item/${ItemId}/move`

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
    type?: string
    name?: string
    minutes?: number
    people?: number
    trainer_id?: string
    color?: string
    reservation_start?: number
    reservation_end?: number
    reservation_cancel_end?: number
    memo?: string
    membership_item_id_list?: string[]
}

class MoveItemRequestBody {
    target_category_id: string
    target_item_index: number
}
