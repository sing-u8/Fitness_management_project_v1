import { Component, OnInit, Input } from '@angular/core'

@Component({
    selector: 'rw-intro-guide-toast',
    templateUrl: './intro-guide-toast.component.html',
    styleUrls: ['./intro-guide-toast.component.scss'],
})
export class IntroGuideToastComponent implements OnInit {
    @Input() isOpen = false
    constructor() {}

    ngOnInit(): void {}
}
