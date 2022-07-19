import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'

import { Response } from '@schemas/response'
import { LockerCategory } from '@schemas/locker-category'
import { LockerItem } from '@schemas/locker-item'
import { LockerItemHistory } from '@schemas/locker-item-history'
import { UserLocker } from '@schemas/user-locker'

@Injectable({
    providedIn: 'root',
})
export class CenterLockerService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/center`

    constructor(private http: HttpClient) {}

    // 카테고리 생성
    createCategory(centerId: string, requestBody: CreateCategoryRequestBody): Observable<LockerCategory> {
        const url = this.SERVER + `/${centerId}/locker`

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

    // 카테고리 조회
    getCategoryList(centerId: string): Observable<Array<LockerCategory>> {
        const url = this.SERVER + `/${centerId}/locker`

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

    // 카테고리 수정
    updateCategory(centerId: string, categoryId: string, requestBody: UpdateCategoryRequestBody): Observable<Response> {
        const url = this.SERVER + `/${centerId}/locker/${categoryId}`

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

    // 카테고리 삭제
    deleteCategory(centerId: string, categoryId: string): Observable<Response> {
        const url = this.SERVER + `/${centerId}/locker/${categoryId}`

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

    // 아이템 생성
    createItem(centerId: string, categoryId: string, requestBody: CreateItemRequestBody): Observable<LockerItem> {
        const url = this.SERVER + `/${centerId}/locker/${categoryId}/item`

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

    // 아이템 조회
    getItemList(centerId: string, categoryId: string): Observable<Array<LockerItem>> {
        const url = this.SERVER + `/${centerId}/locker/${categoryId}/item`

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

    // 아이템 수정
    updateItem(
        centerId: string,
        categoryId: string,
        itemId: string,
        requestBody: UpdateItemRequestBody
    ): Observable<LockerItem> {
        const url = this.SERVER + `/${centerId}/locker/${categoryId}/item/${itemId}`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.put<Response>(url, requestBody, options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // 아이템 삭제
    deleteItem(centerId: string, categoryId: string, itemId: string): Observable<Response> {
        const url = this.SERVER + `/${centerId}/locker/${categoryId}/item/${itemId}`

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

    // 아이템 사용내역 조회
    getItemHistories(centerId: string, categoryId: string, itemId: string): Observable<LockerItemHistory[]> {
        const url = this.SERVER + `/${centerId}/locker/${categoryId}/item/${itemId}/history`

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

    // 아이템에서 사용중인 사용자 락커 이용권 조회
    getItemUserLocker(centerId: string, categoryId: string, itemId: string): Observable<UserLocker> {
        const url = this.SERVER + `/${centerId}/locker/${categoryId}/item/${itemId}/user_locker`

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
}

export interface CreateCategoryRequestBody {
    name: string
}

export interface UpdateCategoryRequestBody {
    name: string
}

export interface CreateItemRequestBody {
    name: string
    x?: number
    y?: number
    rows?: number
    cols?: number
}

export interface UpdateItemRequestBody {
    state_code?: 'locker_item_state_empty' | 'locker_item_state_in_use' | 'locker_item_state_stop_using' // locker_item_state_ + empty, ...
    name?: string
    x?: number
    y?: number
    rows?: number
    cols?: number
}
