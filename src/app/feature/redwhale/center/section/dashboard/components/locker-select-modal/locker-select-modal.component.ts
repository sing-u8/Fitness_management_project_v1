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
import _ from 'lodash'

import { StorageService } from '@services/storage.service'
import { CenterLockerService } from '@services/center-locker.service'
// import {
//     GymRegisterMembershipLockerStateService,
//     ChoseLockers,
// } from '@services/etc/gym-register-membership-locker-state.service'

import { CompactType, GridsterConfig, GridType } from 'angular-gridster2'

import { ChoseLockers, UpdateChoseLocker } from '@schemas/center/dashboard/register-ml-fullmodal'
import { LockerCategory } from '@schemas/locker-category'
import { LockerItem } from '@schemas/locker-item'
import { Center } from '@schemas/center'

@Component({
    selector: 'db-lockerSelectModal',
    templateUrl: './locker-select-modal.component.html',
    styleUrls: ['./locker-select-modal.component.scss'],
})
export class LockerSelectModalComponent implements AfterViewChecked, OnChanges, OnInit, OnDestroy {
    @Input() visible: boolean
    @Input() choseLockers: ChoseLockers
    @Input() lockerListInit: boolean

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<any>()
    @Output() onItemClick = new EventEmitter<UpdateChoseLocker>()

    changed: boolean

    public isMouseModalDown: boolean

    public center: Center

    // gridster vars
    public gridsterOptions: GridsterConfig
    public lockerLoaded: boolean

    // locker variables
    public categList: LockerCategory[]
    public selectedCateg: LockerCategory
    public itemList: Array<LockerItem>
    public originItemList: Array<LockerItem>

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private storageService: StorageService,
        private CenterLockerService: CenterLockerService
    ) {
        this.isMouseModalDown = false
    }

    ngOnInit() {
        this.categList = []
        this.itemList = []

        this.center = this.storageService.getCenter()

        this.CenterLockerService.getCategoryList(this.center.id).subscribe((categs) => {
            this.categList = categs
            this.selectedCateg = this.categList[0]
            this.lockerLoaded = false

            if (this.selectedCateg?.id) {
                this.CenterLockerService.getItemList(this.center.id, this.selectedCateg.id).subscribe((items) => {
                    this.itemList = _.cloneDeep(items)
                    this.originItemList = items
                    this.lockerLoaded = true
                })
            }
        })

        this.initGridster()
    }
    ngOnDestroy() {}
    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && !changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
        if (changes['lockerListInit'] && changes['lockerListInit'].currentValue == true && this.selectedCateg?.id) {
            this.CenterLockerService.getItemList(this.center.id, this.selectedCateg.id).subscribe((items) => {
                this.itemList = items
            })
        }
        if (changes['choseLockers'] && !changes['choseLockers'].firstChange) {
            this.itemList = _.cloneDeep(this.originItemList)
            if (!_.isEmpty(this.selectedCateg)) {
                const choseCategLockers = this.choseLockers.get(this.selectedCateg.id)
                if (choseCategLockers) {
                    this.itemList.forEach((lockerItem, idx) => {
                        if (choseCategLockers[lockerItem.id]) {
                            this.itemList[idx].state_code = 'locker_item_state_in_use'
                        }
                    })
                }
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
        this.lockerLoaded = false
        this.CenterLockerService.getItemList(this.center.id, categ.id).subscribe((items) => {
            this.itemList = _.cloneDeep(items)
            this.originItemList = items

            const choseCategLockers = this.choseLockers.get(this.selectedCateg.id)
            if (choseCategLockers) {
                this.itemList.forEach((lockerItem, idx) => {
                    if (choseCategLockers[lockerItem.id]) {
                        this.itemList[idx].state_code = 'locker_item_state_in_use'
                    }
                })
            }
            this.lockerLoaded = true
        })
    }

    onLockerItemClick(item: LockerItem, index: number) {
        const _item = item
        _item.state_code = 'locker_item_state_in_use'

        this.onItemClick.emit({
            locker: _item,
            lockerCategId: this.selectedCateg.id,
        })
        this.confirm.emit({ locker: item, category: this.selectedCateg })
    }
}
