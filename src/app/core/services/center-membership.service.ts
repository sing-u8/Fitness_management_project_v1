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

    // 회원권 아이템 일괄 조회
    getAllMemberships(gymId: string, page?: number, pageSize?: number): Observable<Array<MembershipItem>> {
        const url =
            this.SERVER + `/${gymId}/membership_item` + (page && pageSize ? `?page=${page}&pageSize=${pageSize}` : '')

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

    // 카테고리 생성
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

    // 카테고리 조회
    getCategoryList(gymId: string, page?: number, pageSize?: number): Observable<Array<MembershipCategory>> {
        const url =
            this.SERVER +
            `/${gymId}/membership` +
            (page ? `page=${page}&` : '') +
            (pageSize ? `pageSize=${pageSize}` : '')

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

    // 카테고리 삭제
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

    // 카테고리 이동
    moveCategory(centerId: string, categoryId: string, requestBody: MoveCategoryRequestBody): Observable<Response> {
        const url = this.SERVER + `/${centerId}/membership/${categoryId}/move`

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

    // 아이템 생성
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

    // 아이템 조회
    getItems(gymId: string, categoryId: string, page?: number, pageSize?: number): Observable<Array<MembershipItem>> {
        const url =
            this.SERVER +
            `/${gymId}/membership/${categoryId}/item` +
            (page ? `page=${page}&` : '') +
            (pageSize ? `pageSize=${pageSize}` : '')

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

    // 아이템 삭제
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

    // 아이템 이동
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

    // 수업 연결
    linkClass(
        centerId: string,
        categoryId: string,
        ItemId: string,
        reqBody: LinkClassRequestBody
    ): Observable<Array<ClassItem>> {
        const url = this.SERVER + `/${centerId}/membership/${categoryId}/item/${ItemId}/class`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.post<Response>(url, reqBody, options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    // 연결된 수업 조회
    getLinkedClass(
        centerId: string,
        categoryId: string,
        ItemId: string,
        page?: number,
        pageSize?: number
    ): Observable<Array<ClassItem>> {
        const url =
            this.SERVER +
            `/${centerId}/membership/${categoryId}/item/${ItemId}/class` +
            (page ? `page=${page}&` : '') +
            (pageSize ? `pageSize=${pageSize}` : '')

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

    //  수업 연결 해제
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
}

export interface MoveItemRequestBody {
    target_category_id: string
    target_item_sequence_number: number
}

export interface MoveCategoryRequestBody {
    target_category_sequence_number: number
}

export interface LinkClassRequestBody {
    class_item_ids: string[]
}
