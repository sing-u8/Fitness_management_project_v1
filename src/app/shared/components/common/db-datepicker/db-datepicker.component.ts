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
import _ from 'lodash'

// 멀티 라인일 떄 현재 날짜 이전은 선택 불가 기능 추가하기
@Component({
    selector: 'db-datepicker',
    templateUrl: './db-datepicker.component.html',
    styleUrls: ['./db-datepicker.component.scss'],
})
export class DbDatepickerComponent implements OnInit, OnChanges, AfterViewChecked, AfterViewInit {
    @Input() isShadow = true
    @Input() mode: 'date' | 'week' | 'multiline' | 'multi' | 'multiline-component' | 'reg-ml' | 'holding'
    @Input() option:
        | 'normal'
        | 'register'
        | 'extend' /* only multiline until this line*/
        | 'onlyStart'
        | 'onlyEnd'
        | 'looseOnlyStart'
        | 'limitLooseOnlyEnd'
        | 'looseOnlyEnd' /* only reg-ml until this line*/
        | 'holdStart' /* only hold */
        | 'holdEnd'
    @Input() width: string
    @Input() height: string

    @Input() data: any
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
    // multiline and reg-ml[register-membership-locker datepicker] and holding
    lineSelectedDateObj: { startDate: string; endDate: string }

    changed
    afterViewCheckedDate
    afterViewCheckedStartDate

    constructor(private zone: NgZone, private renderer: Renderer2) {
        this.mode = 'date'
        this.selectedDate = ''
        this.selectedDateIndex = {
            i: -1,
            j: -1,
        }

        this.selectedDateObj = {}
        this.lineSelectedDateObj = { startDate: '', endDate: '' }
    }

