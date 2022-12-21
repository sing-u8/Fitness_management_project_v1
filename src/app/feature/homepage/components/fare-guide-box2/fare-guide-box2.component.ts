import { Component, OnInit, Input } from '@angular/core'

export type DataType = {
    top: {
        title: string
        desc: string
    }
    middle: {
        discountText: string
        originalPrice: string
        price: string
        desc: string
    }
    bottom: { left: string; right: string }[]
    highlight?: string
}

@Component({
    selector: 'hp-fare-guide-box2',
    templateUrl: './fare-guide-box2.component.html',
    styleUrls: ['./fare-guide-box2.component.scss'],
})
export class FareGuideBox2Component implements OnInit {
    @Input() data: DataType

    constructor() {}

    ngOnInit(): void {}
}
