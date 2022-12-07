import { Component, OnInit, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core'

import { ClassItem } from '@schemas/class-item'
import _ from 'lodash'

import { MembershipTicket } from '@schemas/center/dashboard/register-ml-fullmodal'
import { ContractUserMembership } from '@schemas/contract-user-membership'

@Component({
    selector: 'db-membership-ticket-window-registered',
    templateUrl: './membership-ticket-window-registered.component.html',
    styleUrls: ['./membership-ticket-window-registered.component.scss'],
})
export class MembershipTicketWindowRegisteredComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() type: 'register' | 'contract' = 'register'
    @Input() membershipState: MembershipTicket
    @Input() contractUserMembership: ContractUserMembership

    public selectedLessons: Array<ClassItem> = []
    public selectedLessonText = ''

    constructor() {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        if (this.type == 'register') {
            this.getSelectedLessonList()
        }
        console.log('MembershipTicketWindowRegisteredComponent -- ', this.membershipState)
    }
    ngOnChanges(changes: SimpleChanges): void {}
    // selected lesson item method
    getSelectedLessonList() {
        this.selectedLessons = _.map(
            _.filter(this.membershipState.lessonList, ['selected', true]),
            (lessonObj) => lessonObj.item
        )
        if (this.selectedLessons.length == 0) return
        this.selectedLessonText =
            this.selectedLessons.length == 1
                ? `${this.selectedLessons[0].name}`
                : `${this.selectedLessons[0].name} 외 ${this.selectedLessons.length - 1}건`
    }
}
