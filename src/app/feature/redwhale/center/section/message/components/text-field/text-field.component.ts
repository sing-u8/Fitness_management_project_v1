import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { FormBuilder, FormControl } from '@angular/forms'
import { SMSCaller } from '@schemas/sms-caller'

import { WordService } from '@services/helper/word.service'
import _ from 'lodash'
import { Subscription } from 'rxjs'

@Component({
    selector: 'msg-text-field',
    templateUrl: './text-field.component.html',
    styleUrls: ['./text-field.component.scss'],
})
export class TextFieldComponent implements OnInit, OnDestroy {
    @Input() callerList: SMSCaller[] = []
    @Input() curCaller: SMSCaller = undefined
    @Input() text = ''
    @Input() textByte = 0
    @Input() errText = ''
    @Output() textChange = new EventEmitter<string>()
    @Output() onSelectChange = new EventEmitter<SMSCaller>()
    @Output() onAddNumber = new EventEmitter<void>()

    public textControl: FormControl = new FormControl(this.text)
    public unsubscriber: Subscription

    public textControl1: FormControl = new FormControl(this.text)
    public unsubscriber1: Subscription
    constructor(private wordService: WordService, private fb: FormBuilder) {
        // this.textControl = this.fb.control(this.text)
        this.unsubscriber = this.textControl.valueChanges.subscribe((v) => {
            console.log('textControl.valueChanges - v : ', v)
            this.matchTextTo(v)
            this.textChange.emit(this.textControl.value)
        })

        this.unsubscriber1 = this.textControl1.valueChanges.subscribe((v) => {
            console.log('textControl.valueChanges - v1 : ', v)
            // this.matchTextTo(v)
            // this.textChange.emit(this.textControl.value)
        })
    }

    ngOnInit(): void {
        this.textControl.setValue(this.text)
    }
    ngOnDestroy() {
        this.unsubscriber.unsubscribe()
        this.unsubscriber1.unsubscribe()
    }

    checkTextIsOver(event) {
        const code = event.which ? event.which : event.keyCode
        // 8: backspace, 37: <- , 39: ->, 13: enter, 9: tab
        return (
            code == 8 ||
            code == 39 ||
            code == 37 ||
            code == 38 ||
            code == 40 ||
            code == 13 ||
            code == 9 ||
            this.textByte <= 2000
        )
    }
    onTextChange(text: string) {
        console.log('onTextChange : ', text, ' - ', this.textControl.value)
        this.matchTextTo(text)
        this.textChange.emit(this.textControl.value)
    }
    matchTextTo(text: string, byte = 2000) {
        let _textByte = this.wordService.getTextByte(text)
        let textCopy = _.clone(text)
        let textLength = textCopy.length
        if (_textByte > byte) {
            while (_textByte > byte) {
                textLength--
                textCopy = _.clone(textCopy.slice(0, textLength))
                _textByte = this.wordService.getTextByte(textCopy)
                // this.text = textCopy
            }
            this.textControl.setValue(textCopy)
            // _.findLast(this.text, (v, i) => {})
        }
    }
}
