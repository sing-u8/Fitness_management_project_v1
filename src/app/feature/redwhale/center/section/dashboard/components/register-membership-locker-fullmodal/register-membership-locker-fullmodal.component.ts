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
import { Router, ActivatedRoute } from '@angular/router'

import _ from 'lodash'
import dayjs from 'dayjs'

import { originalOrder } from '@helpers/pipe/keyvalue'

import { StorageService } from '@services/storage.service'
import { DashboardHelperService } from '@services/center/dashboard-helper.service'

// components
import { ClickEmitterType } from '@schemas/components/button'

// component Store
import { RegisterMembershipLockerFullmodalStore, stateInit } from './componentStore/register-ml-fullmodal.store'
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
//

import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { MembershipItem } from '@schemas/membership-item'
import { LockerItem } from '@schemas/locker-item'
import { LockerCategory } from '@schemas/locker-category'
import {
    MembershipLockerItem,
    ChoseLockers,
    Locker,
    MembershipTicket,
    UpdateChoseLocker,
    TotalPrice,
} from '@schemas/center/dashboard/register-ml-fullmodal'

// ngrx
import { Store } from '@ngrx/store'
import * as CenterCommonSelector from '@centerStore/selectors/center.common.selector'
import * as DashboardSelector from '@centerStore/selectors/sec.dashoboard.selector'

type Progress = 'one' | 'two'

