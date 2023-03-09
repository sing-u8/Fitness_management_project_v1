import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
    selector: 'rw-frequently-asked-questions',
    templateUrl: './frequently-asked-questions.component.html',
    styleUrls: ['./frequently-asked-questions.component.scss'],
})
export class FrequentlyAskedQuestionsComponent implements OnInit {
    constructor(private router: Router) {
        const h = document.getElementById('l-homepage')
        h.scrollTo({ top: 0 })
    }

    public kakaoUri = 'http://pf.kakao.com/_gCxiab'

    ngOnInit(): void {}

    routerTo(url: string) {
        this.router.navigateByUrl(`/${url}`)
    }
    openUri(uri: string) {
        window.open(uri)
    }
}
