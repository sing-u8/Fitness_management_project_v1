import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
    selector: 'hp-header',
    templateUrl: './homepage-header.component.html',
    styleUrls: ['./homepage-header.component.scss'],
})
export class HomepageHeaderComponent implements OnInit {
    constructor(private router: Router) {}

    ngOnInit(): void {}

    navigateTo(url: string) {
        this.router.navigateByUrl(url)
    }
}
