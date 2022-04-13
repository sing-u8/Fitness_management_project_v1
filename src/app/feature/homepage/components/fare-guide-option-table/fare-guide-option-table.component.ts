import { Component, OnInit, Input } from '@angular/core'

export type TableInputType = {
    header: {
        one: string
        two: string
        three: string
    }
    bodyItems: { one: string; two: boolean; three: boolean; subText?: string }[]
}

@Component({
    selector: 'hp-fare-guide-option-table',
    templateUrl: './fare-guide-option-table.component.html',
    styleUrls: ['./fare-guide-option-table.component.scss'],
})
export class FareGuideOptionTableComponent implements OnInit {
    @Input() data: TableInputType

    constructor() {}

    ngOnInit(): void {}
}
