import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'
import { StorageService } from '@services/storage.service'
import { WsChatService } from '@services/web-socket/ws-chat.service'

import { Response } from '@schemas/response'
import { User } from '@schemas/user'

export const ROLE = {
    ADMIN: 'administrator',
    MANAGER: 'manager',
    STAFF: 'staff',
    MEMBER: 'member',
}

export const PERMISSION = {}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/auth`

    constructor(private http: HttpClient, private storageService: StorageService, private WsChat: WsChatService) {}

    signInWithFirebase(requestBody: SignInWithFirebaseRequestBody): Observable<User> {
        const url = this.SERVER + '/firebase'

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.post<Response>(url, requestBody, options).pipe(
            map((res) => {
                const user: User = res.dataset[0]
                this.storageService.setUser(user)
                this.WsChat.subscribeChatWs(user.access_token)
                return user
            }),
            catchError(handleError)
        )
    }

    signInWithKakao(requestBody: SignInWithKakaoRequestBody): Observable<User> {
        const url = this.SERVER + '/kakao'

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.post<Response>(url, requestBody, options).pipe(
            map((res) => {
                const user: User = res.dataset[0]
                this.storageService.setUser(user)
                this.WsChat.subscribeChatWs(user.access_token)
                return user
            }),
            catchError(handleError)
        )
    }

    signInWithEmail(requestBody: SignInWithEmailRequestBody): Observable<User> {
        const url = this.SERVER + '/login'

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.post<Response>(url, requestBody, options).pipe(
            map((res) => {
                const user: User = res.dataset[0]
                this.storageService.setUser(user)
                this.WsChat.subscribeChatWs(user.access_token)
                return user
            }),
            catchError(handleError)
        )
    }

    // -- // new
    refreshToken(requestBody: RefreshTokenRequestBody): Observable<string> {
        const url = this.SERVER + '/token'

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.post<Response>(url, requestBody, options).pipe(
            map((res) => {
                const accessToken = res.dataset[0].access_token
                this.storageService.setAccessToken(accessToken)
                return accessToken
            })
        )
    }

    checkDuplicateMail(requestBody: CheckDuplicateMailRequestBody): Observable<Response> {
        const url = this.SERVER + '/check-duplicate-mail'

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.post<Response>(url, requestBody, options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    sendVerificationCodeMail(requestBody: SendVerificationCodeMailRequestBody): Observable<Response> {
        const url = this.SERVER + '/send-verification-code-mail'

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.post<Response>(url, requestBody, options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    checkVerificationCodeMail(requestBody: CheckVerificationCodeMailRequestBody): Observable<Response> {
        const url = this.SERVER + '/check-verification-code-mail'

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.post<Response>(url, requestBody, options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    registration(requestBody: RegistrationRequestBody): Observable<User> {
        // name은??
        const url = this.SERVER + '/registration'

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.post<Response>(url, requestBody, options).pipe(
            map((res) => {
                const user: User = res.dataset[0]
                this.storageService.setUser(user)
                return user
            }),
            catchError(handleError)
        )
    }

    sendResetPasswordLinkMail(requestBody: SendResetPasswordLinkMailRequestBody): Observable<Response> {
        const url = this.SERVER + `/send-reset-password-link-mail`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.post<Response>(url, requestBody, options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    checkResetPasswordLinkMail(requestBody: CheckResetPasswordLinkMailRequestBody): Observable<Response> {
        const url = this.SERVER + `/check-reset-password-link-mail`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.post<Response>(url, requestBody, options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    changePassword(requestBody: ChangePasswordRequestBody): Observable<User> {
        const url = this.SERVER + `/change-password`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.post<Response>(url, requestBody, options).pipe(
            map((res) => {
                const updatedUser: User = res.dataset[0]
                this.storageService.setUser(updatedUser)
                return updatedUser
            }),
            catchError(handleError)
        )
    }

    sendVerificationCodeMailChange(requestBody: SendVerificationCodeMailChangeRequestBody): Observable<Response> {
        const url = this.SERVER + `/send-verification-code-mail-change`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.post<Response>(url, requestBody, options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    checkVerificationCodeMailChange(requestBody: CheckVerificationCodeMailChangeRequestBody): Observable<Response> {
        const url = this.SERVER + `/check-verification-code-mail-change`

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.post<Response>(url, requestBody, options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    sendVerificationCodeSMSChange(requestBody: SendVerificationCodeSMSChangeRequestBody): Observable<Response> {
        const url = this.SERVER + '/send-verification-code-phone-number-change'

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.post<Response>(url, requestBody, options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }

    checkVerificationCodeSMSChange(requestBody: CheckVerificationCodeSMSChangeRequestBody): Observable<Response> {
        const url = this.SERVER + '/check-verification-code-phone-number-change'

        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        }

        return this.http.post<Response>(url, requestBody, options).pipe(
            map((res) => {
                return res
            }),
            catchError(handleError)
        )
    }
    // ---------------------------------------------------------------------------------//
    // checkPermission(permissions: Array<string>, permission: string): boolean {
    //     if (permissions.includes(permission)) {
    //         return true
    //     } else {
    //         return false
    //     }
    // }
}

export type SignInWithFirebaseRequestBody = {
    accessToken: string
}

export type SignInWithKakaoRequestBody = {
    accessToken: string
}

export type SignInWithEmailRequestBody = {
    email: string
    password: string
}

export type RefreshTokenRequestBody = {
    refresh_token: string
}

export type CheckDuplicateMailRequestBody = {
    email: string
}

export type SendVerificationCodeMailRequestBody = {
    email: string
}

export type CheckVerificationCodeMailRequestBody = {
    email: string
    verification_code: number
}

export type RegistrationRequestBody = {
    name: string
    email: string
    verification_code: number
    password: string
    privacy: boolean
    service_terms: boolean
    sms_marketing: boolean
    email_marketing: boolean
}

export type SendResetPasswordLinkMailRequestBody = {
    email: string
}
export type CheckResetPasswordLinkMailRequestBody = {
    token: string
}

export type ChangePasswordRequestBody = {
    token: string
    new_password: string
}

export type SendVerificationCodeMailChangeRequestBody = {
    email: string
}

export type CheckVerificationCodeMailChangeRequestBody = {
    verification_code: number
}

export type SendVerificationCodeSMSChangeRequestBody = {
    phone_number: string
}

export type CheckVerificationCodeSMSChangeRequestBody = {
    verification_code: number
}
