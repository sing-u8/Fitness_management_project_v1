import { Component, OnInit, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import _ from 'lodash'
import dayjs from 'dayjs'

import { StorageService } from '@services/storage.service'
import { CenterUsersLockerService, CreateLockerTicketReqBody } from '@services/center-users-locker.service.service'
import { CenterLockerService } from '@services/center-locker.service'

// schema
import { CenterUser } from '@schemas/center-user'
import { LockerItem } from '@schemas/locker-item'
import { Center } from '@schemas/center'
import { LockerCategory } from '@schemas/locker-category'
import { LockerItemHistory } from '@schemas/locker-item-history'
import { UserLocker } from '@schemas/user-locker'
import { Loading } from '@schemas/componentStore/loading'

import { LockerChargeType, ConfirmOuput } from '../locker-charge-modal/locker-charge-modal.component'

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
    public center: Center

    public curLockerCateg: LockerCategory
    public lockerGlobalMode: FromLocker.LockerGlobalMode
    public curUserLocker: UserLocker = FromLocker.initialLockerState.curUserLocker
    public curLockerItems: LockerItem[] = FromLocker.initialLockerState.curLockerItemList
    public lockerItem: LockerItem = FromLocker.initialLockerState.curLockerItem
    public curUserLockerIsLoading$ = this.nxStore.select(LockerSelector.curUserLockerIsLoading)

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
        this.nxStore.pipe(select(LockerSelector.curLockerItemList), takeUntil(this.unsubscriber$)).subscribe((clil) => {
            this.curLockerItems = clil
        })
        this.nxStore.pipe(select(LockerSelector.curLockerItem), takeUntil(this.unsubscriber$)).subscribe((cli) => {
            this.lockerItem = cli
            console.log('LockerSelector.curLockerItem : ', cli)
            if (!_.isEmpty(this.lockerItem)) {
                this.cancelChangeDate()
                this.closeDoDatePickerShow()
                this.getLockerHistory()
                this.setStatusColor()
                this.willRegisteredMember = undefined
            }
        })
        this.nxStore.pipe(select(LockerSelector.curUserLocker), takeUntil(this.unsubscriber$)).subscribe((cul) => {
            this.curUserLocker = cul
            this.initLockerDateReamin()
            this.initLockerDate()
        })
    }

    ngOnInit(): void {}
    ngOnChanges(changes: SimpleChanges): void {}
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
                this.lockerHistoryList = histories
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
        if (!_.isEmpty(this.curUserLocker)) {
            const date1 = dayjs().format('YYYY-MM-DD')
            const date2 = dayjs(this.curUserLocker.end_date)
            this.dateRemain = date2.diff(date1, 'day') >= 0 ? date2.diff(date1, 'day') + 1 : date2.diff(date1, 'day')
        } else {
            this.dateRemain = undefined
        }
    }
    // locker date method
    initLockerDate() {
        if (!_.isEmpty(this.curUserLocker)) {
            this.lockerDate.startDate = this.curUserLocker.start_date
            this.lockerDate.endDate = this.curUserLocker.end_date
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
        // this.lockerEmptyTitle = this.lockerItem.name
        this.doShowEmptyLockerModal = !this.doShowEmptyLockerModal
    }
    closeShowEmptyLockerModal() {
        this.doShowEmptyLockerModal = false
    }
    onEmptyLockerModaConfirm(res: ConfirmOuput) {
        this.emptyLocker(res)
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
    changeDate(res: ConfirmOuput) {
        const reqBody = {
            end_date: this.lockerDate.endDate,
            payment: {
                card: res.chargeType.pay_card,
                trans: res.chargeType.pay_trans,
                vbank: 0,
                phone: 0,
                cash: res.chargeType.pay_cash,
                unpaid: res.chargeType.unpaid,
                memo: '',
                responsibility_user_id: res.chargeType.assignee_id,
            },
        }
        this.nxStore.dispatch(
            LockerActions.startExtendLockerTicket({
                centerId: this.center.id,
                userId: this.curUserLocker.user_id,
                lockerTicketId: this.curUserLocker.id,
                reqBody,
                cb: () => {
                    res.loadingFns.hideLoading()
                    this.closeShowAdditionalChargeModal()
                },
            })
        )
    }

    toggleShowRestartLockerModal() {
        this.doShowRestartLockerModal = !this.doShowRestartLockerModal
    }
    closeShowRestartLockerModal() {
        this.doShowRestartLockerModal = false
    }
    setLockerUnavailable() {
        this.nxStore.dispatch(
            LockerActions.startStopItem({
                centerId: this.center.id,
                categoryId: this.curLockerCateg.id,
                selectedItem: this.lockerItem,
                curItemList: _.cloneDeep(this.curLockerItems),
            })
        )
        this.nxStore.dispatch(showToast({ text: `[락커 ${this.lockerItem.name}]사용 불가 설정되었습니다.` }))
    }
    setLockerAvailable() {
        this.closeShowRestartLockerModal()
        this.nxStore.dispatch(
            LockerActions.startResumeItem({
                centerId: this.center.id,
                categoryId: this.curLockerCateg.id,
                selectedItem: this.lockerItem,
                curItemList: _.cloneDeep(this.curLockerItems),
            })
        )
        this.nxStore.dispatch(showToast({ text: `[락커 ${this.lockerItem.name}]사용 불가 설정이 해제되었습니다.` }))
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
        } else if (this.lockerItem.state_code == 'locker_item_state_stop_using') {
            this.statusColor = { border: _statusColor.stop, font: _statusColor.stop }
        } else {
            this.statusColor =
                dayjs(this.lockerItem.user_locker_end_date).diff(dayjs(), 'day') < 0
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

    registerMember(res: ConfirmOuput) {
        const createLockerTicketReqBody: CreateLockerTicketReqBody = {
            locker_item_id: this.lockerItem.id,
            start_date: this.lockerDate.startDate,
            end_date: this.lockerDate.endDate,
            payment: {
                card: res.chargeType.pay_card,
                trans: res.chargeType.pay_trans,
                vbank: 0,
                phone: 0,
                cash: res.chargeType.pay_cash,
                unpaid: res.chargeType.unpaid,
                memo: '',
                responsibility_user_id: res.chargeType.assignee_id,
            },
        }

        this.nxStore.dispatch(
            LockerActions.startCreateLockerTicket({
                centerId: this.center.id,
                registerMemberId: this.willRegisteredMember.id,
                createLockerTicketReqBody,
                cb: () => {
                    res.loadingFns.hideLoading()
                    this.closeShowChargeModal()
                    this.willRegisteredMember = undefined
                },
            })
        )

        // this.nxStore.dispatch(showToast({ text: `[락커 ${this.lockerItem.name}]에 회원이 등록되었습니다.` }))
    }

    resetRegisterBox() {
        this.willRegisteredMember = undefined
        this.resetLockerDate()
        this.nxStore.dispatch(showToast({ text: `[락커 ${this.lockerItem.name}]입력중인 정보가 초기화되었습니다.` }))
    }

    emptyLocker(res: ConfirmOuput) {
        const totalPrice = res.chargeType.pay_cash + res.chargeType.pay_card + res.chargeType.pay_trans
        if (totalPrice > 0) {
            this.nxStore.dispatch(
                LockerActions.startRefundLockerTicket({
                    centerId: this.center.id,
                    userId: this.curUserLocker.user_id,
                    lockerTicketId: this.curUserLocker.id,
                    reqBody: {
                        payment: {
                            card: res.chargeType.pay_card,
                            trans: res.chargeType.pay_trans,
                            vbank: 0,
                            phone: 0,
                            cash: res.chargeType.pay_cash,
                            memo: '',
                            responsibility_user_id: res.chargeType.assignee_id,
                        },
                    },
                    cb: () => {
                        res.loadingFns.hideLoading()
                        this.closeShowEmptyLockerModal()
                    },
                })
            )
        } else {
            this.nxStore.dispatch(
                LockerActions.startExpireLockerTicket({
                    centerId: this.center.id,
                    userId: this.curUserLocker.user_id,
                    lockerTicketId: this.curUserLocker.id,
                    reqBody: {
                        payment: {
                            card: 0,
                            trans: 0,
                            vbank: 0,
                            phone: 0,
                            cash: 0,
                            memo: '',
                            responsibility_user_id: res.chargeType.assignee_id,
                        },
                    },
                    cb: () => {
                        res.loadingFns.hideLoading()
                        this.closeShowEmptyLockerModal()
                    },
                })
            )
        }
    }
}
