import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import handleError from './handleError'

import { environment } from '@environments/environment'

import { StatsSales } from '@schemas/stats-sales'
import { StatsSalesSummary } from '@schemas/stats-sales-summary'
import { Response } from '@schemas/response'
import _ from 'lodash'

@Injectable({
    providedIn: 'root',
})
export class CenterStatsService {
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/center`

    constructor(private http: HttpClient) {}

    /**
     *
     * @param centerId 'string'
     * @param date 'yyyy-MM'
     * @param option
     * @returns
     */
    getStatsSales(
        centerId: string,
        start_date: string,
        end_date: string,
        option?: getStatsSaleOption
    ): Observable<Array<StatsSales>> {
        let url = this.SERVER + `/${centerId}/stats/sales` + `?start_date=${start_date}&end_date=${end_date}`

        if (!_.isEmpty(option) && _.keys(option).length > 0) {
            _.forIn(option, (v, k) => {
                url += `&${k}=${encodeURIComponent(v)}`
            })
        }

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
    getStatsSalesSummary(centerId: string): Observable<StatsSalesSummary> {
        const url = this.SERVER + `/${centerId}/stats/sales_summary`

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
}

export type GetStatsSalesTypeCode = 'payment_type_payment' | 'payment_type_refund' | 'payment_type_transfer'
export type GetStatsProductTypeCode = 'user_membership' | 'user_locker'
export type getStatsSaleOption = {
    type_code?: GetStatsSalesTypeCode
    center_user_name?: string
    product_type_code?: GetStatsProductTypeCode
    product_name?: string
    responsibility_center_user_name?: string
}
