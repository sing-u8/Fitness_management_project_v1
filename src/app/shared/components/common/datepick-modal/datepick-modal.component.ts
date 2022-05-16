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
    AfterViewInit,
    ViewChild,
} from '@angular/core'

import _ from 'lodash'

import { ClickEmitterType } from '@shared/components/common/button/button.component'

export interface DatePickOutput {
    startDate: string
    endDate: string
}

export interface DatePickConfirmOutput {
    datepick: {
        startDate: string
        endDate: string
    }
    loadingFns: ClickEmitterType
}

@Component({
    selector: 'rw-datepick-modal',
    templateUrl: './datepick-modal.component.html',
    styleUrls: ['./datepick-modal.component.scss'],
})
export class DatepickModalComponent implements AfterViewChecked, OnChanges, AfterViewInit {
    @Input() visible: boolean
    @Input() textData: {
        text?: string
        subText?: string
        cancelButtonText?: string
        confirmButtonText?: string
        startDateText?: string
        endDateText?: string
    }
    @Input() datepickInput: DatePickOutput

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<DatePickConfirmOutput>()
    @ViewChild('modalBackgroundElement') modalBackgroundElement: ElementRef
    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef

    public changed: boolean
    public isMouseModalDown: boolean

    public doShowDatePick = {
        start: false,
        end: false,
    }
    openShowDatePicker(which: 'start' | 'end') {
        this.doShowDatePick[which] = true
    }
    closeShowDatePicker(which: 'start' | 'end') {
        this.doShowDatePick[which] = false
    }

    public startDatepick = {
        startDate: '',
        endDate: '',
    }
    public endDatePick = {
        startDate: '',
        endDate: '',
    }
    public isStartDatepicReset = false
    setStartDatepickReset(flag: boolean) {
        this.isStartDatepicReset = flag
    }
    public isEndDatepickReset = false
    setEndDatepickReset(flag: boolean) {
        this.isEndDatepickReset = flag
    }
    setDatepickReset(flag: boolean) {
        this.isStartDatepicReset = flag
        this.isEndDatepickReset = flag
    }

    onDatePickerChange(position: 'start' | 'end', date: { startDate: string; endDate: string }) {
        console.log('datepick modal -- onDatePickerChange : ', position, date)
        if (position == 'start') {
            this.startDatepick = {
                startDate: date.startDate,
                endDate: '',
            }
            if (date.endDate == '') {
                this.setEndDatepickReset(true)
                setTimeout(() => {
                    this.endDatePick = {
                        startDate: date.startDate,
                        endDate: '',
                    }
                }, 10)
            }
        } else {
            this.endDatePick = {
                startDate: date.startDate,
                endDate: date.endDate,
            }
        }
    }

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.isMouseModalDown = false
    }

    setCompVars() {
        this.doShowDatePick = {
            start: false,
            end: false,
        }
        this.startDatepick = _.cloneDeep({
            startDate: '',
            endDate: '',
        })
        this.endDatePick = _.cloneDeep({
            startDate: '',
            endDate: '',
        })
    }

    ngOnInit(): void {}
    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && !changes['visible']?.firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
    }
    ngAfterViewInit() {}
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

                this.setDatepickReset(true)
                setTimeout(() => {
                    this.onDatePickerChange('start', _.cloneDeep(this.datepickInput))
                    this.onDatePickerChange('end', _.cloneDeep(this.datepickInput))
                }, 10)
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
                this.setDatepickReset(true)
                setTimeout(() => {
                    this.setCompVars()
                }, 10)
            }
        }
    }

    onCancel(): void {
        this.cancel.emit({})
    }
    onConfirm(loadingFns: ClickEmitterType): void {
        this.confirm.emit({
            datepick: _.cloneDeep(this.endDatePick),
            loadingFns: loadingFns,
        })
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
}
