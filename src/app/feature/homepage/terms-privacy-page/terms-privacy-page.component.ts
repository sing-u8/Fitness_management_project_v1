import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'hp-terms-privacy-page',
    templateUrl: './terms-privacy-page.component.html',
    styleUrls: ['./terms-privacy-page.component.scss'],
})
export class TermsPrivacyPageComponent implements OnInit {
    constructor() {
        const h = document.getElementById('l-homepage')
        h.scrollTo({ top: 0 })
    }

    ngOnInit(): void {}

    openKoplco() {
        window.open('https://kopico.go.kr/main/main.do')
    }
    openPrivacy() {
        window.open('https://privacy.klsa.or.kr')
    }
    openSpo() {
        window.open('https://spo.go.kr')
    }
    openCyberbureau() {
        window.open('https://cyberbureau.police.go.kr')
    }
}
