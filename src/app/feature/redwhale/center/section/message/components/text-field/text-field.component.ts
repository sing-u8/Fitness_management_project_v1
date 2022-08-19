import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'msg-text-field',
    templateUrl: './text-field.component.html',
    styleUrls: ['./text-field.component.scss'],
})
export class TextFieldComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}

    public phoneNumberItems = [
        { number: '010-1234-5678', value: { id: 1 }, verified: true },
        { number: '010-1234-5678', value: { id: 2 }, verified: false },
        { number: '010-1234-5678', value: { id: 3 }, verified: true },
    ]
    public selectedPhoneNumberItem = {
        number: '010-1234-5678',
        value: { id: 1 },
        verified: true,
    }
}
