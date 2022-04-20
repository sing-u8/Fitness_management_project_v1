import {
    Component,
    Output,
    EventEmitter,
    Renderer2,
    AfterViewInit,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core'
import _ from 'lodash'

const dayOfWeekInit = [
    { key: 0, name: '일', selected: true },
    { key: 1, name: '월', selected: true },
    { key: 2, name: '화', selected: true },
    { key: 3, name: '수', selected: true },
    { key: 4, name: '목', selected: true },
    { key: 5, name: '금', selected: true },
    { key: 6, name: '토', selected: true },
]

@Component({
    selector: 'rw-sch-day-repeat-select',
    templateUrl: './sch-day-repeat-select.component.html',
    styleUrls: ['./sch-day-repeat-select.component.scss'],
})
export class SchDayRepeatSelectComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() dayList: Array<number>

    @Output() onDayChange = new EventEmitter<Array<string>>()

    public dayOfWeek = dayOfWeekInit
    public headTitle = ''

    public isOpen = false

    constructor(private renderer: Renderer2) {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.setHeadTitle()
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.initDayOfWeek()
    }

    toggle() {
        this.isOpen = !this.isOpen
    }

    close() {
        this.isOpen = false
    }

    initDayOfWeek() {
        const _dayOfWeek = dayOfWeekInit
        _.forEach(this.dayList, (day) => {
            _.forEach(_dayOfWeek, (dayObj, idx) => {
                if (dayObj.key == day) {
                    _dayOfWeek[idx].selected = true
                }
            })
        })
        this.dayOfWeek = _dayOfWeek
        this.setHeadTitle()
    }

    emitDays() {
        const dayList = []
        _.forEach(this.dayOfWeek, (dayObj, idx) => {
            dayObj.selected ? dayList.push(dayObj.key) : null
        })
        this.onDayChange.emit(dayList)
    }

    toggleDay(idx: number) {
        const selectedDays = _.filter(this.dayOfWeek, ['selected', true])
        if (selectedDays.length == 1 && selectedDays[0].key == this.dayOfWeek[idx].key) return
        this.dayOfWeek[idx].selected = !this.dayOfWeek[idx].selected
        this.setHeadTitle()
        this.emitDays()
    }

    setHeadTitle() {
        if (_.every(this.dayOfWeek, ['selected', true])) {
            this.headTitle = '매일 반복'
        } else if (
            this.dayOfWeek[0].selected == true &&
            this.dayOfWeek[1].selected == false &&
            this.dayOfWeek[2].selected == false &&
            this.dayOfWeek[3].selected == false &&
            this.dayOfWeek[4].selected == false &&
            this.dayOfWeek[5].selected == false &&
            this.dayOfWeek[6].selected == true
        ) {
            this.headTitle = '주말마다 반복'
        } else if (
            this.dayOfWeek[0].selected == false &&
            this.dayOfWeek[1].selected == true &&
            this.dayOfWeek[2].selected == true &&
            this.dayOfWeek[3].selected == true &&
            this.dayOfWeek[4].selected == true &&
            this.dayOfWeek[5].selected == true &&
            this.dayOfWeek[6].selected == false
        ) {
            this.headTitle = '평일마다 반복'
        } else {
            const selectedDays = _.filter(this.dayOfWeek, ['selected', true])
            let text = ''
            _.forEach(selectedDays, (value, idx, list) => {
                text += idx == list.length - 1 ? value.name : value.name + ', '
            })
            text += '요일마다 반복'
            this.headTitle = text
        }
    }
}
