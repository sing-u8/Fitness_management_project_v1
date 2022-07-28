import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core'

import _ from 'lodash'
import dayjs from 'dayjs'
import { originalOrder } from '@helpers/pipe/keyvalue'

import { UserLocker } from '@schemas/user-locker'

import { WordService } from '@services/helper/word.service'
import { TimeService } from '@services/helper/time.service'
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
    @Output() onEmpty = new EventEmitter<UserLocker>()
    @Output() onRefund = new EventEmitter<UserLocker>()
    @Output() onRemoveRecord = new EventEmitter<UserLocker>()

    @Output() onUpdateHolding = new EventEmitter<UserLocker>()
    @Output() onRemoveHolding = new EventEmitter<UserLocker>()

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
            name: '비우기',
            color: 'var(--font-color)',
            visible: true,
            func: () => {
                this.onEmpty.emit(this.locker)
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
            color: '#C2273B',
            visible: true,
            func: () => {
                this.onRemoveRecord.emit(this.locker)
            },
        },
    }
    setMenuDropDownVisible(keys: string[], visible: boolean) {
        _.forIn(this.menuDropDownItemObj, (v, k) => {
            if (_.includes(keys, k)) {
                this.menuDropDownItemObj[k]['visible'] = visible
            } else {
                this.menuDropDownItemObj[k]['visible'] = !visible
            }
        })
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
                this.onUpdateHolding.emit(this.locker)
            },
        },
        removeHoding: {
            name: '홀딩 삭제',
            color: 'var(--red)',
            visible: true,
            func: () => {
                this.onRemoveHolding.emit(this.locker)
            },
        },
    }

    public isHolding = false
    public isHoldingReservaed = false

    public isExpired = false
    checkIsExpired() {
        if (
            this.locker.state_code == 'user_locker_state_refund' ||
            this.locker.state_code == 'user_locker_state_expired'
        ) {
            this.isExpired = true
            this.setMenuDropDownVisible(['removeRecord'], true)
        } else {
            this.isExpired = false
        }
    }

    public restDate = 0

    constructor(private wordService: WordService, private timeService: TimeService) {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.checkIsExpired()
        this.restDate = this.timeService.getRestPeriod(dayjs().format(), this.locker.end_date)
        this.restDate = this.restDate < 1 || this.isExpired ? 0 : this.restDate
        this.isHolding = this.locker.pause_start_date && this.locker.pause_end_date && !this.isExpired ? true : false
        this.isHoldingReservaed =
            this.isHolding && dayjs(this.locker.pause_start_date).isAfter(dayjs(), 'day') ? true : false
    }
}
