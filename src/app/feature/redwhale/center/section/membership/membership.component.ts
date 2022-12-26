import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import _ from 'lodash'
import * as kvPipe from '@helpers/pipe/keyvalue'

import { DragulaService } from 'ng2-dragula'
// services
import { StorageService } from '@services/storage.service'
import { UpdateItemRequestBody } from '@services/center-membership.service'
import { InputHelperService } from '@services/helper/input-helper.service'


// scehmas
import { Center } from '@schemas/center'
import { Drawer } from '@schemas/store/app/drawer.interface'
import { ClassItem } from '@schemas/class-item'
import { DragulaMembershipCategory, MembershipItem, DragulaMembership } from '@schemas/membership-item'

// ngrx reducer for type

import { SelectedMembership, initialSelectedMembership } from '@centerStore/reducers/sec.membership.reducer'

// rxjs
import { Observable, Subject, forkJoin, Subscription } from 'rxjs'
import { takeUntil, take } from 'rxjs/operators'

// ngrx
import { Store, select } from '@ngrx/store'
import { drawerSelector } from '@appStore/selectors'
import { showToast } from '@appStore/actions/toast.action'

import * as FromMembership from '@centerStore/reducers/sec.membership.reducer'
import * as MembershipSelector from '@centerStore/selectors/sec.membership.selector'
import * as MembershipActions from '@centerStore/actions/sec.membership.actions'
import * as LessonActions from '@centerStore/actions/sec.lesson.actions'
import * as FromLesson from '@centerStore/reducers/sec.lesson.reducer'

import { ActivatedRoute, Router } from '@angular/router'

import { originalOrder, reverseOrder } from '@helpers/pipe/keyvalue'
import { ClassCategory } from '@schemas/class-category'

// screen types
type SelectedMembershipObj = {
    days: { value: FormControl; isOn: boolean }
    count: { value: FormControl; isOn: boolean; isInfinit: boolean }
    price: { value: FormControl; isOn: boolean }
    name: { value: FormControl; isOn: boolean }
}
type SelectedMembershipType = keyof SelectedMembershipObj

@Component({
    selector: 'membership',
    templateUrl: './membership.component.html',
    styleUrls: ['./membership.component.scss'],
})
export class MembershipComponent implements OnInit {
    // ngrx state
    public drawer$: Observable<Drawer> = this.nxStore.pipe(select(drawerSelector))
    public membershipCategEntities$ = this.nxStore.pipe(select(MembershipSelector.membershipCategEntities))
    public membershipCategList: FromMembership.MembershipCategoryState[] = []
    public membershipIsloading$ = this.nxStore.pipe(select(MembershipSelector.isLoading))

    public selectedMembership: SelectedMembership = _.cloneDeep(initialSelectedMembership)

    public unSubscriber$ = new Subject<boolean>()

    // screen vars
    public center: Center

    public selMembershipInputObj: SelectedMembershipObj = {
        days: { value: this.fb.control('0', { validators: [Validators.maxLength(4)] }), isOn: false },
        count: {
            value: this.fb.control('0', { validators: [Validators.maxLength(4)] }),
            isOn: false,
            isInfinit: false,
        },
        price: { value: this.fb.control('0', { validators: [Validators.maxLength(7)] }), isOn: false },
        name: { value: this.fb.control(''), isOn: false },
    }
    public selMembershipMemo: FormControl = this.fb.control('')

    // reservable lesson vars in selected membership
    public isReserveLessonExist: boolean

    // dragular vars
    public DragulaCategory = DragulaMembershipCategory
    public dragulaSubs = new Subscription()

    constructor(
        private activatedRoute: ActivatedRoute,
        private route: Router,
        private nxStore: Store,
        private storageService: StorageService,
        private dragulaService: DragulaService,
        private fb: FormBuilder,
        private inputHelperService: InputHelperService

    ) {}

