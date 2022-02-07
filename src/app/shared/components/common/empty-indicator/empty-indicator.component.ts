import { Component, OnInit, Input } from '@angular/core'

@Component({
    selector: 'rw-empty-indicator',
    templateUrl: './empty-indicator.component.html',
    styleUrls: ['./empty-indicator.component.scss'],
})
export class EmptyIndicatorComponent implements OnInit {
    @Input('textList') textListProp: Array<string>

    constructor() {}

    ngOnInit(): void {}
}
