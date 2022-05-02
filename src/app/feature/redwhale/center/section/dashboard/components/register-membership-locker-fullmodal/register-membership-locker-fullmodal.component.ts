import {
    Component,
    OnInit,
    OnDestroy,
    SimpleChanges,
    ElementRef,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    Renderer2,
    OnChanges,
    AfterViewChecked,
} from '@angular/core'

import _ from 'lodash'
import dayjs from 'dayjs'

import { originalOrder } from '@helpers/pipe/keyvalue'

import { StorageService } from '@services/storage.service'

// component Store
import { RegisterMembershipLockerFullmodalStore, stateInit } from './componentStore/register-ml-fullmodal.store'
import { Observable } from 'rxjs'
//

import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { MembershipItem } from '@schemas/membership-item'
import { LockerItem } from '@schemas/locker-item'
import { LockerCategory } from '@schemas/locker-category'
import {
    MembershipLockerItem,
    ChoseLockers,
    Instructor,
    Locker,
    MembershipTicket,
    UpdateChoseLocker,
} from '@schemas/center/dashboard/register-ml-fullmodal'

@Component({
    selector: 'db-register-membership-locker-fullmodal',
    templateUrl: './register-membership-locker-fullmodal.component.html',
    styleUrls: ['./register-membership-locker-fullmodal.component.scss'],
    providers: [RegisterMembershipLockerFullmodalStore],
})
export class RegisterMembershipLockerFullmodalComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
    // modal vars and funcs
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() close = new EventEmitter<any>()
    @Output() finishRegister = new EventEmitter<any>()

    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    public changed: boolean

    //
    @Input() curUser: CenterUser

    public today = dayjs().format('YYYY.MM.DD')

    public center: Center

    public totalPriceInput = {
        cash: { price: '', name: '현금' },
        card: { price: '', name: '카드' },
        trans: { price: '', name: '계좌이체' },
        unpaid: { price: '', name: '미수금' },
    }
    public originalOrder = originalOrder

    // registration membership locker vars
    public mlItemList: Array<MembershipLockerItem> = []

    public mlItems$: Observable<Array<MembershipLockerItem>> = this.cmpStore.mlItems$
    public instructors$: Observable<Array<CenterUser>> = this.cmpStore.instructors$

    constructor(
        private renderer: Renderer2,
        private cmpStore: RegisterMembershipLockerFullmodalStore,
        private storageService: StorageService
    ) {}

    ngOnInit(): void {
        this.center = this.storageService.getCenter()
        this.cmpStore.setState(stateInit)
        this.cmpStore.getInstructorsEffect(this.center.id)
    }
    ngOnDestroy(): void {}
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible'] && !changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
    }
    ngAfterViewChecked(): void {
        if (this.changed) {
            this.changed = false

            if (this.visible) {
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)
            } else {
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)

                // !! add init methods
            }
        }
    }
    // ml list method
    onMLItemRemove(idx: number) {
        this.cmpStore.removeMlItem(idx)
    }
    onLockerItemSave(data: { index: number; item: Locker }) {
        this.cmpStore.modifyMlItem(data)
    }
    onLockerItemModify(data: { index: number; item: Locker }) {
        this.cmpStore.modifyMlItem(data)
    }

    onMemberhispTicketItemSave(data: { index: number; item: MembershipTicket }) {
        this.cmpStore.modifyMlItem(data)
    }
    onMemberhispTicketItemModify(data: { index: number; item: MembershipTicket }) {
        this.cmpStore.modifyMlItem(data)
    }

    onLockerItemClick(data: UpdateChoseLocker) {
        this.cmpStore.updateChoseLockers(data)
    }

    // fullmodal vars and funcs
    closeModal() {
        this.close.emit()
    }
    //

    // modal methods
    public doShowLockerSelectModal = false
    public doShowMembershipListModal = false
    toggleLockerSelectModal() {
        this.doShowLockerSelectModal = !this.doShowLockerSelectModal
    }
    closeLockerSelectModal() {
        this.doShowLockerSelectModal = false
    }
    onLockerSelected(item: { locker: LockerItem; category: LockerCategory }) {
        // this.gymRegisterMlState.create(this.gymRegisterMlState.initLockerItem(item.locker, item.category))
        this.cmpStore.addMlItem(this.cmpStore.initLockerItem(item.locker, item.category))
        this.closeLockerSelectModal()
        // console.log('onLockerSelected: ', item, this.gymRegisterMlState.itemList, this.itemList)
    }

    toggleMembershipListModal() {
        this.doShowMembershipListModal = !this.doShowMembershipListModal
    }
    closeMembershipListModal() {
        this.doShowMembershipListModal = false
    }
    onMembershipTicketSelected(item: MembershipItem) {
        // this.gymRegisterMlState.create(this.gymRegisterMlState.initMembershipItem(item))
        this.cmpStore.addMlItem(this.cmpStore.initMembershipItem(item))
        this.closeMembershipListModal()
        // console.log('onMembershipTicketSelected: ', item, this.gymRegisterMlState.itemList, this.itemList)
    }
}
