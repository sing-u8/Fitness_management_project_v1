import {
    Component,
    Input,
    ElementRef,
    Renderer2,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    AfterViewChecked,
    ViewChild,
    OnInit,
    OnDestroy,
} from '@angular/core'
import { Subscription } from 'rxjs'
import * as _ from 'lodash'

import { StorageService } from '@services/storage.service'
import { GymLockerService } from '@services/gym-locker.service'
import {
    GymRegisterMembershipLockerStateService,
    ChoseLockers,
} from '@services/etc/gym-register-membership-locker-state.service'

import { CompactType, GridsterConfig, GridType } from 'angular-gridster2'

import { LockerCategory } from '@schemas/locker-category'
import { LockerItem } from '@schemas/locker-item'
import { Center } from '@schemas/center'

@Component({
    selector: 'rw-lockerSelectModal',
    templateUrl: './locker-select-modal.component.html',
    styleUrls: ['./locker-select-modal.component.scss'],
})
export class LockerSelectModalComponent implements AfterViewChecked, OnChanges, OnInit, OnDestroy {
    @Input() visible: boolean

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<any>()

    changed: boolean

    public isMouseModalDown: boolean

    public center: Center

    // gridster vars
    public gridsterOptions: GridsterConfig

    // locker variables
    public categList: LockerCategory[]
    public selectedCateg: LockerCategory
    public itemList: Array<Partial<LockerItem>>

    public choseLockers: ChoseLockers
    public choseLockersSubscription: Subscription

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private storageService: StorageService,
        private gymLockerService: GymLockerService,
        private gymRegisterMLState: GymRegisterMembershipLockerStateService
    ) {
        this.isMouseModalDown = false

        this.choseLockersSubscription = this.gymRegisterMLState.selectChoseLockers().subscribe((choseLockers) => {
            this.choseLockers = choseLockers
            this.getLockerCategoryOnStateSelect()
            console.log('gymRegisterMLState.selectChoseLockers ----- this.choseLockers: ', this.choseLockers)
        })
    }

    ngOnInit() {
        this.categList = []
        this.itemList = []

        this.center = this.storageService.getGym()

        this.gymLockerService.getCategoryList(this.center.id).subscribe((categs) => {
            this.categList = categs
            this.selectedCateg = this.categList[0]

            this.gymLockerService.getItemList(this.center.id, this.selectedCateg.id).subscribe((items) => {
                this.itemList = items
            })
        })

        this.initGridster()
    }
    ngOnDestroy() {
        this.choseLockersSubscription.unsubscribe()
    }
    ngOnChanges(changes: SimpleChanges) {
        if (!changes.visible.firstChange) {
            if (changes.visible.previousValue != changes.visible.currentValue) {
                this.changed = true
            }
        }
    }

    ngAfterViewChecked() {
        if (this.changed) {
            this.changed = false

            if (this.visible) {
                this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'display-block')
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
            }
        }
    }

    onCancel(): void {
        this.cancel.emit({})
    }

    onConfirm(): void {
        this.confirm.emit({})
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }

    //

    // gridster methods
    initGridster() {
        this.gridsterOptions = {
            gridType: GridType.Fixed,
            compactType: CompactType.None,

            mobileBreakpoint: 0,
            fixedColWidth: 50,
            fixedRowHeight: 50,
            pushItems: false,
            draggable: {
                enabled: false,
            },
            resizable: {
                enabled: false,
            },
        }
    }

    onSelectChange(categ) {
        this.gymLockerService.getItemList(this.center.id, categ.id).subscribe((items) => {
            this.itemList = items

            const choseCategLockers = this.choseLockers.get(this.selectedCateg.id)
            if (choseCategLockers) {
                this.itemList.forEach((lockerItem, idx) => {
                    if (choseCategLockers[lockerItem.id]) {
                        this.itemList[idx].status = 'use'
                    }
                })
            }
            console.log('item list: ', this.itemList)
        })
    }

    getLockerCategoryOnStateSelect() {
        if (!this.selectedCateg) return
        this.gymLockerService.getItemList(this.center.id, this.selectedCateg.id).subscribe((items) => {
            this.itemList = items

            const choseCategLockers = this.choseLockers.get(this.selectedCateg.id)
            if (choseCategLockers) {
                this.itemList.forEach((lockerItem, idx) => {
                    if (choseCategLockers[lockerItem.id]) {
                        this.itemList[idx].status = 'use'
                    }
                })
            }
        })
    }

    onLockerItemClick(item: LockerItem, index: number) {
        const _item = item
        _item.status = 'use'
        this.choseLockers.set(this.selectedCateg.id, {
            ...this.choseLockers.get(this.selectedCateg.id),
            ...{ [_item.id]: _item },
        })
        this.gymRegisterMLState.setCHoseLockers(this.choseLockers)
        this.confirm.emit({ locker: item, category: this.selectedCateg })
    }
}
