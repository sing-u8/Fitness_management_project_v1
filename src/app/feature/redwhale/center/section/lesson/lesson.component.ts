import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { FormBuilder, FormControl } from '@angular/forms'
import _ from 'lodash'
import * as kvPipe from '@helpers/pipe/keyvalue'

import { DragulaService } from 'ng2-dragula'
// services
import { StorageService } from '@services/storage.service'
import { CenterMembershipService } from '@services/center-membership.service'
import { InputHelperService } from '@services/helper/input-helper.service'

// scehmas
import { Center } from '@schemas/center'
import { MultiSelect, MultiSelectValue } from '@schemas/components/multi-select'
import { Drawer } from '@schemas/store/app/drawer.interface'
import { MembershipItem } from '@schemas/membership-item'
import { DragulaClass, DragulaClassCategory } from '@schemas/class-item'
import { UpdateItemRequestBody } from '@services/center-lesson.service'

// ngrx reducer for type
import {
    TrainerFilter,
    initialTrainerFilter,
    initialTrainerFilterList,
    SelectedLesson,
    initialSelectedLesson,
} from '@centerStore/reducers/sec.lesson.reducer'

// rxjs
import { Observable, Subject, Subscription } from 'rxjs'
import { takeUntil, take } from 'rxjs/operators'

// ngrx
import { Store, select } from '@ngrx/store'
import { drawerSelector } from '@appStore/selectors'
import { showToast } from '@appStore/actions/toast.action'

import * as FromLesson from '@centerStore/reducers/sec.lesson.reducer'
import * as LessonSelector from '@centerStore/selectors/sec.lesson.selector'
import * as LessonActions from '@centerStore/actions/sec.lesson.actions'
import * as MembershipActions from '@centerStore/actions/sec.membership.actions'

import { ActivatedRoute, Router } from '@angular/router'

import { originalOrder } from '@helpers/pipe/keyvalue'
import { Dictionary } from '@ngrx/entity'
import { startLinkMemberships } from '@centerStore/actions/sec.lesson.actions'
import { ClassItem } from '@schemas/class-item'
import { ClassCategory } from '@schemas/class-category'

// screen types
type SelectedLessonObj = {
    duration: { value: FormControl; isOn: boolean }
    capacity: { value: FormControl; isOn: boolean }
    start_booking_until: { value: FormControl; isOn: boolean }
    end_booking_before: { value: FormControl; isOn: boolean }
    cancel_booking_before: { value: FormControl; isOn: boolean }
    name: { value: FormControl; isOn: boolean }
}
type SelectedLessonType = keyof SelectedLessonObj
type ButtinItems = keyof Omit<SelectedLessonObj, 'name'>

