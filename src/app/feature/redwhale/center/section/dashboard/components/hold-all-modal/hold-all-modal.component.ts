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
import dayjs from 'dayjs'

import { UserMembership } from '@schemas/user-membership'
import { UserLocker } from '@schemas/user-locker'
import { ClickEmitterType } from '@shared/components/common/button/button.component'

export interface HoldingOutput {
    startDate: string
    endDate: string
}

export interface HoldingConfirmOutput {
    date: {
        startDate: string
        endDate: string
    }
    loadingFns: ClickEmitterType
    holdWithLocker: boolean
}

@Component({
    selector: 'db-hold-all-modal',
    templateUrl: './hold-all-modal.component.html',
    styleUrls: ['./hold-all-modal.component.scss'],
})
export class HoldAllModalComponent implements AfterViewChecked, OnChanges, AfterViewInit {
    @Input() visible: boolean
    @Input() holdNumber: number

    @ViewChild('modalBackgroundElement') modalBackgroundElement: ElementRef
    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    @ViewChild('rw_datepicker') rw_datepicker: ElementRef

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<HoldingConfirmOutput>()

    changed: boolean

    public isMouseModalDown: boolean

    public holdWithLocker = true

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.isMouseModalDown = false
    }

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
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
                this.setCompVars()
            }
        }
    }

    onCancel(): void {
        this.cancel.emit({})
        this.holdWithLocker = true
    }

    onConfirm(loadingFns: ClickEmitterType): void {
        loadingFns.showLoading()
        this.confirm.emit({
            date: {
                startDate: this.startDatepick.startDate,
                endDate: this.endDatePick.endDate,
            },
            holdWithLocker: this.holdWithLocker,
            loadingFns: loadingFns,
        })
    }

    toggleHoldWithLocker() {
        this.holdWithLocker = !this.holdWithLocker
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }

    // datepick method
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

    onDatePickerChange(position: 'start' | 'end', date: { startDate: string; endDate: string }) {
        if (position == 'start') {
            this.startDatepick = _.cloneDeep({
                startDate: date.startDate,
                endDate: '',
            })
            this.endDatePick = _.cloneDeep({
                startDate: date.startDate,
                endDate: '',
            })
        } else if (position == 'end') {
            this.endDatePick = _.cloneDeep({
                startDate: date.startDate,
                endDate: date.endDate,
            })
        }
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
}
