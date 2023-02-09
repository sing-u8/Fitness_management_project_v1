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
import { DashboardHelperService } from '@services/center/dashboard-helper.service'
import { InputHelperService } from '@services/helper/input-helper.service'

// schemas
import { LockerCategory } from '@schemas/locker-category'
import { LockerItem } from '@schemas/locker-item'
import { Center } from '@schemas/center'

// rxjs
import { Subject } from 'rxjs'
import { takeUntil, take } from 'rxjs/operators'

// ngrx
import { Store, select } from '@ngrx/store'

import * as FromLocker from '@centerStore/reducers/sec.locker.reducer'
import * as LockerSelector from '@centerStore/selectors/sec.locker.selector'
import * as LockerActions from '@centerStore/actions/sec.locker.actions'
import { UserLocker } from '@schemas/user-locker'

@Component({
    selector: 'locker',
    templateUrl: './locker.component.html',
    styleUrls: ['./locker.component.scss'],
})
export class LockerComponent implements OnInit, AfterViewInit, OnDestroy {
    public readonly maxLockerLength = 200

    // ngrx state
    public isLoading$ = this.nxStore.pipe(select(LockerSelector.isLoading))
    public curLockerItemListIsLoading$ = this.nxStore.pipe(select(LockerSelector.curLockerItemListIsLoading))

    public curLockerCateg: LockerCategory = FromLocker.initialLockerState.curLockerCateg
    public curLockerItemList: Array<LockerItem> = _.cloneDeep(FromLocker.initialLockerState.curLockerItemList)
    public LockerGlobalMode: FromLocker.LockerGlobalMode = FromLocker.initialLockerState.lockerGlobalMode
    public willBeMovedLockerItem: LockerItem = FromLocker.initialLockerState.willBeMovedLockerItem
    public curLockerItem: LockerItem = FromLocker.initialLockerState.curLockerItem
    public curUserLocker: UserLocker = FromLocker.initialLockerState.curUserLocker
    public lockerCategLength = 0
    public lockerCategList: Array<LockerCategory> = []

    // component vars
    public center: Center = undefined
    public isEditMode = false

    public categoryChanged = false

    // input vars and  flags
    public categInput: FormControl
    public isCategInputOpen = false
    // public lockerIndexInput: FormControl
    public lockerItemCountInput: FormControl
    replaceToNumber() {
        const input = this.lockerItemCountInput.value.replace(/[^0-9]/gi, '')
        this.lockerItemCountInput.setValue(input)
    }

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

    // block delete categ vars
    public doShowBlockDelCategory = false
    public blockDelCategTexts = {
        text: '앗! 등록된 회원이 있어요.😮',
        subText: `카테고리 내 락커를 모두 비우신 후,
        다시 카테고리를 삭제해주세요.`,
        confirmButtonText: '확인',
    }
    toggleShowBlockDelCategory() {
        this.doShowBlockDelCategory = !this.doShowBlockDelCategory
    }
    closeShowBlockDelCategory() {
        this.doShowBlockDelCategory = false
    }

    // block delete locker item vars
    public doShowBlockDelLockerItem = false
    public blockDelLockerItemTexts = {
        text: '앗! 등록된 회원이 있어요.😮',
        subText: `락커를 비우신 후,
        다시 삭제해주세요.`,
        confirmButtonText: '확인',
    }
    toggleShowBlockDelLockerItem() {
        this.doShowBlockDelLockerItem = !this.doShowBlockDelLockerItem
    }
    closeShowBlockDelLockerItem() {
        this.doShowBlockDelLockerItem = false
    }

    public unSubscriber$ = new Subject<boolean>()

    public originOrder = originalOrder

    public alterGuide = true

    @ViewChildren(LockerCategoryComponent) lockerCategories!: QueryList<LockerCategoryComponent>
    @ViewChild('l_locker_category') l_locker_category: ElementRef

    constructor(
        private nxStore: Store,
        private storageService: StorageService,
        private fb: FormBuilder,
        private dashboardHelperService: DashboardHelperService,
        private inputHelperService: InputHelperService
    ) {}