    setDatePick() {
        this.today = moment()
        if (this.mode == 'date' && this.data.date) {
            this.currentDate = moment(this.data.date)
        } else if (this.mode == 'week' && this.data.startDate) {
            this.currentDate = moment(this.data.startDate)
        } else if (this.mode == 'multiline' || this.mode == 'multiline-component') {
            this.multiLineSelectDate({ date: this.data?.startDate })
            this.multiLineSelectDate({ date: this.data?.endDate })
            this.currentDate = this.data?.endDate
                ? moment(this.data?.endDate)
                : this.data?.startDate
                ? moment(this.data?.startDate)
                : moment()
        } else if (this.mode == 'reg-ml') {
            if (this.option == 'onlyStart' || this.option == 'looseOnlyStart') {
                this.regMLSelectDate({ date: this.data.startDate })
            } else if (this.option == 'onlyEnd' || this.option == 'looseOnlyEnd') {
                this.regMLSelectDate({ date: this.data.startDate })
                this.regMLSelectDate({ date: this.data.endDate })
            } else if (this.option == 'limitLooseOnlyEnd') {
                this.regMLSelectDate({ date: this.data.startDate })
                this.regMLSelectDate({ date: this.data.endDate })
            }
            this.currentDate = this.data?.endDate
                ? moment(this.data?.endDate)
                : this.data?.startDate
                ? moment(this.data?.startDate)
                : moment()
        } else if (this.mode == 'holding') {
            if (this.option == 'holdStart') {
                this.holdingMLSelectDate({ date: this.data.startDate })
            } else if (this.option == 'holdEnd') {
                this.holdingMLSelectDate({ date: this.data.startDate })
                this.holdingMLSelectDate({ date: this.data.endDate })
            }
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

    checkDifference(changes: SimpleChanges) {
        if (
            changes['data']['currentValue']?.date &&
            changes['data']['currentValue']['date'] != changes['data']['previousValue']['date']
        ) {
            return true
        } else if (
            changes['data']['currentValue']?.startDate != changes['data']['previousValue']?.startDate ||
            changes['data']['currentValue']?.endDate != changes['data']['previousValue']?.endDate
        ) {
            return true
        } else {
            return false
        }
    }

    ngOnInit(): void {
        this.option = this.option ?? 'normal'
        this.setDatePick()
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('data') && !changes['data']['firstChange']) {
            this.changed = true
            this.getDays(this.currentDate)
            // this.setDatePick()
        }

        // if (changes.hasOwnProperty('data')) {
        //     if (this.checkDifference(changes)) {
        //         this.setDatePick()
        //     }
        // }
    }
    ngAfterViewInit() {
        if (this.width) {
            // const paddingSide = (Number(this.width) - 255) / 2 + 10
            this.renderer.setStyle(this.multiline_datepicker.nativeElement, 'width', `${this.width}px`)
            this.renderer.setStyle(this.multiline_datepicker.nativeElement, 'padding', `10px 10px`)
        }
        if (this.height) {
            this.renderer.setStyle(this.multiline_datepicker.nativeElement, 'height', `${this.height}px`)
        }
        if (this.mode == 'multiline-component') {
            this.renderer.setStyle(this.multiline_datepicker.nativeElement, 'boxShadow', `none`)
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

    resetDateVars() {
        this.selectedDate = ''
        this.selectedDateObj = {}
        this.lineSelectedDateObj = { startDate: '', endDate: '' }
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
                    weekCol['color'] = 'rgb(227, 74, 94)'
                } else if (date.format('MM') != currentDate.format('MM')) {
                    weekCol['color'] = '#CFCFCF'
                    weekCol['fontWeight'] = 400
                } else {
                    weekCol['color'] = '#606060'
                    weekCol['fontWeight'] = 500
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
                    color: '#CFCFCF',
                    fontWeight: 400,
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
        this.setInitialLineDate(weekCol)
    }
    // helper
    setInitialLineDate(weekCol) {
        switch (this.option) {
            case 'normal':
                this.initNormalDateweekCol(weekCol)
                break
            case 'register':
                this.toggleEdge(weekCol) == false ? this.initRegisterDate(weekCol) : null
                break
            case 'extend':
                this.toggleEdge(weekCol) == false ? this.initExtendDate(weekCol) : null
                break
        }
    }
    // initlineDate methods for each type -->
    initNormalDateweekCol(weekCol) {
        if (!this.lineSelectedDateObj.startDate && !this.lineSelectedDateObj.endDate) {
            this.lineSelectedDateObj.startDate = weekCol.date
        } else if (!this.lineSelectedDateObj.startDate && this.lineSelectedDateObj.endDate) {
            if (moment(weekCol.date).isSameOrBefore(this.lineSelectedDateObj.endDate)) {
                this.lineSelectedDateObj.startDate = weekCol.date
            }
        } else if (!this.lineSelectedDateObj.endDate) {
            if (moment(weekCol.date).isBefore(this.lineSelectedDateObj.startDate, 'day')) {
                this.lineSelectedDateObj.startDate = weekCol.date
            } else {
                this.lineSelectedDateObj.endDate = weekCol.date
            }
        } else if (this.lineSelectedDateObj.startDate && this.lineSelectedDateObj.endDate) {
            if (moment(weekCol.date).isBefore(this.lineSelectedDateObj.startDate, 'day')) {
                this.lineSelectedDateObj.startDate = weekCol.date
            } else if (moment(weekCol.date).isSame(this.lineSelectedDateObj.startDate, 'day')) {
                this.lineSelectedDateObj.startDate = ''
            }

            if (moment(weekCol.date).isSame(this.lineSelectedDateObj.endDate, 'day')) {
                this.lineSelectedDateObj.endDate = ''
            } else if (moment(weekCol.date).isAfter(this.lineSelectedDateObj.startDate, 'day')) {
                this.lineSelectedDateObj.endDate = weekCol.date
            }
        }
        this.dataChange.emit(this.lineSelectedDateObj)
    }
    initRegisterDate(weekCol) {
        // 초기 시작일 설정을 수정해야할 수도 있음
        if (
            this.lineSelectedDateObj.startDate &&
            moment(weekCol.date).isSameOrBefore(moment().format('YYYY-MM-DD'), 'day')
        )
            return
        if (!this.lineSelectedDateObj.startDate) {
            this.lineSelectedDateObj.startDate = moment().format('YYYY-MM-DD')
            this.dataChange.emit(this.lineSelectedDateObj)
        } else {
            this.lineSelectedDateObj.endDate = weekCol.date
            this.dataChange.emit(this.lineSelectedDateObj)
        }

        // this.initNormalDateweekCol(weekCol)
    }
    initExtendDate(weekCol) {
        if (
            this.lineSelectedDateObj.startDate &&
            moment(weekCol.date).isSameOrBefore(moment().format(this.lineSelectedDateObj.startDate), 'day')
        )
            return
        if (!this.lineSelectedDateObj.startDate) {
            this.lineSelectedDateObj.startDate = weekCol.date
            this.dataChange.emit(this.lineSelectedDateObj)
        } else {
            this.lineSelectedDateObj.endDate = weekCol.date
            this.dataChange.emit(this.lineSelectedDateObj)
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
    }
    isStartDate(weekCol) {
        return this.lineSelectedDateObj.startDate == weekCol.date
    }
    isEndDate(weekCol) {
        return this.lineSelectedDateObj.endDate == weekCol.date
    }
    isSameDate(weekCol) {
        return weekCol.date == this.lineSelectedDateObj.startDate && weekCol.date == this.lineSelectedDateObj.endDate
    }
    isBetween(weekCol) {
        return moment(weekCol.date).isBetween(this.lineSelectedDateObj.startDate, this.lineSelectedDateObj.endDate)
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
        return (
            !this.lineSelectedDateObj.startDate ||
            moment(weekCol.date).isSameOrBefore(this.lineSelectedDateObj.startDate)
        )
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

    // --------- multiline component with mcPastUnAvailalble method --------------------------------------------------------------------------------------------------

    // --------- reg ml method --------------------------------------------------------------------------------------------------
    regMLSelectDate(weekCol) {
        if (this.toggleEdge(weekCol) == false) {
            this.setInitRegML(weekCol)
        } else {
            this.dataChange.emit(this.lineSelectedDateObj)
        }
    }

    setInitRegML(weekCol) {
        switch (this.option) {
            case 'onlyStart':
                this.initOnlyStartDateWeekCol(weekCol)
                break
            case 'onlyEnd':
                this.initOnlyEndDateWeekCol(weekCol)
                break
            case 'looseOnlyStart':
                this.initLooseOnlyStartDateWeekCol(weekCol)
                break
            case 'looseOnlyEnd':
                this.initLooseOnlyEndDateWeekCol(weekCol)
                break
            case 'limitLooseOnlyEnd':
                this.initLimitLooseOnlyEndDateWeekCol(weekCol)
                break
        }
    }

    initOnlyStartDateWeekCol(weekCol) {
        if (moment(weekCol.date).isBefore(moment().format('YYYY-MM-DD'), 'day')) return
        this.lineSelectedDateObj.startDate = weekCol.date

        this.dataChange.emit({
            startDate: weekCol.date,
            endDate: this.data?.endDate ?? '',
        })
        // this.dataChange.emit(this.lineSelectedDateObj)
    }

    initOnlyEndDateWeekCol(weekCol) {
        if (moment(weekCol.date).isBefore(moment().format('YYYY-MM-DD'), 'day')) return
        if (!this.lineSelectedDateObj.startDate) {
            this.lineSelectedDateObj.startDate = weekCol.date
            this.dataChange.emit(this.lineSelectedDateObj)
        } else if (
            !moment(weekCol.date).isBefore(moment(this.lineSelectedDateObj.startDate).format('YYYY-MM-DD'), 'day')
        ) {
            this.lineSelectedDateObj.endDate = weekCol.date
            this.dataChange.emit(this.lineSelectedDateObj)
        }
    }
    initLooseOnlyStartDateWeekCol(weekCol) {
        this.lineSelectedDateObj.startDate = weekCol.date
        // this.dataChange.emit(this.lineSelectedDateObj)
        this.dataChange.emit({
            startDate: weekCol.date,
            endDate: this.data?.endDate ?? '',
        })
    }
    initLooseOnlyEndDateWeekCol(weekCol) {
        if (!this.lineSelectedDateObj.startDate) {
            this.lineSelectedDateObj.startDate = weekCol.date
            this.dataChange.emit(this.lineSelectedDateObj)
        } else if (
            !moment(weekCol.date).isBefore(moment(this.lineSelectedDateObj.startDate).format('YYYY-MM-DD'), 'day')
        ) {
            this.lineSelectedDateObj.endDate = weekCol.date
            this.dataChange.emit(this.lineSelectedDateObj)
        }
    }
    initLimitLooseOnlyEndDateWeekCol(weekCol) {
        if (!this.lineSelectedDateObj.startDate) {
            this.lineSelectedDateObj.startDate = weekCol.date
            this.dataChange.emit(this.lineSelectedDateObj)
        } else if (moment(weekCol.date).isBefore(moment().format('YYYY-MM-DD'), 'day')) {
            return
        } else if (
            !moment(weekCol.date).isBefore(moment(this.lineSelectedDateObj.startDate).format('YYYY-MM-DD'), 'day')
        ) {
            this.lineSelectedDateObj.endDate = weekCol.date
            this.dataChange.emit(this.lineSelectedDateObj)
        }
    }

    regML_IsAvailableDate(weekCol) {
        switch (this.option) {
            case 'onlyStart':
                return !moment(weekCol.date).isBefore(moment().format('YYYY-MM-DD'), 'day')
            case 'onlyEnd':
                return !moment(weekCol.date).isBefore(moment().format(this.lineSelectedDateObj.startDate), 'day')
            case 'looseOnlyStart':
                return true
            case 'looseOnlyEnd':
                return !moment(weekCol.date).isBefore(moment().format(this.lineSelectedDateObj.startDate), 'day')
            case 'limitLooseOnlyEnd':
                return (
                    !moment(weekCol.date).isBefore(moment().format(this.lineSelectedDateObj.startDate), 'day') &&
                    !moment(weekCol.date).isBefore(moment().format('YYYY-MM-DD'), 'day')
                )
            default:
                return false
        }
    }

    // --------- holding method --------------------------------------------------------------------------------------------------
    // optional input
    @Input() mlDate: { startDate: string; endDate: string }
    holdingMLSelectDate(weekCol) {
        if (this.toggleEdge(weekCol) == false) {
            this.setInitHoldingML(weekCol)
        } else {
            this.dataChange.emit(this.lineSelectedDateObj)
        }
    }

    setInitHoldingML(weekCol) {
        switch (this.option) {
            case 'holdStart':
                this.initHoldingStartDateWeekCol(weekCol)
                break
            case 'holdEnd':
                this.initHoldingEndDateWeekCol(weekCol)
                break
        }
    }

    initHoldingStartDateWeekCol(weekCol) {
        if (
            moment(weekCol.date).isBefore(moment(this.mlDate.startDate).format('YYYY-MM-DD'), 'day') ||
            moment(weekCol.date).isBefore(moment().format('YYYY-MM-DD'), 'day') ||
            moment(weekCol.date).isAfter(moment(this.mlDate.endDate).format('YYYY-MM-DD'), 'day')
        ) {
            return
        }
        this.lineSelectedDateObj.startDate = weekCol.date

        this.dataChange.emit({
            startDate: weekCol.date,
            endDate: this.data?.endDate ?? '',
        })
        // this.dataChange.emit(this.lineSelectedDateObj)
    }

    initHoldingEndDateWeekCol(weekCol) {
        if (
            moment(weekCol.date).isBefore(moment(this.mlDate.startDate).format('YYYY-MM-DD'), 'day') ||
            moment(weekCol.date).isBefore(moment().format('YYYY-MM-DD'), 'day')
        )
            return

        if (!this.lineSelectedDateObj.startDate) {
            this.lineSelectedDateObj.startDate = weekCol.date
            this.dataChange.emit(this.lineSelectedDateObj)
        } else if (
            !moment(weekCol.date).isBefore(moment(this.lineSelectedDateObj.startDate).format('YYYY-MM-DD'), 'day')
        ) {
            this.lineSelectedDateObj.endDate = weekCol.date
            this.dataChange.emit(this.lineSelectedDateObj)
        }
    }

    holdingML_IsAvailableDate(weekCol) {
        switch (this.option) {
            case 'holdStart':
                return !(
                    moment(weekCol.date).isBefore(moment(this.mlDate.startDate).format('YYYY-MM-DD'), 'day') ||
                    moment(weekCol.date).isBefore(moment().format('YYYY-MM-DD'), 'day') ||
                    moment(weekCol.date).isAfter(moment(this.mlDate.endDate).format('YYYY-MM-DD'), 'day')
                )
            case 'holdEnd':
                return !moment(weekCol.date).isBefore(moment().format(this.lineSelectedDateObj.startDate), 'day')
            default:
                return false
        }
    }
}
