import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'

import { Response } from '@schemas/response'
import { ClassCategory } from '@schemas/class-category'
import { ClassItem } from '@schemas/class-item'
import { MembershipItem } from '@schemas/membership-item'
import { CenterUser } from '@schemas/center-user'

@Injectable({
    providedIn: 'root',
})
export class CenterLessonService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/center`

    constructor(private http: HttpClient) {}

    // 수업 아이템 일괄 조회
    getAllClasses(gymId: string, page?: number, pageSize?: number): Observable<Array<ClassItem>> {
        const url =
            this.SERVER + `/${gymId}/class_item` + (page && pageSize ? `?page=${page}&pageSize=${pageSize}` : '')

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
    createCategory(gymId: string, requestBody: CreateCategoryRequestBody): Observable<ClassCategory> {
        const url = this.SERVER + `/${gymId}/class`

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
    getCategoryList(gymId: string): Observable<Array<ClassCategory>> {
        const url = this.SERVER + `/${gymId}/class`

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
        const url = this.SERVER + `/${gymId}/class/${categoryId}`

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
        const url = this.SERVER + `/${gymId}/class/${categoryId}`

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
    createItem(gymId: string, categoryId: string, requestBody: CreateItemRequestBody): Observable<ClassItem> {
        const url = this.SERVER + `/${gymId}/class/${categoryId}/item`

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
    getItems(gymId: string, categoryId: string): Observable<Array<ClassItem>> {
        const url = this.SERVER + `/${gymId}/class/${categoryId}/item`

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
        const url = this.SERVER + `/${gymId}/class/${categoryId}/item/${itemId}`

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
        const url = this.SERVER + `/${gymId}/class/${categoryId}/item/${itemId}`

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
        const url = this.SERVER + `/${gymId}/class/${categoryId}/item/${ItemId}/move`

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

    // 회원권 연결
    linkMembership(
        centerId: string,
        categoryId: string,
        ItemId: string,
        reqBdoy: LinkMembershipRequestBody
    ): Observable<MembershipItem> {
        const url = this.SERVER + `/${centerId}/class/${categoryId}/item/${ItemId}/membership`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.post<Response>(url, reqBdoy, options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // 연결된 회원권 조회
    getLinkedMemberships(centerId: string, categoryId: string, ItemId: string): Observable<Array<MembershipItem>> {
        const url = this.SERVER + `/${centerId}/class/${categoryId}/item/${ItemId}/membership`

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

    // 회원권 연결 해제
    removeLinkedMembership(
        centerId: string,
        categoryId: string,
        ItemId: string,
        membershipItemId: string
    ): Observable<Response> {
        const url = this.SERVER + `/${centerId}/class/${categoryId}/item/${ItemId}/membership/${membershipItemId}`

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

    // 강사 추가
    addInstructor(
        centerId: string,
        categoryId: string,
        ItemId: string,
        reqBody: AddInstructorRequestBody
    ): Observable<CenterUser> {
        const url = this.SERVER + `/${centerId}/class/${categoryId}/item/${ItemId}/instructor`

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

    // 강사 조회
    getInstructors(centerId: string, categoryId: string, ItemId: string): Observable<Array<CenterUser>> {
        const url = this.SERVER + `/${centerId}/class/${categoryId}/item/${ItemId}/instructor`

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

    // 강사 삭제
    removeInstructor(
        centerId: string,
        categoryId: string,
        ItemId: string,
        instructorUserId: string
    ): Observable<Response> {
        const url = this.SERVER + `/${centerId}/class/${categoryId}/item/${ItemId}/instructor/${instructorUserId}`

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
    type_code?: 'class_item_type_onetoone' | 'class_item_type_group'
    name?: string
    duration?: number
    capacity?: number
    color?: string
    memo?: string
    start_booking_until?: number
    end_booking_before?: number
    cancel_booking_before?: number
}

export interface MoveItemRequestBody {
    target_category_id: string
    target_item_sequence_number: number
}

export interface LinkMembershipRequestBody {
    membership_item_id: string
}

export interface AddInstructorRequestBody {
    instructor_user_id: string
}
