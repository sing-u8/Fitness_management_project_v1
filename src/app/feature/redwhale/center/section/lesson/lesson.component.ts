import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { FormBuilder, FormControl } from '@angular/forms'
import * as _ from 'lodash'
import * as kvPipe from '@helpers/pipe/keyvalue'

// services
import { StorageService } from '@services/storage.service'
import { CenterMembershipService } from '@services/center-membership.service'

// scehmas
import { Center } from '@schemas/center'
import { Drawer } from '@schemas/store/app/drawer.interface'
import { MembershipCategory } from '@schemas/membership-category'
import { MembershipItem } from '@schemas/membership-item'
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
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

// ngrx
import { Store, select } from '@ngrx/store'
import { drawerSelector } from '@appStore/selectors'
import { showToast } from '@appStore/actions/toast.action'

import * as FromLesson from '@centerStore/reducers/sec.lesson.reducer'
import * as LessonSelector from '@centerStore/selectors/sec.lesson.selector'
import * as LessonActions from '@centerStore/actions/sec.lesson.actions'
import { ActivatedRoute, Router } from '@angular/router'

import { originalOrder } from '@helpers/pipe/keyvalue'

// screen types
type SelectedLessonObj = {
    minutes: { value: FormControl; isOn: boolean }
    people: { value: FormControl; isOn: boolean }
    reservation_days: { value: FormControl; isOn: boolean }
    reservation_deadline_time: { value: FormControl; isOn: boolean }
    reservation_cancellation_time: { value: FormControl; isOn: boolean }
    name: { value: FormControl; isOn: boolean }
}
type SelectedLessonType = keyof SelectedLessonObj

