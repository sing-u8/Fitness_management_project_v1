import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import handleError from './handleError'
import { Response } from '@schemas/response'
import { environment } from '@environments/environment'

@Injectable({
    providedIn: 'root',
})
export class PaymentService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/payment`

    private options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    }

    constructor(private http: HttpClient) {}

    createPaymentData(reqBody: CreatePaymentDataReqBody): Observable<{ merchant_uid: string; amount: number }> {
        const url = this.SERVER
        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }

    validatePaymentDataAndSave(reqBody: ValidatePaymentDataAndSaveReqBody): Observable<{ amount: number }> {
        const url = this.SERVER + `/complete`
        return this.http.post<Response>(url, reqBody, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
}

export interface CreatePaymentDataReqBody {
    center_id: string
    product_type_code: 'import_payment_product_type_sms_point'
    amount: number
}
export interface ValidatePaymentDataAndSaveReqBody {
    imp_uid: string
    merchant_uid: string
}
