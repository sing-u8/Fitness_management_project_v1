import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnChanges } from '@angular/core'
import _ from 'lodash'
import dayjs from 'dayjs'

type SelectedDate = [string, string]

@Component({
    selector: 'msg-transmission-history-date-selector',
    templateUrl: './transmission-history-date-selector.component.html',
    styleUrls: ['./transmission-history-date-selector.component.scss'],
})
export class TransmissionHistoryDateSelectorComponent implements OnInit, AfterViewInit {
    @Input() selectedDate: SelectedDate
    @Output() onChangeDate = new EventEmitter<SelectedDate>()

    public isOpen: boolean
    public RangeDateData: { startDate: string; endDate: string }
    constructor() {}

    ngOnInit(): void {
        this.isOpen = false
        this.RangeDateData = { startDate: undefined, endDate: undefined }
    }
    ngAfterViewInit() {
        this.selectedDate[0] = _.split(this.selectedDate[0], '.').reduce((acc, str, idx) => {
            if (idx == 0) {
                return acc + str
            } else {
                return acc + '-' + str
            }
        }, '')
        this.selectedDate[1] = _.split(this.selectedDate[1], '.').reduce((acc, str, idx) => {
            if (idx == 0) {
                return acc + str
            } else {
                return acc + '-' + str
            }
        }, '')

        this.setRangeDateData(this.selectedDate[0], this.selectedDate[1])
    }

    toggle() {
        this.isOpen = !this.isOpen
    }
    close() {
        const _start = _.split(this.selectedDate[0], '.')
        const _end = _.split(this.selectedDate[1], '.')
        this.RangeDateData =
            _end.length < 1
                ? { startDate: _start[0] + '-' + _start[1] + '-' + _start[2], endDate: undefined }
                : {
                      startDate: _start[0] + '-' + _start[1] + '-' + _start[2],
                      endDate: _end[0] + '-' + _end[1] + '-' + _end[2],
                  }
        this.isOpen = false
    }

    setRangeDateData(startDate: string, endDate: string) {
        this.RangeDateData.startDate = startDate
        this.RangeDateData.endDate = endDate
    }
    applyRangeDateDate() {
        this.selectedDate = [
            dayjs(this.RangeDateData.startDate).format('YYYY.MM.DD'),
            dayjs(this.RangeDateData.endDate).format('YYYY.MM.DD') == 'Invalid Date'
                ? ''
                : dayjs(this.RangeDateData.endDate).format('YYYY.MM.DD'),
        ]
        this.onChangeDate.emit(this.selectedDate)
        this.isOpen = false
    }
}
