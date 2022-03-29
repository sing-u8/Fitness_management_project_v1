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
import * as dayjs from 'dayjs'
import * as _ from 'lodash'

import { GymUserService } from '@services/gym-user.service'
import { StorageService } from '@services/storage.service'

import { User } from '@schemas/user'
import { GymUser } from '@schemas/gym-user'
import { Gym } from '@schemas/gym'

@Component({
    selector: 'rw-modify-ticket-charge-modal',
    templateUrl: './modify-ticket-charge-modal.component.html',
    styleUrls: ['./modify-ticket-charge-modal.scss'],
})
export class ModifyTicketChargeModalComponent implements OnChanges, AfterViewChecked {
    @Input() visible: boolean
    @Input() type: 'register' | 'modify'

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<any>()

    changed: boolean

    public paid_date: string
    public inputs = { pay_card: '', pay_cash: '', pay_trans: '', unpaid: '' }
    public total = ''

    public isMouseModalDown: boolean

    public staffSelect_list: Array<{ name: string; value: GymUser }> = []
    public lockerStaffSelectValue: { name: string; value: GymUser } = { name: '', value: undefined }
    public staffList: Array<GymUser> = []
    public gym: Gym
    public user: User

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private gymUserService: GymUserService,
        private storageService: StorageService
    ) {
        this.isMouseModalDown = false
        this.paid_date = dayjs().format('YYYY.MM.DD')
        this.gym = this.storageService.getGym()
        this.user = this.storageService.getUser()
        this.gymUserService.getUserList(this.gym.id, '', 'administrator, manager, staff').subscribe((managers) => {
            this.staffList = managers
            managers.forEach((v) => {
                this.staffSelect_list.push({
                    name: v.gym_user_name ?? v.given_name,
                    value: v,
                })
                this.user.id == v.id
                    ? (this.lockerStaffSelectValue = { name: v.gym_user_name ?? v.given_name, value: v })
                    : null
            })
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.visible.firstChange) {
            if (changes.visible.previousValue != changes.visible.currentValue) {
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

    onCancel(): void {
        this.initModal()
        this.cancel.emit({})
    }

    onConfirm(): void {
        const emitData = {
            pay_card: Number(this.inputs.pay_card.replace(/[^0-9]/gi, '')) ?? 0,
            pay_cash: Number(this.inputs.pay_cash.replace(/[^0-9]/gi, '')) ?? 0,
            pay_trans: Number(this.inputs.pay_trans.replace(/[^0-9]/gi, '')) ?? 0,
            unpaid: Number(this.inputs.unpaid.replace(/[^0-9]/gi, '')) ?? 0,
            pay_date: dayjs(this.paid_date).format('YYYY-MM-DD'),
            assignee_id: this.lockerStaffSelectValue.value.id,
        }
        this.initModal()
        this.confirm.emit(emitData)
    }

    initModal() {
        this.inputs = { pay_card: '', pay_cash: '', pay_trans: '', unpaid: '' }
        this.total = ''
        this.staffList.forEach((v) => {
            this.user.id == v.id
                ? (this.lockerStaffSelectValue = { name: v.gym_user_name ?? v.given_name, value: v })
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
        if (code < 48 || code > 57) {
            return false
        }
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

type ModalInput = 'pay_card' | 'pay_cash' | 'pay_trans' | 'unpaid'
