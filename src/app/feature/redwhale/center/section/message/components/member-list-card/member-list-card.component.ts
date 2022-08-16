import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core'
import { Subject, Subscription } from 'rxjs'

import { CenterUser } from '@schemas/center-user'

@Component({
    selector: 'msg-member-list-card',
    templateUrl: './member-list-card.component.html',
    styleUrls: ['./member-list-card.component.scss'],
})
export class MemberListCardComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    @Input() cardItem: { user: CenterUser; selected: boolean }
    @Input() search: string

    public doHide = false
    public searchSubject = new Subject<string>()
    public searchSubscription: Subscription
    @Output() onCardClick = new EventEmitter<boolean>()

    constructor() {}

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