@Component({
    selector: 'lesson',
    templateUrl: './lesson.component.html',
    styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent implements OnInit, AfterViewInit, OnDestroy {
    // ngrx state
    public drawer$: Observable<Drawer> = this.nxStore.pipe(select(drawerSelector))
    public lessonCategEntities$ = this.nxStore.pipe(select(LessonSelector.FilteredLessonCategEntities))
    public lessonLength$ = this.nxStore.pipe(select(LessonSelector.lessonLength))
    public lessonIsloading$ = this.nxStore.pipe(select(LessonSelector.isLoading))

    public lessonManagerList: Array<TrainerFilter> = []
    public trainerFilterList: Array<TrainerFilter> = _.cloneDeep(initialTrainerFilterList)
    public trainerFilter: TrainerFilter = _.cloneDeep(initialTrainerFilter)
    public selectedLesson: SelectedLesson = _.cloneDeep(initialSelectedLesson)

    public unSubscriber$ = new Subject<void>()

    // screen vars
    public center: Center

    public selLessonInputObj: SelectedLessonObj = {
        minutes: { value: this.fb.control('0'), isOn: false },
        people: { value: this.fb.control('0'), isOn: false },
        reservation_days: { value: this.fb.control('0'), isOn: false },
        reservation_deadline_time: { value: this.fb.control('0'), isOn: false },
        reservation_cancellation_time: { value: this.fb.control('0'), isOn: false },
        name: { value: this.fb.control(''), isOn: false },
    }
    public selLessonMemo: FormControl = this.fb.control('')
    public selectedLessonTypeObj = {
        name: '1:1 수업',
        value: 'class_item_type_onetoone',
    }

    public lessonManagerSelectValue: TrainerFilter = { name: '', value: undefined }

    // reservable mebership vars in selected lesson
    public centerMembershipCategList: Array<MembershipCategory>
    public centerReservableMembershipItemList: Array<MembershipItem>
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

    constructor(
        private activatedRoute: ActivatedRoute,
        private route: Router,
        private nxStore: Store,
        private storageService: StorageService,
        private centerMembershipService: CenterMembershipService,
        private fb: FormBuilder
    ) {
        this.center = this.storageService.getCenter()
        this.nxStore.pipe(select(LessonSelector.currentCenter), takeUntil(this.unSubscriber$)).subscribe((curGym) => {
            if (curGym != this.center.id) {
                this.nxStore.dispatch(LessonActions.resetAll())
                this.nxStore.dispatch(LessonActions.startLoadLessonCategs({ centerId: this.center.id }))
            }
        })

        this.nxStore.dispatch(LessonActions.setCurrentGym({ currentCenter: this.center.id }))
        this.nxStore.dispatch(LessonActions.startGetTrainerFilterList({ centerId: this.center.id }))

        this.centerMembershipService.getCategoryList(this.center.id).subscribe((categs) => {
            this.isReserveMembershipExist = categs.some((v) => {
                return v.items.length > 0
            })
            this.centerMembershipCategList = categs
            if (this.selectedLesson.lessonData) this.initAddReservableMembershipList(this.selectedLesson)
        })

        this.nxStore
            .pipe(select(LessonSelector.seletedTrainerFilter), takeUntil(this.unSubscriber$))
            .subscribe((tf) => {
                console.log('select trainer filter : ', tf)
                this.trainerFilter = tf
            })
        this.nxStore.pipe(select(LessonSelector.trainerFilterList), takeUntil(this.unSubscriber$)).subscribe((tfl) => {
            console.log('select trainer filter list: ', tfl)
            this.trainerFilterList = tfl
            this.lessonManagerList = tfl.filter((tf) => tf.value != undefined)
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
                        name:
                            this.selectedLesson.lessonData.instructor.center_user_name ||
                            this.selectedLesson.lessonData.instructor.name,
                        value: this.selectedLesson.lessonData.instructor,
                    }
                    // !! 예약 가능한 회원권리스트 초기화 함수 추가하기
                    this.initAddReservableMembershipList(this.selectedLesson)
                }
            })
    }

    ngOnInit(): void {}
    ngAfterViewInit(): void {}
    ngOnDestroy(): void {
        this.unSubscriber$.next()
        this.unSubscriber$.complete()
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

    // !! need to be add type
    onLessonTypeSelcted(event) {
        const reqBody: UpdateItemRequestBody = { type_code: event.value }
        this.updateSelLesson(this.selectedLesson, reqBody)
    }

    // !! need to be add type
    onLessonManagerSelected(event) {
        const reqBody: UpdateItemRequestBody = { instructor_user_id: event.value.id }
        this.updateSelLesson(this.selectedLesson, reqBody)
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

            // this.selLessonInputObj[inputType].value.setValue(reqBody[inputType])
            this.selLessonInputObj[inputType].isOn = false
        } else {
            this.selLessonInputObj[inputType].isOn = false
        }
    }

    public btItems = {
        minutes: {
            title: '수업 진행 시간',
            suffix: '분',
            property: 'minutes',
        },
        people: {
            title: '정원',
            suffix: '명',
            property: 'people',
        },
        reservation_start: {
            title: '예약 가능 날짜',
            suffix: '일 전부터',
            property: 'reservation_days',
        },
        reservation_end: {
            title: '예약 마감 시간',
            suffix: '시간 전까지',
            property: 'reservation_deadline_time',
        },
        reservation_cancel_end: {
            title: '예약 취소 마감 시간',
            suffix: '시간 전까지',
            property: 'reservation_cancellation_time',
        },
    }
    kvOriginOrder = kvPipe.originalOrder

    restrictToNumber(event) {
        const code = event.which ? event.which : event.keyCode
        if (code < 48 || code > 57) {
            return false
        }
        return true
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
        this.isReservMembershipListModalOn = this.isReservMembershipListModalOn == true ? false : true
    }
    setReserveMembershipModalOff() {
        this.isReservMembershipListModalOn = false
    }

    removeReservationMembership(itemId: string, curLesMemItemList: Array<MembershipItem>) {
        const filteredIdList = _.filter(curLesMemItemList, (v) => v.id != itemId).map((v) => String(v.id))
        const reqBody: UpdateItemRequestBody = { membership_item_ids: filteredIdList }
        this.updateSelLesson(this.selectedLesson, reqBody, 'RemoveReservationMembership')
    }

    initAddReservableMembershipList(lesItem: FromLesson.SelectedLesson) {
        this.centerReservableMembershipItemList = _.reduce(
            _.cloneDeep(this.centerMembershipCategList),
            (list, v) => {
                v.items.forEach((j) => list.push(j))
                return list
            },
            []
        )
        _.remove(this.centerReservableMembershipItemList, (v) => {
            return lesItem.lessonData.membership_items.some((j) => j.id == v.id)
        })
    }

    // - // route
    goToMembershipSection() {
        this.route.navigate(['../membership'], { relativeTo: this.activatedRoute })
    }

    // nxStore helper
    updateSelLesson(
        selectedLesson: SelectedLesson,
        reqBody: UpdateItemRequestBody,
        updateType: LessonActions.UpdateType = undefined
    ) {
        this.nxStore.dispatch(
            LessonActions.updateSelectedLesson({
                selectedLesson,
                reqBody,
                updateType,
            })
        )
        // this.nxStore.dispatch(MembershipActions.startUpsertState({ centerId: this.center.id }))
    }

    // keyValue pipe helper
    public originOrder = originalOrder
}
