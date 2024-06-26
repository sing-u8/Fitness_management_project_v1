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
    ViewChildren,
    QueryList,
    ElementRef,
    Renderer2,
} from '@angular/core'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(weekOfYear)
dayjs.extend(isBetween)

@Component({
    selector: 'rw-datepicker2',
    templateUrl: './datepicker2.component.html',
    styleUrls: ['./datepicker2.component.scss'],
})
export class Datepicker2Component implements OnInit, OnChanges, AfterViewChecked, AfterViewInit {
    @Input() isDivider = false
    @Input() isShadow = true
    @Input() mode: 'date' | 'week' | 'multi' | 'modify-range'
    @Input() availableDays: number[] = [0, 1, 2, 3, 4, 5, 6]

    @Input() data: any
    @Input() shadowOn: boolean

    @Input() height: string
    @ViewChildren('rw_datepicker') rw_datepicker_els: QueryList<ElementRef>

    @Output() dataChange = new EventEmitter<any>()

    public month: string
    public today: dayjs.Dayjs
    public currentDate: dayjs.Dayjs
    public weekRows: any

    // date
    public selectedDate: string
    public selectedDateIndex: any

    // week
    public weekNumbers
    public selectedWeek
    public selectedWeekIndex: number

    // multi
    public selectedDateObj: any

    // lineselect
    public lineSelectedDateObj: { startDate: string; endDate: string } = { startDate: '', endDate: '' }

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
    }

    setDatePick() {
        this.today = dayjs()
        if (this.mode == 'date' && this.data.date) {
            this.currentDate = dayjs(this.data.date)
        } else if (this.mode == 'week' && this.data.startDate) {
            this.currentDate = dayjs(this.data.startDate)
        } else {
            this.currentDate = dayjs()
        }
        this.month = this.currentDate.clone().format('YYYY년 MM월')
        this.getDays(this.currentDate)
    }

    ngOnInit(): void {
        this.setDatePick()
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('data') && !changes['data']['firstChange']) {
            this.changed = true
            this.setDatePick()
        }
    }
    ngAfterViewInit(): void {
        if (this.height) {
            this.rw_datepicker_els.forEach((v) => {
                this.renderer.setStyle(v.nativeElement, 'height', `${this.height}`)
            })
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
                        this.currentDate = dayjs(this.data.date)
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
                        this.currentDate = dayjs(this.data.startDate)
                        this.month = this.currentDate.clone().format('YYYY년 MM월')
                        this.getDays(this.currentDate)
                    }, 1)
                })
            }
        }
    }

    getDays(currentDate: dayjs.Dayjs) {
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
                    weekCol['color'] = 'rgb(228, 233, 242)'
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
        console.log('datepicker2 select date : ', i, j)
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

        const selectedYearMonth = dayjs(this.selectedDate).format('YYYY-MM')
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

        const week = dayjs(startDate).week()
        this.selectedWeek = week

        this.dataChange.emit({ startDate: startDate, endDate: endDate })
    }

    checkSelectedWeek() {
        if (this.data.startDate) {
            const week = dayjs(this.data.startDate).week()
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
}
