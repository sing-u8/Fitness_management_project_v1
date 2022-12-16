import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core'
import { Subject, Subscription } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'

import { CenterUser } from '@schemas/center-user'

@Component({
    selector: 'msg-member-list-card',
    templateUrl: './msg-member-list-card.component.html',
    styleUrls: ['./msg-member-list-card.component.scss'],
})
export class MsgMemberListCardComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    @Input() cardItem: { user: CenterUser; selected: boolean }
    @Input() search: string
    @Input() includeAd: boolean

    public doHide = false
    public searchSubject = new Subject<string>()
    public searchSubscription: Subscription
    @Output() onCardClick = new EventEmitter<boolean>()

    constructor() {
        this.searchSubscription = this.searchSubject
            .asObservable()
            .pipe(distinctUntilChanged())
            .subscribe((value) => {
                this.doHide = !(
                    this.cardItem.user.name.includes(value) || this.cardItem.user.phone_number.includes(value)
                )
            })
    }

    ngOnInit(): void {}
    ngOnChanges() {
        this.searchSubject.next(this.search ?? '')
    }
    ngAfterViewInit(): void {}
    ngOnDestroy(): void {
        this.searchSubscription.unsubscribe()
    }

    clickCard() {
        this.onCardClick.emit(this.cardItem.selected)
    }
}
