import {
    Component,
    Output,
    EventEmitter,
    Renderer2,
    ViewChild,
    ViewChildren,
    QueryList,
    AfterViewInit,
    OnInit,
    Input,
    ElementRef,
    OnChanges,
    SimpleChanges,
} from '@angular/core'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)
import _ from 'lodash'

export type Time = { key: string; name: string; isDisabled: boolean }

// 쓰이는 곳마다 key의 format A가 한글이 되었다가 영어로 되었다가 함
@Component({
    selector: 'rw-time-picker2',
    templateUrl: './time-picker2.component.html',
    styleUrls: ['./time-picker2.component.scss'],
})
export class TimePicker2Component implements OnInit, AfterViewInit, OnChanges {
    @ViewChild('selectElement') selectElement: ElementRef
    @ViewChild('selectedElement') selectedElement: ElementRef
    @ViewChild('itemsElement') itemsElement: ElementRef
    @ViewChild('timeTextElement') timeTextElement: ElementRef

    @ViewChildren('item') items: QueryList<any>

    @Input() time: string // dayjs.format('HH:mm:ss')
    // optinal
    @Input() width: string // ex) 135
    @Input() dropUp: boolean
    @Input() startTime: string // 00:00:00
    @Input() endTime: string // 00:00:00
    @Input() disableTimeUntil: string // 00:00:00
    @Input() textAlign: string

    @Output() onTimeClick = new EventEmitter<Pick<Time, 'key' | 'name'>>()

    public isOpen = false
    public timeList: Array<Time> = []
    public selectedTime: Time = { key: undefined, name: undefined, isDisabled: true }

    public isFirstOpen = false
    public isViewInitEnd = false
    constructor(private renderer: Renderer2) {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.initWidth()
        this.initTimeList()
        this.initSelectedTime()
        this.initTextAlign()

        this.isViewInitEnd = true
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (this.time && this.selectedTime.key && this.selectedTime.name) {
            this.initSelectedTime()
        }
        if (changes['startTime'] && changes['startTime']?.previousValue) {
            this.initTimeList()
        }
        if (changes['endTime'] && changes['endTime']?.previousValue) {
            this.initTimeList()
        }
        if (changes['disableTimeUntil'] && this.isViewInitEnd) {
            this.initTimeList()
            this.initSelectedTime()
        }
    }

    initTextAlign() {
        if (this.textAlign) {
            this.renderer.setStyle(this.timeTextElement.nativeElement, 'textAlign', `${this.textAlign}`)
        }
    }

    initWidth() {
        if (this.width) {
            this.renderer.setStyle(this.selectedElement.nativeElement, 'width', `${this.width}px`)
            this.renderer.setStyle(this.itemsElement.nativeElement, 'width', `${this.width}px`)
        }
    }

    getInitialTimeObj() {
        const startTime = this.startTime ? this.startTime.split(':').map((time) => Number(time)) : []
        const endTime = this.endTime ? this.endTime.split(':').map((time) => Number(time)) : []
        return {
            startTime:
                startTime.length != 0
                    ? new Date().setHours(startTime[0], startTime[1], startTime[2])
                    : new Date().setHours(0, 0, 0, 0),
            endTime:
                endTime.length != 0
                    ? new Date().setHours(endTime[0], endTime[1], endTime[2])
                    : new Date().setHours(23, 59, 59, 999),
        }
    }

    initTimeList() {
        let { startTime, endTime } = this.getInitialTimeObj()
        this.timeList = []
        while (startTime < endTime) {
            const valueList = dayjs(startTime).format('A:hh:mm').split(':')
            const value =
                (valueList[0] == 'AM' || valueList[0] == '오전' ? '오전' : '오후') +
                ' ' +
                valueList[1] +
                ':' +
                valueList[2]
            const key = dayjs(startTime).format('HH:mm:ss')
            this.timeList.push({ key: key, name: value, isDisabled: this.checkIsDisableTime(key) })
            if (dayjs().isBetween(dayjs(startTime), dayjs(startTime + 1800000), 'minute', '[]')) {
                this.selectedTime = { key: key, name: value, isDisabled: this.checkIsDisableTime(key) }
            }
            startTime += 1800000
        }
    }
    initSelectedTime() {
        if (!this.time) return
        // ! 임시로 해놓은 부분 - 운영시간이 바뀐 후에 정해진 시작 시간 또는 종료 시간이 없을 경우 자동 설정하는 코드 추가하기
        let selectedTimeIdx = _.findIndex(this.timeList, (item) => this.time == item.key)

        if (selectedTimeIdx == -1) {
            this.selectedTime = this.timeList[this.timeList.length - 1]
            selectedTimeIdx = this.timeList.length - 1
        } else if (this.checkIsDisableTime(this.timeList[selectedTimeIdx].key)) {
            // disableTimeUntil시간이 바뀌어 선택된 시간이 disable될 때,
            this.selectedTime = _.find(this.timeList, (time) => time.isDisabled == false)
            this.onTimeClick.emit(this.selectedTime)
        } else {
            this.selectedTime = this.timeList[selectedTimeIdx]
        }

        const timeHeight = selectedTimeIdx * 40 - 40
        this.renderer.setProperty(this.itemsElement.nativeElement, 'scrollTop', `${timeHeight}`)
    }

    toggle() {
        const visibility = this.itemsElement.nativeElement.style.visibility
        if (visibility == 'inherit') {
            this.close()
            this.initSelectedTime()
        } else {
            this.renderer.setStyle(this.itemsElement.nativeElement, 'visibility', 'inherit')
            this.isOpen = true
            if (this.isFirstOpen == false) {
                // 처음 랜더링 될 때, itemsElement가 스크롤이 가능한 상태가 아니라서
                // 처음 토글로 드롭다운이 열릴 때 처음 선택된 시간으로 스크롤 시킴
                this.initSelectedTime()
                this.isFirstOpen = true
            }
        }
    }

    close() {
        this.renderer.setStyle(this.itemsElement.nativeElement, 'visibility', 'hidden')
        this.isOpen = false
    }

    onSelect(event, item: Time, selectedTimeIdx: number) {
        this.selectedTime = item
        this.onTimeClick.emit(this.selectedTime)
        this.close()
    }

    // check disable time
    checkIsDisableTime(compareTime: string) {
        if (!this.disableTimeUntil) return false

        const disableTimeList = _.split(this.disableTimeUntil, ':')
        const compareTimeList = _.split(compareTime, ':')

        if (Number(disableTimeList[0]) > Number(compareTimeList[0])) {
            return true
        } else if (
            Number(disableTimeList[0]) == Number(compareTimeList[0]) &&
            Number(disableTimeList[1]) >= Number(compareTimeList[1])
        ) {
            return true
        }

        return false
    }
}
