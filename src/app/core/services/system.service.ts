import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ReCaptchaV3Service } from 'ng-recaptcha'
import handleError from './handleError'

import { environment } from '@environments/environment'

import { Response } from '@schemas/response'

@Injectable({
    providedIn: 'root',
})
export class SystemService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/system`

    constructor(private http: HttpClient, private recaptchaV3Service: ReCaptchaV3Service) {}

    getVersionList(): Observable<Array<any>> {
        const url = this.SERVER + `/versions`

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

    getOpengraphList(text: string): Observable<Array<any>> {
        const url = this.SERVER + `/opengraph`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }
        // const regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
        const regex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi

        const urls = text.match(regex)

        return this.http.post<Response>(url, { urls: urls }, options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    recaptcha(requestBody: RecaptchaRequestBody): Observable<RecaptchaResponse> {
        const url = this.SERVER + `/recaptcha`

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

    async isBot(action: string): Promise<boolean> {
        const recaptchaToken = await this.recaptchaV3Service.execute(action).toPromise()
        const result = await this.recaptcha({ recaptcha_token: recaptchaToken }).toPromise()

        if (result.success) {
            const score = result['score']
            if (score < 0.5) {
                return true
            } else {
                return false
            }
        } else {
            return true
        }
    }

    getCodeList(codeTypeList: Array<string>): Observable<Array<any>> {
        const url = this.SERVER + `/codes?type=${codeTypeList.toString()}`

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
}

type RecaptchaRequestBody = {
    recaptcha_token: string
}

type RecaptchaResponse = {
    success: boolean
    challenge_ts: string
    hostname: string
    score: number
    action: string
}
