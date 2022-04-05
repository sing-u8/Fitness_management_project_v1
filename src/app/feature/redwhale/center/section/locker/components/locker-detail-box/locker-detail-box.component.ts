import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import _ from 'lodash'
import dayjs from 'dayjs'

import { StorageService } from '@services/storage.service'
import {
    CenterUsersLockerService,
    CreateLockerTicketReqBody,
    CreateLockerTicketUnpaidReqBody,
} from '@services/center-users-locker.service.service'
import { CenterLockerService } from '@services/center-locker.service'

// schema
import { CenterUser } from '@schemas/center-user'
import { LockerItem } from '@schemas/locker-item'
import { Center } from '@schemas/center'
import { LockerCategory } from '@schemas/locker-category'
import { LockerItemHistory } from '@schemas/locker-item-history'

import { LockerChargeType } from '../../components/locker-charge-modal/locker-charge-modal.component'

// ngrx
import { Store, select } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'

import * as FromLocker from '@centerStore/reducers/sec.locker.reducer'
import * as LockerSelector from '@centerStore/selectors/sec.locker.selector'
import * as LockerActions from '@centerStore/actions/sec.locker.actions'

@Component({
    selector: 'rw-locker-detail-box',
    templateUrl: './locker-detail-box.component.html',
    styleUrls: ['./locker-detail-box.component.scss'],
})
export class LockerDetailBoxComponent implements OnInit, OnChanges, OnDestroy {
    @Input() lockerItem: LockerItem

    public center: Center

    public curLockerCateg: LockerCategory
    public lockerGlobalMode: FromLocker.LockerGlobalMode
    public doShowMoveLockerTicketModal = false

    public doShowRestartLockerModal = false
    public doDropDownShow = false
    public doShowRegisterLockerModal = false
    public doDatePickerShow = false
    public doShowEmptyLockerModal = false
    public doShowChangeDateModal = false
    public dateEditMode = false
    public doShowlockerHistory = false
    public doShowChargeModal = false
    public doShowAdditionalChargeModal = false

    public lockerEmptyTitle = ''

    public willRegisteredMember: CenterUser = undefined

    public lockerDate: { startDate: string; endDate: string } = { startDate: '', endDate: '' }
    public lockerDateDiff: number = undefined

    public lockerHistoryList: Array<LockerItemHistory> = []

    public dateRemain: number = undefined

    public statusColor: { border: string; font: string } = { border: '', font: '' }

    public restartLockerText = {
        text: '사용 불가 설정을 해제하시겠어요?',
        subText: `사용 불가 설정을 해제하시면,
        락커에 다시 회원을 등록하실 수 있어요.`,
        cancelButtonText: '취소',
        confirmButtonText: '사용 불가 해제',
    }
    public moveLockerTicketText: any
    public changeDateText: any

    public unsubscriber$ = new Subject<void>()

    constructor(
        private storageService: StorageService,
        private centerUserLockerService: CenterUsersLockerService,
        private centerLockerService: CenterLockerService,
        private nxStore: Store
    ) {
        this.center = this.storageService.getCenter()
        this.nxStore.pipe(select(LockerSelector.LockerGlobalMode), takeUntil(this.unsubscriber$)).subscribe((lgm) => {
            this.lockerGlobalMode = lgm
        })
        this.nxStore.pipe(select(LockerSelector.curLockerCateg), takeUntil(this.unsubscriber$)).subscribe((clc) => {
            this.curLockerCateg = clc
        })
    }

    ngOnInit(): void {}
    ngOnChanges(): void {
        this.initLockerDateReamin()
        this.initLockerDate()
        this.setStatusColor()
        this.cancelChangeDate()
        this.closeDoDatePickerShow()
        this.getLockerHistory()
        this.willRegisteredMember = undefined
    }
    ngOnDestroy(): void {
        this.unsubscriber$.next()
        this.unsubscriber$.complete()
    }

