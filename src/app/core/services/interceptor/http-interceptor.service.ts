import { Injectable } from '@angular/core'
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'
import { BehaviorSubject, Observable, throwError, of } from 'rxjs'
import { catchError, filter, switchMap, take } from 'rxjs/operators'

import { environment } from '@environments/environment'
import { StorageService } from '@services/storage.service'
import { AuthService } from '@services/auth.service'
import { ErrorObj } from '@schemas/error'

@Injectable({
    providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
    constructor(private storageService: StorageService, private authService: AuthService) {}

    private isRefreshing = false
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const url = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}`
        if (req.url.indexOf(url) == 0) {
            let accessToken = 'none'
            const user = this.storageService.getUser()
            if (user) {
                accessToken = user.access_token
            }
            const request: HttpRequest<any> = this.setTokenHeader(req, accessToken)
            return next.handle(request).pipe(
                catchError((err: ErrorObj) => {
                    if (err.status == 401) {
                        return this.handle401Error(req, next)
                    }
                    console.log('interceptor err : ', err)
                    return throwError(() => err)
                })
            )
        } else {
            return next.handle(req)
        }
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true
            this.refreshTokenSubject.next(null)

            const refreshToken = this.storageService.getUser().refresh_token
            console.log('handle 401 error -- refreshToken : ', refreshToken)
            if (refreshToken) {
                return this.authService.refreshToken({ refresh_token: refreshToken }).pipe(
                    switchMap((accessToken) => {
                        console.log('after refresh access token : ', accessToken)
                        this.isRefreshing = false
                        this.refreshTokenSubject.next(accessToken)
                        return next.handle(this.setTokenHeader(request, accessToken))
                    }),
                    catchError((err) => {
                        console.log('after refresh access token err : ', err)
                        this.isRefreshing = false
                        this.storageService.logout()
                        return throwError(err)
                    })
                )
            }
        }

        return this.refreshTokenSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((token) => next.handle(this.setTokenHeader(request, token)))
        )
    }

    private setTokenHeader(req: HttpRequest<any>, token: string) {
        return req.clone({
            setHeaders: {
                Authorization: 'Bearer' + ' ' + token,
            },
        })
    }
}
