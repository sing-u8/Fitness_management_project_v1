import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'
import { StorageService } from '@services/storage.service'

import { Response } from '@schemas/response'
import { CenterPermission } from '@schemas/centerPermission'

@Injectable({
    providedIn: 'root',
})
export class CenterPermissionService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/center`

    constructor(private http: HttpClient, private storageService: StorageService) {}

    getCenterPermission(centerId: string, role_code: string): Observable<CenterPermission> {
        const url = this.SERVER + `/${centerId}/permission`

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

    modifyCenterPermission(centerId: string, reqBody: ModifyCenterPermissionReqBody) {
        const url = this.SERVER + `/${centerId}/permission`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.put<Response>(url, reqBody, options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
}

export interface ModifyCenterPermissionReqBody {
    role_code: string
    permission_code: string
    approved: number // 0 || 1
}
