import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
    selector: 'account-removed',
    templateUrl: './account-removed.component.html',
    styleUrls: ['./account-removed.component.scss'],
})
export class AccountRemovedComponent implements OnInit {
    constructor(private router: Router) {}

    ngOnInit(): void {}

    goRouterLink(url: string) {
        this.router.navigateByUrl(url)
    }
}
