import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { SMSCaller } from '@schemas/sms-caller'

@Component({
    selector: 'msg-text-field',
    templateUrl: './text-field.component.html',
    styleUrls: ['./text-field.component.scss'],
})
export class TextFieldComponent implements OnInit {
    @Input() callerList: SMSCaller[] = []
    @Input() text = ''
    @Input() textByte = 0
    @Output() textChange = new EventEmitter<string>()
    @Output() onSelectChange = new EventEmitter<SMSCaller>()
    constructor() {}

    ngOnInit(): void {}

    public selectedPhoneNumberItem: SMSCaller = undefined
}
