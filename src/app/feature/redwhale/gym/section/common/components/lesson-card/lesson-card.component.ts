import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core'

import { MembershipItem } from '@schemas/membership-item'
import { LessonItem } from '@schemas/lesson-item'

// rxjs
import { Subject, Subscription } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
// ngrx
import { Store, select } from '@ngrx/store'
// - // state
import * as FromLesson from '@gymStore/reducers/sec.lesson.reducer'
import * as LessonSelector from '@gymStore/selectors/sec.lesson.selector'
import * as LessonActions from '@gymStore/actions/sec.lesson.actions'

import * as FromMembership from '@gymStore/reducers/sec.membership.reducer'
import * as MembershipActions from '@gymStore/actions/sec.membership.actions'
import * as MembershipSelector from '@gymStore/selectors/sec.membership.selector'

@Component({
    selector: 'gl-lesson-card',
    templateUrl: './lesson-card.component.html',
    styleUrls: ['./lesson-card.component.scss'],
})
export class LessonCardComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() memLessonItem: LessonItem
    @Input() categItem: LessonItem
    @Input() categId: string
    @Input() categName: string
    @Input() gymId: string
    @Input() isIn: 'category' | 'reservableItemList' | 'addReservableItemList'

    @Output() onAddReservableCard = new EventEmitter()
    @Output() onReservableCardDelete = new EventEmitter<any>()
    onReservableCardDeleteClick() {
        this.onReservableCardDelete.emit({})
    }

    public selectedLesson: FromLesson.SelectedLesson = undefined
    public unSubscriber$ = new Subject<void>()
    public isSelected = false

    public cardInfo: {
        color: string
        category_name: string
        name: string
        type_name: string
        trainer_name: string
    } = {
        color: '',
        category_name: '',
        name: '',
        type_name: '',
        trainer_name: '',
    }

    constructor(private nxStore: Store) {} // private GymSecMembershipState: GymSecMembershipStateService // private gymLessonState: GymSecLessonStateService,

    ngOnInit(): void {}
    ngOnDestroy(): void {
        this.unSubscriber$.next()
        this.unSubscriber$.complete()
    }
    ngAfterViewInit(): void {
        if (this.isIn == 'category') {
            this.nxStore
                .pipe(select(LessonSelector.selectedLesson), takeUntil(this.unSubscriber$))
                .subscribe((selectedLesson) => {
                    this.selectedLesson = selectedLesson
                    this.isSelected =
                        selectedLesson.lessonData && selectedLesson.lessonData.id == this.categItem.id ? true : false
                })
        }
        this.parseCardInfo()
    }

    onClickItem() {
        if (this.isIn == 'category') {
            this.nxStore.dispatch(
                LessonActions.setSelectedLesson({
                    selectedLesson: {
                        gymId: this.gymId,
                        categId: this.categId,
                        categName: this.categName,
                        lessonData: this.categItem,
                    },
                })
            )
        } else if (this.isIn == 'addReservableItemList') {
            this.addReservableLessonToMembership()
        }
    }
    addReservableLessonToMembership() {
        let selMembership: FromMembership.SelectedMembership = undefined
        const selMembershipSubscription: Subscription = this.nxStore
            .pipe(select(MembershipSelector.selectedMembership), takeUntil(this.unSubscriber$))
            .subscribe((selectedMembership) => {
                selMembership = selectedMembership
            })
        const lessonItemIdList: Array<string> = selMembership.membershipData.lesson_item_list.map((v) => String(v.id))
        lessonItemIdList.push(String(this.categItem.id))
        this.nxStore.dispatch(
            MembershipActions.updateSelectedMembership({
                selectedMembership: selMembership,
                reqBody: { lesson_item_id_list: lessonItemIdList },
            })
        )
        // !! 예약가능한 수업 추가할 때, 순서가 틀어지지 않는지 확인하기  위 액션이 끝난 후에 아래가 실행되어야 함!
        // this.nxStore.dispatch(LessonActions.refreshSelectedLesson())
        selMembershipSubscription.unsubscribe()
        this.onAddReservableCard.emit({})
    }

    parseCardInfo() {
        if (this.categItem) {
            this.cardInfo.category_name = this.categItem.category_name
            this.cardInfo.color = this.categItem.color
            this.cardInfo.name = this.categItem.name
            this.cardInfo.trainer_name = this.categItem.trainer.given_name
            this.cardInfo.type_name = this.categItem.type_name
        } else {
            this.cardInfo.category_name = this.memLessonItem.category_name
            this.cardInfo.color = this.memLessonItem.color
            this.cardInfo.name = this.memLessonItem.name
            this.cardInfo.trainer_name = this.memLessonItem.trainer.given_name
            this.cardInfo.type_name = this.memLessonItem.type == 'onetoone' ? '1:1 수업' : '그룹 수업'
        }
    }
}
