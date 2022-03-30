import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core'
import { Subject, Subscription } from 'rxjs'
import { distinctUntilChanged, debounceTime } from 'rxjs/operators'

import { GlobalService } from '@services/global.service'
import { TimeService } from '@services/etc/time.service'

import { GetUserReturn, GetUserType } from '@schemas/gym-dashboard'
// !! 아직 구현 불가능
@Component({
    selector: 'rw-user-list-card',
    templateUrl: './user-list-card.component.html',
    styleUrls: ['./user-list-card.component.scss'],
})
export class UserListCardComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    @Input() cardItem: { user: GetUserReturn; holdSelected: boolean }
    @Input() type: GetUserType
    @Input() holdMode: boolean
    @Input() holdNumber: number
    @Input() search: string

    public doHide = false
    public searchSubject = new Subject<string>()
    public searchSubscription: Subscription
    @Output() onCardClick = new EventEmitter<GetUserReturn>()
    @Output() onHoldClick = new EventEmitter<boolean>()

    public attendanceTime = undefined

    clickCard() {
        this.onCardClick.emit(this.cardItem.user)
    }

    toggleHold() {
        if (this.holdNumber >= 500 && !this.cardItem.holdSelected) {
            this.globalService.showToast('일부 회원 홀딩 시, 최대 500명까지 선택하실 수 있어요.')
        } else {
            this.cardItem.holdSelected = !this.cardItem.holdSelected
            this.onHoldClick.emit(this.cardItem.holdSelected)
        }
    }

    constructor(private globalService: GlobalService, private timeService: TimeService) {
        this.searchSubscription = this.searchSubject
            .asObservable()
            .pipe(distinctUntilChanged(), debounceTime(0))
            .subscribe((value) => {
                this.doHide = !(
                    this.cardItem.user.gym_user_name.includes(value) || this.cardItem.user.phone_number.includes(value)
                )
            })
    }

    ngOnInit(): void {}
    ngOnChanges() {
        this.searchSubject.next(this.search ?? '')
    }
    ngAfterViewInit(): void {
        this.initAttendanceTime()
    }
    ngOnDestroy(): void {
        this.searchSubscription.unsubscribe()
    }

    initAttendanceTime() {
        if (this.cardItem.user.attended_datetime) {
            this.attendanceTime = this.timeService.getTodayRegisteredTime(this.cardItem.user.attended_datetime)
        }
    }
}