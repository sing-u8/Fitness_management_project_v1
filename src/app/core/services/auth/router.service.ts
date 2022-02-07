import { Injectable } from '@angular/core'
import { NavigationStart, Router } from '@angular/router'
import { Observable, Subscription } from 'rxjs'

import { StorageService } from '@services/storage.service'

@Injectable({
    providedIn: 'root',
})
export class RouterService {
    constructor(private storageService: StorageService, private router: Router) {}

    initUserDataWhenPopstate(): Subscription {
        const user = this.storageService.getUser()
        if (user == null || (user != null && user.provider == 'redwhale.xyz')) {
            return new Observable(() => {
                // do nothing, just return subscription
            }).subscribe()
        } else {
            return this.router.events.subscribe(async (event: NavigationStart) => {
                if (event.navigationTrigger === 'popstate') {
                    await this.storageService.removeUser()
                    this.router.navigateByUrl('/auth/login')
                }
            })
        }
    }

    async backToLogin() {
        await this.storageService.removeUser()
        this.router.navigateByUrl('/auth/login')
    }
}