    ngOnInit(): void {
        this.center = this.storageService.getCenter()
        this.nxStore.pipe(select(MembershipSelector.currentCenter), take(1)).subscribe((curGym) => {
            if (curGym != this.center.id) {
                this.nxStore.dispatch(MembershipActions.resetAll())
                this.nxStore.dispatch(MembershipActions.startLoadMembershipCategs({ centerId: this.center.id }))
            }
        })

        this.nxStore.dispatch(MembershipActions.setCurrentGym({ currentCenter: this.center.id }))

        this.membershipCategEntities$.pipe(takeUntil(this.unSubscriber$)).subscribe((memCategEn) => {
            this.membershipCategList = _.orderBy(_.values(memCategEn), ['sequence_number'], ['asc'])
            console.log('this.membershipCategList  -- ', this.membershipCategList)
        })

        this.nxStore
            .pipe(select(MembershipSelector.selectedMembership), takeUntil(this.unSubscriber$))
            .subscribe((selectedMembership) => {
                this.selectedMembership = selectedMembership
                if (this.selectedMembership.membershipData) {
                    _.keys(this.selMembershipInputObj).forEach((key: SelectedMembershipType) => {
                        this.selMembershipInputObj[key].value.setValue(this.selectedMembership.membershipData[key])
                        if (key == 'count') {
                            if (this.selectedMembership.membershipData.unlimited == true) {
                                this.selMembershipInputObj[key].isInfinit = true
                                this.selMembershipInputObj[key].value.disable()
                            } else {
                                this.selMembershipInputObj[key].isInfinit = false
                                this.selMembershipInputObj[key].value.enable()
                            }
                        }
                    })
                    this.selMembershipMemo.setValue(this.selectedMembership.membershipData.memo)
                    this.isReserveLessonExist = this.selectedMembership.linkableClassItems.length > 0
                }
            })

        // dragula funcs
        this.dragulaService.createGroup(this.DragulaCategory, {
            direction: 'vertical',
            invalid: (el, handle) => {
                return _.includes(el.className, 'l-membership-card')
            },
            moves: (el, source, handle) => {
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
                        MembershipActions.startMoveMembershipCategory({
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
                                sequence_number: idx + 1,
                            })),
                            targetItem: _item,
                        })
                    )
                })
        )
        this.dragulaSubs.add(
            this.dragulaService
                .dropModel(DragulaMembership)
                .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
                    const _item = item as MembershipItem
                    const _targetModel = targetModel as MembershipItem[]
                    const _targetCategId = target.id
                    const _sourceCategId = source.id

                    this.nxStore.dispatch(
                        MembershipActions.startMoveMembershipItem({
                            apiData: {
                                centerId: this.center.id,
                                categoryId: _item.category_id,
                                itemId: _item.id,
                                requestBody: {
                                    target_category_id: _targetCategId,
                                    target_item_sequence_number:
                                        _targetModel.length -
                                        _targetModel.findIndex(
                                            (v) => v.id == _item.id && v.category_id == _item.category_id
                                        ),
                                },
                            },
                            targetItems: _.map(_targetModel, (v, idx, vs) => ({
                                ...v,
                                sequence_number: vs.length - idx,
                                category_id: _targetCategId,
                            })),
                            targetItem: _item,
                            targetCategId: _targetCategId,
                            sourceCategId: _sourceCategId,
                            cb: () => {
                                if (_targetCategId != _sourceCategId) {
                                    this.nxStore.dispatch(LessonActions.refreshSelectedLesson())
                                }
                            },
                        })
                    )
                })
        )
    }
    ngAfterViewInit(): void {}
    ngOnDestroy(): void {
        this.unSubscriber$.next(true)
        this.unSubscriber$.complete()
        this.dragulaSubs.unsubscribe()
        this.dragulaService.destroy(this.DragulaCategory)
    }

    // category methods
    public isAddCategOn = false
    public addCategForm = this.fb.control('')

    onAddCategClick(event) {
        this.addCategOn()
        // event.stopPropagation()
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
                MembershipActions.startAddMembershipCateg({
                    centerId: this.center.id,
                    categName: this.addCategForm.value,
                })
            )
        }
        this.addCategOff()
        this.addCategForm.setValue('')
    }

    // selected-lesson-top methods
    // - // isItemDel modal and delete lesson method
    public isItemDelOpen: boolean
    public delModalData = {
        text: '회원권을 삭제하시겠습니까?',
        subText: `잠깐! 회원권을 삭제하시면
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
        this.nxStore.dispatch(
            MembershipActions.removeSelectedMembership({ selectedMembership: this.selectedMembership })
        )

        this.isItemDelOpen = false
        this.nxStore.dispatch(showToast({ text: '회원권이 삭제되었습니다.' }))
    }
    // - //

    // selected-membership-middle methods
    onTextClick(event: Event, inputType: SelectedMembershipType) {
        _.keys(this.selMembershipInputObj).find((key: SelectedMembershipType) => {
            if (this.selMembershipInputObj[key].isOn == true && key != inputType) {
                this.updateMembershipItemInput(key)
                this.selMembershipInputObj[key].isOn = false
                return true
            }
            if (this.selMembershipInputObj[inputType].value.value == '0') {
                this.selMembershipInputObj[inputType].value.setValue('')
            }
            return false
        })
        this.selMembershipInputObj[inputType].isOn = true
        event.stopPropagation()
    }

    updateMembershipItemInput(inputType: SelectedMembershipType) {
        if (inputType == 'count') {
            const reqBody: UpdateItemRequestBody = {}
            if (String(this.selMembershipInputObj[inputType].value.value) != '') {
                reqBody[inputType] = this.selMembershipInputObj[inputType].value.value
            }
            reqBody['unlimited'] = this.selMembershipInputObj[inputType].isInfinit == true ? true : false
            this.selMembershipInputObj[inputType].value.setValue(String(reqBody[inputType]))
            this.updateSelMembership(this.selectedMembership, reqBody)
        } else if (
            String(this.selMembershipInputObj[inputType].value.value) != '' &&
            this.selMembershipInputObj[inputType].value.value != this.selectedMembership.membershipData[inputType]
        ) {
            const reqBody = {}
            reqBody[inputType] =
                inputType != 'name'
                    ? Number(this.selMembershipInputObj[inputType].value.value.replace(/[^0-9]/gi, ''))
                    : this.selMembershipInputObj[inputType].value.value

            this.updateSelMembership(this.selectedMembership, reqBody as UpdateItemRequestBody)
        }
        this.selMembershipInputObj[inputType].isOn = false
    }

    public btItems = {
        days: {
            title: '기간',
            suffix: '일',
            property: 'days',
        },
        count: {
            title: '횟수',
            suffix: '회',
            property: 'count',
            isFinite: false,
        },
        price: {
            title: '가격',
            suffix: '원',
            property: 'price',
        },
    }
    toggleInfinitCount(event) {
        this.selMembershipInputObj['count'].isInfinit = !this.selMembershipInputObj['count'].isInfinit
        this.selMembershipInputObj['count'].isInfinit == true
            ? this.selMembershipInputObj.count.value.disable()
            : this.selMembershipInputObj.count.value.enable()

        event.stopPropagation()
    }

    kvOriginOrder = kvPipe.originalOrder

    restrictToNumber(event) {
        return this.inputHelperService.restrictToNumber(event)

    }

    onSelectedItemInputKeyup(event, inputType: SelectedMembershipType) {
        if (event.code == 'Enter' || _.includes(event.code, 'Arrow')) return
        if (inputType == 'price') {
            const preValue = String(this.selMembershipInputObj[inputType].value.value)
            this.selMembershipInputObj[inputType].value.setValue(
                preValue.replace(/[^0-9]/gi, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            )
        } else {
            const preValue = String(this.selMembershipInputObj[inputType].value.value)
            this.selMembershipInputObj[inputType].value.setValue(preValue.replace(/[^0-9]/gi, ''))
        }
    }

    // selected-membership-bottom methods
    @ViewChild('membership_memo') membership_memo: ElementRef
    updateItemMemo(memo: string) {
        if (this.selectedMembership.membershipData.memo != memo) {
            const reqBody: UpdateItemRequestBody = { memo: this.selMembershipMemo.value }
            this.updateSelMembership(this.selectedMembership, reqBody)

            this.membership_memo.nativeElement.scrollTop = 0
        }
    }

    // selected-membership-lessonlist methods
    public isReservLessonListModalOn = false
    setReserveLessonModalOn() {
        this.isReservLessonListModalOn = this.isReservLessonListModalOn != true
    }
    setReserveLessonModalOff() {
        if (this.isReservLessonListModalOn) {
            this.isReservLessonListModalOn = false
            this.nxStore.dispatch(MembershipActions.resetWillBeLinkedClassItem())
        }
    }
    setReserveLessonItems() {
        this.isReservLessonListModalOn = false
        this.nxStore.dispatch(MembershipActions.startLinkClass())
    }

    removeReservationLesson(unlinkClass: ClassItem) {
        this.nxStore.dispatch(MembershipActions.startUnlinkClass({ unlinkClass }))
    }

    // - // route
    goToLessonSection() {
        this.route.navigate(['../lesson'], { relativeTo: this.activatedRoute })
    }

    // nxStore helper
    updateSelMembership(selectedMembership: SelectedMembership, reqBody: UpdateItemRequestBody) {
        this.nxStore.dispatch(
            MembershipActions.updateSelectedMembership({
                selectedMembership,
                reqBody,
            })
        )
    }

    // keyValue pipe helper
    public originOrder = originalOrder
    public reverseOrder = reverseOrder
}
