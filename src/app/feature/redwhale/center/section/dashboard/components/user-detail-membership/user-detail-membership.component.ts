import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { WordService } from '@services/helper/word.service'
import {
    CenterUsersMembershipService,
    ExtendMembershipTicketReqBody,
    RefundMembershipTicketReqBody,
    TransferMembershipTicketReqBody,
    UpdateHoldingMembershipTicketReqBody,
    HoldingMembershipTicketReqBody,
} from '@services/center-users-membership.service'
import { StorageService } from '@services/storage.service'
import { DashboardHelperService } from '@services/center/dashboard-helper.service'

import { Center } from '@schemas/center'
import { UserMembership } from '@schemas/user-membership'
import { ExtensionOutput } from '../membership-extension-modal/membership-extension-modal.component'
import { ChargeType, ChargeMode, ConfirmOuput } from '@shared/components/common/charge-modal/charge-modal.component'
import { HoldingOutput, HoldingConfirmOutput } from '../hold-modal/hold-modal.component'
import { DatePickConfirmOutput } from '@shared/components/common/datepick-modal/datepick-modal.component'
import { CenterUser } from '@schemas/center-user'

import _ from 'lodash'
import dayjs from 'dayjs'

// ngrx
import { Store } from '@ngrx/store'
import * as DashboardReducer from '@centerStore/reducers/sec.dashboard.reducer'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import * as DashboardSelector from '@centerStore/selectors/sec.dashoboard.selector'
import { showToast } from '@appStore/actions/toast.action'
import { catchError } from 'rxjs'

@Component({
    selector: 'db-user-detail-membership',
    templateUrl: './user-detail-membership.component.html',
    styleUrls: ['./user-detail-membership.component.scss'],
})
export class UserDetailMembershipComponent implements OnInit {
    @Input() curUserData: DashboardReducer.CurUseData = _.cloneDeep(DashboardReducer.CurUseDataInit)

    @Output() onRegisterML = new EventEmitter<void>()

    constructor(
        private nxStore: Store,
        private centerUsersMembershipService: CenterUsersMembershipService,
        private storageService: StorageService,
        private wordService: WordService,
        private dashboardHelper: DashboardHelperService
    ) {}
    // //
    ngOnInit(): void {}

    public center: Center = this.storageService.getCenter()

    public chargeMode: ChargeMode = undefined

    public selectedUserMembership: UserMembership = undefined
    public selectedUserMembershipHoldingIdx: number
    setSelectedUserMembership(userMembership: UserMembership, holdingIdx?: number) {
        this.selectedUserMembership = userMembership
        if (_.isNumber(holdingIdx)) {
            this.selectedUserMembershipHoldingIdx = holdingIdx
        }
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
        this.toggleChargeModal()
        this.chargeData = output.chargeType

        if (this.chargeMode == 'extend') {
            this.callExpendApi(() => {
                output.loadingFns.hideLoading()
            })
        } else if (this.chargeMode == 'refund') {
            this.callRefundApi(() => {
                output.loadingFns.hideLoading()
            })
        } else if (this.chargeMode == 'transfer') {
            this.callTransferApi(() => {
                output.loadingFns.hideLoading()
            })
        }
    }

