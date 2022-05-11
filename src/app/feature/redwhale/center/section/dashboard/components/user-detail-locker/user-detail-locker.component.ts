import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { WordService } from '@services/helper/word.service'
import { CenterUsersLockerService } from '@services/center-users-locker.service.service'
import { StorageService } from '@services/storage.service'

import { Center } from '@schemas/center'
import { UserLocker } from '@schemas/user-locker'
import { ExtensionOutput } from '../locker-extension-modal/locker-extension-modal.component'
import { ChargeType, ChargeMode, ConfirmOuput } from '@shared/components/common/charge-modal/charge-modal.component'
import { HoldingOutput, HoldingConfirmOutput } from '../hold-modal/hold-modal.component'
import { CenterUser } from '@schemas/center-user'

import _ from 'lodash'
// ngrx
import { Store } from '@ngrx/store'
import * as DashboardReducer from '@centerStore/reducers/sec.dashboard.reducer'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import * as DashboardSelector from '@centerStore/selectors/sec.dashoboard.selector'
import { showToast } from '@appStore/actions/toast.action'

@Component({
    selector: 'db-user-detail-locker',
    templateUrl: './user-detail-locker.component.html',
    styleUrls: ['./user-detail-locker.component.scss'],
})
export class UserDetailLockerComponent implements OnInit {
    @Input() curUserData: DashboardReducer.CurUseData = _.cloneDeep(DashboardReducer.CurUseDataInit)

    @Output() onRegisterML = new EventEmitter<void>()
    constructor(
        private nxStore: Store,
        private wordService: WordService,
        private centerUsersLockerService: CenterUsersLockerService,
        private storageService: StorageService
    ) {}

    ngOnInit(): void {}

    public center: Center = this.storageService.getCenter()

    public chargeMode: ChargeMode = undefined

    public selectedUserLocker: UserLocker = undefined
    setSelectedUserLocker(userLocker: UserLocker) {
        this.selectedUserLocker = userLocker
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

        // !! 타입별로 호출할 함수 나누기
    }

    // hoding function
    public showHoldModal = false
    public holdData: HoldingOutput = undefined
    toggleHoldModal() {
        this.showHoldModal = !this.showHoldModal
    }
    onHoldConfirm(output: HoldingConfirmOutput) {
        this.toggleHoldModal()
        this.holdData = output.datepick
    }

    // transter function
    public showTransferModal = false
    public transferMember: CenterUser = undefined
    toggleShowTransferModal() {
        this.showTransferModal = !this.showTransferModal
    }
    onTransferMemberConfirm(centerUser: CenterUser) {
        this.toggleShowTransferModal()
        this.transferMember = centerUser
        this.showTransferCheckModalText.text = `'${this.wordService.ellipsis(
            this.selectedUserLocker.name,
            15
        )}' 회원권을
            ${this.transferMember.center_user_name}님에게 양도하시겠어요?`
        this.toggleTransferCheckModal()
    }

    public showTransferCheckModal = false
    public showTransferCheckModalText = {
        text: '',
        subText: `양도 시, 예약 내역 및 결제 내역을
                제외한 모든 정보가 양도돼요.`,
        cancelButtonText: '취소',
        confirmButtonText: '회원권 양도',
    }
    toggleTransferCheckModal() {
        this.showTransferCheckModal = !this.showTransferCheckModal
    }
    onConfirmTransferCheck() {
        this.chargeMode = 'transfer'
        this.toggleTransferCheckModal()
        this.toggleChargeModal()
    }

    // refund funcs
    public showRefundModal = false
    public refundModalData = {
        text: '',
        subText: `정확한 매출 집계를 위해
            다음 단계에서 환불 금액을 입력해주세요.`,
        cancelButtonText: '취소',
        confirmButtonText: '회원권 환불',
    }
    toggleShowRefundModal() {
        this.refundModalData.text = this.selectedUserLocker
            ? `'${this.wordService.ellipsis(this.selectedUserLocker.name, 6)}' 회원권을 환불하시겠어요?`
            : ''
        this.showRefundModal = !this.showRefundModal
    }
    onConfirmRefund() {
        this.chargeMode = 'refund'
        this.showRefundModal = false
        this.toggleChargeModal()
    }

    // remove funcs
    public showRemoveModal = false
    public removeModalData = {
        text: '',
        subText: `해당 회원권에 대한 모든 정보가 삭제되며,
                다시 복구하실 수 없어요.`,
        cancelButtonText: '취소',
        confirmButtonText: '회원권 삭제',
    }
    toggleRemoveModal() {
        this.removeModalData.text = this.selectedUserLocker
            ? `'${this.wordService.ellipsis(this.selectedUserLocker.name, 6)}' 회원권을 삭제하시겠어요?`
            : ''
        this.showRemoveModal = !this.showRemoveModal
    }
    onConfirmRemove() {
        this.showRemoveModal = false
    }

    // api funcs
    callExpendApi(cb?: () => void) {}
    callHodingApi(cb?: () => void) {}
    callTransferApi(cb?: () => void) {}
    callRefundApi(cb?: () => void) {}
    callRemoveApi(cb?: () => void) {}
}
