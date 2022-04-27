import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'
import { StorageService } from '@services/storage.service'

import { Response } from '@schemas/response'

import { Role } from '@schemas/role'
import { PermissionCategory } from '@schemas/permission-category'
import { PermissionItem } from '@schemas/permission-item'

@Injectable({
    providedIn: 'root',
})
export class CenterRolePermission {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/center`
    private options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    }

    constructor(private http: HttpClient, private storageService: StorageService) {}

    // get
    getCenterRoles(centerId: string): Observable<Array<Role>> {
        const url = this.SERVER + `${centerId}/role`

        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    getCenterRolePermission(centerId: string, roleCode: string): Observable<PermissionCategory> {
        const url = this.SERVER + `${centerId}/role/${roleCode}/permission`

        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // post
    createCenterRole(centerId: string, reqBody: CreateCenterRoleReqBody): Observable<Role> {
        const url = this.SERVER + `${centerId}/role`

        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // put
    modifyCenterRole(centerId: string, roleCode: string, reqBody: ModifyCenterRoleReqBody): Observable<Role> {
        const url = this.SERVER + `${centerId}/role/${roleCode}`

        return this.http.put<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    modifyCenterRolePermission(
        centerId: string,
        roleCode: string,
        permissionCode: string,
        reqBody: ModifyCenterRolePermissionReqBody
    ): Observable<PermissionItem> {
        const url = this.SERVER + `${centerId}/role/${roleCode}/permission/${permissionCode}`

        return this.http.put<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    // delete
    deleteCenterRole(centerId: string, roleCode: string) {
        const url = this.SERVER + `${centerId}/role/${roleCode}`

        return this.http.delete<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
}

// post
export interface CreateCenterRoleReqBody {
    code: string
    name: string
}
export interface ModifyCenterRoleReqBody {
    code: string
    name: string
}

// put
export interface ModifyCenterRolePermissionReqBody {
    approved: boolean
}
