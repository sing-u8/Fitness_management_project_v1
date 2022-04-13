import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core'

@Component({
    selector: 'hp-free-start-footer',
    templateUrl: './free-start-footer.component.html',
    styleUrls: ['./free-start-footer.component.scss'],
})
export class FreeStartFooterComponent implements OnInit {
    @Output() onFreeStartClick = new EventEmitter<void>()
    @Input() animation = false
    constructor() {}

    ngOnInit(): void {}
}