@Component({
    selector: 'db-register-membership-locker-fullmodal',
    templateUrl: './register-membership-locker-fullmodal.component.html',
    styleUrls: ['./register-membership-locker-fullmodal.component.scss'],
    providers: [RegisterMembershipLockerFullmodalStore],
})
export class RegisterMembershipLockerFullmodalComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
    // modal vars and funcs
    @Input() curUser: CenterUser
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() close = new EventEmitter<any>()
    @Output() finishRegister = new EventEmitter<any>()

    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    @ViewChild('terms') termsElement: ElementRef

    public changed: boolean
    public today = dayjs().format('YYYY.MM.DD')
    public center: Center
    public originalOrder = originalOrder

    // center common vars
    public instructors$ = this.nxStore.select(CenterCommonSelector.instructors)
    // registration membership locker vars
    public mlItems$: Observable<Array<MembershipLockerItem>> = this.cmpStore.mlItems$
    // public instructors$: Observable<Array<CenterUser>> = this.cmpStore.instructors$
    public choseLocker$: Observable<ChoseLockers> = this.cmpStore.choseLockers$
    public membershipItems$: Observable<Array<MembershipItem>> = this.cmpStore.membershipItems$

    public isAllMlItemDone = false
    public isAllMlItemDoneSubscriber = this.cmpStore.isAllMlItemDone$.subscribe((isDone) => {
        this.isAllMlItemDone = isDone
    })

    public totalPrice$: Observable<TotalPrice> = this.cmpStore.totalPrice$
    public totalSum = 0
    public TotalPriceSumSubscriber = this.cmpStore.totalPrice$.subscribe((total) => {
        this.totalSum = 0
        _.forIn(total, (v) => {
            this.totalSum += v.price
        })
    })

    public lockerItemsExist = false
    public membershipItemsExist = false
    public lieSubscriber = this.cmpStore.doLockerItemsExist$.subscribe((doExist) => {
        this.lockerItemsExist = doExist
    })
    public mieSubscriber = this.cmpStore.doMembershipItemsExist$.subscribe((doExist) => {
        this.membershipItemsExist = doExist
    })

    public progress: Progress = 'one'
    setProgress(progress: Progress) {
        this.progress = progress
        this.progressChanged = true
    }
    public progressChanged = false

    public dbCurCenterId$ = this.nxStore.select(DashboardSelector.curCenterId)
    public dwCurCenterId$ = this.nxStore.select(DashboardSelector.drawerCurCenterId)
    public dbCurCenterId = undefined
    public dwCurCenterId = undefined

    public unSubscribe$ = new Subject<boolean>()

    constructor(
        private renderer: Renderer2,
        private readonly cmpStore: RegisterMembershipLockerFullmodalStore,
        private storageService: StorageService,
        private nxStore: Store,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private dashboardHelper: DashboardHelperService
    ) {}

    ngOnInit(): void {
        this.center = this.storageService.getCenter()
        // this.cmpStore.setState(stateInit)
        this.cmpStore.checkLockerItemsExist(this.center.id)
        this.cmpStore.checkMembershipItemsExist(this.center.id)
        // this.cmpStore.getInstructorsEffect(this.center.id)
        // this.cmpStore.getmembershipItemsEffect(this.center.id)

        this.dbCurCenterId$.subscribe((dbCurCenterId) => {
            this.dbCurCenterId = dbCurCenterId
        })
        this.dwCurCenterId$.subscribe((dwCurCenterId) => {
            this.dwCurCenterId = dwCurCenterId
        })
    }
    ngOnDestroy(): void {
        this.TotalPriceSumSubscriber.unsubscribe()
        this.isAllMlItemDoneSubscriber.unsubscribe()
        this.lieSubscriber.unsubscribe()
        this.mieSubscriber.unsubscribe()
        this.unSubscribe$.next(true)
        this.unSubscribe$.complete()
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible'] && !changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
    }
    ngAfterViewChecked(): void {
        if (this.progressChanged) {
            this.progressChanged = false
            this.renderer.setStyle(
                this.termsElement.nativeElement,
                'height',
                `${this.termsElement.nativeElement.scrollHeight + 10}px`
            )
        }
        if (this.changed) {
            this.changed = false

            this.center = this.storageService.getCenter()

            if (this.visible) {
                this.cmpStore.checkLockerItemsExist(this.center.id)
                this.cmpStore.checkMembershipItemsExist(this.center.id)
                // this.cmpStore.getInstructorsEffect(this.center.id)
                this.cmpStore.getmembershipItemsEffect(this.center.id)
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)
            } else {
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)

                this.progress = 'one'
                this.cmpStore.setState(
                    _.cloneDeep({
                        ...stateInit,
                        ...{
                            doLockerItemsExist: this.lockerItemsExist,
                            doMembershipItemsExist: this.membershipItemsExist,
                        },
                    })
                )
                this.inputSignData = undefined
            }
        }
    }

    // contract sign box vars and methods
    public inputSignData = undefined
    public signData: string = undefined
    onContractSign(signData: string) {
        this.signData = signData
        this.inputSignData = signData
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

    checkLockerItemEmpty() {
        this.lockerItemsExist ? this.toggleLockerSelectModal() : this.openShowLockerEmpty()
    }
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

    checkMembershipItemEmpty() {
        this.membershipItemsExist ? this.toggleMembershipListModal() : this.openShowMembershipEmpty()
    }
    toggleMembershipListModal() {
        this.doShowMembershipListModal = !this.doShowMembershipListModal
    }
    closeMembershipListModal() {
        this.doShowMembershipListModal = false
    }
    async onMembershipTicketSelected(item: MembershipItem) {
        // this.gymRegisterMlState.create(this.gymRegisterMlState.initMembershipItem(item))
        const membershipTicket = await this.cmpStore.initMembershipItem(item)
        this.cmpStore.addMlItem(membershipTicket)
        this.closeMembershipListModal()
        // console.log('onMembershipTicketSelected: ', item, this.gymRegisterMlState.itemList, this.itemList)
    }

    // don't exist membership, locker modals
    public doShowLockerEmpty = false
    public showLockerEmptyData = {
        text: '앗! 추가할 수 있는 락커가 없어요. 😱',
        subText: `회원에게 락커를 추가하기 위해
                    먼저 센터의 락커 정보를 등록해주세요.`,
        cancelButtonText: '뒤로',
        confirmButtonText: '락커 등록하기',
    }
    openShowLockerEmpty() {
        this.doShowLockerEmpty = true
    }
    closeShowLockerEmpty() {
        this.doShowLockerEmpty = false
    }
    onLockerEmtpyConfirm() {
        this.closeShowLockerEmpty()
        this.close.emit()
        this.router.navigate(['../locker'], {
            relativeTo: this.activatedRoute,
        })
    }
    public doShowMembershipEmpty = false
    public showMembershipEmtpyData = {
        text: '앗! 추가할 수 있는 회원권이 없어요. 😱',
        subText: `회원에게 회원권을 추가하기 위해
                    먼저 센터의 회원권 정보를 등록해주세요.`,
        cancelButtonText: '뒤로',
        confirmButtonText: '회원권 등록하기',
    }
    openShowMembershipEmpty() {
        this.doShowMembershipEmpty = true
    }
    closeShowMembershipEmpty() {
        this.doShowMembershipEmpty = false
    }
    onMembershipEmtpyConfirm() {
        this.closeShowMembershipEmpty()
        this.close.emit()
        this.router.navigate(['../membership'], {
            relativeTo: this.activatedRoute,
        })
    }

    // register ml items func
    registerMLs(btLoadingFns: ClickEmitterType) {
        btLoadingFns.showLoading()
        this.cmpStore.registerMlItems({
            centerId: this.center.id,
            user: this.curUser,
            signData: this.signData,
            callback: () => {
                btLoadingFns.hideLoading()
                if (!_.isEmpty(this.dbCurCenterId) && this.dbCurCenterId == this.center.id) {
                    this.dashboardHelper.refreshCurUser(this.center.id, this.curUser)
                }
                if (!_.isEmpty(this.dwCurCenterId) && this.dwCurCenterId == this.center.id) {
                    this.dashboardHelper.refreshDrawerCurUser(this.center.id, this.curUser)
                }
                this.closeModal()
            },
            errCallback: () => {
                btLoadingFns.hideLoading()
            },
        })
    }
}
