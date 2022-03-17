import { Component, OnInit, Output, EventEmitter } from '@angular/core'

@Component({
    selector: 'hp-free-start-footer',
    templateUrl: './free-start-footer.component.html',
    styleUrls: ['./free-start-footer.component.scss'],
})
export class FreeStartFooterComponent implements OnInit {
    @Output() onFreeStartClick = new EventEmitter<void>()
    constructor() {}

    ngOnInit(): void {}
}
