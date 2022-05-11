import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core'

import _ from 'lodash'
import { originalOrder } from '@helpers/pipe/keyvalue'

import { UserMembership } from '@schemas/user-membership'

@Component({
    selector: 'db-user-detail-membership-item',
    templateUrl: './user-detail-membership-item.component.html',
    styleUrls: ['./user-detail-membership-item.component.scss'],
})
export class UserDetailMembershipItemComponent implements OnInit, AfterViewInit {
    @Input() membership: UserMembership

    @Output() onUpdateInfo = new EventEmitter<UserMembership>()
    @Output() onExtendPeriodCount = new EventEmitter<UserMembership>()
    @Output() onHold = new EventEmitter<UserMembership>()
    @Output() onTransfer = new EventEmitter<UserMembership>()
    @Output() onRefund = new EventEmitter<UserMembership>()
    @Output() onRemoveRecord = new EventEmitter<UserMembership>()

    @Output() onUpdateHolding = new EventEmitter<UserMembership>()
    @Output() onRemoveHolding = new EventEmitter<UserMembership>()

    public originalOrder = originalOrder

    public showMenuDropDown = false
    toggleMenuDropDown() {
        this.showMenuDropDown = !this.showMenuDropDown
    }
    hideMenuDropDown() {
        this.showMenuDropDown = false
    }

    public menuDropDownItemObj = {
        updateInfo: {
            name: '기본 정보 수정',
            color: 'var(--font-color)',
            visible: true,
            func: () => {
                this.onUpdateInfo.emit(this.membership)
            },
        },
        extendPeriodCount: {
            name: '기간 / 횟수 연장',
            color: 'var(--font-color)',
            visible: true,
            func: () => {
                this.onExtendPeriodCount.emit(this.membership)
            },
        },
        hold: {
            name: '홀딩',
            color: 'var(--font-color)',
            visible: true,
            func: () => {
                this.onHold.emit(this.membership)
            },
        },
        transfer: {
            name: '양도',
            color: 'var(--font-color)',
            visible: true,
            func: () => {
                this.onTransfer.emit(this.membership)
            },
        },
        refund: {
            name: '환불',
            color: 'var(--font-color)',
            visible: true,
            func: () => {
                this.onRefund.emit(this.membership)
            },
        },
        removeRecord: {
            name: '기록 삭제',
            color: 'var(--red)',
            visible: true,
            func: () => {
                this.onRemoveRecord.emit(this.membership)
            },
        },
    }

    public showNotificationDropDown = false
    toggleNotificationDropDown() {
        this.showNotificationDropDown = !this.showNotificationDropDown
    }
    hideNotificationDropDown() {
        this.showNotificationDropDown = false
    }
    public holdingMenuDropDownItemObj = {
        updateHoding: {
            name: '홀딩 기간 수정',
            color: 'var(--font-color)',
            visible: true,
            func: () => {
                this.onUpdateHolding.emit(this.membership)
            },
        },
        removeHoding: {
            name: '홀딩 삭제',
            color: 'var(--red)',
            visible: true,
            func: () => {
                this.onRemoveHolding.emit(this.membership)
            },
        },
    }

    public reservableClassText = ''
    public isHolding = false

    constructor() {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.reservableClassText = _.reduce(
            this.membership.class,
            (acc, cur, idx, list) => {
                return acc + cur.name + (idx != list.length - 1 ? ', ' : '')
            },
            ''
        )

        this.isHolding = this.membership.pause_start_date && this.membership.pause_end_date ? true : false
    }
}
