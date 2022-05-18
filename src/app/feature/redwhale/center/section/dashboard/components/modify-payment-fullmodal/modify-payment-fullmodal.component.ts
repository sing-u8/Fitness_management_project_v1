import {
    Component,
    OnInit,
    OnDestroy,
    SimpleChanges,
    ElementRef,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    Renderer2,
    OnChanges,
    AfterViewChecked,
} from '@angular/core'

import _ from 'lodash'
import dayjs from 'dayjs'

import { originalOrder } from '@helpers/pipe/keyvalue'
import { StorageService } from '@services/storage.service'

// components
import { ClickEmitterType } from '@shared/components/common/button/button.component'

import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { MembershipItem } from '@schemas/membership-item'
import { LockerItem } from '@schemas/locker-item'
import { LockerCategory } from '@schemas/locker-category'
import { Payment } from '@schemas/payment'
import { UserLocker } from '@schemas/user-locker'
import { UserMembership } from '@schemas/user-membership'

// ngrx
import { Store } from '@ngrx/store'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'

// component store
import {
    MembershipTicket,
    LockerTicket,
    Instructor,
    TotalPrice,
    Price,
} from '@schemas/center/dashboard/modify-payment-fullmodal'
import { ModifyPaymentFullModalStore } from './componentStore/modify-payment-fullmodal.store'
import { Observable } from 'rxjs'

@Component({
    selector: 'db-modify-payment-fullmodal',
    templateUrl: './modify-payment-fullmodal.component.html',
    styleUrls: ['./modify-payment-fullmodal.component.scss'],
    providers: [ModifyPaymentFullModalStore],
})
export class ModifyPaymentFullmodalComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
    @Input() visible: boolean
    @Input() curUser: CenterUser
    @Input() userPayment: Payment
    @Input() userLocker: UserLocker
    @Input() userMembership: UserMembership
    @Input() instructors: Array<CenterUser>

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() close = new EventEmitter<any>()
    @Output() finishModify = new EventEmitter<any>()

    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    public changed: boolean

    //
    public today = dayjs().format('YYYY.MM.DD')
    public center: Center
    public originalOrder = originalOrder

    // component store vars
    public membershipTicket$: Observable<MembershipTicket> = this.cmpStore.membershipTicket$
    public lockerTicket$: Observable<LockerTicket> = this.cmpStore.lockerTicket$
    public instructors$: Observable<Array<CenterUser>> = this.cmpStore.instructors$
    public totalPrice$: Observable<TotalPrice> = this.cmpStore.totalPrice$
    public totalPriceSum$: Observable<number> = this.cmpStore.totalPriceSum$

    constructor(
        private renderer: Renderer2,
        private storageService: StorageService,
        private nxStore: Store,
        private cmpStore: ModifyPaymentFullModalStore
    ) {}

    ngOnInit(): void {
        this.center = this.storageService.getCenter()
        this.cmpStore.getInstructorsEffect(this.center.id)
    }
    ngOnDestroy(): void {}
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible'] && !changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
    }

    ngAfterViewChecked(): void {
        if (this.changed) {
            this.changed = false

            if (this.visible) {
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)

                this.cmpStore.getInstructorsEffect(this.center.id)
                this.initCompVars(this.userPayment, this.userLocker, this.userMembership)
                this.getMembershipItem()
            } else {
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)

                this.cmpStore.resetAll()
            }
        }
    }

    // comp vars funcs
    initCompVars(payment: Payment, userLocker: UserLocker, userMembership: UserMembership) {
        if (payment?.user_membership_id && userMembership != undefined) {
            this.cmpStore.setmembershipTicket(this.cmpStore.initMembershipTicket(payment, userMembership))
        } else if (payment?.user_locker_id && userLocker != undefined) {
            this.cmpStore.setLockerTicket(this.cmpStore.initLockerTicket(payment, userLocker))
        }
    }

    getMembershipItem() {
        if (this.userPayment?.user_membership_id && this.userMembership) {
            this.cmpStore.getMembershipItemEffect({
                centerId: this.center.id,
                categoryId: this.userMembership.membership_category_id,
                itemId: this.userMembership.membership_item_id,
            })
        }
    }

    onMemershipTicketChange(membershipTicket: MembershipTicket) {
        console.log('onMemershipTicketChange : ', membershipTicket)
        this.cmpStore.setmembershipTicket(membershipTicket)
    }

    onLockerTicketChange(lockerTicket: LockerTicket) {
        this.cmpStore.setLockerTicket(lockerTicket)
    }

    // fullmodal vars and funcs
    closeModal() {
        this.close.emit()
    }
    //

    // modify payment
    modifyPayment(btLoadingFns: ClickEmitterType) {
        btLoadingFns.showLoading()
        if (this.userPayment?.user_membership_id) {
            this.cmpStore.modifyMembershipPayment({
                centerId: this.center.id,
                curUser: this.curUser,
                membershipId: this.userMembership.id,
                payment: this.userPayment,
                callback: () => {
                    btLoadingFns.hideLoading()
                    this.closeModal()
                },
            })
        } else {
            this.cmpStore.modifyLockerPayment({
                centerId: this.center.id,
                curUser: this.curUser,
                lockerId: this.userLocker.id,
                payment: this.userPayment,
                callback: () => {
                    btLoadingFns.hideLoading()
                    this.closeModal()
                },
            })
        }
    }
}
