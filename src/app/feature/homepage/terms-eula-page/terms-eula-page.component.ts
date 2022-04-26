import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'hp-terms-eula-page',
    templateUrl: './terms-eula-page.component.html',
    styleUrls: ['./terms-eula-page.component.scss'],
})
export class TermsEulaPageComponent implements OnInit {
    constructor() {
        const h = document.getElementById('l-homepage')
        h.scrollTo({ top: 0 })
    }

    ngOnInit(): void {}
}
