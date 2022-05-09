import { Component, OnInit, Input, Output, AfterViewInit } from '@angular/core'

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

    public originalOrder = originalOrder

    public ShowMenuDropDown = false
    public menuDropDownItemObj = {
        updateInfo: {
            name: '기본 정보 수정',
            color: 'var(--font-color)',
            visible: true,
            func: () => {},
        },
        extendPeriodCount: {
            name: '기간 / 횟수 연장',
            color: 'var(--font-color)',
            visible: true,
            func: () => {},
        },
        hold: {
            name: '홀딩',
            color: 'var(--font-color)',
            visible: true,
            func: () => {},
        },
        transfer: {
            name: '양도',
            color: 'var(--font-color)',
            visible: true,
            func: () => {},
        },
        refund: {
            name: '환불',
            color: 'var(--font-color)',
            visible: true,
            func: () => {},
        },
        removeRecord: {
            name: '기록 삭제',
            color: 'var(--red)',
            visible: true,
            func: () => {},
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
