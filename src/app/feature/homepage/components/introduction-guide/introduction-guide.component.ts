import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'rw-introduction-guide',
    templateUrl: './introduction-guide.component.html',
    styleUrls: ['./introduction-guide.component.scss'],
})
export class IntroductionGuideComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}

    public uriForGoogleForm = 'https://forms.gle/cUznbtQzYngJ7TUg9'
    openUri(uri: string) {
        window.open(uri)
    }
}
