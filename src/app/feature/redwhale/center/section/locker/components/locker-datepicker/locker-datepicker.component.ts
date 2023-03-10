import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    AfterViewChecked,
    AfterViewInit,
    NgZone,
    ViewChild,
    ElementRef,
    Renderer2,
} from '@angular/core'
import moment from 'moment-timezone'

@Component({
    selector: 'rw-locker-datepicker',
    templateUrl: './locker-datepicker.component.html',
    styleUrls: ['./locker-datepicker.component.scss'],
})
export class LockerDatepickerComponent implements OnInit, OnChanges, AfterViewChecked, AfterViewInit {
    @Input() isShadow = true
    @Input() mode: 'date' | 'week' | 'multi' | 'multiline'
    @Input() data: any
    @Input() option: 'normal' | 'register' | 'extend'
    @Input() width: string
    @Output() dataChange = new EventEmitter<any>()

    @ViewChild('multiline_datepicker') multiline_datepicker: ElementRef

    month: string
    today: moment.Moment
    currentDate: moment.Moment
    weekRows: any

    // date
    selectedDate: string
    selectedDateIndex: any

    // week
    weekNumbers
    selectedWeek
    selectedWeekIndex: number

    // multi
    selectedDateObj: any
    // multiline and   reg-ml : register-membership-locker datepicker
    lineSelectedDateObj: { startDate: string; endDate: string }

    changed
    afterViewCheckedDate
    afterViewCheckedStartDate

    constructor(private zone: NgZone, private renderer: Renderer2) {
        this.selectedDate = ''
        this.selectedDateIndex = {
            i: -1,
            j: -1,
        }

        this.selectedDateObj = {}
        this.lineSelectedDateObj = { startDate: '', endDate: '' }
    }

