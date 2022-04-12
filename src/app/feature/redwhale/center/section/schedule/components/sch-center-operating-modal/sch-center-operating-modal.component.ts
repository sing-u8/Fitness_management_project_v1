import {
    Component,
    Input,
    ElementRef,
    Renderer2,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    AfterViewChecked,
    ViewChild,
} from '@angular/core'
import _ from 'lodash'

@Component({
    selector: 'rw-sch-center-operating-modal',
    templateUrl: './sch-center-operating-modal.component.html',
    styleUrls: ['./sch-center-operating-modal.component.scss'],
})
export class SchCenterOpratingModalComponent implements AfterViewChecked, OnChanges {
    @Input() visible: boolean
    @Input() time: { start: string; end: string }
    @Input() daysString: { value: number[] }

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<any>()

    public dayOfWeek = [
        { key: 0, name: '일', selected: true },
        { key: 1, name: '월', selected: true },
        { key: 2, name: '화', selected: true },
        { key: 3, name: '수', selected: true },
        { key: 4, name: '목', selected: true },
        { key: 5, name: '금', selected: true },
        { key: 6, name: '토', selected: true },
    ]

    // public prevDayOfWeek = []
    // public prevTime = undefined
    // public prevDaysString = undefined

    changed: boolean

    public isMouseModalDown: boolean

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.isMouseModalDown = false
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && !changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }

        if (this.time) {
            console.log('change time: ', this.time)
        }
        if (this.daysString.value) {
            this.initDayOfWeek(this.daysString.value)
            console.log('change daysString: ', this.daysString)
        }
    }

    ngAfterViewChecked() {
        if (this.changed) {
            this.changed = false

            if (this.visible) {
                this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'display-block')
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
            }
        }
    }

    onCancel(): void {
        this.cancel.emit({})
    }

    onConfirm(): void {
        this.setDaysString()
        this.confirm.emit({
            operatingTime: this.time,
            operatingDayOfWeek: this.daysString,
        })
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }

    // --------------------------------------------------

    toggleDay(idx: number) {
        this.dayOfWeek[idx].selected = !this.dayOfWeek[idx].selected
        this.setDaysString()
    }

    setDaysString() {
        this.daysString.value = _.map(
            _.filter(this.dayOfWeek, (day) => day.selected),
            (day) => day.key
        )
    }

    initDayOfWeek(days: number[]) {
        if (days) {
            const dayWeek = [
                { key: 0, name: '일', selected: false },
                { key: 1, name: '월', selected: false },
                { key: 2, name: '화', selected: false },
                { key: 3, name: '수', selected: false },
                { key: 4, name: '목', selected: false },
                { key: 5, name: '금', selected: false },
                { key: 6, name: '토', selected: false },
            ]

            _.forEach(days, (day) => {
                _.find(dayWeek, (item, idx) => {
                    if (item.key == day) {
                        dayWeek[idx].selected = true
                        return true
                    } else {
                        return false
                    }
                })
            })
            this.dayOfWeek = dayWeek
        }
    }

    onStartTimeClick(time: { key: string; name: string }) {
        this.time.start = time.key
        console.log('onStartTimeClick: ', time, this.time.start)
    }
    onEndTimeClick(time: { key: string; name: string }) {
        this.time.end = time.key
        console.log('onEndTimeClick: ', time, this.time.start)
    }
}
