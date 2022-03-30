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
import dayjs from 'dayjs'

import { StorageService } from '@services/storage.service'
import { CenterLockerService } from '@services/center-locker.service'
import { CenterUsersLockerService } from '@services/center-users-locker.service.service'

import { GlobalService } from '@services/global.service'

import { CompactType, GridsterConfig, GridType } from 'angular-gridster2'

import { UserLocker } from '@schemas/user-locker'
import { LockerCategory } from '@schemas/locker-category'
import { LockerItem } from '@schemas/locker-item'
import { Center } from '@schemas/center'

// !! 아직 수정할 부분 있음
@Component({
    selector: 'rw-locker-shift-modal',
    templateUrl: './locker-shift-modal.component.html',
    styleUrls: ['./locker-shift-modal.component.scss'],
})
export class LockerShiftModalComponent implements AfterViewChecked, OnChanges, OnInit, OnDestroy {
    @Input() visible: boolean
    @Input() shiftedLockerTicket: UserLocker

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<any>()

    changed: boolean

    public isMouseModalDown: boolean
    public shiftConfirmModal = false
    public shiftLocker: LockerItem = undefined
    public shiftConfirmText = {
        text: ``,
        subText: `확인 버튼을 클릭하시면,
                즉시 회원의 락커 자리가 변경돼요.`,
        cancelButtonText: '취소',
        confirmButtonText: '이동',
    }

    public isSameCategWithSelectedTicket = false

    public center: Center

    // gridster vars
    public gridsterOptions: GridsterConfig

    // locker variables
    public categList: LockerCategory[]
    public selectedCateg: LockerCategory = undefined
    public itemList: Array<LockerItem> // !! Partial<LockerItem>

    // public choseLockers: ChoseLockers
    // public choseLockersSubscription: Subscription

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private storageService: StorageService,
        private centerLockerService: CenterLockerService,
        private centerUsersLockerService: CenterUsersLockerService,
        private globalService: GlobalService
    ) {
        this.isMouseModalDown = false
    }

    ngOnInit() {
        this.categList = []
        this.itemList = []

        this.center = this.storageService.getCenter()

        this.centerLockerService.getCategoryList(this.center.id).subscribe((categs) => {
            console.log('locker categ list: ', categs)
            this.categList = categs
            if (this.categList.length > 0) {
                this.selectedCateg = this.categList[0]
                this.centerLockerService.getItemList(this.center.id, this.selectedCateg.id).subscribe((items) => {
                    this.itemList = items
                })
            }
        })

        this.initGridster()
    }
    ngOnDestroy() {
        // this.choseLockersSubscription.unsubscribe()
    }
    ngOnChanges(changes: SimpleChanges) {
        if (!changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
        // !!
        // if (
        //     this.selectedCateg &&
        //     this.shiftedLockerTicket &&
        //     this.selectedCateg.id == this.shiftedLockerTicket?.locker_category_id
        // ) {
        //     this.isSameCategWithSelectedTicket = true
        // }
    }

    ngAfterViewChecked() {
        if (this.changed) {
            this.changed = false

            if (this.visible) {
                this.showModal()
            } else {
                this.closeModal()
            }
        }
    }
    showModal() {
        this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'display-block')
        this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
        setTimeout(() => {
            this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
            this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
        }, 0)
    }
    closeModal() {
        this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
        this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
        setTimeout(() => {
            this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
            this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
        }, 200)
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
        // !!
        // if (categ.id == this.shiftedLockerTicket?.locker_category_id) {
        //     this.isSameCategWithSelectedTicket = true
        // }
        this.centerLockerService.getItemList(this.center.id, categ.id).subscribe((items) => {
            this.itemList = items
            console.log('item list: ', this.itemList)
        })
    }

    onLockerItemClick(item: LockerItem, index: number) {
        this.shiftLocker = item
        this.shiftConfirmText.text = `[락커 ${this.shiftLocker.name}]으로 자리를 이동하시겠어요?`
        this.openShiftConfirmModal()
        this.confirm.emit({ locker: item, category: this.selectedCateg })
    }
    // shiftConfirmModal func
    openShiftConfirmModal() {
        this.shiftConfirmModal = true
        this.visible = false
        this.closeModal()
    }
    onShiftCancel() {
        this.visible = true
        this.showModal()
        this.shiftConfirmModal = false
    }
    onShiftConfirm() {
        this.centerUsersLockerService
            .updateLockerTicket(
                this.shiftedLockerTicket.center.id,
                this.shiftedLockerTicket.user.id,
                this.shiftedLockerTicket.id,
                {
                    start_date: dayjs().format('YYYY-MM-DD'),
                    end_date: this.shiftedLockerTicket.end_date,
                }
            )
            .subscribe((__) => {
                this.centerLockerService.getItemList(this.center.id, this.selectedCateg.id).subscribe((items) => {
                    this.itemList = items
                    this.shiftConfirmModal = false
                    this.confirm.emit({})
                    this.globalService.showToast(
                        `${this.shiftedLockerTicket.user.name}님의 락커가 [${this.selectedCateg.name}] 락커${this.shiftLocker.name}으로 이동되었습니다.`
                    )
                })
            })
    }
}
