import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core'
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import * as _ from 'lodash'
import * as kvPipe from '@helpers/pipe/keyvalue'

// services
import { StorageService } from '@services/storage.service'
import { GymLessonService } from '@services/gym-lesson.service'

// scehmas
import { Gym } from '@schemas/gym'
import { Drawer } from '@schemas/store/app/drawer.interface'
import { LessonCategory } from '@schemas/lesson-category'
import { LessonItem } from '@schemas/lesson-item'
import { UpdateItemRequestBody } from '@services/gym-membership.service'

// ngrx reducer for type

import { SelectedMembership, initialSelectedMembership } from '@gymStore/reducers/sec.membership.reducer'

// rxjs
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

// ngrx
import { Store, select } from '@ngrx/store'
import { drawerSelector } from '@appStore/selectors'
import { showToast } from '@appStore/actions/toast.action'

import * as FromMembership from '@gymStore/reducers/sec.membership.reducer'
import * as MembershipSelector from '@gymStore/selectors/sec.membership.selector'
import * as MembershipActions from '@gymStore/actions/sec.membership.actions'

import { ActivatedRoute, Router } from '@angular/router'

import { originalOrder } from '@helpers/pipe/keyvalue'

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
    public membershipIsloading$ = this.nxStore.pipe(select(MembershipSelector.isLoading))

    public isCurGymFirstSet = false
    public selectedMembership: SelectedMembership = _.cloneDeep(initialSelectedMembership)

    public unSubscriber$ = new Subject<void>()

    // screen vars
    public gym: Gym

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
    public gymLessonCategList: Array<LessonCategory>
    public gymReservableLessonItemList: Array<LessonItem>
    public isReserveLessonExist: boolean

    constructor(
        private activatedRoute: ActivatedRoute,
        private route: Router,
        private nxStore: Store,
        private storageService: StorageService,
        private gymLessonService: GymLessonService,
        private fb: FormBuilder
    ) {
        this.gym = this.storageService.getGym()
        this.nxStore.pipe(select(MembershipSelector.currentGym), takeUntil(this.unSubscriber$)).subscribe((curGym) => {
            console.log('memberhsip gym : ', ' : ', curGym, ' : ', this.gym.id)
            if (curGym != this.gym.id) {
                this.nxStore.dispatch(MembershipActions.resetAll())
                this.nxStore.dispatch(MembershipActions.startLoadMembershipCategs({ gymId: this.gym.id }))
            }
        })

        this.nxStore.dispatch(MembershipActions.setCurrentGym({ currentGym: this.gym.id }))

        this.gymLessonService.getCategoryList(this.gym.id).subscribe((categs) => {
            this.isReserveLessonExist = categs.some((v) => {
                return v.items.length > 0
            })
            this.gymLessonCategList = categs
            if (this.selectedMembership.membershipData) {
                this.initAddReservableLessonList(this.selectedMembership) // !
            }
        })

        this.nxStore
            .pipe(select(MembershipSelector.selectedMembership), takeUntil(this.unSubscriber$))
            .subscribe((selectedMembership) => {
                this.selectedMembership = selectedMembership
                if (this.selectedMembership.membershipData) {
                    _.keys(this.selMembershipInputObj).forEach((key: SelectedMembershipType) => {
                        this.selMembershipInputObj[key].value.setValue(this.selectedMembership.membershipData[key])
                        if (key == 'count') {
                            if (this.selectedMembership.membershipData.infinity_yn == 1) {
                                this.selMembershipInputObj[key].isInfinit = true
                                this.selMembershipInputObj[key].value.disable()
                            } else {
                                this.selMembershipInputObj[key].isInfinit = false
                                this.selMembershipInputObj[key].value.enable()
                            }
                        }
                    })
                    this.selMembershipMemo.setValue(this.selectedMembership.membershipData.memo)
                    this.initAddReservableLessonList(this.selectedMembership)
                }
            })
    }

    ngOnInit(): void {}
    ngAfterViewInit(): void {}
    ngOnDestroy(): void {
        this.unSubscriber$.next()
        this.unSubscriber$.complete()
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
                MembershipActions.startAddMembershipCateg({ gymId: this.gym.id, categName: this.addCategForm.value })
            )
        }
        this.addCategOff()
        this.addCategForm.setValue('')
    }

    // selected-lesson-top methods
    // - // isItemDel modal and delete lesson method
    public isItemDelOpen: boolean
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
        this.nxStore.dispatch(
            MembershipActions.removeSelectedMembership({ selectedMembership: this.selectedMembership })
        )

        this.isItemDelOpen = false
        this.nxStore.dispatch(showToast({ text: '수업이 삭제되었습니다.' }))
    }
    // - //

    // selected-membership-middle methods
    onTextClick(event: Event, inputType: SelectedMembershipType) {
        _.keys(this.selMembershipInputObj).find((key: SelectedMembershipType) => {
            if (this.selMembershipInputObj[key].isOn == true && key != inputType) {
                this.selMembershipInputObj[key].isOn = false
                return true
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
            reqBody['infinity_yn'] = this.selMembershipInputObj[inputType].isInfinit == true ? 1 : 0

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
            suffix: '￦',
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
        const code = event.which ? event.which : event.keyCode
        if (code < 48 || code > 57) {
            return false
        }
        return true
    }

    onSelectedItemInputKeyup(event, inputType: SelectedMembershipType) {
        if (event.code == 'Enter' || _.includes(event.code, 'Arrow')) return
        if (inputType == 'price') {
            const preValue: string = this.selMembershipInputObj[inputType].value.value
            this.selMembershipInputObj[inputType].value.setValue(
                preValue.replace(/[^0-9]/gi, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            )
        } else {
            const preValue: string = this.selMembershipInputObj[inputType].value.value
            this.selMembershipInputObj[inputType].value.setValue(preValue.replace(/[^0-9]/gi, ''))
        }
    }

    // selected-membership-bottom methods
    updateItemMemo(memo: string) {
        if (this.selectedMembership.membershipData.memo != memo) {
            const reqBody: UpdateItemRequestBody = { memo: this.selMembershipMemo.value }
            this.updateSelMembership(this.selectedMembership, reqBody)
        }
    }

    // selected-membership-lessonlist methods
    public isReservLessonListModalOn = false
    setReserveLessonModalOn() {
        this.isReservLessonListModalOn = this.isReservLessonListModalOn == true ? false : true
    }
    setReserveLessonModalOff() {
        this.isReservLessonListModalOn = false
    }

    removeReservationLesson(itemId: string, curMemLesItemList: Array<LessonItem>) {
        const filteredIdList = _.filter(curMemLesItemList, (v) => v.id != itemId).map((v) => String(v.id))

        const reqBody: UpdateItemRequestBody = { lesson_item_id_list: filteredIdList }
        this.updateSelMembership(this.selectedMembership, reqBody)
    }

    // init item add reservable lesson item list
    initAddReservableLessonList(membItem: FromMembership.SelectedMembership) {
        this.gymReservableLessonItemList = _.reduce(
            _.cloneDeep(this.gymLessonCategList),
            (list, v) => {
                v.items.forEach((j) => list.push(j))
                return list
            },
            []
        )
        _.remove(this.gymReservableLessonItemList, (v) => {
            return membItem.membershipData.lesson_item_list.some((j) => j.id == v.id)
        })
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
}
