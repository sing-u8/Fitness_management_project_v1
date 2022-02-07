import { Component, OnInit, Input, AfterViewInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core'
import { FormBuilder, FormControl } from '@angular/forms'
import * as _ from 'lodash'

import { LessonItem } from '@schemas/lesson-item'

// rxjs
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

// ngrx
import { Store, select } from '@ngrx/store'
// - // state
import { showToast } from '@appStore/actions/toast.action'
import * as FromLesson from '@gymStore/reducers/sec.lesson.reducer'
import * as LessonSelector from '@gymStore/selectors/sec.lesson.selector'
import * as LessonActions from '@gymStore/actions/sec.lesson.actions'

import * as MembershipActions from '@gymStore/actions/sec.membership.actions'

@Component({
    selector: 'gl-gym-lesson-category',
    templateUrl: './lesson-category.component.html',
    styleUrls: ['./lesson-category.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class LessonCategoryComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() id: string
    @Input() categ: FromLesson.LessonCategoryState
    @Input() gymId: string

    public items: Array<LessonItem> = []
    public name: string
    public isCategOpen: boolean

    public isDropdownOpen: boolean
    public isChangeNameOn: boolean
    public isCategDelOpen: boolean
    public isAddLessonInputOn: boolean

    public categNameForm: FormControl
    public newLessonForm: FormControl

    public selectedLesson: FromLesson.SelectedLesson = undefined
    public unSubscriber$ = new Subject<void>()

    public delModalData = {
        text: '카테고리를 삭제하시겠습니까?',
        subText: `잠깐! 카테고리를 삭제하시면
                  포함된 수업이 모두 삭제되며, 복구하실 수 없어요.`,
        confirmButtonText: '삭제',
    }

    constructor(private fb: FormBuilder, private nxStore: Store) {
        this.isDropdownOpen = false

        this.isChangeNameOn = false
        this.isCategDelOpen = false
        this.isAddLessonInputOn = false

        this.categNameForm = this.fb.control('')
        this.newLessonForm = this.fb.control('')

        this.nxStore
            .pipe(select(LessonSelector.selectedLesson), takeUntil(this.unSubscriber$))
            .subscribe((selectedLesson) => {
                this.selectedLesson = selectedLesson
            })
    }

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        this.categNameForm.setValue(this.categ.name)

        // init input variable
        this.items = this.categ.items
        this.name = this.categ.name
        this.isCategOpen = this.categ.isCategOpen
    }
    ngOnDestroy(): void {
        this.unSubscriber$.next()
        this.unSubscriber$.complete()
    }

    // flag methods
    setDropdonwOpen(event?: Event) {
        this.isDropdownOpen = true
        event ? event.stopPropagation() : null
    }
    setDropdonwClose() {
        this.isDropdownOpen = false
    }

    toggleCategOpen() {
        if (this.isChangeNameOn) return
        this.nxStore.dispatch(LessonActions.setCategIsOpen({ id: this.id, isOpen: !this.isCategOpen }))
    }

    setCategInputOpen() {
        this.isChangeNameOn = true
    }
    setCategInputClose() {
        this.isChangeNameOn = false
    }

    setCategDelModalOepn() {
        this.setDropdonwClose()
        this.isCategDelOpen = true
    }
    setCategDelModalClose() {
        this.isCategDelOpen = false
    }

    setAddLessonItemOn(event: Event) {
        this.isAddLessonInputOn = true
        event.stopPropagation()
    }
    setAddLessonItemOff() {
        this.isAddLessonInputOn = false
    }

    //  dropdown
    onChangeName(event: Event) {
        this.setDropdonwClose()
        this.setCategInputOpen()
        event.stopPropagation()
    }

    // categ name change method
    changeCategName() {
        if (this.categ.name != this.categNameForm.value) {
            this.nxStore.dispatch(
                LessonActions.changeLessonCategName({
                    gymId: this.gymId,
                    id: this.id,
                    categName: this.categNameForm.value,
                })
            )
        }
        this.setCategInputClose()
    }

    // delete category method
    onDeleteCategoryConfirm() {
        this.nxStore.dispatch(LessonActions.removeLessonCateg({ gymId: this.gymId, id: this.id }))
        console.log('onDelCateg slelctedLesson: ', this.selectedLesson)
        if (this.selectedLesson.lessonData && this.items.some((v) => v.id == this.selectedLesson.lessonData.id)) {
            this.nxStore.dispatch(LessonActions.resetSelectedLesson())
        }
        this.nxStore.dispatch(MembershipActions.refreshSelectedMembership())

        this.setCategDelModalClose()
        this.nxStore.dispatch(showToast({ text: '카테고리가 삭제되었습니다.' }))
    }

    onDeleteCategoryCancel() {
        this.setCategDelModalClose()
    }

    // add categ item
    addCategItem(itemName: string) {
        if (_.trim(itemName) == '') {
            this.setAddLessonItemOff()
            return
        }
        this.nxStore.dispatch(
            LessonActions.startAddLessonToCateg({
                gymId: this.gymId,
                categId: this.id,
                categName: this.name,
                reqBody: {
                    name: itemName,
                    sequence_number: 0,
                },
            })
        )
        this.setAddLessonItemOff()
    }
}
