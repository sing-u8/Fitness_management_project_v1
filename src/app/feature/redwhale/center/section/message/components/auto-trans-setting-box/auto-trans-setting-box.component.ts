import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core'

import { SMSAutoSend } from '@schemas/sms-auto-send'

import { InputHelperService } from '@services/helper/input-helper.service'

import _ from 'lodash'

import { Subject } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'

@Component({
    selector: 'msg-auto-trans-setting-box',
    templateUrl: './auto-trans-setting-box.component.html',
    styleUrls: ['./auto-trans-setting-box.component.scss'],
})
export class AutoTransSettingBoxComponent implements OnInit, OnDestroy {
    @Input() autoTransmitTextObj: {
        settingTitle: string
        transType: string
    }
    @Input() smsAutoSend: SMSAutoSend
    @Input() smsAutoSendDays: number
    @Input() guideText: string

    @Output() OnAutoTransmitChange = new EventEmitter<boolean>()
    @Output() OnAutoTransmitDayChange = new EventEmitter<string>()
    @Output() OnAutoTransmitTimeChange = new EventEmitter<string>()

    constructor(public inputhelperService: InputHelperService) {}
    ngOnInit(): void {}
    ngOnDestroy() {}

    public checkBoxText = {
        on: '자동 전송 사용함',
        off: '자동 전송 사용 안 함',
    }
    onCheckBoxClick() {
        this.smsAutoSend.auto_send_yn = !this.smsAutoSend.auto_send_yn
        this.OnAutoTransmitChange.emit(this.smsAutoSend.auto_send_yn)
    }

    // autoTransmitDay method
    updateAutoTransmitDayKeyUp(event) {
        if (event.code == 'Enter' || _.includes(event.code, 'Arrow')) return
        String(this.smsAutoSend.days).replace(/[^0-9]/gi, '')
    }
    updateAutoTransmitDay() {
        if (!this.isInputFocused) return
        this.isInputFocused = false
        this.OnAutoTransmitDayChange.emit(String(this.smsAutoSendDays))
    }

    // autoTransmitTime method
    onAutoTransmitTimeClick(v: { key: string; name: string }) {
        this.smsAutoSend.time = v.key
        this.OnAutoTransmitTimeChange.emit(this.smsAutoSend.time)
    }

    // isInputFocused
    public isInputFocused = false
    onFocus() {
        this.isInputFocused = true
    }
}
