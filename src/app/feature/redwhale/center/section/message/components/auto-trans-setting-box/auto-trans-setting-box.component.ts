import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { InputHelperService } from '@services/helper/input-helper.service'

import _ from 'lodash'

@Component({
    selector: 'msg-auto-trans-setting-box',
    templateUrl: './auto-trans-setting-box.component.html',
    styleUrls: ['./auto-trans-setting-box.component.scss'],
})
export class AutoTransSettingBoxComponent implements OnInit {
    @Input() autoTransmitTextObj: {
        settingTitle: string
        transType: string
    }
    @Input() autoTransmit = false
    @Input() autoTransmitDay = '7'
    @Input() autoTransmitTime = '10:00:00' // HH:mm:ss

    @Output() OnAutoTransmitChange = new EventEmitter<boolean>()
    @Output() OnAutoTransmitDayChange = new EventEmitter<string>()
    @Output() OnAutoTransmitTimeChange = new EventEmitter<string>()

    constructor(public inputhelperService: InputHelperService) {}
    ngOnInit(): void {}

    public checkBoxText = {
        on: '자동 전송 사용함',
        off: '자동 전송 사용 안 함',
    }
    onCheckBoxClick() {
        this.autoTransmit = !this.autoTransmit
        this.OnAutoTransmitChange.emit(this.autoTransmit)
    }

    // autoTransmitDay method
    updateAutoTransmitDayKeyUp(event) {
        if (event.code == 'Enter' || _.includes(event.code, 'Arrow')) return
        this.autoTransmitDay.replace(/[^0-9]/gi, '')
    }
    updateAutoTransmitDay() {
        this.OnAutoTransmitDayChange.emit(this.autoTransmitDay)
    }

    // autoTransmitTime method
    onAutoTransmitTimeClick(v: { key: string; name: string }) {
        this.autoTransmitTime = v.key
        this.OnAutoTransmitTimeChange.emit(this.autoTransmitTime)
    }
}
