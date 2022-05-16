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
}
