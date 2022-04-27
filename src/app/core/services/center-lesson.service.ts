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

    getItem(gymId: string, categoryId: string, itemId: string): Observable<ClassItem> {
        const url = this.SERVER + `/${gymId}/class/${categoryId}/item/${itemId}`

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
    type_code?: string
    name?: string
    minutes?: number
    people?: number
    instructor_user_id?: string
    color?: string
    memo?: string
    reservation_days?: number
    reservation_deadline_time?: number
    reservation_cancellation_time?: number
    membership_item_ids?: Array<string>
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
