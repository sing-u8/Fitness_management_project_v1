import { Injectable } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'

import { DeviceDetectorService } from 'ngx-device-detector'

@Injectable({
    providedIn: 'root',
})
export class DeeplinkService {
    private defaultURI = `https://redwhale.xyz/`
    private defaultQuery = `&apn=xyz.redwhale.m&isi=1532693624&ibi=xyz.redwhale.m` // ! not used now

    constructor(
        private deviceService: DeviceDetectorService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {}

    isDeeplinkingAvailable(): boolean {
        if (!this.deviceService.isMobile() || window.location.pathname == '/') return false
        return true
    }
    isMobile(): boolean {
        return this.deviceService.isMobile()
    }

    launchAppWhenInMobile(query?: string): void {
        if (!this.isDeeplinkingAvailable()) return null
        if (this.filterLink()) {
            return null
        }

        let replacedUrl = this.defaultURI
        replacedUrl += `?link=${window.location.href}${this.defaultQuery}`
        if (query) replacedUrl += `&${encodeURIComponent(query)}`

        // window.location.replace(replacedUrl)
    }

    // returnDeeplink(centerId: string): string {
    //     let replacedUrl = this.defaultURI
    //     replacedUrl += `?link=${window.location.href}${this.defaultQuery}`
    //     if (query) replacedUrl += `&${encodeURIComponent(query)}`
    //     return replacedUrl
    // }
    returnDeeplink(centerUrl: string): string {
        let replacedUrl = this.defaultURI
        replacedUrl += `${centerUrl}`
        return replacedUrl
    }

    onLoginWhenInMobile() {
        if (!this.isMobile()) return null
        window.location.replace(`${this.defaultURI}?link=${window.location.origin}/auth/login${this.defaultQuery}`)
    }

    // filter link function
    filterLink() {
        const urlList = window.location.href.split('/')
        console.log('filterLink : ', urlList, urlList.includes('auth'))
        if (urlList.includes('m.reset-password') || urlList.includes('auth')) {
            return true
        } else {
            return false
        }
    }
}
