import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
    selector: 'hp-homepage-footer',
    templateUrl: './homepage-footer.component.html',
    styleUrls: ['./homepage-footer.component.scss'],
})
export class HomepageFooterComponent implements OnInit {
    constructor(private router: Router) {}

    ngOnInit(): void {}

    routeTo(url: string) {
        this.router.navigateByUrl(`/${url}`)
    }
}
