import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
    selector: 'hp-find-more-button',
    templateUrl: './find-more-button.component.html',
    styleUrls: ['./find-more-button.component.scss'],
})
export class FindMoreButtonComponent implements OnInit {
    @Input() text = '기능 더 알아보기'
    @Input() maxWidth = '137px'
    @Input() whiteMode = false
    @Output() onClick = new EventEmitter<void>()
    constructor() {}

    ngOnInit(): void {}
}
