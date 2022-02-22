import { Injectable } from '@angular/core'
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { CenterService } from '@services/center.service'

@Injectable({
    providedIn: 'root',
})
export class CenterGuard implements CanActivate {
    constructor(private router: Router, private gymService: CenterService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const address = route.params['address']
        return this.gymService.checkMemeber(address).pipe(
            map((res) => {
                return true
            }),
            catchError((error: any) => {
                this.router.navigateByUrl('/redwhale-home')
                return of(false)
            })
        )
    }
}
