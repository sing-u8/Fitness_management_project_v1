import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core'
import dayjs from 'dayjs'
import { MembershipTicket, LockerTicket } from '@schemas/gym-dashboard'

// ! 아직 적용 불가
@Component({
    selector: 'rw-dashboard-ticket-card',
    templateUrl: './dashboard-ticket-card.component.html',
    styleUrls: ['./dashboard-ticket-card.component.scss'],
})
export class DashboardTicketCardComponent implements OnInit, AfterViewInit {
    @Input() membershipTicket: MembershipTicket
    @Input() lockerTicket: LockerTicket

    @Output() onMembershipClick = new EventEmitter<MembershipTicket>()
    @Output() onLockerClick = new EventEmitter<LockerTicket>()

    public statusMather = {
        holding: '홀딩중',
        finished: '만료',
        use: '사용중',
        expired: '기간초과',
    }
    public date = { startDate: '', endDate: '' }
    public lockerStatus = ''
    public membershipStatus = ''
    public isSameHoldDate = false
    constructor() {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.initIsSameHoldDate()
        this.initDate()
        this.setStatusText()
    }

    initIsSameHoldDate() {
        if (this.lockerTicket) {
            if (this.lockerTicket.holding_start_date && this.lockerTicket.holding_end_date) {
                this.isSameHoldDate =
                    this.lockerTicket.holding_start_date == this.lockerTicket.holding_end_date ? true : false
            }
        } else {
            if (this.membershipTicket.holding_start_date && this.membershipTicket.holding_end_date) {
                this.isSameHoldDate =
                    this.membershipTicket.holding_start_date == this.membershipTicket.holding_end_date ? true : false
            }
        }
    }

    initDate() {
        if (this.lockerTicket) {
            this.date = {
                startDate: dayjs(this.lockerTicket.start_date).format('YYYY-MM-DD'),
                endDate: dayjs(this.lockerTicket.end_date).format('YYYY-MM-DD'),
            }
        } else {
            this.date = {
                startDate: dayjs(this.membershipTicket.start_date).format('YYYY-MM-DD'),
                endDate: dayjs(this.membershipTicket.end_date).format('YYYY-MM-DD'),
            }
        }
    }

    setStatusText() {
        if (this.membershipTicket) {
            switch (this.membershipTicket.status) {
                case 'use':
                    this.membershipStatus = '사용중'
                    break
                case 'holding':
                    this.membershipStatus = '홀딩중'
                    break
                case 'expired':
                    this.membershipStatus = '만료'
                    break
            }
        } else if (this.lockerTicket) {
            switch (this.lockerTicket.status) {
                case 'use':
                    this.lockerStatus = '사용중'
                    break
                case 'holding':
                    this.lockerStatus = '홀딩중'
                    break
                case 'expired':
                    this.lockerStatus = '기간 초과'
                    break
            }
        }
    }

    onMembershipTicketClick() {
        this.onMembershipClick.emit(this.membershipTicket)
    }

    onLockerTicketClick() {
        this.onLockerClick.emit(this.lockerTicket)
    }
}