    // check gloabl locker ticket -  move locker ticket
    checkMoveLockerTicketMode() {
        return this.lockerGlobalMode == 'moveLockerTicket' ? true : false
    }
    // locker history method
    getLockerHistory() {
        this.centerLockerService
            .getItemHistories(this.center.id, this.curLockerCateg.id, this.lockerItem.id)
            .subscribe((histories) => {
                console.log('getLockerHistory : ', histories)
                // this.lockerHistoryList = histories
            })
    }
    //
    initChangeDateText() {
        this.changeDateText = {
            text: `[락커 ${this.lockerItem.name}] 만료일을 변경하시겠어요?`,
            subText: `변경할 만료일을 선택하신 후,
        [변경하기] 버튼을 눌러주세요.`,
            cancelButtonText: '취소',
            confirmButtonText: '변경',
        }
    }
    // lockerdate remain method
    initLockerDateReamin() {
        if (this.lockerItem.user_locker) {
            const date1 = dayjs().format('YYYY-MM-DD')
            const date2 = dayjs(this.lockerItem.user_locker.end_date)
            this.dateRemain = date2.diff(date1, 'day') >= 0 ? date2.diff(date1, 'day') + 1 : date2.diff(date1, 'day')
        } else {
            this.dateRemain = undefined
        }
    }
    // locker date method
    initLockerDate() {
        if (this.lockerItem.user_locker) {
            this.lockerDate.startDate = this.lockerItem.user_locker.start_date
            this.lockerDate.endDate = this.lockerItem.user_locker.end_date
        } else {
            this.resetLockerDate()
        }
    }
    resetLockerDate() {
        this.lockerDate.startDate = dayjs().format('YYYY-MM-DD')
        this.lockerDate.endDate = ''
    }

    // flag method
    toggleDropdown() {
        this.doDropDownShow = !this.doDropDownShow
    }
    closeDropdown() {
        this.doDropDownShow = false
    }

    toggleRegisterLockerModal() {
        this.doShowRegisterLockerModal = !this.doShowRegisterLockerModal
    }
    closeRegisterLockerModal() {
        this.doShowRegisterLockerModal = false
    }
    onRegisterMemberChoose(member: CenterUser) {
        this.willRegisteredMember = member
        this.closeRegisterLockerModal()
    }

    toggleShowEmptyLockerModal() {
        this.lockerEmptyTitle = this.lockerItem.name
        this.doShowEmptyLockerModal = !this.doShowEmptyLockerModal
    }
    closeShowEmptyLockerModal() {
        this.doShowEmptyLockerModal = false
    }
    onEmptyLockerModaConfirm(refund: string) {
        this.emptyLocker(refund)
        this.closeShowEmptyLockerModal()
    }

    openShowlockerHistory() {
        this.doShowlockerHistory = !this.doShowlockerHistory
        this.closeDropdown()
    }
    closeShowlockerHistory() {
        this.doShowlockerHistory = false
    }

    toggleMoveLockerTicketMode() {
        if (this.lockerGlobalMode == 'normal') {
            this.nxStore.dispatch(LockerActions.setLockerGlobalMode({ lockerMode: 'moveLockerTicket' }))
        } else if (this.lockerGlobalMode == 'moveLockerTicket') {
            this.nxStore.dispatch(LockerActions.setLockerGlobalMode({ lockerMode: 'normal' }))
        }
    }
    resetMoveLockerTicketMode() {
        this.nxStore.dispatch(LockerActions.setLockerGlobalMode({ lockerMode: 'normal' }))
    }
    openShowMoveLockerTicketModal() {
        this.moveLockerTicketText = {
            text: `[락커 ${this.lockerItem.name}]으로 자리를 이동하시겠어요?`,
            subText: `이동 버튼을 클릭하시면,
            즉시 회원의 락커 자리가 변경돼요.`,
            cancelButtonText: '취소',
            confirmButtonText: '이동',
        }
        this.doShowMoveLockerTicketModal = true
    }
    closeShowMoveLockerTicketModal() {
        this.doShowMoveLockerTicketModal = false
    }

    toggleShowChargeModal() {
        this.doShowChargeModal = !this.doShowChargeModal
    }
    closeShowChargeModal() {
        this.doShowChargeModal = false
    }
    toggleShowAdditionalChargeModal() {
        this.doShowAdditionalChargeModal = !this.doShowAdditionalChargeModal
    }
    closeShowAdditionalChargeModal() {
        this.doShowAdditionalChargeModal = false
    }

