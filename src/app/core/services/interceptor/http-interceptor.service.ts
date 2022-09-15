import { Injectable } from '@angular/core'
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'
import { Observable } from 'rxjs'

import { environment } from '@environments/environment'
import { StorageService } from '@services/storage.service'

@Injectable({
    providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
    constructor(private storageService: StorageService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const url = `${environment.protocol}${environment.subDomain}${environment.domain}${environment.port}`
        if (req.url.indexOf(url) == 0) {
            let accessToken = 'none'
            const user = this.storageService.getUser()
            if (user) {
                accessToken = user.access_token
            }

            const request: HttpRequest<any> = req.clone({
                setHeaders: {
                    Authorization: 'Bearer' + ' ' + accessToken,
                },
            })

            return next.handle(request)
        } else {
            return next.handle(req)
        }
    }
}