    ngOnInit(): void {
        this.option = this.option ?? 'normal'
        this.today = moment()
        if (this.mode == 'date' && this.data.date) {
            this.currentDate = moment(this.data.date)
        } else if (this.mode == 'week' && this.data.startDate) {
            this.currentDate = moment(this.data.startDate)
        } else if (this.mode == 'multiline' && this.data.startDate) {
            this.multiLineSelectDate({ date: this.data?.startDate })
            this.multiLineSelectDate({ date: this.data?.endDate })
            this.currentDate = this.data?.endDate
                ? moment(this.data?.endDate)
                : this.data?.startDate
                ? moment(this.data?.startDate)
                : moment()
        } else {
            this.currentDate = moment()
        }
        this.month = this.currentDate.clone().format('YYYY년 MM월')
        this.getDays(this.currentDate)
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('data') && !changes['data']['firstChange']) {
            this.changed = true
            this.getDays(this.currentDate)
        }
    }
    ngAfterViewInit() {
        if (this.width) {
            const paddingSide = (Number(this.width) - 255) / 2 + 10
            this.renderer.setStyle(this.multiline_datepicker.nativeElement, 'width', `${this.width}px`)
            this.renderer.setStyle(this.multiline_datepicker.nativeElement, 'padding', `10px ${paddingSide}px`)
        }
    }
    ngAfterViewChecked() {
        if (this.mode == 'date' && this.afterViewCheckedDate != this.data.date) {
            this.afterViewCheckedDate = this.data.date
            if (this.changed) {
                this.changed = false
            } else {
                this.changed = false
                this.selectedDate = ''
                this.zone.runOutsideAngular(() => {
                    setTimeout(() => {
                        this.currentDate = moment(this.data.date)
                        this.month = this.currentDate.clone().format('YYYY년 MM월')
                        this.getDays(this.currentDate)
                    }, 1)
                })
            }
        } else if (this.mode == 'week' && this.afterViewCheckedStartDate != this.data.startDate) {
            this.afterViewCheckedStartDate = this.data.startDate
            if (this.changed) {
                this.changed = false
            } else {
                this.changed = false
                this.zone.runOutsideAngular(() => {
                    setTimeout(() => {
                        this.currentDate = moment(this.data.startDate)
                        this.month = this.currentDate.clone().format('YYYY년 MM월')
                        this.getDays(this.currentDate)
                    }, 1)
                })
            }
        }
    }

    getDays(currentDate: moment.Moment) {
        const firstWeek = currentDate.clone().startOf('month').week()
        const lastWeek =
            currentDate.clone().endOf('month').week() === 1 ? 53 : currentDate.clone().endOf('month').week()

        this.weekRows = []
        this.weekNumbers = []
        for (let week = firstWeek; week <= lastWeek; week++) {
            const weekRow = []

            let weekNumber = week % 52
            weekNumber = weekNumber == 0 ? 52 : weekNumber
            this.weekNumbers.push(weekNumber)

            for (let index = 0; index < 7; index++) {
                const date = currentDate.clone().startOf('year').week(week).startOf('week').add(index, 'day')
                const weekCol = {
                    day: date.format('D'),
                    week: weekNumber,
                    month: date.format('MM'),
                    year: date.format('YYYY'),
                    date: date.format('YYYY-MM-DD'),
                    selected: false,
                }

                if (date.format('YYYYMMDD') == this.today.format('YYYYMMDD')) {
                    weekCol['color'] = 'rgb(51, 102, 255)'
                } else if (date.format('MM') != currentDate.format('MM')) {
                    weekCol['color'] = 'rgb(207, 207, 207)'
                } else {
                    weekCol['color'] = 'rgb(96, 96, 96)'
                }

                if (this.mode == 'date') {
                    this.checkSelectedDate({ date: date, weekCol: weekCol, weekColIndex: index })
                } else if (this.mode == 'multi' && this.data.length > 0) {
                    if (this.data.includes(weekCol.date)) {
                        this.selectedDateObj[weekCol.date] = true
                    }
                }

                weekRow.push(weekCol)
            }

            this.weekRows.push(weekRow)
        }

        if (this.weekRows.length == 5) {
            const weekRow = []

            let weekNumber = (lastWeek + 1) % 52
            weekNumber = weekNumber == 0 ? 52 : weekNumber
            this.weekNumbers.push(weekNumber)

            for (let index = 7; index < 14; index++) {
                const date = currentDate.clone().startOf('year').week(lastWeek).startOf('week').add(index, 'day')
                const weekCol = {
                    day: date.format('D'),
                    week: weekNumber,
                    month: date.format('MM'),
                    year: date.format('YYYY'),
                    date: date.format('YYYY-MM-DD'),
                    color: 'rgb(228, 233, 242)',
                    selected: false,
                }

                if (this.mode == 'date') {
                    this.checkSelectedDate({ date: date, weekCol: weekCol, weekColIndex: index % 7 })
                } else if (this.mode == 'multi' && this.data.length > 0) {
                    if (this.data.includes(weekCol.date)) {
                        this.selectedDateObj[weekCol.date] = true
                    }
                }

                weekRow.push(weekCol)
            }

            this.weekRows.push(weekRow)
        }

        if (this.mode == 'week') {
            this.checkSelectedWeek()
        }
    }

    previousMonth() {
        this.currentDate = this.currentDate.clone().subtract(1, 'month')
        this.month = this.currentDate.clone().format('YYYY년 MM월')
        this.getDays(this.currentDate)
    }

    nextMonth() {
        this.currentDate = this.currentDate.clone().add(1, 'month')
        this.month = this.currentDate.clone().format('YYYY년 MM월')
        this.getDays(this.currentDate)
    }

    previousYear() {
        this.currentDate = this.currentDate.clone().subtract(1, 'year')
        this.month = this.currentDate.clone().format('YYYY년 MM월')
        this.getDays(this.currentDate)
    }

    nextYear() {
        this.currentDate = this.currentDate.clone().add(1, 'year')
        this.month = this.currentDate.clone().format('YYYY년 MM월')
        this.getDays(this.currentDate)
    }

    selectDate(i, j) {
        if (this.selectedDate) {
            this.weekRows[this.selectedDateIndex['i']][this.selectedDateIndex['j']]['selected'] = false
        }

        this.weekRows[i][j]['selected'] = true
        this.selectedDate = this.weekRows[i][j]['date']
        this.selectedDateIndex = {
            i: i,
            j: j,
        }

        this.dataChange.emit({ date: this.selectedDate })

        const selectedYearMonth = moment(this.selectedDate).format('YYYY-MM')
        if (selectedYearMonth < this.currentDate.format('YYYY-MM')) {
            this.previousMonth()
        } else if (this.currentDate.format('YYYY-MM') < selectedYearMonth) {
            this.nextMonth()
        }
    }

    checkSelectedDate({ date, weekCol, weekColIndex }) {
        if (this.data.date) {
            if (date.format('YYYY-MM-DD') == this.data.date) {
                this.selectedDate = this.data.date
                weekCol['selected'] = true
                this.selectedDateIndex = {
                    i: this.weekRows.length,
                    j: weekColIndex,
                }
            }
        } else if (this.selectedDate) {
            if (date.format('YYYY-MM-DD') == this.selectedDate) {
                weekCol['selected'] = true
                this.selectedDateIndex = {
                    i: this.weekRows.length,
                    j: weekColIndex,
                }
            }
        }
    }

    selectWeek(i) {
        const startDate = this.weekRows[i][0]['date']
        const endDate = this.weekRows[i][6]['date']

        const week = moment(startDate).week()
        this.selectedWeek = week

        this.dataChange.emit({ startDate: startDate, endDate: endDate })
    }

    checkSelectedWeek() {
        if (this.data.startDate) {
            const week = moment(this.data.startDate).week()
            this.selectedWeek = week
        }
    }

    multiSelectDate(weekCol) {
        this.selectedDateObj[weekCol.date] = !this.selectedDateObj[weekCol.date]
        const selectedDateList = Object.keys(this.selectedDateObj).filter((key) => {
            return this.selectedDateObj[key]
        })

        this.dataChange.emit(selectedDateList)
    }

    // ------------------ multi line methods -----------------------------------------------------------------------------------
    multiLineSelectDate(weekCol) {
        this.toggleEdge(weekCol) == false ? this.setInitialLineDate(weekCol) : null
        this.dataChange.emit(this.lineSelectedDateObj)
    }
    // helper
    setInitialLineDate(weekCol) {
        switch (this.option) {
            case 'normal':
                this.initNormalDateweekCol(weekCol)
                break
            case 'register':
                this.initRegisterDate(weekCol)
                break
            case 'extend':
                this.initExtendDate(weekCol)
                break
        }
    }
    // initlineDate methods for each type -->
    initNormalDateweekCol(weekCol) {
        if (!this.lineSelectedDateObj.startDate) {
            this.lineSelectedDateObj.startDate = weekCol.date
        } else if (!this.lineSelectedDateObj.endDate) {
            if (moment(weekCol.date).isSameOrBefore(this.lineSelectedDateObj.startDate, 'day')) {
                this.lineSelectedDateObj.startDate = weekCol.date
            } else {
                this.lineSelectedDateObj.endDate = weekCol.date
            }
        } else if (this.lineSelectedDateObj.startDate && this.lineSelectedDateObj.endDate) {
            this.lineSelectedDateObj.startDate = moment(weekCol.date).isBefore(
                this.lineSelectedDateObj.startDate,
                'day'
            )
                ? weekCol.date
                : this.lineSelectedDateObj.startDate
            this.lineSelectedDateObj.endDate =
                moment(weekCol.date).isAfter(this.lineSelectedDateObj.endDate, 'day') || this.isBetween(weekCol)
                    ? weekCol.date
                    : this.lineSelectedDateObj.endDate
        }
    }
    initRegisterDate(weekCol) {
        // 초기 시작일 설정을 수정해야할 수도 있음
        if (this.lineSelectedDateObj.startDate && moment(weekCol.date).isBefore(moment().format('YYYY-MM-DD'), 'day'))
            return
        if (!this.lineSelectedDateObj.startDate) {
            this.lineSelectedDateObj.startDate = moment().format('YYYY-MM-DD')
        } else {
            this.lineSelectedDateObj.endDate = weekCol.date
        }

        // this.initNormalDateweekCol(weekCol)
    }
    initExtendDate(weekCol) {
        if (
            this.lineSelectedDateObj.startDate &&
            moment(weekCol.date).isBefore(moment().format(this.lineSelectedDateObj.startDate), 'day')
        )
            return
        if (!this.lineSelectedDateObj.startDate) {
            this.lineSelectedDateObj.startDate = weekCol.date
        } else {
            this.lineSelectedDateObj.endDate = weekCol.date
        }
    }

    // <-- initlineDate methods for each type

    toggleEdge(weekCol): boolean {
        let isToggled = false
        if (
            this.lineSelectedDateObj.startDate &&
            moment(weekCol.date).isSame(this.lineSelectedDateObj.startDate, 'day') &&
            this.option == 'normal'
        ) {
            this.lineSelectedDateObj.startDate = ''
            isToggled = true
        } else if (
            this.lineSelectedDateObj.endDate &&
            moment(weekCol.date).isSame(this.lineSelectedDateObj.endDate, 'day')
        ) {
            this.lineSelectedDateObj.endDate = ''
            isToggled = true
        }
        return isToggled
    }

    // deprecated 메세지가 나타났음 - 나중에 수정하기 !
    isEdgeDate(weekCol) {
        return this.lineSelectedDateObj.startDate == weekCol.date || this.lineSelectedDateObj.endDate == weekCol.date
            ? true
            : false
    }
    isStartDate(weekCol) {
        return this.lineSelectedDateObj.startDate == weekCol.date ? true : false
    }
    isEndDate(weekCol) {
        return this.lineSelectedDateObj.endDate == weekCol.date ? true : false
    }
    isSameDate(weekCol) {
        return weekCol.date == this.lineSelectedDateObj.startDate && weekCol.date == this.lineSelectedDateObj.endDate
    }
    isBetween(weekCol) {
        return moment(weekCol.date).isBetween(this.lineSelectedDateObj.startDate, this.lineSelectedDateObj.endDate)
            ? true
            : false
    }
    getDayFromStartDate(weekCol) {
        if (this.lineSelectedDateObj.startDate) {
            const startDate = moment(this.lineSelectedDateObj.startDate)
            const targetDate = moment(weekCol.date)
            // return targetDate.diff(startDate, 'days')
            return targetDate.diff(startDate, 'days') + 1
        }
        return 0
    }
    pastDisable(weekCol) {
        return !this.lineSelectedDateObj.startDate ||
            moment(weekCol.date).isSameOrBefore(this.lineSelectedDateObj.startDate)
            ? true
            : false
    }
    isAvailableDate(weekCol) {
        switch (this.option) {
            case 'normal':
                return true
            case 'register':
                return !moment(weekCol.date).isBefore(moment().format('YYYY-MM-DD'), 'day')
            case 'extend':
                return !moment(weekCol.date).isBefore(moment().format(this.lineSelectedDateObj.startDate), 'day')
            default:
                return false
        }
    }
}
