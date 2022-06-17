import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'

import { Response } from '@schemas/response'
import { File } from '@schemas/file'

export type FileTypeCode =
    | 'file_type_user_picture'
    | 'file_type_user_background'
    | 'file_type_center_picture'
    | 'file_type_center_background'
    | 'file_type_center_user_picture'
    | 'file_type_center_user_background'
    | 'file_type_center_chat'

@Injectable({
    providedIn: 'root',
})
export class FileService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}`

    constructor(private http: HttpClient) {}

    getFile(
        type_code: FileTypeCode,
        center_id = undefined,
        center_user_id = undefined,
        chat_room_id = undefined,
        page = undefined,
        pageSize = undefined
    ): Observable<Array<File>> {
        const url =
            this.SERVER +
            `/files?type_code=${type_code}` +
            (center_id ? `&center_id=${center_id}` : ``) +
            (center_user_id ? `&center_user_id=${center_user_id}` : ``) +
            (chat_room_id ? `&chat_room_id=${chat_room_id}` : ``) +
            (page ? `&page=${page}` : ``) +
            (pageSize ? `&pageSize=${pageSize}` : ``)

        const options = {
            headers: new HttpHeaders({
                Accept: 'application/json',
            }),
        }

        return this.http.get<Response>(url, options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    createFile(requestBody: CreateFileRequestBody, files: FileList): Observable<Array<File>> {
        const url = this.SERVER + `/files`

        const options = {
            headers: new HttpHeaders({
                Accept: 'application/json',
            }),
        }

        const formData: FormData = new FormData()

        const keys = Object.keys(requestBody)
        keys.forEach((key) => {
            formData.append(key, requestBody[key])
        })

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i])
        }

        return this.http.post<Response>(url, formData, options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    createFileWithReport(requestBody: CreateFileRequestBody, files: FileList) {
        const url = this.SERVER + `/files`

        const formData: FormData = new FormData()

        const keys = Object.keys(requestBody)
        keys.forEach((key) => {
            formData.append(key, requestBody[key])
        })

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i])
        }

        return this.http
            .post<Response>(url, formData, {
                headers: new HttpHeaders({
                    Accept: 'application/json',
                }),
                reportProgress: true,
                observe: 'events',
            })
            .pipe(catchError(handleError))
    }

    deleteFile(location: string): Observable<Response> {
        const url = this.SERVER + `/files/${encodeURIComponent(location)}`

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

    async getUploadedFile(url: string, option?: RequestInit): Promise<Blob> {
        const _option = option ?? {
            method: 'GET',
            mode: 'cors',
            headers: { 'Cache-Control': 'no-cache' },
        }
        return fetch(url, _option).then((res) => {
            return res.blob()
        })
    }
}

export interface CreateFileRequestBody {
    type_code: FileTypeCode
    center_id?: string
    center_user_id?: string
    center_chat_room_id?: string
    // files  : FileList   -- is already in other param
}