    // strongly coupled ! --->
    toggleDoDatePickerShow() {
        console.log('toggleDoDatePickerShow ----- start', this.doDatePickerShow, 'dateEditMode ----', this.dateEditMode)
        if (this.lockerItem.state_code == 'locker_item_state_empty' || this.dateEditMode == true) {
            this.doDatePickerShow = !this.doDatePickerShow
        } else if (this.lockerItem.state_code == 'locker_item_state_in_use') {
            this.initChangeDateText()
            this.toggleShowChangeDateModal()
        }
    }
    closeDoDatePickerShow() {
        this.doDatePickerShow = false
    }

    toggleShowChangeDateModal() {
        this.doShowChangeDateModal = !this.doShowChangeDateModal
    }
    closeShowChangeDateModal() {
        this.doShowChangeDateModal = false
        this.dateEditMode = false
    }

    onChangeDateModalConfirm() {
        this.doDatePickerShow = true
        this.dateEditMode = true
        this.doShowChangeDateModal = false
    }
    // <---- strongly coupled !
    cancelChangeDate() {
        this.dateEditMode = false
    }

    // 결제 가격 수정되는 방식에 따라 수정 필요!  결제 담당자 에러 때문에  주석 처리 ; 나중에 수정되면 수정하기!
    changeDate(modalReturn: LockerChargeType) {
        // !! API가 달라져서 수정 필요
        // const changeDataReqBody = {
        // }
        // console.log('modalReturn: ' + modalReturn)
        // const reqBody: ModifyLockerTicketRequestBody = {
        //     locker_item_id: Number(this.lockerItem.id),
        //     // start_date: this.lockerDate.startDate,
        //     end_date: this.lockerDate.endDate,
        //     pay_card: modalReturn.pay_card,
        //     pay_cash: modalReturn.pay_cash,
        //     pay_trans: modalReturn.pay_trans,
        //     unpaid: modalReturn.unpaid,
        //     pay_date: modalReturn.pay_date,
        //     assignee_id: modalReturn.assignee_id,
        // }
        // console.log('reqBody: ', reqBody)
        // this.closeShowAdditionalChargeModal()
        // this.gymUserLockerTicketService
        //     .modifyLockerTicket(
        //         this.center.id,
        //         this.lockerItem.locker_ticket.user_id,
        //         this.lockerItem.locker_ticket.id,
        //         reqBody
        //     )
        //     .subscribe((__) => {
        //         this.getLockerItem()
        //         this.globalService.showToast(`[락커 ${this.lockerItem.name}] 만료일이 변경되었습니다.`)
        //     })
    }

    toggleShowRestartLockerModal() {
        this.doShowRestartLockerModal = !this.doShowRestartLockerModal
    }
    closeShowRestartLockerModal() {
        this.doShowRestartLockerModal = false
    }
    setLockerUnavailable() {
        // this.gymLockerState.stopItem(this.center.id, this.curLockerCateg.id, this.lockerItem.id, () => {
        //     this.nxStore.dispatch(showToast({ text: `[락커 ${this.lockerItem.name}]사용 불가 설정되었습니다.` }))
        // })
    }
    setLockerAvailable() {
        // this.gymLockerState.restartItem(this.center.id, this.curLockerCateg.id, this.lockerItem.id, () => {
        //     this.closeShowRestartLockerModal()
        //     this.nxStore.dispatch(showToast({ text: `[락커 ${this.lockerItem.name}]사용 불가 설정이 해제되었습니다.` }))
        // })
    }