    ngOnInit(): void {
        this.categInput = this.fb.control('')
        this.lockerItemCountInput = this.fb.control('0')

        this.center = this.storageService.getCenter()
        this.nxStore.pipe(select(LockerSelector.curCenterId), take(1)).subscribe((curCenterId) => {
            if (curCenterId != this.center.id) {
                // this.lockerSerState.resetLockerItemList()
                this.nxStore.dispatch(LockerActions.resetAll())
                this.nxStore.dispatch(LockerActions.startLoadLockerCategs({ centerId: this.center.id }))
            }
        })
        this.nxStore
            .pipe(takeUntil(this.unSubscriber$), select(LockerSelector.curLockerCateg))
            .subscribe((curLockerCateg) => {
                if (!curLockerCateg) {
                    this.nxStore.dispatch(LockerActions.resetCurLockerItem())
                    this.nxStore.dispatch(LockerActions.resetCurLockerItemList())
                }
                this.curLockerCateg = curLockerCateg
                this.categoryScrollControl(curLockerCateg)
                this.categoryChanged = true
            })

        this.nxStore.dispatch(LockerActions.setCurCenterId({ centerId: this.center.id }))

        this.nxStore
            .pipe(takeUntil(this.unSubscriber$), select(LockerSelector.curLockerItemList))
            .subscribe((curLockerItemList) => {
                if (this.categoryChanged) {
                    // when lcoker category changed
                    this.curLockerItemList = _.cloneDeep(curLockerItemList)
                    this.lockerItemCountInput.setValue(String(this.getMaximumLockerId(curLockerItemList) + 1))
                    this.categoryChanged = false
                } else {
                    const preArr = _.differenceWith(this.curLockerItemList, curLockerItemList, _.isEqual)
                    const postArr = _.differenceWith(curLockerItemList, this.curLockerItemList, _.isEqual)

                    if (postArr.length > 0) {
                        const indexes = _.map(preArr, (v) =>
                            _.findIndex(this.curLockerItemList, (item) => {
                                return _.isEqual(item, v)
                            })
                        )
                        _.forEach(indexes, (v, i) => {
                            this.curLockerItemList[v] = _.cloneDeep(curLockerItemList[v])
                            _.assign(this.curLockerItemList[v], _.cloneDeep(postArr[i]))
                        })
                    }
                }

                this.checkIsLockerCountItemEnable()
            })
        this.nxStore.pipe(takeUntil(this.unSubscriber$), select(LockerSelector.LockerGlobalMode)).subscribe((lgm) => {
            this.LockerGlobalMode = lgm
        })
        this.nxStore
            .pipe(takeUntil(this.unSubscriber$), select(LockerSelector.willBeMovedLockerItem))
            .subscribe((willBeMovedLockerItem) => {
                this.willBeMovedLockerItem = willBeMovedLockerItem
            })
        this.nxStore
            .pipe(takeUntil(this.unSubscriber$), select(LockerSelector.curLockerItem))
            .subscribe((curLockerItem) => {
                this.curLockerItem = curLockerItem
            })
        this.nxStore
            .pipe(takeUntil(this.unSubscriber$), select(LockerSelector.lockerCategLength))
            .subscribe((lcLength) => {
                this.lockerCategLength = lcLength
            })

        this.nxStore.pipe(takeUntil(this.unSubscriber$), select(LockerSelector.LockerCategList)).subscribe((lcList) => {
            this.lockerCategList = lcList
        })
        this.nxStore.pipe(takeUntil(this.unSubscriber$), select(LockerSelector.curUserLocker)).subscribe((cul) => {
            this.curUserLocker = cul
        })

        this.initGridster()
    }
    ngAfterViewInit(): void {}

    ngOnDestroy(): void {
        console.log('ng on destroy in locker component : ')
        this.unSubscriber$.next(true)
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

    checkIsLockerCountItemEnable() {
        if (this.curLockerItemList.length >= this.maxLockerLength) {
            this.lockerItemCountInput.disable()
        } else {
            this.lockerItemCountInput.enable()
        }
    }

    // categ input method
    // onLockerItemClick(lockerItem: LockerItem) {
    //     this.lockerItemCountInput.setValue(String(this.getMaximumLockerId(this.curLockerItemList) + 1))
    // }

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
        this.nxStore.dispatch(
            LockerActions.startMoveLockerTicket({
                centerId: this.center.id,
                userId: this.curUserLocker.center_user_id,
                lockerTicketId: this.curUserLocker.id,
                startLockerReqBody: { locker_item_id: this.willBeMovedLockerItem.id },
                cb: () => {
                    this.dashboardHelperService.synchronizeUserLocker(this.center.id, this.curUserLocker.center_user_id)
                },
            })
        )
        this.doShowMoveLockerTicketModal = false
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
        if (_.find(this.curLockerItemList, (item) => item.state_code != 'locker_item_state_empty')) {
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

    // locker item methods

    onDeleteLockerItem(lockerItem: LockerItem) {
        if (lockerItem.state_code == 'locker_item_state_in_use') {
            this.toggleShowBlockDelLockerItem()
            return
        }

        this.curLockerItemList = _.filter(this.curLockerItemList, (v) => !_.isEqual(lockerItem, v))
        this.nxStore.dispatch(
            LockerActions.startDeleteLockerItem({
                centerId: this.center.id,
                categoryId: this.curLockerCateg.id,
                item: lockerItem,
                curItemList: _.cloneDeep(this.curLockerItemList),
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
            swap: true,

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
        const newItem = {
            name: String(Number(this.lockerItemCountInput.value)),
            rows: 1,
            cols: 1,
        } as LockerItem
        this.curLockerItemList.push(newItem)
        if (this.curLockerItemList.length < this.maxLockerLength) {
            this.lockerItemCountInput.setValue(String(Number(this.lockerItemCountInput.value) + 1))
        }
        // this.lockerItemCountInput.setValue(String(this.getMaximumLockerId(this.curLockerItemList) + 1))
    }
    createGridItem(item: GridsterItem) {
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
                cbFn: () => {},
            })
        )
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
                curLockerItems: _.cloneDeep(this.curLockerItemList),
            })
        )
    }

    //  gridster methods --> //
    onClickOutsideOfLocker(e) {
        if (
            this.LockerGlobalMode == 'moveLockerTicket'
            // && _.findIndex(e.path, (el) => el['id'] == 'rw-locker-detail-box') == -1
        ) {
            this.nxStore.dispatch(LockerActions.setLockerGlobalMode({ lockerMode: 'normal' }))
        }
    }

    restrictToNumber(event) {
        return this.inputHelperService.restrictToNumber(event)
    }
}
