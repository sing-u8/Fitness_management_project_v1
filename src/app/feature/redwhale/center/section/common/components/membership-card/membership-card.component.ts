import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core'

import { MembershipItem } from '@schemas/membership-item'

// rxjs
import { Subscription, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

// ngrx
import { Store, select } from '@ngrx/store'
// - // state
import * as FromMembership from '@centerStore/reducers/sec.membership.reducer'
import * as MembershipSelector from '@centerStore/selectors/sec.membership.selector'
import * as MembershipActions from '@centerStore/actions/sec.membership.actions'

import * as FromLesson from '@centerStore/reducers/sec.lesson.reducer'
import * as LessonActions from '@centerStore/actions/sec.lesson.actions'
import * as LessonSelector from '@centerStore/selectors/sec.lesson.selector'

@Component({
    selector: 'gm-membership-card',
    templateUrl: './membership-card.component.html',
    styleUrls: ['./membership-card.component.scss'],
})
export class MembershipCardComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() lesMembershipItem: MembershipItem
    @Input() categItem: MembershipItem
    @Input() categId: string
    @Input() categName: string
    @Input() centerId: string
    @Input() isIn: 'category' | 'reservableItemList' | 'addReservableItemList'

    @Output() onAddReservableCard = new EventEmitter()
    @Output() onReservableCardDelete = new EventEmitter<any>()
    onReservableCardDeleteClick() {
        this.onReservableCardDelete.emit({})
    }

    public selectedMembership: FromMembership.SelectedMembership = undefined
    public unSubscriber$ = new Subject<void>()
    public isSelected = false

    public cardInfo: {
        color: string
        category_name: string
        name: string
        days: string
        count: string
        price: string
        unlimited: boolean
    } = {
        color: '',
        category_name: '',
        name: '',
        days: '',
        count: '',
        price: '',
        unlimited: false,
    }
    constructor(private nxStore: Store) {} // private gymSecLessonState: GymSecLessonStateService // private gymMembershipState: GymSecMembershipStateService,

    ngOnInit(): void {
        if (this.isIn == 'category') {
            this.nxStore
                .pipe(select(MembershipSelector.selectedMembership), takeUntil(this.unSubscriber$))
                .subscribe((selectedMembership) => {
                    this.selectedMembership = selectedMembership
                    this.isSelected =
                        selectedMembership.membershipData && selectedMembership.membershipData.id == this.categItem.id
                            ? true
                            : false
                })
        }
        this.parseCardInfo()
    }
    ngOnDestroy(): void {
        this.unSubscriber$.next()
        this.unSubscriber$.complete()
    }
    ngAfterViewInit(): void {}

    onClickItem() {
        if (this.isIn == 'category') {
            const selMembershipSubscription: Subscription = this.nxStore
                .pipe(select(MembershipSelector.selectedMembership), takeUntil(this.unSubscriber$))
                .subscribe((selectedMembership) => {
                    if (selectedMembership.membershipData?.id != this.categItem.id)
                        this.nxStore.dispatch(
                            MembershipActions.startSetSelectedMembership({
                                selectedMembership: {
                                    centerId: this.centerId,
                                    categId: this.categId,
                                    categName: this.categName,
                                    membershipData: this.categItem,
                                },
                            })
                        )
                })
            selMembershipSubscription.unsubscribe()
        } else if (this.isIn == 'addReservableItemList') {
            this.addReservableMembershipToLesson()
        }
    }

    addReservableMembershipToLesson() {
        this.nxStore.dispatch(LessonActions.startLinkMembership({ linkMembership: this.categItem }))
        this.onAddReservableCard.emit({})
    }

    parseCardInfo() {
        if (this.categItem) {
            this.cardInfo.category_name = this.categItem.category_name
            this.cardInfo.color = this.categItem.color
            this.cardInfo.name = this.categItem.name
            this.cardInfo.days = String(this.categItem.days)
            this.cardInfo.count = String(this.categItem.count)
            this.cardInfo.price = String(this.categItem.price)
            this.cardInfo.unlimited = this.categItem.unlimited
        } else {
            this.cardInfo.category_name = this.lesMembershipItem.category_name
            this.cardInfo.color = this.lesMembershipItem.color
            this.cardInfo.name = this.lesMembershipItem.name
            this.cardInfo.days = String(this.lesMembershipItem.days)
            this.cardInfo.count = String(this.lesMembershipItem.count)
            this.cardInfo.price = String(this.lesMembershipItem.price)
            this.cardInfo.unlimited = this.lesMembershipItem.unlimited
        }
    }
}
