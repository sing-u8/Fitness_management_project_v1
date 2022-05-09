import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core'

import _ from 'lodash'
import { originalOrder } from '@helpers/pipe/keyvalue'

import { UserLocker } from '@schemas/user-locker'
@Component({
    selector: 'db-user-detail-locker-item',
    templateUrl: './user-detail-locker-item.component.html',
    styleUrls: ['./user-detail-locker-item.component.scss'],
})
export class UserDetailLockerItemComponent implements OnInit, AfterViewInit {
    @Input() locker: UserLocker

    @Output() onUpdateInfo = new EventEmitter<UserLocker>()
    @Output() onExtendPeriod = new EventEmitter<UserLocker>()
    @Output() onMovePlace = new EventEmitter<UserLocker>()
    @Output() onHold = new EventEmitter<UserLocker>()
    @Output() onTransfer = new EventEmitter<UserLocker>()
    @Output() onRefund = new EventEmitter<UserLocker>()
    @Output() onRemoveRecord = new EventEmitter<UserLocker>()

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
                this.onUpdateInfo.emit(this.locker)
            },
        },
        extendPeriod: {
            name: '기간 연장',
            color: 'var(--font-color)',
            visible: true,
            func: () => {
                this.onExtendPeriod.emit(this.locker)
            },
        },
        movePlace: {
            name: '자리 이동',
            color: 'var(--font-color)',
            visible: true,
            func: () => {
                this.onMovePlace.emit(this.locker)
            },
        },
        hold: {
            name: '홀딩',
            color: 'var(--font-color)',
            visible: true,
            func: () => {
                this.onHold.emit(this.locker)
            },
        },
        transfer: {
            name: '양도',
            color: 'var(--font-color)',
            visible: true,
            func: () => {
                this.onTransfer.emit(this.locker)
            },
        },
        refund: {
            name: '환불',
            color: 'var(--font-color)',
            visible: true,
            func: () => {
                this.onRefund.emit(this.locker)
            },
        },
        removeRecord: {
            name: '기록 삭제',
            color: 'var(--red)',
            visible: true,
            func: () => {
                this.onRemoveRecord.emit(this.locker)
            },
        },
    }

    public isHolding = false

    constructor() {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.isHolding = this.locker.pause_start_date && this.locker.pause_end_date ? true : false
    }
}
