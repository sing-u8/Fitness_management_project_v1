import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'

import { Response } from '@schemas/response'
import { LessonCategory } from '@schemas/lesson-category'
import { LessonItem } from '@schemas/lesson-item'

@Injectable({
    providedIn: 'root',
})
export class GymLessonService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/gym`

    constructor(private http: HttpClient) {}

    createCategory(gymId: string, requestBody: CreateCategoryRequestBody): Observable<LessonCategory> {
        const url = this.SERVER + `/${gymId}/lesson`

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

    getCategoryList(gymId: string): Observable<Array<LessonCategory>> {
        const url = this.SERVER + `/${gymId}/lesson`

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
        const url = this.SERVER + `/${gymId}/lesson/${categoryId}`

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
        const url = this.SERVER + `/${gymId}/lesson/${categoryId}`

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

    createItem(gymId: string, categoryId: string, requestBody: CreateItemRequestBody): Observable<LessonItem> {
        const url = this.SERVER + `/${gymId}/lesson/${categoryId}/item`

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

    getItem(gymId: string, categoryId: string, itemId: string): Observable<LessonItem> {
        const url = this.SERVER + `/${gymId}/lesson/${categoryId}/item/${itemId}`

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
        const url = this.SERVER + `/${gymId}/lesson/${categoryId}/item/${itemId}`

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
        const url = this.SERVER + `/${gymId}/lesson/${categoryId}/item/${itemId}`

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
        const url = this.SERVER + `/${gymId}/lesson/${categoryId}/item/${ItemId}/move`

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
