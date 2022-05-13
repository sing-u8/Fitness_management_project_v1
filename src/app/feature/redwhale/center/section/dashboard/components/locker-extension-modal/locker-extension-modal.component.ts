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

import { UserLocker } from '@schemas/user-locker'

export interface ExtensionOutput {
    datepick: {
        startDate: string
        endDate: string
    }
}

@Component({
    selector: 'db-locker-extension-modal',
    templateUrl: './locker-extension-modal.component.html',
    styleUrls: ['./locker-extension-modal.component.scss'],
})
export class LockerExtensionModalComponent implements AfterViewChecked, OnChanges, AfterViewInit {
    @Input() visible: boolean
    @Input() userLocker: UserLocker

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<ExtensionOutput>()

    @ViewChild('modalBackgroundElement') modalBackgroundElement: ElementRef
    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    @ViewChild('rw_datepicker') rw_datepicker: ElementRef

    public changed: boolean
    public isMouseModalDown: boolean

    public doShowDatePick = false
    openShowDatePicker() {
        this.doShowDatePick = true
    }
    closeShowDatePicker() {
        this.doShowDatePick = false
    }
    public datepick = {
        startDate: '',
        endDate: '',
    }

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.isMouseModalDown = false
    }

    setCompVars() {
        this.doShowDatePick = false
        this.datepick = _.cloneDeep({
            startDate: this.userLocker.start_date,
            endDate: this.userLocker.end_date,
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
        this.initComponentVars()
    }
    onConfirm(): void {
        this.confirm.emit({
            datepick: _.cloneDeep(this.datepick),
        })
        this.initComponentVars()
    }

    initComponentVars() {
        this.datepick = _.cloneDeep({
            startDate: '',
            endDate: '',
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
