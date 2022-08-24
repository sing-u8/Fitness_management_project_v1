import { Component, OnInit, Input } from '@angular/core'
import { SMSHistory } from '@schemas/sms-history'

@Component({
    selector: 'msg-transmission-history-item',
    templateUrl: './transmission-history-item.component.html',
    styleUrls: ['./transmission-history-item.component.scss'],
})
export class TransmissionHistoryItemComponent implements OnInit {
    @Input() smsHistory: SMSHistory
    @Input() index: number
    constructor() {}

    ngOnInit(): void {}
}
