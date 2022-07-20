import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core'
import { FormBuilder, FormControl } from '@angular/forms'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import dayjs from 'dayjs'

import { StorageService } from '@services/storage.service'
import { LockerCategory } from '@schemas/locker-category'
import { LockerItem } from '@schemas/locker-item'
import { Center } from '@schemas/center'

// ngrx
import { Store, select } from '@ngrx/store'
import * as LockerSelector from '@centerStore/selectors/sec.locker.selector'
import * as LockerAction from '@centerStore/actions/sec.locker.actions'
import { LockerGlobalMode } from '@centerStore/reducers/sec.locker.reducer'
import _ from 'lodash'

@Component({
    selector: 'rw-locker-item',
    templateUrl: './locker-item.component.html',
    styleUrls: ['./locker-item.component.scss'],
})
export class LockerItemComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() lockerItem: LockerItem
    @Input() selectedLockerItem: LockerItem
    @Input() curLockerItems: LockerItem[]
    @Input() editMode: boolean
    @Input() switchPlaceMode: boolean

    @Output() onItemSelected = new EventEmitter<LockerItem>()
    @Output() onItemDelete = new EventEmitter<LockerItem>()
    @Output() onMovableLockerClick = new EventEmitter<LockerItem>()

    public center: Center

    public selected: boolean
    public isExceed: boolean
    public isSevenDaysRemain: boolean

    public doNameInputShow: boolean
    public nameInput: FormControl

    public isSameWillBeMovedLocker: boolean
    public lockerGlobalMode: LockerGlobalMode = 'normal'
    public curLockerCateg: LockerCategory = undefined

    public unSubscriber$ = new Subject<void>()

    constructor(private storageService: StorageService, private nxStore: Store, private fb: FormBuilder) {
        this.nameInput = this.fb.control('')
    }

    ngOnInit(): void {
        this.doNameInputShow = false
        this.isExceed = false
        this.isSevenDaysRemain = false
        this.center = this.storageService.getCenter()
        this.nameInput.setValue(this.lockerItem.name)

        this.nxStore
            .pipe(select(LockerSelector.curLockerItem), takeUntil(this.unSubscriber$))
            .subscribe((curLockerItem) => {
                if (curLockerItem?.id != this.lockerItem.id) {
                    this.selected = false
                } else if (curLockerItem && this.lockerItem.id && curLockerItem.id == this.lockerItem.id) {
                    this.selected = true
                }
                this.setStatusIcon()
            })

        this.nxStore.pipe(select(LockerSelector.LockerGlobalMode), takeUntil(this.unSubscriber$)).subscribe((gm) => {
            this.lockerGlobalMode = gm
        })

        this.nxStore
            .pipe(select(LockerSelector.willBeMovedLockerItem), takeUntil(this.unSubscriber$))
            .subscribe((mi) => {
                this.isSameWillBeMovedLocker = mi && this.lockerItem.id == mi.id ? true : false
            })

        this.nxStore.pipe(select(LockerSelector.curLockerCateg), takeUntil(this.unSubscriber$)).subscribe((lc) => {
            this.curLockerCateg = lc
        })
    }
    ngAfterViewInit(): void {}
    ngOnDestroy(): void {
        this.unSubscriber$.next()
        this.unSubscriber$.complete()
    }

    // ------------------------------------------------------------------------ //
    setStatusIcon() {
        if (this.lockerItem.user_locker_end_date) {
            const date1 = dayjs().format('YYYY-MM-DD')
            const date2 = dayjs(this.lockerItem.user_locker_end_date)
            const dayDiff = date2.diff(date1, 'day')
            if (dayDiff < 8 && dayDiff >= 0) {
                this.isSevenDaysRemain = true
                this.isExceed = false
            } else if (dayDiff < 0) {
                this.isExceed = true
                this.isSevenDaysRemain = false
            }
        }
    }

    toggleNameInputShow() {
        this.doNameInputShow = !this.doNameInputShow
    }
    changeItemName() {
        // this.nameInput = this.lockerItem.name.replace(/[^0-9]/gi, '')
        if (!this.nameInput.value || this.nameInput.value == this.lockerItem.name) {
            this.nameInput.setValue(this.lockerItem.name)
            this.toggleNameInputShow()
            return
        }
        // this.lockerItem.name = this.nameInput.value

        this.nxStore.dispatch(
            LockerAction.startUpdateLockerItem({
                centerId: this.center.id,
                categoryId: this.curLockerCateg.id,
                itemId: this.lockerItem.id,
                reqBody: { name: this.nameInput.value },
                curLockerItems: _.cloneDeep(this.curLockerItems),
            })
        )

        this.toggleNameInputShow()
    }

    onItemClick() {
        if (this.isEditMode() || this.selectedLockerItem?.id == this.lockerItem.id) {
            return
        } else if (
            this.lockerGlobalMode == 'moveLockerTicket' &&
            this.lockerItem.state_code == 'locker_item_state_empty'
        ) {
            this.onAnotherEmptyLockerClick()
        } else if (this.lockerGlobalMode != 'moveLockerTicket') {
            this.nxStore.dispatch(LockerAction.startSetCurLockerItem({ lockerItem: _.cloneDeep(this.lockerItem) }))
            this.selected = true
        }
    }

    deleteItem() {
        this.onItemDelete.emit(this.lockerItem)
    }

    isEditMode() {
        return this.editMode == true
    }
    //  method when move locker ticket
    checkIsMoveTicket() {
        return this.lockerGlobalMode == 'moveLockerTicket'
    }
    onAnotherEmptyLockerClick() {
        this.nxStore.dispatch(LockerAction.setWillBeMovedLockerItem({ lockerItem: this.lockerItem }))
        this.onMovableLockerClick.emit(this.lockerItem)
    }

    // input eventlistener
    restrictToNumber(event) {
        const code = event.which ? event.which : event.keyCode
        if (code < 48 || code > 57) {
            return false
        } else {
            return true
        }
    }
    onInputKeyUp(event) {
        if (event.code == 'Enter') return
        if (this.nameInput.value.length > 3) {
            this.nameInput.setValue(this.nameInput.value.slice(0, 3))
        }
    }
}
