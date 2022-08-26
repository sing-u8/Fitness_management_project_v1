import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core'

import _ from 'lodash'
import dayjs from 'dayjs'

import { originalOrder } from '@helpers/pipe/keyvalue'

import { UserMembership } from '@schemas/user-membership'

import { WordService } from '@services/helper/word.service'
import { TimeService } from '@services/helper/time.service'

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

    @Output() onUpdateHolding = new EventEmitter<{ item: UserMembership; holdingIdx: number }>()
    @Output() onRemoveHolding = new EventEmitter<{ item: UserMembership; holdingIdx: number }>()

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
            color: '#C2273B',
            visible: true,
            func: () => {
                this.onRemoveRecord.emit(this.membership)
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

    public holdingMenuDropDownItemObj = {
        updateHoding: {
            name: '홀딩 기간 수정',
            color: 'var(--font-color)',
            visible: true,
            func: (idx: number) => {
                this.onUpdateHolding.emit({ item: this.membership, holdingIdx: idx })
            },
        },
        removeHoding: {
            name: '홀딩 삭제',
            color: 'var(--red)',
            visible: true,
            func: (idx: number) => {
                this.onRemoveHolding.emit({ item: this.membership, holdingIdx: idx })
            },
        },
    }

    public reservableClassText = ''
    public reservableClassFullText = ''
    public showFullClassArrow = false
    public openFullClass = false
    getReservableClassText() {
        // !! 기능 숨김 및 스키마 변경으로 수정 필요
        // if (this.membership.class.length > 1) {
        //     this.showFullClassArrow = true
        //     this.reservableClassText = `${this.wordService.ellipsis(this.membership.class[0].name, 11)} 외 ${
        //         this.membership.class.length - 1
        //     }개`
        //     this.reservableClassFullText = _.reduce(
        //         this.membership.class,
        //         (acc, cur, idx, list) => {
        //             return acc + cur.name + (idx != list.length - 1 ? ', ' : '')
        //         },
        //         ''
        //     )
        // } else {
        //     this.reservableClassText = `${this.wordService.ellipsis(this.membership.class[0].name, 11)}`
        //     if (this.membership.class[0].name.length > 11) {
        //         this.showFullClassArrow = true
        //         this.reservableClassFullText = this.membership.class[0].name
        //     }
        // }
    }
    openShowFullClass() {
        if (this.showFullClassArrow) {
            this.openFullClass = true
        }
    }
    closeShowFullClass() {
        if (this.showFullClassArrow) {
            this.openFullClass = false
        }
    }
    public isHolding = false
    public isExpired = false
    checkIsExpired() {
        if (
            this.membership.state_code == 'user_membership_state_refund' ||
            this.membership.state_code == 'user_membership_state_expired' ||
            this.timeService.getRestPeriod(dayjs().format(), this.membership.end_date) < 1 ||
            (this.membership.count <= 0 && this.membership.unlimited == false)
        ) {
            this.isExpired = true
            this.setMenuDropDownVisible(['removeRecord'], true)
        } else {
            this.isExpired = false
        }
    }

    public restDate = 0

    public showNotificationDropDownObj = {}
    toggleNotificationDropDown(index: number) {
        if (!_.isBoolean(this.showNotificationDropDownObj[index])) {
            this.showNotificationDropDownObj = _.assign(this.showNotificationDropDownObj, { [index]: true })
        } else {
            this.showNotificationDropDownObj[index] = !this.showNotificationDropDownObj[index]
        }
    }
    hideNotificationDropDown(index: number) {
        if (!_.isBoolean(this.showNotificationDropDownObj[index])) {
            this.showNotificationDropDownObj = _.assign(this.showNotificationDropDownObj, { [index]: false })
        } else {
            this.showNotificationDropDownObj[index] = false
        }
    }

    constructor(private wordService: WordService, private timeService: TimeService) {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.checkIsExpired()
        this.getReservableClassText()
        this.restDate = this.timeService.getRestPeriod(dayjs().format(), this.membership.end_date)
        this.restDate = this.restDate < 1 || this.isExpired ? 0 : this.restDate
        this.isHolding = this.membership.holding.length > 0 && !this.isExpired
    }
}
