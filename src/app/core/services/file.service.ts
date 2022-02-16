import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'

import { Response } from '@schemas/response'
import { File } from '@schemas/file'

export type FileTag = 'user-picture' | 'user-background' | 'gym-picture' | 'gym-background' | 'chat'

@Injectable({
    providedIn: 'root',
})
export class FileService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}`

    constructor(private http: HttpClient) {}

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
    tag: FileTag
    gym_id?: string
    chat_room_id?: string
    // files  : FileList   -- is already in other param
}
