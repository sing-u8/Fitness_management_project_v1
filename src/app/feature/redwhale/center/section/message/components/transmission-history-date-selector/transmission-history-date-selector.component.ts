import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'
import _ from 'lodash'
import dayjs from 'dayjs'

type SelectedDate = [string, string]

@Component({
    selector: 'msg-transmission-history-date-selector',
    templateUrl: './transmission-history-date-selector.component.html',
    styleUrls: ['./transmission-history-date-selector.component.scss'],
})
export class TransmissionHistoryDateSelectorComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() selectedDate: SelectedDate
    @Output() onChangeDate = new EventEmitter<SelectedDate>()

    public isOpen: boolean
    public RangeDateData: { startDate: string; endDate: string } = { startDate: '', endDate: '' }
    constructor() {}

    ngOnInit(): void {
        this.isOpen = false
        // this.RangeDateData = { startDate: undefined, endDate: undefined }
    }
    ngOnChanges(changes: SimpleChanges) {}

    ngAfterViewInit() {
        if (_.isArray(this.selectedDate)) {
            this.setRangeDateData(this.selectedDate[0], this.selectedDate[1])
        }
    }

    toggle() {
        this.isOpen = !this.isOpen
    }
    close() {
        this.RangeDateData = {
            startDate: this.selectedDate[0],
            endDate: this.selectedDate[1],
        }
        this.isOpen = false
    }

    setRangeDateData(startDate: string, endDate: string) {
        this.RangeDateData.startDate = startDate
        this.RangeDateData.endDate = endDate
        console.log('transmission history date selector : ', this.selectedDate, this.RangeDateData)
    }
    applyRangeDateDate() {
        this.selectedDate = [
            dayjs(this.RangeDateData.startDate).format('YYYY-MM-DD'),
            dayjs(this.RangeDateData.endDate).format('YYYY-MM-DD') == 'Invalid Date'
                ? ''
                : dayjs(this.RangeDateData.endDate).format('YYYY-MM-DD'),
        ]
        this.onChangeDate.emit(this.selectedDate)
        this.isOpen = false
    }
}
