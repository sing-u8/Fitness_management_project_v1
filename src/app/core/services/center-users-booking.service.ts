import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import handleError from './handleError'
import { environment } from '@environments/environment'
import { Response } from '@schemas/response'
import { Booking } from '@schemas/booking'

@Injectable({
    providedIn: 'root',
})
export class CenterUsersBookingService {
    constructor(private http: HttpClient) {}
    private SERVER = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}${environment.version}/center`

    private options = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    }

    // 예약 조회
    getBookings(centerId: string, userId: string, page?: number, pageSize?: number): Observable<Array<Booking>> {
        const url =
            this.SERVER +
            `/${centerId}/users/${userId}/booking` +
            (page ? `page=${page}&` : '') +
            (pageSize ? `pageSize=${pageSize}` : '')

        return this.http.get<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset
            }),
            catchError(handleError)
        )
    }

    // 예약 취소
    cancelBooking(centerId: string, userId: string, bookingId: string): Observable<Response> {
        const url = this.SERVER + `/${centerId}/users/${userId}/booking/${bookingId}`

        return this.http.delete<Response>(url, this.options).pipe(
            map((res) => {
                return res.dataset[0]
            }),
            catchError(handleError)
        )
    }
}
