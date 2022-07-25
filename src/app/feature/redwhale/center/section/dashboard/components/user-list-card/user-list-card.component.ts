import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core'
import { Subject, Subscription } from 'rxjs'
import { distinctUntilChanged, debounceTime } from 'rxjs/operators'

import dayjs from 'dayjs'

import { GlobalService } from '@services/global.service'
import { TimeService } from '@services/helper/time.service'

import * as FromDashboardReducer from '@centerStore/reducers/sec.dashboard.reducer'

import { CenterUser } from '@schemas/center-user' // !! 나중에 다른 스키마로 수정해야할 필요가 있음

@Component({
    selector: 'db-user-list-card',
    templateUrl: './user-list-card.component.html',
    styleUrls: ['./user-list-card.component.scss'],
})
export class UserListCardComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    @Input() cardItem: { user: CenterUser; holdSelected: boolean }
    @Input() type: FromDashboardReducer.MemberSelectCateg
    @Input() holdMode: boolean
    @Input() holdNumber: number
    @Input() search: string

    public doHide = false
    public searchSubject = new Subject<string>()
    public searchSubscription: Subscription
    @Output() onCardClick = new EventEmitter<CenterUser>()
    @Output() onHoldClick = new EventEmitter<boolean>()

    public attendanceTime = undefined

    clickCard() {
        this.onCardClick.emit(this.cardItem.user)
    }

    toggleHold() {
        if (this.holdNumber >= 500 && !this.cardItem.holdSelected) {
            this.globalService.showToast('일부 회원 홀딩 시, 최대 500명까지 선택하실 수 있어요.')
        } else {
            // this.cardItem.holdSelected = !this.cardItem.holdSelected
            this.onHoldClick.emit(this.cardItem.holdSelected)
        }
    }

    constructor(private globalService: GlobalService, private timeService: TimeService) {
        this.searchSubscription = this.searchSubject
            .asObservable()
            .pipe(distinctUntilChanged(), debounceTime(200))
            .subscribe((value) => {
                this.doHide = !(
                    this.cardItem.user.center_user_name.includes(value) ||
                    this.cardItem.user.phone_number.includes(value)
                )
            })
    }

    ngOnInit(): void {}
    ngOnChanges() {
        this.searchSubject.next(this.search ?? '')
    }
    ngAfterViewInit(): void {
        this.initAttendanceTime()
        this.findEndDateToExpired(7)
    }
    ngOnDestroy(): void {
        this.searchSubscription.unsubscribe()
    }

    //
    public imminentDateObj = {
        isImminent: false,
        imminentDate: 0,
    }
    findEndDateToExpired(dateToExpired: number) {
        const remainDate = this.timeService.getRestPeriod(dayjs().format(), this.cardItem.user.user_membership_end_date)
        if (remainDate <= dateToExpired) {
            this.imminentDateObj = {
                isImminent: true,
                imminentDate: remainDate,
            }
        } else {
            this.imminentDateObj = {
                isImminent: false,
                imminentDate: 0,
            }
        }
    }
    //
    initAttendanceTime() {
        // if (this.cardItem.user.attended_datetime) {
        //     this.attendanceTime = this.timeService.getTodayRegisteredTime(this.cardItem.user.attended_datetime)
        // }
    }
}