    // hoding function
    public showHoldModal = false
    public holdData: HoldingOutput = undefined
    toggleHoldModal() {
        this.showHoldModal = !this.showHoldModal
    }
    onHoldConfirm(output: HoldingConfirmOutput) {
        this.holdData = output.datepick
        output.loadingFns.showLoading()
        this.callHodingApi(() => {
            output.loadingFns.hideLoading()
            this.toggleHoldModal()
        })
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
        const membershipName = this.wordService.ellipsis(this.selectedUserMembership.name, 15)
        this.showTransferCheckModalText.text = `'${membershipName}' 회원권을
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
        this.refundModalData.text = this.selectedUserMembership
            ? `'${this.wordService.ellipsis(this.selectedUserMembership.name, 6)}' 회원권을 환불하시겠어요?`
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
        this.removeModalData.text = this.selectedUserMembership
            ? `'${this.wordService.ellipsis(this.selectedUserMembership.name, 6)}' 회원권을 삭제하시겠어요?`
            : ''
        this.showRemoveModal = !this.showRemoveModal
    }
    onConfirmRemove() {
        this.callRemoveApi()
        this.showRemoveModal = false
    }

    // modify membership fullmodal
    public showModifyMembershipFullModal = false
    toggleModifyMembershipFullModal() {
        this.showModifyMembershipFullModal = !this.showModifyMembershipFullModal
    }
    confirmModifyMembership() {
        this.showModifyMembershipFullModal = false
    }

    // update, remove hoding funcs
    public showUpdateHoldModal = false
    public updateHoldModalText = {
        text: '',
        subText: '홀딩 기간을 선택하신 후, [수정하기] 버튼을 클릭해주세요.',
        cancelButtonText: '취소',
        confirmButtonText: '홀딩 기간 수정하기',
        startDateText: '홀딩 시작일',
        endDateText: '홀딩 종료일',
    }
    public updateHoldData: HoldingOutput = undefined
    public updateHoldDateInput: HoldingOutput = {
        startDate: '',
        endDate: '',
    }
    toggleUpdateHoldModal(holdingIdx: number) {
        this.updateHoldModalText.text = `'${this.wordService.ellipsis(
            this.selectedUserMembership.name,
            15
        )}' 홀딩 기간을 수정하시겠어요?`
        this.updateHoldDateInput = _.cloneDeep({
            startDate: this.selectedUserMembership.holding[holdingIdx].start_date,
            endDate: this.selectedUserMembership.holding[holdingIdx].end_date,
        })
        this.showUpdateHoldModal = !this.showUpdateHoldModal
    }
    hideUpdateHoldModal() {
        this.showUpdateHoldModal = false
    }
    onUpdateHoldConfirm(output: DatePickConfirmOutput) {
        this.updateHoldData = output.datepick
        output.loadingFns.showLoading()
        this.callUpdateHoldingApi(() => {
            output.loadingFns.hideLoading()
            this.showUpdateHoldModal = false
        })
    }

    public showRemoveHoldModal = false
    public removeHoldingModalData = {
        text: '',
        subText: `홀딩 정보를 삭제하실 경우,
                홀딩중이거나 홀딩 예약된 정보가 모두 삭제돼요.`,
        cancelButtonText: '취소',
        confirmButtonText: '홀딩 정보 삭제',
    }
    toggleRemoveHoldingModal() {
        this.removeHoldingModalData.text = this.selectedUserMembership
            ? `'${this.wordService.ellipsis(this.selectedUserMembership.name, 6)}' 홀딩 정보를 삭제하시겠어요?`
            : ''
        this.showRemoveHoldModal = !this.showRemoveHoldModal
    }
    onConfirmRemoveHolding() {
        this.callRemoveHoldingApi()
        this.showRemoveHoldModal = false
    }

    // api funcs
    callExpendApi(cb?: () => void) {
        const reqBody: ExtendMembershipTicketReqBody = {
            end_date: this.extensionModalData.datepick.endDate,
            count: Number(this.extensionModalData.countObj.count),
            unlimited: this.extensionModalData.countObj.unlimited,
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
            .extendMembershipTicket(this.center.id, this.curUserData.user.id, this.selectedUserMembership.id, reqBody)
            .subscribe({
                next: (userMembership) => {
                    this.nxStore.dispatch(
                        showToast({
                            text: `'${this.wordService.ellipsis(
                                this.selectedUserMembership.name,
                                6
                            )}' 회원권 기간/횟수가 연장되었습니다.`,
                        })
                    )
                    // this.nxStore.dispatch(
                    //     DashboardActions.startGetUserData({ centerId: this.center.id, centerUser: this.curUserData.user })
                    // )
                    this.dashboardHelper.refreshCurUser(this.center.id, this.curUserData.user)
                    cb ? cb() : null
                },
                error: () => {
                    cb ? cb() : null
                },
            })
    }
    callHodingApi(cb?: () => void) {
        const reqBody: HoldingMembershipTicketReqBody = {
            start_date: this.holdData.startDate,
            end_date: this.holdData.endDate,
        }
        this.centerUsersMembershipService
            .holdingMembershipTicket(this.center.id, this.curUserData.user.id, this.selectedUserMembership.id, reqBody)
            .subscribe({
                next: (_) => {
                    const toastText = dayjs(this.holdData.startDate).isSameOrBefore(dayjs())
                        ? `'${this.wordService.ellipsis(this.selectedUserMembership.name, 6)}' 회원권이 홀딩되었습니다.`
                        : `'${this.wordService.ellipsis(
                              this.selectedUserMembership.name,
                              6
                          )}' 회원권이 홀딩이 예약되었습니다.`
                    this.nxStore.dispatch(showToast({ text: toastText }))
                    // this.nxStore.dispatch(
                    //     DashboardActions.startGetUserData({ centerId: this.center.id, centerUser: this.curUserData.user })
                    // )
                    this.dashboardHelper.refreshCurUser(this.center.id, this.curUserData.user)
                    cb ? cb() : null
                },
                error: () => {
                    cb ? cb() : null
                },
            })
    }
    callTransferApi(cb?: () => void) {
        const reqBody: TransferMembershipTicketReqBody = {
            transferee_user_id: this.transferMember.id,
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
        console.log('callTransferApi -- reqBody : ', reqBody)
        this.centerUsersMembershipService
            .transferMembershipTicket(this.center.id, this.curUserData.user.id, this.selectedUserMembership.id, reqBody)
            .subscribe({
                next: () => {
                    this.nxStore.dispatch(
                        showToast({
                            text: `'${this.wordService.ellipsis(
                                this.selectedUserMembership.name,
                                8
                            )}' 회원권이 양도되었습니다.`,
                        })
                    )
                    // this.nxStore.dispatch(
                    //     DashboardActions.startGetUserData({ centerId: this.center.id, centerUser: this.curUserData.user })
                    // )
                    this.dashboardHelper.refreshCurUser(this.center.id, this.curUserData.user)
                    cb ? cb() : null
                },
                error: () => {
                    cb ? cb() : null
                },
            })
    }
    callRefundApi(cb?: () => void) {
        const reqBody: RefundMembershipTicketReqBody = {
            payment: {
                card: this.chargeData.pay_card,
                trans: this.chargeData.pay_trans,
                cash: this.chargeData.pay_cash,
                vbank: 0,
                phone: 0,
                memo: '',
                responsibility_user_id: this.chargeData.assignee_id,
            },
        }
        this.centerUsersMembershipService
            .refundMembershipTicket(this.center.id, this.curUserData.user.id, this.selectedUserMembership.id, reqBody)
            .subscribe({
                next: (_) => {
                    this.nxStore.dispatch(
                        showToast({
                            text: `'${this.wordService.ellipsis(
                                this.selectedUserMembership.name,
                                6
                            )}' 회원권이 환불되었습니다.`,
                        })
                    )
                    // this.nxStore.dispatch(
                    //     DashboardActions.startGetUserData({ centerId: this.center.id, centerUser: this.curUserData.user })
                    // )
                    this.dashboardHelper.refreshCurUser(this.center.id, this.curUserData.user)
                    cb ? cb() : null
                },
                error: () => {
                    cb ? cb() : null
                },
            })
    }
    callRemoveApi(cb?: () => void) {
        this.centerUsersMembershipService
            .deletteMembershipTicket(this.center.id, this.curUserData.user.id, this.selectedUserMembership.id)
            .subscribe({
                next: (_) => {
                    this.nxStore.dispatch(
                        showToast({
                            text: `'${this.wordService.ellipsis(
                                this.selectedUserMembership.name,
                                6
                            )}' 회원권이 삭제되었습니다.`,
                        })
                    )
                    // this.nxStore.dispatch(
                    //     DashboardActions.startGetUserData({ centerId: this.center.id, centerUser: this.curUserData.user })
                    // )
                    this.dashboardHelper.refreshCurUser(this.center.id, this.curUserData.user)
                    cb ? cb() : null
                },
                error: () => {
                    cb ? cb() : null
                },
            })
    }

    callUpdateHoldingApi(cb?: () => void) {
        const reqBody: UpdateHoldingMembershipTicketReqBody = {
            start_date: this.updateHoldData.startDate,
            end_date: this.updateHoldData.endDate,
        }
        this.centerUsersMembershipService
            .modifyHoldingMembershipTicket(
                this.center.id,
                this.curUserData.user.id,
                this.selectedUserMembership.id,
                this.selectedUserMembership.holding[this.selectedUserMembershipHoldingIdx].id,
                reqBody
            )
            .subscribe({
                next: (_) => {
                    const toastText = `'${this.wordService.ellipsis(
                        this.selectedUserMembership.name,
                        6
                    )}' 홀딩 기간이 수정되었습니다.`

                    this.nxStore.dispatch(showToast({ text: toastText }))
                    // this.nxStore.dispatch(
                    //     DashboardActions.startGetUserData({ centerId: this.center.id, centerUser: this.curUserData.user })
                    // )
                    this.dashboardHelper.refreshCurUser(this.center.id, this.curUserData.user)
                    cb ? cb() : null
                },
                error: () => {
                    cb ? cb() : null
                },
            })
    }
    callRemoveHoldingApi(cb?: () => void) {
        this.centerUsersMembershipService
            .removeHoldingMembershipTicket(
                this.center.id,
                this.curUserData.user.id,
                this.selectedUserMembership.id,
                this.selectedUserMembership.holding[this.selectedUserMembershipHoldingIdx].id
            )
            .subscribe({
                next: (_) => {
                    const toastText = `'${this.wordService.ellipsis(
                        this.selectedUserMembership.name,
                        6
                    )}' 홀딩 정보가 삭제되었습니다.`
                    this.nxStore.dispatch(showToast({ text: toastText }))
                    // this.nxStore.dispatch(
                    //     DashboardActions.startGetUserData({ centerId: this.center.id, centerUser: this.curUserData.user })
                    // )
                    this.dashboardHelper.refreshCurUser(this.center.id, this.curUserData.user)
                    cb ? cb() : null
                },
                error: () => {
                    cb ? cb() : null
                },
            })
    }
}
