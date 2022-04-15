import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
    selector: 'rw-frequently-asked-questions',
    templateUrl: './frequently-asked-questions.component.html',
    styleUrls: ['./frequently-asked-questions.component.scss'],
})
export class FrequentlyAskedQuestionsComponent implements OnInit {
    constructor(private router: Router) {}

    ngOnInit(): void {}

    routerTo(url: string) {
        this.router.navigateByUrl(`/${url}`)
    }
}
