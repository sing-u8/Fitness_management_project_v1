import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { WordService } from '@services/helper/word.service'
import {
    CenterUsersLockerService,
    ExtendLockerTicketReqBody,
    RefundLockerTicketReqBody,
    ExpireLockerTicketReqBody,
    UpdateHoldingLockerTicketReqBody,
    HoldingLockerTicketReqBody,
} from '@services/center-users-locker.service.service'
import { StorageService } from '@services/storage.service'
import { TimeService } from '@services/helper/time.service'
import { DashboardHelperService } from '@services/center/dashboard-helper.service'

import { Center } from '@schemas/center'
import { UserLocker } from '@schemas/user-locker'
import { ExtensionOutput } from '../locker-extension-modal/locker-extension-modal.component'
import { ChargeType, ChargeMode, ConfirmOuput } from '@shared/components/common/charge-modal/charge-modal.component'
import { HoldingOutput, HoldingConfirmOutput } from '../hold-modal/hold-modal.component'
import { DatePickConfirmOutput } from '@shared/components/common/datepick-modal/datepick-modal.component'

import _ from 'lodash'
import dayjs from 'dayjs'

// ngrx
import { Store } from '@ngrx/store'
import * as DashboardReducer from '@centerStore/reducers/sec.dashboard.reducer'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
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
        private storageService: StorageService,
        private timeService: TimeService,
        private dashboardHelper: DashboardHelperService
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
        } else if (this.chargeMode == 'empty_locker_payment') {
            this.callEmptyPaymentApi(() => {
                output.loadingFns.hideLoading()
            })
        } else if (this.chargeMode == 'empty_locker_refund') {
            this.callEmptyRefund(() => {
                output.loadingFns.hideLoading()
            })
        }
    }

    // movePlace function
    public showMovePlaceModal = false
    openMovePlaceModal() {
        this.showMovePlaceModal = !this.showMovePlaceModal
    }
    onConfirmMoveLocker() {
        this.showMovePlaceModal = false
        this.nxStore.dispatch(
            DashboardActions.startGetUserData({ centerId: this.center.id, centerUser: this.curUserData.user })
        )
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

    // Empty function
    public showEmptyModal = false
    public EmptyModalTextData = {
        text: '',
        subText: `추가 결제 또는 환불이 발생한 경우,
            다음 단계에서 금액을 입력해주세요.`,
        cancelButtonText: '취소',
        confirmButtonText: '락커 비우기',
    }
    openEmptyModal() {
        this.EmptyModalTextData.text = `'[${this.wordService.ellipsis(
            this.selectedUserLocker.category_name,
            10
        )}] ${this.wordService.ellipsis(this.selectedUserLocker.name, 13)}'
            락커를 비우시겠어요?`
        this.showEmptyModal = true
    }
    hideEmptyModal() {
        this.showEmptyModal = false
    }
    onConfirmEmptyModal() {
        this.chargeMode =
            this.timeService.getRestPeriod(dayjs().format(), this.selectedUserLocker.end_date) < 0 ||
            this.checkIsLockerExpired()
                ? 'empty_locker_payment'
                : 'empty_locker_refund'
        this.hideEmptyModal()
        this.toggleChargeModal()
    }

    checkIsLockerExpired() {
        return this.timeService.getRestPeriod(dayjs().format(), this.selectedUserLocker.end_date) < 1
    }

    // refund funcs
    public showRefundModal = false
    public refundModalData = {
        text: '',
        subText: `정확한 매출 집계를 위해
            다음 단계에서 환불 금액을 입력해주세요.`,
        cancelButtonText: '취소',
        confirmButtonText: '락커 환불',
    }
    toggleShowRefundModal() {
        this.refundModalData.text = this.selectedUserLocker
            ? `'[${this.wordService.ellipsis(this.selectedUserLocker.category_name, 10)}] ${this.wordService.ellipsis(
                  this.selectedUserLocker.name,
                  6
              )}'
              락커를 환불하시겠어요?`
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
        subText: `해당 락커에 대한 모든 정보가 삭제되며,
                다시 복구하실 수 없어요.`,
        cancelButtonText: '취소',
        confirmButtonText: '락커 삭제',
    }
    toggleRemoveModal() {
        this.removeModalData.text = this.selectedUserLocker
            ? `'[${this.wordService.ellipsis(this.selectedUserLocker.category_name, 10)}] ${this.wordService.ellipsis(
                  this.selectedUserLocker.name,
                  6
              )}' 락커를 삭제하시겠어요?`
            : ''
        this.showRemoveModal = !this.showRemoveModal
    }
    onConfirmRemove() {
        this.callRemoveApi()
        this.showRemoveModal = false
    }

    // modify Locker fullmodal
    public showModifyLockerFullModal = false
    toggleModifyLockerFullModal() {
        this.showModifyLockerFullModal = !this.showModifyLockerFullModal
    }
    confirmModifyLocker() {
        this.showModifyLockerFullModal = false
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
    toggleUpdateHoldModal() {
        this.updateHoldModalText.text = `'[${this.wordService.ellipsis(
            this.selectedUserLocker.category_name,
            10
        )}] ${this.wordService.ellipsis(this.selectedUserLocker.name, 15)}' 홀딩 기간을 수정하시겠어요?`
        this.updateHoldDateInput = _.cloneDeep({
            startDate: this.selectedUserLocker.pause_start_date,
            endDate: this.selectedUserLocker.pause_end_date,
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
        this.removeHoldingModalData.text = this.selectedUserLocker
            ? `'[${this.wordService.ellipsis(this.selectedUserLocker.category_name, 10)}] ${this.wordService.ellipsis(
                  this.selectedUserLocker.name,
                  6
              )}'
              홀딩 정보를 삭제하시겠어요?`
            : ''
        this.showRemoveHoldModal = !this.showRemoveHoldModal
    }
    onConfirmRemoveHolding() {
        this.callRemoveHoldingApi()
        this.showRemoveHoldModal = false
    }

    // api funcs
    callExpendApi(cb?: () => void) {
        const reqBody: ExtendLockerTicketReqBody = {
            end_date: this.extensionModalData.datepick.endDate,
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
            .extendLockerTicket(this.center.id, this.curUserData.user.id, this.selectedUserLocker.id, reqBody)
            .subscribe({
                next: (userMembership) => {
                    this.nxStore.dispatch(
                        showToast({
                            text: `'[${this.wordService.ellipsis(
                                this.selectedUserLocker.category_name,
                                10
                            )}] ${this.wordService.ellipsis(this.selectedUserLocker.name, 6)}' 기간이 연장되었습니다.`,
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
        const reqBody: HoldingLockerTicketReqBody = {
            start_date: this.holdData.startDate,
            end_date: this.holdData.endDate,
        }
        this.centerUsersLockerService
            .holdingLockerTicket(this.center.id, this.curUserData.user.id, this.selectedUserLocker.id, reqBody)
            .subscribe({
                next: (_) => {
                    const toastText = dayjs(this.holdData.startDate).isSameOrBefore(dayjs())
                        ? `'[${this.wordService.ellipsis(
                              this.selectedUserLocker.category_name,
                              10
                          )}] ${this.wordService.ellipsis(this.selectedUserLocker.name, 6)}' 락커 홀딩되었습니다.`
                        : `'[${this.wordService.ellipsis(
                              this.selectedUserLocker.category_name,
                              10
                          )}] ${this.wordService.ellipsis(
                              this.selectedUserLocker.name,
                              6
                          )}' 락커 홀딩이 예약되었습니다.`
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
    callEmptyRefund(cb?: () => void) {
        const reqBody: RefundLockerTicketReqBody = {
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
        this.centerUsersLockerService
            .refundLockerTicket(this.center.id, this.curUserData.user.id, this.selectedUserLocker.id, reqBody)
            .subscribe({
                next: (_) => {
                    this.nxStore.dispatch(
                        showToast({
                            text: `'[${this.wordService.ellipsis(
                                this.selectedUserLocker.category_name,
                                10
                            )}] ${this.wordService.ellipsis(
                                this.selectedUserLocker.name,
                                6
                            )}' 비우기가 완료되었습니다.`,
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
    callEmptyPaymentApi(cb?: () => void) {
        const reqBody: ExpireLockerTicketReqBody = {
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
        this.centerUsersLockerService
            .expireLockerTicket(this.center.id, this.curUserData.user.id, this.selectedUserLocker.id, reqBody)
            .subscribe({
                next: (_) => {
                    this.nxStore.dispatch(
                        showToast({
                            text: `'[${this.wordService.ellipsis(
                                this.selectedUserLocker.category_name,
                                10
                            )}] ${this.wordService.ellipsis(
                                this.selectedUserLocker.name,
                                6
                            )}' 비우기가 완료되었습니다.`,
                        })
                    )
                    this.dashboardHelper.refreshCurUser(this.center.id, this.curUserData.user)
                    // this.nxStore.dispatch(
                    //     DashboardActions.startGetUserData({
                    //         centerId: this.center.id,
                    //         centerUser: this.curUserData.user,
                    //     })
                    // )
                    cb ? cb() : null
                },
                error: () => {
                    cb ? cb() : null
                },
            })
    }
    callRefundApi(cb?: () => void) {
        const reqBody: RefundLockerTicketReqBody = {
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
        this.centerUsersLockerService
            .refundLockerTicket(this.center.id, this.curUserData.user.id, this.selectedUserLocker.id, reqBody)
            .subscribe({
                next: (_) => {
                    this.nxStore.dispatch(
                        showToast({
                            text: `'[${this.wordService.ellipsis(
                                this.selectedUserLocker.category_name,
                                10
                            )}] ${this.wordService.ellipsis(this.selectedUserLocker.name, 6)}' 락커가 환불되었습니다.`,
                        })
                    )
                    this.dashboardHelper.refreshCurUser(this.center.id, this.curUserData.user)
                    // this.nxStore.dispatch(
                    //     DashboardActions.startGetUserData({ centerId: this.center.id, centerUser: this.curUserData.user })
                    // )
                    cb ? cb() : null
                },
                error: () => {
                    cb ? cb() : null
                },
            })
    }
    callRemoveApi(cb?: () => void) {
        this.centerUsersLockerService
            .deleteLockerTicket(this.center.id, this.curUserData.user.id, this.selectedUserLocker.id)
            .subscribe({
                next: (_) => {
                    this.nxStore.dispatch(
                        showToast({
                            text: `'[${this.wordService.ellipsis(
                                this.selectedUserLocker.category_name,
                                10
                            )}] ${this.wordService.ellipsis(this.selectedUserLocker.name, 6)}' 락커가 삭제되었습니다.`,
                        })
                    )
                    this.dashboardHelper.refreshCurUser(this.center.id, this.curUserData.user)
                    // this.nxStore.dispatch(
                    //     DashboardActions.startGetUserData({ centerId: this.center.id, centerUser: this.curUserData.user })
                    // )
                    cb ? cb() : null
                },
                error: () => {
                    cb ? cb() : null
                },
            })
    }
    callUpdateHoldingApi(cb?: () => void) {
        const reqBody: UpdateHoldingLockerTicketReqBody = {
            start_date: this.updateHoldData.startDate,
            end_date: this.updateHoldData.endDate,
        }
        // this.centerUsersLockerService
        //     .modifyHoldingLockerTicket(this.center.id, this.curUserData.user.id, this.selectedUserLocker.id, reqBody)
        //     .subscribe({
        //         next: (_) => {
        //             const toastText = `'[${this.wordService.ellipsis(
        //                 this.selectedUserLocker.category_name,
        //                 10
        //             )}] ${this.wordService.ellipsis(this.selectedUserLocker.name, 6)}' 홀딩 기간이 수정되었습니다.`

        //             this.nxStore.dispatch(showToast({ text: toastText }))
        //             // this.nxStore.dispatch(
        //             //     DashboardActions.startGetUserData({ centerId: this.center.id, centerUser: this.curUserData.user })
        //             // )
        //             this.dashboardHelper.refreshCurUser(this.center.id, this.curUserData.user)
        //         },
        //         error: () => {
        //             cb ? cb() : null
        //         },
        //     })
    }
    callRemoveHoldingApi(cb?: () => void) {
        // this.centerUsersLockerService
        //     .removeHoldingLockerTicket(this.center.id, this.curUserData.user.id, this.selectedUserLocker.id)
        //     .subscribe({
        //         next: (_) => {
        //             const toastText = `'[${this.wordService.ellipsis(
        //                 this.selectedUserLocker.category_name,
        //                 10
        //             )}] ${this.wordService.ellipsis(this.selectedUserLocker.name, 6)}' 홀딩 정보가 삭제되었습니다.`
        //             this.nxStore.dispatch(showToast({ text: toastText }))
        //             // this.nxStore.dispatch(
        //             //     DashboardActions.startGetUserData({ centerId: this.center.id, centerUser: this.curUserData.user })
        //             // )
        //             this.dashboardHelper.refreshCurUser(this.center.id, this.curUserData.user)
        //             cb ? cb() : null
        //         },
        //         error: () => {
        //             cb ? cb() : null
        //         },
        //     })
    }
}
