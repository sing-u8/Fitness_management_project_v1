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
import { WordService } from '@services/helper/word.service'
import { DashboardHelperService } from '@services/center/dashboard-helper.service'

import { Payment } from '@schemas/payment'
import { Center } from '@schemas/center'
import { ChargeType, ChargeMode, ConfirmOuput } from '@shared/components/common/charge-modal/charge-modal.component'
import { UserLocker } from '@schemas/user-locker'
import { UserMembership } from '@schemas/user-membership'
import { ClickEmitterType } from '@schemas/components/button'

import _ from 'lodash'
// ngrx
import { Store } from '@ngrx/store'
import * as DashboardReducer from '@centerStore/reducers/sec.dashboard.reducer'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import * as DashboardSelector from '@centerStore/selectors/sec.dashboard.selector'
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
        private storageService: StorageService,
        private wordService: WordService,
        private dashboardHelper: DashboardHelperService
    ) {}

    ngOnInit(): void {}

    public center: Center = this.storageService.getCenter()

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
        this.selectedUserLocker = this.curUserData.lockers.find((v) => v.id == this.selectedPayment.user_locker_id)
        this.selectedUserMembership = undefined
    }
    public selectedUserMembership: UserMembership = undefined
    getPaymentMembershipItem() {
        this.selectedUserMembership = this.curUserData.memberships.find(
            (v) => v.id == this.selectedPayment.user_membership_id
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

    // charge modal
    public chargeInput = { pay_card: '', pay_cash: '', pay_trans: '', unpaid: '' }
    public chargeMode: ChargeMode = undefined
    public showChargeModal = false
    public chargeData: ChargeType = {
        pay_card: 0,
        pay_cash: 0,
        pay_trans: 0,
        unpaid: 0,
        pay_date: '',
        assignee_id: '',
    }
    openChargeModal(chargeMode: ChargeMode) {
        this.chargeMode = chargeMode
        this.chargeInput = {
            pay_card: this.selectedPayment.card.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            pay_cash: this.selectedPayment.cash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            pay_trans: this.selectedPayment.trans.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            unpaid: this.selectedPayment.unpaid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        }
        this.showChargeModal = true
    }
    hideChargeModal() {
        this.showChargeModal = false
    }
    onChargeConfirm(output: ConfirmOuput) {
        this.showChargeModal = false
        this.chargeData = output.chargeType

        if (this.chargeMode == 'modify_refund_payment' || this.chargeMode == 'modify_transfer_payment') {
            this.callModifyPaymentApi(() => {
                output.loadingFns.hideLoading()
            })
        }
    }

    callModifyPaymentApi(cb?: () => void) {
        const text = this.chargeMode == 'modify_refund_payment' ? '환불 정보가' : '양도 정보가'
        if (this.selectedPayment.user_membership_id) {
            const reqBody: UpdateMembershipTicketPaymentReqBody = {
                payment: {
                    card: this.chargeData.pay_card,
                    trans: this.chargeData.pay_trans,
                    cash: this.chargeData.pay_cash,
                    unpaid: this.chargeData.unpaid,
                    vbank: 0,
                    phone: 0,
                    memo: '',
                    responsibility_user_id: this.chargeData.assignee_id,
                },
            }
            this.centerUsersMembershipService
                .updateMembershipTicketPayment(
                    this.center.id,
                    this.curUserData.user.id,
                    this.selectedPayment.user_membership_id,
                    this.selectedPayment.id,
                    reqBody
                )
                .subscribe({
                    next: () => {
                        const toastText = `'${this.wordService.ellipsis(
                            this.selectedPayment.user_membership_name,
                            6
                        )}' ${text} 수정되었습니다.`

                        this.nxStore.dispatch(showToast({ text: toastText }))
                        this.dashboardHelper.refreshCurUser(this.center.id, this.curUserData.user)
                        cb ? cb() : null
                    },
                    error: () => {
                        cb ? cb() : null
                    },
                })
        } else {
            const reqBody: UpdateLockerTicektPaymentReqBody = {
                payment: {
                    card: this.chargeData.pay_card,
                    trans: this.chargeData.pay_trans,
                    cash: this.chargeData.pay_cash,
                    unpaid: this.chargeData.unpaid,
                    vbank: 0,
                    phone: 0,
                    memo: '',
                    responsibility_user_id: this.chargeData.assignee_id,
                },
            }
            this.centerUsersLockerService
                .updateLockerTicketPayment(
                    this.center.id,
                    this.curUserData.user.id,
                    this.selectedPayment.user_locker_id,
                    this.selectedPayment.id,
                    reqBody
                )
                .subscribe({
                    next: () => {
                        const toastText = `'${this.wordService.ellipsis(
                            this.selectedPayment.user_locker_name,
                            6
                        )}' ${text} 수정되었습니다.`

                        this.nxStore.dispatch(showToast({ text: toastText }))
                        this.dashboardHelper.refreshCurUser(this.center.id, this.curUserData.user)
                        cb ? cb() : null
                    },
                    error: () => {
                        cb ? cb() : null
                    },
                })
        }
    }

    // remove payment vars and funcs
    public showRemovePaymentModal = false
    openRemovePaymentModal() {
        this.showRemovePaymentModal = true
    }
    closeRemovePaymentModal() {
        this.showRemovePaymentModal = false
    }

    onRemovePaymentCancel() {
        this.closeRemovePaymentModal()
    }
    onRemovePaymentConfirm(e: ClickEmitterType) {
        e.showLoading()
        if (this.selectedPayment.user_membership_id) {
            this.centerUsersMembershipService
                .removeMembershipTicketPayment(
                    this.center.id,
                    this.curUserData.user.id,
                    this.selectedPayment.user_membership_id,
                    this.selectedPayment.id
                )
                .subscribe({
                    next: () => {
                        const itemName =
                            this.selectedPayment.user_membership_name ?? this.selectedPayment.user_membership_name
                        const toastText = `'${this.wordService.ellipsis(itemName, 8)}' 결제 내역이 삭제되었습니다.`
                        this.nxStore.dispatch(showToast({ text: toastText }))
                        this.dashboardHelper.refreshCurUser(this.center.id, this.curUserData.user)
                        this.closeRemovePaymentModal()
                        e.hideLoading()
                    },
                    error: () => {
                        this.closeRemovePaymentModal()
                        e.hideLoading()
                    },
                })
        } else if (this.selectedPayment.user_locker_id) {
            this.centerUsersLockerService
                .removeLockerTicketPayment(
                    this.center.id,
                    this.curUserData.user.id,
                    this.selectedPayment.user_locker_id,
                    this.selectedPayment.id
                )
                .subscribe({
                    next: () => {
                        const itemName =
                            this.selectedPayment.user_membership_name ?? this.selectedPayment.user_locker_name
                        const toastText = `'${this.wordService.ellipsis(itemName, 8)}' 결제 내역이 삭제되었습니다.`
                        this.nxStore.dispatch(showToast({ text: toastText }))
                        this.dashboardHelper.refreshCurUser(this.center.id, this.curUserData.user)
                        this.closeRemovePaymentModal()
                        e.hideLoading()
                    },
                    error: () => {
                        this.closeRemovePaymentModal()
                        e.hideLoading()
                    },
                })
        }
    }
}
