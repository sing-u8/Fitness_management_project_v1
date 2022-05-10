import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { UserMembership } from '@schemas/user-membership'
import { ExtensionOutput } from '../membership-extension-modal/membership-extension-modal.component'
import { ChargeType, ChargeMode, ConfirmOuput } from '@shared/components/common/charge-modal/charge-modal.component'

import _ from 'lodash'
// ngrx
import { Store } from '@ngrx/store'
import * as DashboardReducer from '@centerStore/reducers/sec.dashboard.reducer'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import * as DashboardSelector from '@centerStore/selectors/sec.dashoboard.selector'
import { showToast } from '@appStore/actions/toast.action'

@Component({
    selector: 'db-user-detail-membership',
    templateUrl: './user-detail-membership.component.html',
    styleUrls: ['./user-detail-membership.component.scss'],
})
export class UserDetailMembershipComponent implements OnInit {
    @Input() curUserData: DashboardReducer.CurUseData = _.cloneDeep(DashboardReducer.CurUseDataInit)

    @Output() onRegisterML = new EventEmitter<void>()

    constructor(private nxStore: Store) {}
    // //
    ngOnInit(): void {}

    public chargeMode: ChargeMode = undefined

    public selectedUserMembership: UserMembership = undefined
    setSelectedUserMembership(userMembership: UserMembership) {
        this.selectedUserMembership = userMembership
    }
    public showExtensionModal = false
    toggleExtensionModal() {
        this.showExtensionModal = !this.showExtensionModal
    }
    public extensionModalData: ExtensionOutput = {
        datepick: {
            startDate: '',
            endDate: '',
        },
        countObj: {
            count: '0',
            unlimited: false,
        },
    }
    onExtensionConfirm(output: ExtensionOutput) {
        console.log('onExtensionConfirm - output : ', output)
        this.extensionModalData = output
        this.chargeMode = 'extend'
        this.toggleExtensionModal()
        this.toggleChargeModal()
    }

    public showChargeModal = false
    public chargeData: ChargeType = {
        pay_card: 0,
        pay_cash: 0,
        pay_trans: 0,
        unpaid: 0,
        pay_date: '',
        assignee_id: '',
    }
    toggleChargeModal() {
        this.showChargeModal = !this.showChargeModal
    }
    onChargeConfirm(output: ConfirmOuput) {
        console.log('onChargeConfirm : ', output)
        this.toggleChargeModal()
        this.chargeData = output.chargeType

        output.loadingFns.hideLoading()
    }
}
