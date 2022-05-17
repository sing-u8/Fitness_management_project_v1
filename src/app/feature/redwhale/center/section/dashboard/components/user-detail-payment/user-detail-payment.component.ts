import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import {
    CenterUsersMembershipService,
    UpdateMembershipTicketPaymentReqBody,
} from '@services/center-users-membership.service'
import {
    CenterUsersLockerService,
    UpdateLockerTicektPaymentReqBody,
} from '@services/center-users-locker.service.service'
import { StorageService } from '@services/storage.service'

import { Payment } from '@schemas/payment'
import { Center } from '@schemas/center'
import { ChargeType, ChargeMode, ConfirmOuput } from '@shared/components/common/charge-modal/charge-modal.component'
import { UserLocker } from '@schemas/user-locker'
import { UserMembership } from '@schemas/user-membership'

import _ from 'lodash'
// ngrx
import { Store } from '@ngrx/store'
import * as DashboardReducer from '@centerStore/reducers/sec.dashboard.reducer'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import * as DashboardSelector from '@centerStore/selectors/sec.dashoboard.selector'
import { showToast } from '@appStore/actions/toast.action'
@Component({
    selector: 'db-user-detail-payment',
    templateUrl: './user-detail-payment.component.html',
    styleUrls: ['./user-detail-payment.component.scss'],
})
export class UserDetailPaymentComponent implements OnInit {
    @Input() curUserData: DashboardReducer.CurUseData = _.cloneDeep(DashboardReducer.CurUseDataInit)

    @Output() onRegisterML = new EventEmitter<void>()
    constructor(
        private nxStore: Store,
        private centerUsersMembershipService: CenterUsersMembershipService,
        private centerUsersLockerService: CenterUsersLockerService,
        private storageService: StorageService
    ) {}

    ngOnInit(): void {}

    public center: Center = this.storageService.getCenter()

    public chargeMode: ChargeMode = undefined

    public selectedPayment: Payment = undefined
    setSelectedPayment(payment: Payment) {
        this.selectedPayment = payment
    }

    getPaymentLockerOrMembership() {
        if (this.selectedPayment.user_membership_id) {
            this.getPaymentMembershipItem()
        } else {
            this.getPaymentLockerItem()
        }
    }
    public selectedUserLocker: UserLocker = undefined
    getPaymentLockerItem() {
        this.selectedUserLocker = this.curUserData.lockers.find(
            (v) => v.payment.findIndex((pv) => pv.id == this.selectedPayment.id) != -1
        )
        this.selectedUserMembership = undefined
    }
    public selectedUserMembership: UserMembership = undefined
    getPaymentMembershipItem() {
        this.selectedUserMembership = this.curUserData.memberships.find(
            (v) => v.payment.findIndex((pv) => pv.id == this.selectedPayment.id) != -1
        )
        this.selectedUserLocker = undefined
    }

    // modify pyament fullmodal
    public showModifyPaymentFullModal = false
    toggleModifyPaymentFullModal() {
        this.showModifyPaymentFullModal = !this.showModifyPaymentFullModal
    }
    confirmModifyPayment() {
        this.showModifyPaymentFullModal = false
    }
}
