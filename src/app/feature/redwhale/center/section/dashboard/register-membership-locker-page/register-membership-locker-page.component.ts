import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild,
} from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Location } from '@angular/common'

import _ from 'lodash'
import dayjs from 'dayjs'
import { originalOrder } from '@helpers/pipe/keyvalue'

import { StorageService } from '@services/storage.service'
import { DashboardHelperService } from '@services/center/dashboard-helper.service'

// components
import { ClickEmitterType } from '@schemas/components/button'

// component Store
import { RegisterMembershipLockerPageStore, stateInit } from './componentsStore/register-ml-page.store'
import { Observable, Subject } from 'rxjs'
//
import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { MembershipItem } from '@schemas/membership-item'
import { LockerItem } from '@schemas/locker-item'
import { LockerCategory } from '@schemas/locker-category'
import {
    ChoseLockers,
    Locker,
    MembershipLockerItem,
    MembershipTicket,
    TotalPrice,
    UpdateChoseLocker,
} from '@schemas/center/dashboard/register-ml-fullmodal'
import { ContractTypeCode } from '@schemas/contract'
import { UserMembership } from '@schemas/user-membership'

// ngrx
import { Store } from '@ngrx/store'
import { Loading } from '@schemas/store/loading'
import * as CenterCommonSelector from '@centerStore/selectors/center.common.selector'

type Progress = 'one' | 'two'

@Component({
    selector: 'db-register-membership-locker-page',
    templateUrl: './register-membership-locker-page.component.html',
    styleUrls: ['./register-membership-locker-page.component.scss'],
    providers: [RegisterMembershipLockerPageStore],
})
export class RegisterMembershipLockerPageComponent implements OnInit, OnDestroy {
    public curUser: CenterUser
    public type: ContractTypeCode
    public rerUserMembership: UserMembership // exist only when type is contract_type_renewal

    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    @ViewChild('terms') termsElement: ElementRef

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

    public isRenewalMLLoading$: Observable<Loading> = this.cmpStore.isRenewalMLLoading$

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

    public unSubscribe$ = new Subject<boolean>()

    constructor(
        private renderer: Renderer2,
        private readonly cmpStore: RegisterMembershipLockerPageStore,
        private storageService: StorageService,
        private nxStore: Store,
        private router: Router,
        private location: Location,
        private activatedRoute: ActivatedRoute,
        private dashboardHelper: DashboardHelperService
    ) {
        const routerState = this.router.getCurrentNavigation().extras.state
        this.curUser = routerState['curUser']
        this.type = routerState['type']
        this.rerUserMembership = routerState['rerUserMembership']
        console.log('register membership locker page -- ', this.router.getCurrentNavigation().extras.state)
    }

    ngOnInit(): void {
        this.center = this.storageService.getCenter()

        // !! router resolve에 추가할 예정 !!!!
        this.cmpStore.checkLockerItemsExist(this.center.id)
        this.cmpStore.checkMembershipItemsExist(this.center.id)

        this.cmpStore.checkLockerItemsExist(this.center.id)
        this.cmpStore.checkMembershipItemsExist(this.center.id)
        this.cmpStore.getmembershipItemsEffect(this.center.id)

        this.initByType()
    }
    ngOnDestroy(): void {
        this.TotalPriceSumSubscriber.unsubscribe()
        this.isAllMlItemDoneSubscriber.unsubscribe()
        this.lieSubscriber.unsubscribe()
        this.mieSubscriber.unsubscribe()
        this.unSubscribe$.next(true)
        this.unSubscribe$.complete()
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
    onMembershipTicketFinishGetLinkedClass(data: { index: number; item: MembershipTicket }) {
        this.cmpStore.modifyMlItem(data)
    }

    onLockerItemClick(data: UpdateChoseLocker) {
        this.cmpStore.updateChoseLockers(data)
    }

    // fullmodal vars and funcs
    exitPage() {
        this.router.navigate([this.center.address, 'dashboard'])
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
        const membershipTicket = await this.cmpStore.initMembershipItem(item)
        this.cmpStore.addMlItem(membershipTicket)
        this.closeMembershipListModal()
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
        this.router.navigate(['../membership'], {
            relativeTo: this.activatedRoute,
        })
    }

    // register ml items func
    registerMLs(btLoadingFns: ClickEmitterType) {
        btLoadingFns.showLoading()
        this.cmpStore.registerMlItems({
            type: this.type,
            centerId: this.center.id,
            user: this.curUser,
            signData: this.signData,
            memo: this.memoTerms,
            callback: () => {
                btLoadingFns.hideLoading()

                this.dashboardHelper.refreshCurUser(this.center.id, this.curUser)
                this.dashboardHelper.refreshDrawerCurUser(this.center.id, this.curUser)

                this.resetMemoTerms()
                this.exitPage()
            },
            errCallback: () => {
                btLoadingFns.hideLoading()
            },
        })
    }

    // memo terms
    public memoTerms = ''
    resetMemoTerms() {
        this.memoTerms = ''
    }

    // init by type
    async initByType() {
        if (this.type == 'contract_type_renewal' && !_.isEmpty(this.rerUserMembership)) {
            this.cmpStore.setRenewalMLLoading('pending')
            const membershipTicket = await this.cmpStore.initMembershipItemByUM(this.rerUserMembership, this.curUser)
            this.cmpStore.addMlItem(membershipTicket)
            this.cmpStore.setRenewalMLLoading('done')
        }
    }
}
