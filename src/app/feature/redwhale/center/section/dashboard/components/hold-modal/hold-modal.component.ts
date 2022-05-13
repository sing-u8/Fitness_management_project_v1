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

import { UserMembership } from '@schemas/user-membership'
import { UserLocker } from '@schemas/user-locker'
import { ClickEmitterType } from '@shared/components/common/button/button.component'

export interface HoldingOutput {
    startDate: string
    endDate: string
}

export interface HoldingConfirmOutput {
    datepick: {
        startDate: string
        endDate: string
    }
    loadingFns: ClickEmitterType
}

@Component({
    selector: 'db-hold-modal',
    templateUrl: './hold-modal.component.html',
    styleUrls: ['./hold-modal.component.scss'],
})
export class HoldModalComponent implements AfterViewChecked, OnChanges, AfterViewInit {
    @Input() visible: boolean
    @Input() userLocker: UserLocker = undefined
    @Input() userMembership: UserMembership = undefined

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<HoldingConfirmOutput>()

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
    public isDatepickReset = false
    setDateReset(flag: boolean) {
        this.isDatepickReset = flag
    }
    onDatePickerChange(position: 'start' | 'end', date: { startDate: string; endDate: string }) {
        if (position == 'start') {
            this.endDatePick = _.cloneDeep({
                startDate: '',
                endDate: '',
            })
            setTimeout(() => {
                this.endDatePick = _.cloneDeep({
                    startDate: date.startDate,
                    endDate: '',
                })
            }, 10)
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

        this.startDatepick = _.cloneDeep({
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

                this.setCompVars()
                this.setDateReset(false)
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)

                this.setDateReset(true)
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
