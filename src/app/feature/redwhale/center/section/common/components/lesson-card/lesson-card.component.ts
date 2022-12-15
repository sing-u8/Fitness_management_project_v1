import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core'

import { MembershipItem } from '@schemas/membership-item'
import { ClassItem } from '@schemas/class-item'

// rxjs
import { Subject, Subscription } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
// ngrx
import { Store, select } from '@ngrx/store'
// - // state
import * as FromLesson from '@centerStore/reducers/sec.lesson.reducer'
import * as LessonSelector from '@centerStore/selectors/sec.lesson.selector'
import * as LessonActions from '@centerStore/actions/sec.lesson.actions'

import * as FromMembership from '@centerStore/reducers/sec.membership.reducer'
import * as MembershipActions from '@centerStore/actions/sec.membership.actions'
import * as MembershipSelector from '@centerStore/selectors/sec.membership.selector'
import _ from 'lodash'

@Component({
    selector: 'gl-lesson-card',
    templateUrl: './lesson-card.component.html',
    styleUrls: ['./lesson-card.component.scss'],
})
export class LessonCardComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() memLessonItem: ClassItem
    @Input() categItem: ClassItem
    @Input() categId: string
    @Input() categName: string
    @Input() centerId: string
    @Input() isIn: 'category' | 'reservableItemList' | 'addReservableItemList'

    @Output() onAddReservableCard = new EventEmitter()
    @Output() onReservableCardDelete = new EventEmitter<any>()
    onReservableCardDeleteClick() {
        this.onReservableCardDelete.emit({})
    }

    public selectedLesson: FromLesson.SelectedLesson = undefined
    public unSubscriber$ = new Subject<void>()
    public isSelected = false
    public willBeLinked = false

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

    ngOnInit(): void {
        if (this.isIn == 'category') {
            this.nxStore
                .pipe(select(LessonSelector.selectedLesson), takeUntil(this.unSubscriber$))
                .subscribe((selectedLesson) => {
                    this.selectedLesson = selectedLesson
                    this.isSelected = selectedLesson.lessonData && selectedLesson.lessonData.id == this.categItem.id
                })
        } else if (this.isIn == 'addReservableItemList') {
            this.nxStore
                .pipe(select(MembershipSelector.selectedMembership), takeUntil(this.unSubscriber$))
                .subscribe((selectedMembership) => {
                    this.willBeLinked =
                        !_.isEmpty(selectedMembership.willBeLinkedClassItemRecord) &&
                        _.has(selectedMembership.willBeLinkedClassItemRecord, this.categItem.id)
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
            const selLessonSubscription: Subscription = this.nxStore
                .pipe(select(LessonSelector.selectedLesson), takeUntil(this.unSubscriber$))
                .subscribe((selectedLesson) => {
                    if (selectedLesson.lessonData?.id != this.categItem.id)
                        this.nxStore.dispatch(
                            LessonActions.startSetSelectedLesson({
                                selectedLesson: {
                                    centerId: this.centerId,
                                    categId: this.categId,
                                    categName: this.categName,
                                    lessonData: this.categItem,
                                },
                            })
                        )
                })

            selLessonSubscription.unsubscribe()
        } else if (this.isIn == 'addReservableItemList') {
            this.addReservableLessonToMembership()
        }
    }
    addReservableLessonToMembership() {
        this.nxStore.dispatch(MembershipActions.updateWillBeLinkedClassItem({ classItem: this.categItem }))
        this.onAddReservableCard.emit({})
    }

    parseCardInfo() {
        if (this.categItem) {
            const insts = _.orderBy(this.categItem.instructors, 'name')
            this.cardInfo.category_name = this.categItem.category_name
            this.cardInfo.color = this.categItem.color
            this.cardInfo.name = this.categItem.name
            this.cardInfo.trainer_name =
                this.categItem.instructors.length > 1
                    ? insts[0].name + ` 외 ${insts.length - 1}명`
                    : insts[0].name
            this.cardInfo.type_name = this.categItem.type_code == 'class_item_type_onetoone' ? '1:1 수업' : '그룹 수업'
        } else {
            const insts = _.orderBy(this.memLessonItem.instructors, 'name')
            this.cardInfo.category_name = this.memLessonItem.category_name
            this.cardInfo.color = this.memLessonItem.color
            this.cardInfo.name = this.memLessonItem.name
            this.cardInfo.trainer_name =
                this.memLessonItem.instructors.length > 1
                    ? insts[0].name + ` 외 ${insts.length - 1}명`
                    : insts[0].name
            this.cardInfo.type_name =
                this.memLessonItem.type_code == 'class_item_type_onetoone' ? '1:1 수업' : '그룹 수업'
        }
    }
}
