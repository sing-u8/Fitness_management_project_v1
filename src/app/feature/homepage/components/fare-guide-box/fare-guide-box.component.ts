import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

export type InputType = {
    type: string
    price: string
    price_unit: string
    desc_title: string
    desc_element: {
        one: string
        two: string
    }
    button_name: string
}

@Component({
    selector: 'hp-fare-guide-box',
    templateUrl: './fare-guide-box.component.html',
    styleUrls: ['./fare-guide-box.component.scss'],
})
export class FareGuideBoxComponent implements OnInit {
    @Input() data: InputType
    @Output() onButtonClick = new EventEmitter<void>()
    constructor() {}

    ngOnInit(): void {}
}
