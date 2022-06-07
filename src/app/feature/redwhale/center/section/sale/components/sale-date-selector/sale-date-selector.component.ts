import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnChanges } from '@angular/core'
import _ from 'lodash'
import dayjs from 'dayjs'

import * as FromSale from '@centerStore/reducers/sec.sale.reducer'

@Component({
    selector: 'rw-sale-date-selector',
    templateUrl: './sale-date-selector.component.html',
    styleUrls: ['./sale-date-selector.component.scss'],
})

// 변경 될 떄  토스트 생성하기 !
export class SaleDateSelectorComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() selectedDate: FromSale.SelectedDate
    @Output() onChangeDate = new EventEmitter<FromSale.SelectedDate>()

    public isOpen: boolean
    public datePickType: DatePickType
    public monthDateData: { year: FromSale.DateType; month: FromSale.DateType }
    public RangeDateData: { startDate: FromSale.DateType; endDate: FromSale.DateType }
    constructor() {}

    ngOnInit(): void {
        this.isOpen = false
        this.monthDateData = undefined
        this.RangeDateData = { startDate: undefined, endDate: undefined }
    }
    ngAfterViewInit(): void {
        this.setDatePickType(this.selectedDate)
        if (_.isArray(this.selectedDate)) {
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
            this.setMonthDateData()
        } else if (_.isString(this.selectedDate)) {
            this.setMonthDateData(this.selectedDate as FromSale.DateType)
            this.setRangeDateData()
        }
    }
    ngOnChanges(): void {}

    toggle() {
        this.isOpen = !this.isOpen
    }
    close() {
        if (_.isArray(this.selectedDate)) {
            const _start = _.split(this.selectedDate[0], '.')
            const _end = _.split(this.selectedDate[1], '.')

            this.RangeDateData =
                _end.length < 1
                    ? { startDate: _start[0] + '-' + _start[1] + '-' + _start[2], endDate: undefined }
                    : {
                          startDate: _start[0] + '-' + _start[1] + '-' + _start[2],
                          endDate: _end[0] + '-' + _end[1] + '-' + _end[2],
                      }
        } else {
            this.RangeDateData = { startDate: undefined, endDate: undefined }
        }
        this.isOpen = false
    }

    changeDatePickType(type: DatePickType) {
        this.datePickType = type
    }

    setDatePickType(inputDate: FromSale.SelectedDate) {
        if (_.isArray(inputDate)) {
            this.datePickType = 'range'
        } else if (_.isString(inputDate)) {
            this.datePickType = 'month'
        }
    }

    setMonthDateData(inputDate?: FromSale.DateType) {
        if (!inputDate) {
            this.monthDateData = { year: dayjs().format('YYYY'), month: undefined }
            return
        }
        this.monthDateData = { year: dayjs(inputDate).format('YYYY'), month: dayjs(inputDate).format('MM') }
    }
    setMonthDateYear(input: 'next' | 'prev') {
        this.monthDateData.year =
            input == 'next' ? String(Number(this.monthDateData.year) + 1) : String(Number(this.monthDateData.year) - 1)
    }
    setMonthDateMonth(input: number) {
        this.monthDateData.month = String(input)
        this.selectedDate = dayjs(this.monthDateData.year + '-' + this.monthDateData.month).format('YYYY.MM')
        this.onChangeDate.emit(this.selectedDate)
    }
    checkSelectedMonthDate(inputMonth: number) {
        if (_.isArray(this.selectedDate)) {
            return false
        } else if (_.isString(this.selectedDate)) {
            return (
                (this.selectedDate as FromSale.DateType) ==
                dayjs(this.monthDateData.year + '-' + inputMonth).format('YYYY.MM')
            )
        } else {
            return false
        }
    }

    setRangeDateData(startDate?: FromSale.DateType, endDate?: FromSale.DateType) {
        this.RangeDateData.startDate = startDate ?? undefined
        this.RangeDateData.endDate = endDate ?? undefined
    }
    applyRangeDateDate() {
        this.selectedDate = [
            dayjs(this.RangeDateData.startDate).format('YYYY.MM.DD'),
            dayjs(this.RangeDateData.endDate).format('YYYY.MM.DD') == 'Invalid Date'
                ? ''
                : dayjs(this.RangeDateData.endDate).format('YYYY.MM.DD'),
        ]
        this.onChangeDate.emit(this.selectedDate)
        this.setMonthDateData()
        this.isOpen = false
    }
}

type DatePickType = 'month' | 'range'
