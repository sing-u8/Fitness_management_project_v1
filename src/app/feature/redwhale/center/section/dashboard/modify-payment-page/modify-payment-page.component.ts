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

import dayjs from 'dayjs'

import { originalOrder } from '@helpers/pipe/keyvalue'
import { StorageService } from '@services/storage.service'

// components
import { ClickEmitterType } from '@schemas/components/button'

import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { Payment } from '@schemas/payment'
import { UserLocker } from '@schemas/user-locker'
import { UserMembership } from '@schemas/user-membership'

// ngrx
import { Store } from '@ngrx/store'
import * as CenterCommonSelector from '@centerStore/selectors/center.common.selector'

// component store
import { MembershipTicket, LockerTicket, TotalPrice } from '@schemas/center/dashboard/modify-payment-fullmodal'
import { ModifyPaymentPageStore } from './componentStore/modify-payment-page.store'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'

@Component({
    selector: 'db-modify-payment-page',
    templateUrl: './modify-payment-page.component.html',
    styleUrls: ['./modify-payment-page.component.scss'],
    providers: [ModifyPaymentPageStore],
})
export class ModifyPaymentPageComponent implements OnInit, OnDestroy {
    public curUser: CenterUser
    public userPayment: Payment
    public userLocker: UserLocker
    public userMembership: UserMembership

    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    //
    public today = dayjs().format('YYYY.MM.DD')
    public center: Center
    public originalOrder = originalOrder

    // component store vars
    public membershipTicket$: Observable<MembershipTicket> = this.cmpStore.membershipTicket$
    public lockerTicket$: Observable<LockerTicket> = this.cmpStore.lockerTicket$
    public totalPrice$: Observable<TotalPrice> = this.cmpStore.totalPrice$
    public totalPriceSum$: Observable<number> = this.cmpStore.totalPriceSum$

    // center common store vars
    public instructors$ = this.nxStore.select(CenterCommonSelector.instructors) // this.cmpStore.instructors$

    constructor(
        private renderer: Renderer2,
        private storageService: StorageService,
        private nxStore: Store,
        public cmpStore: ModifyPaymentPageStore,
        private router: Router
    ) {
        this.center = this.storageService.getCenter()

        this.initCompVars(this.userPayment, this.userLocker, this.userMembership)
        this.getMembershipItem()
    }

    ngOnInit(): void {}
    ngOnDestroy(): void {}
    exitPage() {
        this.router.navigate([this.center.address, 'dashboard'])
    }

    // comp vars funcs
    initCompVars(payment: Payment, userLocker: UserLocker, userMembership: UserMembership) {
        if (payment?.user_membership_id && userMembership != undefined) {
            this.cmpStore.setMembershipTicket(this.cmpStore.initMembershipTicket(payment, userMembership))
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
                userMembership: this.userMembership,
            })
        }
    }

    onMemershipTicketChange(membershipTicket: MembershipTicket) {
        this.cmpStore.setMembershipTicket(membershipTicket)
    }

    onLockerTicketChange(lockerTicket: LockerTicket) {
        this.cmpStore.setLockerTicket(lockerTicket)
    }

    // fullmodal vars and funcs
    closeModal() {
        this.exitPage()
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
                    this.exitPage()
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
                    this.exitPage()
                },
            })
        }
    }
}
