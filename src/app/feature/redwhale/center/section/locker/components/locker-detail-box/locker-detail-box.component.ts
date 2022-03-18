import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import * as _ from 'lodash'
import * as dayjs from 'dayjs'

@Component({
    selector: 'rw-locker-detail-box',
    templateUrl: './locker-detail-box.component.html',
    styleUrls: ['./locker-detail-box.component.scss'],
})
export class LockerDetailBoxComponent implements OnInit, OnChanges, OnDestroy {
    // @Input() lockerItem: LockerItem

    // public gym: Gym

    // public lockerGlobalMode: LockerGlobalMode
    public lockerGlobalModeSubscription: Subscription
    public doShowMoveLockerTicketModal: boolean

    public doShowRestartLockerModal: boolean
    public doDropDownShow: boolean
    public doShowRegisterLockerModal: boolean
    public doShowEmptyLockerModal: boolean
    public doDatePickerShow: boolean
    public doShowChangeDateModal: boolean
    public dateEditMode: boolean
    public doShowlockerHistory: boolean
    public doShowChargeModal: boolean
    public doShowAdditionalChargeModal: boolean

    public lockerEmptyTitle: string

    // public willRegisteredMember: GymUser

    public lockerDate: { startDate: string; endDate: string }
    public lockerDateDiff: number

    // public lockerHistoryList: Array<LockerTicketHistory>

    public dateRemain: number

    public statusColor: { border: string; font: string }

    public restartLockerText = {
        text: '사용 불가 설정을 해제하시겠어요?',
        subText: `사용 불가 설정을 해제하시면,
        락커에 다시 회원을 등록하실 수 있어요.`,
        cancelButtonText: '취소',
        confirmButtonText: '사용 불가 해제',
    }
    public moveLockerTicketText: any
    public changeDateText: any

    constructor() {}

    ngOnInit(): void {}
    ngOnChanges(): void {}
    ngOnDestroy(): void {
        this.lockerGlobalModeSubscription.unsubscribe()
    }
}
