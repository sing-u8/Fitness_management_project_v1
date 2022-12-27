import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnDestroy,
    AfterViewInit,
    ViewChild,
    ElementRef,
    Renderer2,
} from '@angular/core'
import { FormBuilder, FormControl } from '@angular/forms'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'

import { StorageService } from '@services/storage.service'

import { LockerCategory } from '@schemas/locker-category'
import { Center } from '@schemas/center'

import { DashboardHelperService } from '@services/center/dashboard-helper.service'

// ngrx
import { Store, select } from '@ngrx/store'
import * as FromLocker from '@centerStore/reducers/sec.locker.reducer'
import * as LockerSelector from '@centerStore/selectors/sec.locker.selector'
import * as LockerActions from '@centerStore/actions/sec.locker.actions'

@Component({
    selector: 'rw-locker-category',
    templateUrl: './locker-category.component.html',
    styleUrls: ['./locker-category.component.scss'],
})
export class LockerCategoryComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('categoryContainer') categoryContainer: ElementRef
    @ViewChild('categoryDropDown') categoryDropDown: ElementRef
    @ViewChild('lockerCategoryImage') lockerCategoryImage: ElementRef

    @Input() category: LockerCategory
    @Input() isEditMode: boolean

    @Output() onDeleteCategory = new EventEmitter()
    emitOnDeleteCategory(e) {
        this.onDeleteCategory.emit(this.category)
        this.closeDropdown(e)
        e.stopPropagation()
    }

    public center: Center

    public isDropdownOpen: boolean
    public isActivated: boolean

    public isChangeName: boolean
    public changeNameInput: FormControl

    public lockerGlobalMode: FromLocker.LockerGlobalMode
    public curLockerCateg: LockerCategory = FromLocker.initialLockerState.curLockerCateg

    public unsubscriber$ = new Subject<void>()

    constructor(
        private nxStore: Store,
        private storageService: StorageService,
        private fb: FormBuilder,
        private renderer: Renderer2,
        private dashboardHelperService: DashboardHelperService
    ) {
        this.changeNameInput = this.fb.control('')
    }

    ngOnInit(): void {
        this.isDropdownOpen = false
        this.isChangeName = false
        this.center = this.storageService.getCenter()

        this.changeNameInput.setValue(this.category.name)
        this.nxStore.pipe(select(LockerSelector.curLockerCateg), takeUntil(this.unsubscriber$)).subscribe((lc) => {
            this.curLockerCateg = lc
            if (lc != FromLocker.initialLockerState.curLockerCateg) {
                this.isActivated = this.category.id == lc.id ? true : false
            }
        })
        this.nxStore.pipe(select(LockerSelector.LockerGlobalMode), takeUntil(this.unsubscriber$)).subscribe((lgm) => {
            this.lockerGlobalMode = lgm
        })
    }
    ngAfterViewInit(): void {}
    ngOnDestroy(): void {
        this.unsubscriber$.next()
        this.unsubscriber$.complete()
    }

    setCategActivate() {
        if (this.category.id == this.curLockerCateg?.id) {
            return
        }

        this.nxStore.dispatch(LockerActions.setCurLockerCateg({ lockerCateg: this.category }))
        this.nxStore.dispatch(
            LockerActions.startGetLockerItemList({ centerId: this.center.id, categoryId: this.category.id })
        )
        if (this.lockerGlobalMode != 'moveLockerTicket') {
            this.nxStore.dispatch(LockerActions.resetCurLockerItem())
        }
    }

    toggleDropdown(e) {
        // pointerevent.clientX - pointerevent.layerX - dropdown.style.width + categorycontainer.offsetWidth
        // pointerevent.clientY - pointerevent.layerY + (categorycontainer.height + margin)
        const drX = e.clientX - e.layerX - 105 + this.categoryContainer.nativeElement.offsetWidth
        const drY = e.clientY - e.layerY + 42

        this.renderer.setStyle(this.categoryDropDown.nativeElement, 'left', `${drX}px`)
        this.renderer.setStyle(this.categoryDropDown.nativeElement, 'top', `${drY}px`)

        this.isDropdownOpen = !this.isDropdownOpen
        this.setCategActivate()

        // e.stopPropagation()
    }
    closeDropdown(e) {
        // 선택된 카테고리와 이 카테고리와 같고 locker-category-image-container 클래스를 가지는 엘리먼트를 눌렀을 때는 드롭다운 보여주고 아니면 감추기
        this.isDropdownOpen = !!(
            this.curLockerCateg != FromLocker.initialLockerState.curLockerCateg &&
            this.curLockerCateg.id == this.category.id &&
            e.path.includes(this.lockerCategoryImage.nativeElement)
        )
    }

    toggleIsChangeName(e) {
        this.isChangeName = !this.isChangeName
        this.closeDropdown(e)
        e.stopPropagation()
    }
    closeIsChangeName() {
        this.isChangeName = false
    }

    changeCategName(changedName: string) {
        if (this.category.name == this.changeNameInput.value || !this.changeNameInput.value) {
            this.isChangeName = false
            return
        } else {
            this.nxStore.dispatch(
                LockerActions.startUpdateLockerCategory({
                    centerId: this.center.id,
                    categoryId: this.category.id,
                    updateName: changedName,
                    cb: () => {
                        this.dashboardHelperService.synchronizeUserLockerCategory(this.center.id)
                    },
                })
            )
            this.isChangeName = false
            this.changeNameInput.setValue(changedName)
        }
    }
}
