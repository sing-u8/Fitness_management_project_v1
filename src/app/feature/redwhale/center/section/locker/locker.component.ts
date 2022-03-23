import {
    Component,
    OnInit,
    AfterViewInit,
    OnDestroy,
    ViewChild,
    ElementRef,
    ViewChildren,
    QueryList,
} from '@angular/core'
import { FormBuilder, FormControl } from '@angular/forms'
import { CompactType, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2'

import _ from 'lodash'
import { originalOrder } from '@helpers/pipe/keyvalue'

import { LockerCategoryComponent } from '@redwhale/center/section/locker/components/locker-category/locker-category.component'

// services
import { StorageService } from '@services/storage.service'
import { CenterLockerService } from '@services/center-locker.service'
import { UsersLockerService } from '@services/users-locker.service'
import { CenterUsersLockerService } from '@services/center-users-locker.service.service'

// schemas
import { LockerCategory } from '@schemas/locker-category'
import { LockerItem } from '@schemas/locker-item'
import { Center } from '@schemas/center'
import { Drawer } from '@schemas/store/app/drawer.interface'

// rxjs
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

// ngrx
import { Store, select } from '@ngrx/store'
import { drawerSelector } from '@appStore/selectors'
import { showToast } from '@appStore/actions/toast.action'

import * as FromLocker from '@centerStore/reducers/sec.locker.reducer'
import * as LockerSelector from '@centerStore/selectors/sec.locker.selector'
import * as LockerActions from '@centerStore/actions/sec.locker.actions'

@Component({
    selector: 'locker',
    templateUrl: './locker.component.html',
    styleUrls: ['./locker.component.scss'],
})
export class LockerComponent implements OnInit, AfterViewInit, OnDestroy {
    // ngrx state
    public isLoading$ = this.nxStore.pipe(select(LockerSelector.isLoading))

    public curLockerCateg: LockerCategory = FromLocker.initialLockerState.curLockerCateg
    public curLockerItemList: Array<LockerItem> = FromLocker.initialLockerState.curLockerItemList
    public LockerGlobalMode: FromLocker.LockerGlobalMode = FromLocker.initialLockerState.lockerGlobalMode
    public willBeMovedLockerItem: LockerItem = FromLocker.initialLockerState.willBeMovedLockerItem
    public curLockerItem: LockerItem = FromLocker.initialLockerState.curLockerItem
    public lockerCategLength = 0
    public lockerCategList: Array<LockerCategory> = []

    // component vars
    public center: Center = undefined
    public isEditMode = false

    // input vars and  flags
    public categInput: FormControl
    public isCategInputOpen = false
    // public lockerIndexInput: FormControl
    public lockerItemCountInput: FormControl

    // vars related to delete categ
    public delCategModalVisible = false
    public delCategData = {
        text: '락커 카테고리를 삭제하시겠어요?',
        subText: `잠깐! 카테고리를 삭제하시면
        포함된 락커가 모두 삭제되며, 복구하실 수 없어요.`,
        cancelButtonText: '취소',
        confirmButtonText: '삭제',
    }
    public willBeDeletedCategory: LockerCategory = undefined

    // vars related to willBeMovedLocker
    public doShowMoveLockerTicketModal = false
    public moveLockerTicketData: any

    // gridster vars
    public gridsterOptions: GridsterConfig
    public helpTexts = helpTexts

    // block delete categ vars
    public doShowBlockDelCategory = false
    public blockDelCategTexts = {
        text: '앗! 등록된 회원이 있어요.😮',
        subText: `카테고리 내 락커를 모두 비우신 후,
        다시 카테고리를 삭제해주세요.`,
        confirmButtonText: '확인',
    }

    public unSubscriber$ = new Subject<void>()

    public originOrder = originalOrder

    @ViewChildren(LockerCategoryComponent) lockerCategories!: QueryList<LockerCategoryComponent>
    @ViewChild('l_locker_category') l_locker_category: ElementRef

    constructor(private nxStore: Store, private storageService: StorageService, private fb: FormBuilder) {
        // input formcontrol
        this.categInput = this.fb.control('')
        this.lockerItemCountInput = this.fb.control('0')

        this.initGridster()

        this.center = this.storageService.getCenter()
        this.nxStore
            .pipe(select(LockerSelector.curCenterId), takeUntil(this.unSubscriber$))
            .subscribe((curCenterId) => {
                if (curCenterId != this.center.id) {
                    this.nxStore.dispatch(LockerActions.resetAll())
                    this.nxStore.dispatch(LockerActions.startLoadLockerCategs({ centerId: this.center.id }))
                }
            })
        this.nxStore
            .pipe(select(LockerSelector.curLockerCateg), takeUntil(this.unSubscriber$))
            .subscribe((curLockerCateg) => {
                if (!curLockerCateg) {
                    this.nxStore.dispatch(LockerActions.resetCurLockerItem())
                    this.nxStore.dispatch(LockerActions.resetCurLockerItemList())
                }
                this.curLockerCateg = curLockerCateg
                this.categoryScrollControl(curLockerCateg)
            })

        this.nxStore.dispatch(LockerActions.setCurCenterId({ centerId: this.center.id }))
        this.nxStore
            .pipe(select(LockerSelector.curLockerItemList), takeUntil(this.unSubscriber$))
            .subscribe((curLockerItemList) => {
                this.curLockerItemList = _.cloneDeep(curLockerItemList)
                this.lockerItemCountInput.setValue(String(this.getMaximumLockerId(curLockerItemList) + 1))

                console.log('curLockerItemList,  testLockerItemList : ', this.curLockerItemList)
            })
        this.nxStore.pipe(select(LockerSelector.LockerGlobalMode), takeUntil(this.unSubscriber$)).subscribe((lgm) => {
            this.LockerGlobalMode = lgm
        })
        this.nxStore
            .pipe(select(LockerSelector.willBeMovedLockerItem), takeUntil(this.unSubscriber$))
            .subscribe((willBeMovedLockerItem) => {
                this.willBeMovedLockerItem = willBeMovedLockerItem
            })
        this.nxStore
            .pipe(select(LockerSelector.curLockerItem), takeUntil(this.unSubscriber$))
            .subscribe((curLockerItem) => {
                this.curLockerItem = _.cloneDeep(curLockerItem)
            })
        this.nxStore
            .pipe(select(LockerSelector.lockerCategLength), takeUntil(this.unSubscriber$))
            .subscribe((lcLength) => {
                this.lockerCategLength = lcLength
            })

        this.nxStore.pipe(select(LockerSelector.LockerCategList), takeUntil(this.unSubscriber$)).subscribe((lcList) => {
            this.lockerCategList = lcList
        })
    }

    ngOnInit(): void {}
    ngAfterViewInit(): void {}
    ngOnDestroy(): void {
        this.unSubscriber$.next()
        this.unSubscriber$.complete()
    }

    // helper funcs
    getMaximumLockerId(lockerItemList: Array<LockerItem>): number {
        let maximum = 0
        if (lockerItemList) {
            lockerItemList.forEach((v) => {
                maximum = Number(v.name) > maximum ? Number(v.name) : maximum
            })
        }
        return maximum
    }

    // categ input method
    openCategInput() {
        this.isCategInputOpen = true
    }
    closeCategInput() {
        this.isCategInputOpen = false
    }

    // category scroll control function
    categoryScrollControl(categ: LockerCategory) {
        if (
            this.l_locker_category &&
            this.l_locker_category.nativeElement.scrollWidth > this.l_locker_category.nativeElement.clientWidth
        ) {
            let isLastCateg = false
            const _selectedCateg = this.lockerCategories.find((_categ, index) => {
                if (_categ.category.id == categ.id) {
                    this.lockerCategories.length - 1 == index ? (isLastCateg = true) : (isLastCateg = false)
                    return true
                }
                return false
            })

            if (!_selectedCateg) return

            const scrollableWidth =
                this.l_locker_category.nativeElement.scrollWidth - this.l_locker_category.nativeElement.clientWidth
            const scrollDiff =
                _selectedCateg.categoryContainer.nativeElement.offsetLeft +
                _selectedCateg.categoryContainer.nativeElement.clientWidth -
                this.l_locker_category.nativeElement.clientWidth +
                20
            if (isLastCateg) {
                // 마지막 카테고리 선택 시
                this.l_locker_category.nativeElement.scrollLeft = scrollableWidth
            } else if (scrollDiff > 0 && this.l_locker_category.nativeElement.scrollLeft < scrollDiff) {
                // scroll width 보다 긴 카테고리 선택 시
                this.l_locker_category.nativeElement.scrollLeft = scrollDiff
            } else if (
                // categ container 보다 scrollLeft가 작은 offsetLeft를 선택 시
                _selectedCateg.categoryContainer.nativeElement.offsetLeft <
                this.l_locker_category.nativeElement.scrollLeft
            ) {
                this.l_locker_category.nativeElement.scrollLeft =
                    _selectedCateg.categoryContainer.nativeElement.offsetLeft == 0
                        ? 0
                        : _selectedCateg.categoryContainer.nativeElement.offsetLeft - 20
            }
        }
    }

    // willbeMovedLocker methods
    openShowMoveLockerTicketModal(willBeMovedLocker: LockerItem) {
        this.moveLockerTicketData = {
            text: `[락커 ${willBeMovedLocker.name}]으로 자리를 이동하시겠어요?`,
            subText: `확인 버튼을 클릭하시면,
            즉시 회원의 락커 자리가 변경돼요.`,
            cancelButtonText: '취소',
            confirmButtonText: '이동',
        }
        this.doShowMoveLockerTicketModal = true
    }
    closeShowMoveLockerTicketModal() {
        this.nxStore.dispatch(LockerActions.resetWillBeMovedLockerItem())
        this.doShowMoveLockerTicketModal = false
    }
    onMovableLockerClick(willBeMovedLocker: LockerItem) {
        this.nxStore.dispatch(LockerActions.setWillBeMovedLockerItem({ lockerItem: willBeMovedLocker }))
        this.openShowMoveLockerTicketModal(willBeMovedLocker)
    }
    modifyLockerTicket() {
        // !! this.gymLockerState.moveLockerPlace(this.gym.id, this.item, this.willBeMovedLockerItem, () => {

        this.nxStore.dispatch(
            showToast({
                text: `${this.curLockerItem.user_locker.user.name}님의 자리가 [락커 ${this.willBeMovedLockerItem.name}]으로 이동되었습니다.`,
            })
        )
        this.nxStore.dispatch(LockerActions.resetWillBeMovedLockerItem())
        // })
    }

    // locker category methods
    createCategory(categName: string) {
        if (!categName) {
            this.closeCategInput()
            return
        }
        this.nxStore.dispatch(LockerActions.startCreateLockerCateg({ centerId: this.center.id, categName: categName }))
        this.closeCategInput()
        this.categInput.setValue('')
    }
    deleteCategory() {
        this.nxStore.dispatch(
            LockerActions.startDeleteLockerCategory({
                centerId: this.center.id,
                categoryId: this.willBeDeletedCategory.id,
            })
        )
        this.willBeDeletedCategory = undefined
    }
    // delete locker categ modal methods
    setDelCategModalVisible(onOff: boolean) {
        this.delCategModalVisible = onOff
    }
    setWillBeDeletedCategory(categ: LockerCategory) {
        if (_.find(this.curLockerItemList, (item) => item.user_locker)) {
            this.toggleShowBlockDelCategory()
            return
        }
        this.willBeDeletedCategory = categ
        this.setDelCategModalVisible(true)
    }
    onDelCategoryCancel() {
        this.willBeDeletedCategory = undefined
        this.setDelCategModalVisible(false)
    }
    onDelCategoryConfirm() {
        this.deleteCategory()
        this.setDelCategModalVisible(false)
    }

    // bloack delete category modal method
    toggleShowBlockDelCategory() {
        this.doShowBlockDelCategory = !this.doShowBlockDelCategory
    }
    closeShowBlockDelCategory() {
        this.doShowBlockDelCategory = false
    }

    // locker item methods

    onDeleteLockerItem(lockerItem: LockerItem) {
        this.nxStore.dispatch(
            LockerActions.startDeleteLockerItem({
                centerId: this.center.id,
                categoryId: this.curLockerCateg.id,
                itemId: lockerItem.id,
                itemName: lockerItem.name,
            })
        )
    }

    // <- gridster methods   //
    initGridster() {
        this.gridsterOptions = {
            gridType: GridType.Fixed,
            compactType: CompactType.None,
            mobileBreakpoint: 450,
            displayGrid: 'onDrag&Resize',
            fixedColWidth: 65,
            fixedRowHeight: 65,
            pushItems: false,
            draggable: {
                enabled: false,
            },
            resizable: {
                enabled: false,
            },
            itemChangeCallback: (item, itemComponent) => {
                console.log('changed item: ', item, ', itemId: ', item['id'])
                if (item['id']) {
                    this.updateGridItem(item)
                } else {
                    this.createGridItem(item)
                }
            },
        }

        // this.itemList = []
    }

    changeGridsterOptionToEditMode() {
        if (this.lockerCategLength > 0 && !this.curLockerCateg) {
            this.nxStore.dispatch(LockerActions.setCurLockerCateg({ lockerCateg: this.lockerCategList[0] }))
            this.nxStore.dispatch(
                LockerActions.startGetLockerItemList({
                    centerId: this.center.id,
                    categoryId: this.lockerCategList[0].id,
                })
            )
        }
        this.gridsterOptions = {
            ...this.gridsterOptions,
            draggable: {
                enabled: true,
            },
        }
    }

    changeGridsterOptionToNormalMode() {
        this.gridsterOptions = {
            ...this.gridsterOptions,
            draggable: {
                enabled: false,
            },
        }
    }

    onEditModeChange(e: boolean) {
        e == true ? this.changeGridsterOptionToEditMode() : this.changeGridsterOptionToNormalMode()
    }

    addGridItem() {
        this.nxStore.dispatch(
            LockerActions.addLockerItemToList({
                lockerItem: {
                    name: String(this.curLockerItemList.length + 1),
                    rows: 1,
                    cols: 1,
                } as LockerItem,
            })
        )
        // this.testItemList.push({ name: String(this.testItemList.length + 1), rows: 1, cols: 1 })
    }
    createGridItem(item: GridsterItem) {
        console.log('createGridItem item : ', item, item['name'])
        this.nxStore.dispatch(
            LockerActions.startCreateLockerItem({
                centerId: this.center.id,
                categoryId: this.curLockerCateg.id,
                reqBody: {
                    name: item['name'],
                    x: item.x,
                    y: item.y,
                    rows: item.rows,
                    cols: item.cols,
                },
            })
        )
        // this.gymLockerState.createItem(this.gym.id, this.selectedCateg.id, item, (newList) => {
        //     const _newItem = this.itemList[this.itemList.length - 1]
        //     const newItem = _.find(newList, (item) => {
        //         return _newItem.x == item.x && _newItem.y == item.y
        //     })
        //     _.assign(this.itemList[this.itemList.length - 1], newItem)
        // })
    }
    updateGridItem(item: GridsterItem) {
        this.nxStore.dispatch(
            LockerActions.startUpdateLockerItem({
                centerId: this.center.id,
                categoryId: this.curLockerCateg.id,
                itemId: String(item['id']),
                reqBody: {
                    name: item['name'],
                    x: item.x,
                    y: item.y,
                    rows: item.rows,
                    cols: item.cols,
                },
            })
        )
    }

    //  gridster methods --> //
}

const helpTexts = [
    {
        title: '변경모드가 무엇인가요?',
        text: '카테고리 내 락커는 최대 100개까지 생성하실 수 있으며, 락커 카테고리는 필요하신 만큼 추가하실 수 있어요.',
    },
    {
        title: '락커 배치는 어떻게 하나요?',
        text: '카테고리 내 락커는 최대 100개까지 생성하실 수 있으며, 락커 카테고리는 필요하신 만큼 추가하실 수 있어요.',
    },
    {
        title: '몇 개까지 만들 수 있나요?',
        text: '카테고리 내 락커는 최대 100개까지 생성하실 수 있으며, 락커 카테고리는 필요하신 만큼 추가하실 수 있어요.',
    },
]
