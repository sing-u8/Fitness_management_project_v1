import { Component } from '@angular/core'
import { Router } from '@angular/router'

@Component({
    selector: 'rw-auth-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
    constructor(private router: Router) {}

    goRouterLink(link: string) {
        this.router.navigateByUrl(link)
    }
}
