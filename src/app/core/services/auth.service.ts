import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'
import { StorageService } from '@services/storage.service'

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

    constructor(private http: HttpClient, private storageService: StorageService) {}

    checkPermission(permissions: Array<string>, permission: string): boolean {
        if (permissions.includes(permission)) {
            return true
        } else {
            return false
        }
    }

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
                return user
            }),
            catchError(handleError)
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
                const user: User = res.dataset[0]
                this.storageService.setUser(user)
                return user
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
        const url = this.SERVER + '/send-verification-code-sms-change'

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
        const url = this.SERVER + '/check-verification-code-sms-change'

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
}

class SignInWithFirebaseRequestBody {
    accessToken: string
}

class SignInWithKakaoRequestBody {
    accessToken: string
}

class SignInWithEmailRequestBody {
    email: string
    password: string
}

class CheckDuplicateMailRequestBody {
    email: string
}

class SendVerificationCodeMailRequestBody {
    email: string
}

class CheckVerificationCodeMailRequestBody {
    email: string
    verification_code: number
}

class RegistrationRequestBody {
    email: string
    verification_code: number
    password: string
    family_name?: string
    given_name: string
    terms_eula: number
    terms_privacy: number
    marketing_sms: number
    marketing_email: number
    unique_id?: string
    device_id?: string
}

class SendResetPasswordLinkMailRequestBody {
    email: string
}
class CheckResetPasswordLinkMailRequestBody {
    token: string
}

class ChangePasswordRequestBody {
    token: string
    new_password: string
    unique_id?: string
    device_id?: string
}

class SendVerificationCodeMailChangeRequestBody {
    email: string
}

class CheckVerificationCodeMailChangeRequestBody {
    verification_code: number
}

class SendVerificationCodeSMSChangeRequestBody {
    phone_number: string
    is_test?: boolean
}

class CheckVerificationCodeSMSChangeRequestBody {
    verification_code: number
}