    // locker status color method
    setStatusColor() {
        const _statusColor = {
            empty: 'var(--darkgreen)',
            stop: 'var(--darkyellow)',
            use: '#707070',
            exceed: 'var(--darkred)',
        }
        if (this.lockerItem.state_code == 'locker_item_state_empty') {
            this.statusColor = { border: _statusColor.empty, font: _statusColor.empty }
            // this.lockerItem.state_code_name = '사용 가능'
        } else if (this.lockerItem.state_code == 'locker_item_state_stop') {
            this.statusColor = { border: _statusColor.stop, font: _statusColor.stop }
        } else {
            this.statusColor =
                dayjs(this.lockerItem.user_locker.end_date).diff(dayjs(), 'day') < 0
                    ? { border: _statusColor.exceed, font: _statusColor.exceed }
                    : { border: _statusColor.use, font: 'var(--font-color)' }

            // this.lockerItem.status_name =
            //     dayjs(this.lockerItem.user_locker.end_date).diff(dayjs(), 'day') < 0
            //         ? '기간 초과'
            //         : this.lockerItem.status_name
        }
    }

    // on click method in search modal

    isLockerDateExist() {
        console.log('isLockerDateExist: ', this.lockerDate.startDate && this.lockerDate.endDate)
        return this.lockerDate.startDate && this.lockerDate.endDate
    }

    setLockerDate(changedLockerDate: { startDate: string; endDate: string }) {
        this.lockerDate.startDate = changedLockerDate.startDate
        this.lockerDate.endDate = changedLockerDate.endDate

        this.lockerDateDiff = dayjs(this.lockerDate.endDate).diff(dayjs(this.lockerDate.startDate), 'day') + 1
    }

    // !! 추가 수정 필요 03/25
    registerMember(modalReturn: LockerChargeType) {
        const createLockerTicketReqBody: CreateLockerTicketReqBody = {
            locker_item_id: this.lockerItem.id,
            start_date: this.lockerDate.startDate,
            end_date: this.lockerDate.endDate,
            payment: {
                card: modalReturn.pay_card,
                trans: modalReturn.pay_trans,
                vbank: 0,
                phone: 0,
                cash: modalReturn.pay_cash,
            },
        }
        const createLockerTicketUnpaidReqBody: CreateLockerTicketUnpaidReqBody = {
            amount: modalReturn.unpaid,
        }
        this.nxStore.dispatch(
            LockerActions.startCreateLockerTicket({
                centerId: this.center.id,
                registerMemberId: this.willRegisteredMember.id,
                createLockerTicketReqBody,
                createLockerTicketUnpaidReqBody,
            })
        )
        this.closeShowChargeModal()
        this.willRegisteredMember = undefined
        // this.nxStore.dispatch(showToast({ text: `[락커 ${this.lockerItem.name}]에 회원이 등록되었습니다.` }))
    }

    resetRegisterBox() {
        this.willRegisteredMember = undefined
        this.resetLockerDate()
        this.nxStore.dispatch(showToast({ text: `[락커 ${this.lockerItem.name}]입력중인 정보가 초기화되었습니다.` }))
    }

    // // buttonBox2 method
    emptyLocker(_refund: string) {
        let refundPrice = '0'
        if (Number(_refund) > 0) {
            refundPrice = _refund
            this.nxStore.dispatch(
                LockerActions.startRefundLockerTicket({
                    centerId: this.center.id,
                    userId: this.lockerItem.user_locker.user.id,
                    lockerTicketId: this.lockerItem.user_locker.id,
                    reqBody: {
                        amount: refundPrice,
                    },
                })
            )
        } else {
            // this.nxStore.dispatch(
            //     LockerActions.startExpireLockerTicket({
            //         centerId: this.center.id,
            //         userId: this.lockerItem.user_locker.user.id,
            //         lockerTicketId: this.lockerItem.user_locker.id,
            //         reqBody: {
            //             payment: {
            //                 card: 0,
            //                 trans: 0,
            //                 vbank: 0,
            //                 phone: 0,
            //                 cash: 0,
            //             },
            //         },
            //     })
            // )
        }
        //     this.gymUserLockerTicketService
        //         .finishLockerTicket(
        //             this.center.id,
        //             this.lockerItem.locker_ticket.user_id,
        //             this.lockerItem.locker_ticket.id,
        //             {
        //                 refund: refundPrice,
        //             }
        //         )
        //         .subscribe(() => {
        //             this.getLockerItem()
        //             this.globalService.showToast(`[락커 ${this.lockerItem.name}] 락커 비우기가 완료되었습니다.`)
        //         })
    }

    // move locker ticket method
    moveLockerTicket() {}
}
