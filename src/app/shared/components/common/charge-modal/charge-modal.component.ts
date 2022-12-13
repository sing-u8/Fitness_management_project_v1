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
    OnDestroy,
} from '@angular/core'
import dayjs from 'dayjs'
import _ from 'lodash'
import { Subject, interval } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { CenterUsersService } from '@services/center-users.service'
import { CenterUserListService } from '@services/helper/center-user-list.service'
import { StorageService } from '@services/storage.service'

import { User } from '@schemas/user'
import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'

import { ClickEmitterType } from '@schemas/components/button'

export interface ChargeType {
    pay_card: number
    pay_cash: number
    pay_trans: number
    unpaid: number
    pay_date: string
    assignee_id: string
}
export type ModalInput = 'pay_card' | 'pay_cash' | 'pay_trans' | 'unpaid'
export type ChargeMode =
    | 'extend'
    | 'transfer'
    | 'refund'
    | 'empty_locker_payment' // locker  only
    | 'empty_locker_refund' // locker  only
    | 'modify_refund_payment' // payment only
    | 'modify_transfer_payment' // payment only
export interface ConfirmOuput {
    chargeType: ChargeType
    loadingFns: ClickEmitterType
}

@Component({
    selector: 'rw-charge-modal',
    templateUrl: './charge-modal.component.html',
    styleUrls: ['./charge-modal.component.scss'],
})
export class ChargeModalComponent implements OnChanges, AfterViewChecked, OnDestroy {
    @Input() visible: boolean
    @Input() chargeMode: ChargeMode = 'extend'
    @Input() inputs = { pay_card: '', pay_cash: '', pay_trans: '', unpaid: '' }

    @ViewChild('modalBackgroundElement') modalBackgroundElement: ElementRef
    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<ConfirmOuput>()

    public changed: boolean

    public paid_date: string = dayjs().format('YYYY.MM.DD')
    public paid_date_raw: dayjs.Dayjs = dayjs()
    public unsubscribe$ = new Subject<void>()
    // public inputs = { pay_card: '', pay_cash: '', pay_trans: '', unpaid: '' }
    public total = '0'

    public isMouseModalDown: boolean

    public staffSelect_list: Array<{ name: string; value: CenterUser }> = []
    public lockerStaffSelectValue: { name: string; value: CenterUser } = { name: '', value: undefined }
    public staffList: Array<CenterUser> = []
    public center: Center
    public user: User

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private centerUsersService: CenterUsersService,
        private centerUserListService: CenterUserListService,
        private storageService: StorageService
    ) {
        interval(60000)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((__) => {
                if (dayjs(this.paid_date_raw).isBefore(dayjs())) {
                    this.paid_date_raw = dayjs()
                    this.paid_date = dayjs().format('YYYY.MM.DD')
                }
            })

        this.isMouseModalDown = false
        this.center = this.storageService.getCenter()
        this.user = this.storageService.getUser()
        this.centerUserListService.getCenterInstructorList(this.center.id).subscribe({
            next: (instructors) => {
                this.staffList = instructors
                instructors.forEach((v) => {
                    this.staffSelect_list.push({
                        name: v.name,
                        value: v,
                    })
                    this.user.id == v.id
                        ? (this.lockerStaffSelectValue = { name: v.name, value: v })
                        : null
                })
            },
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
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
    ngOnDestroy(): void {
        this.unsubscribe$.next()
        this.unsubscribe$.complete()
    }

    onCancel(): void {
        this.initModal()
        this.cancel.emit({})
    }

    onConfirm(loadingFns: ClickEmitterType): void {
        loadingFns.showLoading()

        const emitData: ChargeType = {
            pay_card: Number(this.inputs.pay_card.replace(/[^0-9]/gi, '')) ?? 0,
            pay_cash: Number(this.inputs.pay_cash.replace(/[^0-9]/gi, '')) ?? 0,
            pay_trans: Number(this.inputs.pay_trans.replace(/[^0-9]/gi, '')) ?? 0,
            unpaid: Number(this.inputs.unpaid.replace(/[^0-9]/gi, '')) ?? 0,
            pay_date: dayjs(this.paid_date).format('YYYY-MM-DD'),
            assignee_id: this.lockerStaffSelectValue.value.id,
        }
        this.initModal()
        this.confirm.emit({
            chargeType: emitData,
            loadingFns: loadingFns,
        })
    }

    initModal() {
        this.inputs = { pay_card: '', pay_cash: '', pay_trans: '', unpaid: '' }
        this.total = '0'
        this.staffList.forEach((v) => {
            this.user.id == v.id
                ? (this.lockerStaffSelectValue = { name: v.name, value: v })
                : null
        })
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }

    // input helper functions
    restrictToNumber(event) {
        const code = event.which ? event.which : event.keyCode
        if (code < 48 || code > 57 || code < 96  || code > 105) {
            return false
        }
        return true
    }
    onInputKeyup(event, type: ModalInput) {
        if (event.code == 'Enter') return
        this.inputs[type] = this.inputs[type].replace(/[^0-9]/gi, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')

        // set total
        let _total = 0
        _.forIn(this.inputs, (value) => {
            _total += Number(value.replace(/[^0-9]/gi, ''))
        })
        this.total = String(_total).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
}
