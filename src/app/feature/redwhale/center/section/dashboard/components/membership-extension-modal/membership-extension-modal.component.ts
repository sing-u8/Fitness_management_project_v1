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

export interface ExtensionOutput {
    datepick: {
        startDate: string
        endDate: string
    }
    countObj: {
        count: string
        unlimited: boolean
    }
}

@Component({
    selector: 'db-membership-extension-modal',
    templateUrl: './membership-extension-modal.component.html',
    styleUrls: ['./membership-extension-modal.component.scss'],
})
export class MembershipExtensionModalComponent implements AfterViewChecked, OnChanges, AfterViewInit {
    @Input() visible: boolean
    @Input() userMembership: UserMembership

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<ExtensionOutput>()

    @ViewChild('modalBackgroundElement') modalBackgroundElement: ElementRef
    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef

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

    public countObj: {
        count: string
        unlimited: boolean
    } = {
        count: '0',
        unlimited: false,
    }
    setCompVars() {
        this.doShowDatePick = false
        this.datepick.startDate = this.userMembership.start_date
        this.datepick.endDate = this.userMembership.end_date
        this.countObj.count = String(this.userMembership.count)
        this.countObj.unlimited = this.userMembership.unlimited
    }
    toggleUnlimited() {
        this.countObj.unlimited = !this.countObj.unlimited
    }

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.isMouseModalDown = false
    }

    ngOnInit(): void {}
    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && !changes['visible']?.firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
        // if (this.lockerTicket) {
        //     this.lockerName =
        //         `[${this.lockerTicket.locker_category_name}] ${this.lockerTicket.locker_item_name}`.length > 15
        //             ? `[${this.lockerTicket.locker_category_name}] ${this.lockerTicket.locker_item_name}`.slice(0, 15) +
        //               '...'
        //             : `[${this.lockerTicket.locker_category_name}] ${this.lockerTicket.locker_item_name}`
        // } else if (this.membershipTicket) {
        //     this.membershipName =
        //         this.membershipTicket.name.length > 15
        //             ? this.membershipTicket.name.slice(0, 15) + '...'
        //             : this.membershipTicket.name
        // }
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
        console.log('membership extension modal confirm : ', this.datepick, this.countObj)
        this.confirm.emit({
            datepick: _.cloneDeep(this.datepick),
            countObj: {
                count: this.countObj.count ?? '0',
                unlimited: this.countObj.unlimited,
            },
        })
        this.initComponentVars()
    }

    initComponentVars() {
        this.datepick = {
            startDate: '',
            endDate: '',
        }
        this.countObj = {
            count: '0',
            unlimited: false,
        }
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }

    //

    onCountKeyUp(event) {
        if (event.code == 'Enter') return
        if (this.countObj.unlimited) return
        this.countObj.count = this.countObj.count.replace(/[^0-9]/gi, '')
    }
}
