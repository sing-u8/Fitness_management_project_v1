import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'

@Component({
    selector: 'hp-header',
    templateUrl: './homepage-header.component.html',
    styleUrls: ['./homepage-header.component.scss'],
})
export class HomepageHeaderComponent implements OnInit, OnDestroy {
    public isMenuOpen = false
    public resizeListener: () => void

    public isMobileWidth = false

    constructor(private router: Router, private renderer: Renderer2) {}

    ngOnInit(): void {
        this.checkIsMobile(window.innerWidth)
        this.resizeListener = this.renderer.listen('window', 'resize', (event) => {
            if (event.target.innerWidth >= 960 && this.isMenuOpen) {
                this.isMenuOpen = false
            }
            this.checkIsMobile(event.target.innerWidth)
        })
    }
    ngOnDestroy(): void {
        this.resizeListener()
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
}
