import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core'
import { Router, NavigationStart, Event, NavigationEnd } from '@angular/router'
import { Location } from '@angular/common'
import { DeviceDetectorService } from 'ngx-device-detector'

import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { DeeplinkService } from '@services/deeplink.service'

@Component({
    selector: 'hp-header',
    templateUrl: './homepage-header.component.html',
    styleUrls: ['./homepage-header.component.scss'],
})
export class HomepageHeaderComponent implements OnInit, OnDestroy {
    public isMenuOpen = false
    public resizeListener: () => void

    public isMobileWidth = false

    public unSubscriber$ = new Subject<boolean>()

    constructor(
        private router: Router,
        private renderer: Renderer2,
        private deviceDetector: DeviceDetectorService,
        private deeplink: DeeplinkService,
        private location: Location
    ) {}

    ngOnInit(): void {
        this.checkIsMobile(window.innerWidth)
        this.resizeListener = this.renderer.listen('window', 'resize', (event) => {
            if (event.target.innerWidth >= 960 && this.isMenuOpen) {
                this.isMenuOpen = false
            }
            this.checkIsMobile(event.target.innerWidth)
        })

        this.setRemoveHeaderFlag(this.router.url)

        this.router.events.pipe(takeUntil(this.unSubscriber$)).subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                this.setRemoveHeaderFlag(event.url)
            }
        })
    }
    ngOnDestroy(): void {
        this.resizeListener()
        this.unSubscriber$.next(true)
        this.unSubscriber$.complete()
    }

    navigateTo(url: string) {
        this.router.navigateByUrl(url)
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen
    }

    checkIsMobile(width) {
        if (width >= 768 && this.isMobileWidth) {
            this.isMobileWidth = false
        } else if (width < 768 && !this.isMobileWidth) {
            this.isMobileWidth = true
        }
    }

    public faqFlag = false
    toggleFaqFlag() {
        this.faqFlag = !this.faqFlag
    }

    // ----------  free start modal ---------------//
    public isFreeStartModalVisible = false
    toggleFreeStartModalVisible() {
        if (this.deviceDetector.isDesktop()) {
            this.router.navigateByUrl('/auth/login')
        } else {
            this.isFreeStartModalVisible = !this.isFreeStartModalVisible
        }
    }
    onFreeStartCancel() {
        this.isFreeStartModalVisible = false
    }

    public removeHeaderFlag = false
    setRemoveHeaderFlag(url: string) {
        this.removeHeaderFlag = (url == '/terms-privacy' || url == '/terms-eula') && this.deeplink.isMobile()
    }

    public win
    public storageId = 'openwindowId'
    closeWindow() {
        console.log(
            'close window : ',
            this.router.url,
            this.location.path(),
            window.location.origin,
            window.location.href
        )
        // setTimeout(() => {
        //     // top.window.open(window.location.href, '_self').close()
        //     top.window.opener = self
        //     top.self.close()
        // }, 500)
        // const wdId = `new_window_${this.location}`
        // localStorage.setItem(this.storageId, wdId)
        const wd = window.open(window.location.href, '_self')
        wd.close()
        window.close()
        // window.open('', '_self').close()
    }

    //
    openUri(uri: string) {
        window.open(uri)
    }
}