@Component({
    selector: 'lesson',
    templateUrl: './lesson.component.html',
    styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent implements OnInit, AfterViewInit, OnDestroy {
    // dragula Vars
    public dLessonCateg = 'D_LESSON_CATEG'

    // ngrx state
    public drawer$: Observable<Drawer> = this.nxStore.pipe(select(drawerSelector))
    public lessonCategEntities$ = this.nxStore.select(LessonSelector.FilteredLessonCategEntities)
    public lessonCategList: FromLesson.LessonCategoryState[] = []
    public lessonLength$ = this.nxStore.pipe(select(LessonSelector.lessonLength))
    public lessonIsloading$ = this.nxStore.pipe(select(LessonSelector.isLoading))

    public lessonManagerList: Array<TrainerFilter> = []
    public trainerFilterList: Array<TrainerFilter> = _.cloneDeep(initialTrainerFilterList)
    public trainerFilter: TrainerFilter = _.cloneDeep(initialTrainerFilter)
    public selectedLesson: SelectedLesson = _.cloneDeep(initialSelectedLesson)

    public lessonInstructorList: MultiSelect = []
    public lessonInstructorSelectValue: MultiSelect = []

    public lessonManagerSelectValue: TrainerFilter = { name: '', value: undefined }

    public unSubscriber$ = new Subject<void>()

    // screen vars
    public center: Center

    public selLessonInputObj: SelectedLessonObj = {
        duration: { value: this.fb.control('0'), isOn: false },
        capacity: { value: this.fb.control('0'), isOn: false },
        start_booking_until: { value: this.fb.control('0'), isOn: false },
        end_booking_before: { value: this.fb.control('0'), isOn: false },
        cancel_booking_before: { value: this.fb.control('0'), isOn: false },
        name: { value: this.fb.control(''), isOn: false },
    }
    public selLessonMemo: FormControl = this.fb.control('')
    public selectedLessonTypeObj = {
        name: '1:1 수업',
        value: 'class_item_type_onetoone',
    }

    // reservable mebership vars in selected lesson
    public isReserveMembershipExist: boolean

    // screen const
    public lessonType_list = [
        {
            name: '1:1 수업',
            value: 'class_item_type_onetoone',
        },
        {
            name: '그룹 수업',
            value: 'class_item_type_group',
        },
    ]
    // dragular vars
    public DragulaCategory = DragulaClassCategory
    public dragulaSubs = new Subscription()

    constructor(
        private activatedRoute: ActivatedRoute,
        private route: Router,
        private nxStore: Store,
        private storageService: StorageService,
        private centerMembershipService: CenterMembershipService,
        private dragulaService: DragulaService,
        private inputHelperService: InputHelperService,
        private fb: FormBuilder
    ) {
        this.center = this.storageService.getCenter()
        this.nxStore.pipe(select(LessonSelector.currentCenter), take(1)).subscribe((curGym) => {
            if (curGym != this.center.id) {
                this.nxStore.dispatch(LessonActions.resetAll())
                this.nxStore.dispatch(LessonActions.startLoadLessonCategs({ centerId: this.center.id }))
            }
        })

        this.nxStore.dispatch(LessonActions.setCurrentGym({ currentCenter: this.center.id }))

        this.nxStore.dispatch(LessonActions.startGetTrainerFilterList({ centerId: this.center.id }))

        this.lessonCategEntities$.pipe(takeUntil(this.unSubscriber$)).subscribe((lesCategEn) => {
            this.lessonCategList = _.orderBy(_.values(lesCategEn), ['sequence_number'], ['asc'])
        })
        this.nxStore
            .pipe(select(LessonSelector.selectedTrainerFilter), takeUntil(this.unSubscriber$))
            .subscribe((tf) => {
                this.trainerFilter = tf
            })
        this.nxStore.pipe(select(LessonSelector.trainerFilterList), takeUntil(this.unSubscriber$)).subscribe((tfl) => {
            this.trainerFilterList = tfl
            this.lessonManagerList = tfl.filter((tf) => tf.value != undefined)
            this.initInstructorList()
        })
        this.nxStore
            .pipe(select(LessonSelector.selectedLesson), takeUntil(this.unSubscriber$))
            .subscribe((selectedLesson) => {
                this.selectedLesson = selectedLesson
                if (this.selectedLesson.lessonData) {
                    _.keys(this.selLessonInputObj).forEach((key: SelectedLessonType) => {
                        this.selLessonInputObj[key].value.setValue(this.selectedLesson.lessonData[key])
                    })
                    this.selLessonMemo.setValue(this.selectedLesson.lessonData.memo)
                    this.selectedLessonTypeObj = {
                        name:
                            this.selectedLesson.lessonData.type_code == 'class_item_type_onetoone'
                                ? '1:1 수업'
                                : '그룹 수업',
                        value: this.selectedLesson.lessonData.type_code,
                    }
                    this.lessonManagerSelectValue = {
                        name: this.selectedLesson.lessonData.instructors[0]?.name ?? '',
                        value: this.selectedLesson.lessonData.instructors[0] ?? undefined,
                    }

                    this.isReserveMembershipExist = this.selectedLesson.linkableMembershipItems.length > 0

                    this.initInstructorList()
                }
            })

        // dragula funcs
        this.dragulaService.createGroup(this.DragulaCategory, {
            direction: 'vertical',
            invalid: (el, handle) => {
                return _.includes(el.className, 'l-lesson-card')
            },
            moves: (el, source, handle) => {
                console.log('dragulaService.createGroup in lesson -- ', el, source, handle)
                return true // handle.className === 'category-container'
            },
        })
        this.dragulaSubs.add(
            this.dragulaService
                .dropModel(this.DragulaCategory)
                .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
                    const _item = item as ClassCategory
                    const _targetModel = targetModel as ClassCategory[]

                    this.nxStore.dispatch(
                        LessonActions.startMoveLessonCategory({
                            apiData: {
                                centerId: this.center.id,
                                categoryId: _item.id,
                                requestBody: {
                                    target_category_sequence_number:
                                        1 + _targetModel.findIndex((v) => v.id == _item.id),
                                },
                            },
                            targetItems: _.map(_targetModel, (v, idx, vs) => ({
                                ...v,
                                sequence_number: 1 + idx,
                            })),
                            targetItem: _item,
                        })
                    )
                })
        )
        this.dragulaSubs.add(
            this.dragulaService
                .dropModel(DragulaClass)
                .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
                    const _item = item as ClassItem
                    const _targetModel = targetModel as ClassItem[]
                    const _targetCategId = target.id
                    const _sourceCategId = source.id

                    this.nxStore.dispatch(
                        LessonActions.startMoveLessonItem({
                            apiData: {
                                centerId: this.center.id,
                                categoryId: _item.category_id,
                                itemId: _item.id,
                                requestBody: {
                                    target_category_id: _targetCategId,
                                    target_item_sequence_number: _targetModel.findIndex(
                                        (v) => v.id == _item.id && v.category_id == _item.category_id
                                    ),
                                },
                            },
                            targetItems: _.map(_targetModel, (v, idx, vs) => ({
                                ...v,
                                sequence_number: idx,
                                category_id: _targetCategId,
                            })),
                            targetItem: _item,
                            targetCategId: _targetCategId,
                            sourceCategId: _sourceCategId,
                            cb: () => {
                                if (_targetCategId != _sourceCategId) {
                                    this.nxStore.dispatch(MembershipActions.refreshSelectedMembership())
                                }
                            },
                        })
                    )
                })
        )
    }

    ngOnInit(): void {}
    ngAfterViewInit(): void {}
    ngOnDestroy(): void {
        this.unSubscriber$.next()
        this.unSubscriber$.complete()
        this.dragulaSubs.unsubscribe()
        this.dragulaService.destroy(this.DragulaCategory)
    }

    // trainerFilter method
    onTrainerFilterSelected(event: TrainerFilter) {
        this.nxStore.dispatch(LessonActions.setTrainerFilter({ trainerFilter: event }))
    }

    // category methods
    public isAddCategOn = false
    public addCategForm = this.fb.control('')

    onAddCategClick(event) {
        this.addCategOn()
        event.stopPropagation()
    }
    addCategOff() {
        this.isAddCategOn = false
    }
    addCategOn() {
        this.isAddCategOn = true
    }
    addCategory() {
        if (this.addCategForm.value) {
            this.nxStore.dispatch(
                LessonActions.startAddLessonCateg({ centerId: this.center.id, categName: this.addCategForm.value })
            )
        }
        this.addCategOff()
        this.addCategForm.setValue('')
    }

    // selected-lesson-top methods
    changeLessonIcon(color: string) {
        if (this.selectedLesson.lessonData.color != color) {
            const reqBody: UpdateItemRequestBody = { color: color }
            this.updateSelLesson(this.selectedLesson, reqBody)
        }
    }

    onLessonTypeSelcted(event) {
        const reqBody: UpdateItemRequestBody = { type_code: event.value }
        this.updateSelLesson(this.selectedLesson, reqBody)
    }

    initInstructorList() {
        if (!_.isEmpty(this.selectedLesson.lessonData)) {
            const instFilterList = _.filter(
                this.lessonManagerList,
                (v) => _.findIndex(this.selectedLesson.lessonData.instructors, (vi) => vi.id == v.value.id) == -1
            ).map((vii) => ({
                name: vii.name,
                value: vii.value,
                checked: false,
                disabled: false,
            }))

            this.lessonInstructorList = _.cloneDeep(
                _.orderBy(
                    [
                        ...this.selectedLesson.lessonData.instructors.map((v) => ({
                            name: v.name,
                            value: v,
                            checked: true,
                            disabled: false,
                        })),
                        ...instFilterList,
                    ],
                    (i) => i.name && i.value.id
                )
            )
        }
    }

    onLessonInstructorSelected(event: { selectedValue: MultiSelectValue; items: MultiSelect }) {
        this.nxStore.dispatch(
            LessonActions.startUpdateSelectedLessonInstructor({
                instructor: event.selectedValue,
                instructorItems: event.items,
                selectedLesson: this.selectedLesson,
            })
        )
    }

    // - // isItemDel modal and delete lesson method
    public isItemDelOpen = false
    public delModalData = {
        text: '수업을 삭제하시겠습니까?',
        subText: `잠깐! 수업을 삭제하시면
                  다시 복구하실 수 없어요.`,
        confirmButtonText: '삭제',
    }
    setItemDelOpen() {
        this.isItemDelOpen = true
    }
    onDeleteItemCancel() {
        this.isItemDelOpen = false
    }
    onDeleteItemConfirm() {
        this.nxStore.dispatch(LessonActions.removeSelectedLesson({ selectedLesson: this.selectedLesson }))

        this.isItemDelOpen = false
        this.nxStore.dispatch(showToast({ text: '수업이 삭제되었습니다.' }))
    }
    // - //

    // selected-lesson-middle methods
    onTextClick(event: Event, inputType: SelectedLessonType) {
        _.keys(this.selLessonInputObj).find((key: SelectedLessonType) => {
            if (this.selLessonInputObj[key].isOn == true && key != inputType) {
                this.selLessonInputObj[key].isOn = false
                return true
            }
            return false
        })
        this.selLessonInputObj[inputType].isOn = true
        event.stopPropagation()
    }

    updateLessonItemInput(inputType: SelectedLessonType) {
        if (
            this.selLessonInputObj[inputType].value.value != '' &&
            this.selLessonInputObj[inputType].value.value != this.selectedLesson.lessonData[inputType]
        ) {
            const reqBody = {}
            reqBody[inputType] =
                inputType != 'name'
                    ? Number(this.selLessonInputObj[inputType].value.value.replace(/[^0-9]/gi, ''))
                    : this.selLessonInputObj[inputType].value.value

            this.updateSelLesson(this.selectedLesson, reqBody as UpdateItemRequestBody)

            this.selLessonInputObj[inputType].isOn = false
        } else {
            this.selLessonInputObj[inputType].isOn = false
        }
    }

    public btItems: Record<ButtinItems, { title: string; suffix: string; property: string }> = {
        duration: {
            title: '수업 진행 시간',
            suffix: '분',
            property: 'duration',
        },
        capacity: {
            title: '정원',
            suffix: '명',
            property: 'capacity',
        },
        start_booking_until: {
            title: '예약 가능 날짜',
            suffix: '일 전부터',
            property: 'start_booking_until',
        },
        end_booking_before: {
            title: '예약 마감 시간',
            suffix: '시간 전까지',
            property: 'end_booking_before',
        },
        cancel_booking_before: {
            title: '예약 취소 마감 시간',
            suffix: '시간 전까지',
            property: 'cancel_booking_before',
        },
    }
    kvOriginOrder = kvPipe.originalOrder
    kvReverseOrder = kvPipe.reverseOrder

    restrictToNumber(event) {
        return this.inputHelperService.restrictToNumber(event)
    }

    onSelectedItemInputKeyup(event, inputType: SelectedLessonType) {
        if (event.code == 'Enter' || _.includes(event.code, 'Arrow')) return
        const preValue: string = this.selLessonInputObj[inputType].value.value
        this.selLessonInputObj[inputType].value.setValue(preValue.replace(/[^0-9]/gi, ''))
    }

    // selected-lesson-bottom methods
    @ViewChild('lesson_memo') lesson_memo: ElementRef
    updateItemMemo(memo: string) {
        if (this.selectedLesson.lessonData.memo != memo) {
            const reqBody: UpdateItemRequestBody = { memo: this.selLessonMemo.value }
            this.updateSelLesson(this.selectedLesson, reqBody)

            this.lesson_memo.nativeElement.scrollTop = 0
        }
    }

    // seleted-lesson-membershiplist methods
    public isReservMembershipListModalOn = false
    setReserveMembershipModalOn() {
        this.isReservMembershipListModalOn = this.isReservMembershipListModalOn != true
    }
    setReserveMembershipModalOff() {
        if (this.isReservMembershipListModalOn) {
            this.isReservMembershipListModalOn = false
            this.nxStore.dispatch(LessonActions.resetWillBeLinkedMembershipItem())
        }
    }
    addReserveMembershipItems() {
        this.isReservMembershipListModalOn = false
        this.nxStore.dispatch(LessonActions.startLinkMemberships())
    }

    removeReservationMembership(unlinkMembership: MembershipItem) {
        this.nxStore.dispatch(LessonActions.startUnlinkMembership({ unlinkMembership }))
    }

    // - // route
    goToMembershipSection() {
        this.route.navigate(['../membership'], { relativeTo: this.activatedRoute })
    }

    // nxStore helper
    updateSelLesson(selectedLesson: SelectedLesson, reqBody: UpdateItemRequestBody) {
        this.nxStore.dispatch(
            LessonActions.updateSelectedLesson({
                selectedLesson,
                reqBody,
            })
        )
    }

    // keyValue pipe helper
    public originOrder = originalOrder
}
