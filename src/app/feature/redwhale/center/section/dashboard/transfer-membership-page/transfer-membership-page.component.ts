import { Component, ElementRef, Renderer2, ViewChild, OnDestroy, OnInit, AfterViewChecked } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

import _ from 'lodash'
import dayjs from 'dayjs'

import { originalOrder } from '@helpers/pipe/keyvalue'

import { StorageService } from '@services/storage.service'
import { DashboardHelperService } from '@services/center/dashboard-helper.service'

// components
import { ClickEmitterType } from '@schemas/components/button'

// component Store
import { TransferMembershipPageStore } from './componentStore/transfer-membership-page.store'
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
//
import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { PriceType, TotalPrice, MembershipTicket } from '@schemas/center/dashboard/transfer-m-fullmodal'
import { UserMembership } from '@schemas/user-membership'

// ngrx
import { Store } from '@ngrx/store'
import * as CenterCommonSelector from '@centerStore/selectors/center.common.selector'
import * as DashboardSelector from '@centerStore/selectors/sec.dashboard.selector'
import * as DashboardAction from '@centerStore/actions/sec.dashboard.actions'
import { Loading } from '@schemas/store/loading'

type Progress = 'one' | 'two'

@Component({
    selector: 'db-transfer-membership-page',
    templateUrl: './transfer-membership-page.component.html',
    styleUrls: ['./transfer-membership-page.component.scss'],
    providers: [TransferMembershipPageStore],
})
export class TransferMembershipPageComponent implements OnInit, OnDestroy, AfterViewChecked {
    // modal vars and funcs
    public curUser: CenterUser
    public transferCenterUser: CenterUser
    public transferUserMembership: UserMembership

    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    @ViewChild('terms') termsElement: ElementRef

    public today = dayjs().format('YYYY.MM.DD')
    public center: Center
    public originalOrder = originalOrder

    // center common vars
    public instructors$ = this.nxStore.select(CenterCommonSelector.instructors)

    // component state
    public mItem$: Observable<MembershipTicket> = this.cmpStore.mItem$
    public isMLoading$: Observable<Loading> = this.cmpStore.isMLoading$

    public isAllMItemDone = false
    public isAllMItemDoneSubscriber = this.cmpStore.isAllMItemDone$.subscribe((isDone) => {
        this.isAllMItemDone = isDone
    })

    public totalPrice$: Observable<TotalPrice> = this.cmpStore.totalPrice$
    public totalSum = 0
    public TotalPriceSumSubscriber = this.cmpStore.totalPrice$.subscribe((total) => {
        this.totalSum = 0
        _.forIn(total, (v) => {
            this.totalSum += v.price
        })
    })

    public progress: Progress = 'one'
    setProgress(progress: Progress) {
        this.progress = progress
        this.progressChanged = true
    }
    public progressChanged = false

    public dbCurCenterId$ = this.nxStore.select(DashboardSelector.curCenterId)
    public dbCurCenterId = undefined

    public unSubscribe$ = new Subject<boolean>()

    constructor(
        private renderer: Renderer2,
        private readonly cmpStore: TransferMembershipPageStore,
        private storageService: StorageService,
        private nxStore: Store,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private dashboardHelper: DashboardHelperService
    ) {
        this.center = this.storageService.getCenter()
        const routerState = this.router.getCurrentNavigation().extras.state
        this.curUser = routerState['curUser']
        this.transferCenterUser = routerState['transferCenterUser']
        this.transferUserMembership = routerState['transferUserMembership']
        this.init()
    }

    ngOnInit(): void {
        // this.cmpStore.checkMembershipItemsExist(this.center.id)

        this.dbCurCenterId$.pipe(takeUntil(this.unSubscribe$)).subscribe((dbCurCenterId) => {
            this.dbCurCenterId = dbCurCenterId
        })
    }
    ngOnDestroy() {
        this.TotalPriceSumSubscriber.unsubscribe()
        this.isAllMItemDoneSubscriber.unsubscribe()
        this.unSubscribe$.next(true)
        this.unSubscribe$.complete()
    }
    ngAfterViewChecked() {
        if (this.progressChanged) {
            this.progressChanged = false
            this.renderer.setStyle(
                this.termsElement.nativeElement,
                'height',
                `${this.termsElement.nativeElement.scrollHeight + 10}px`
            )
        }
    }
    exitPage() {
        this.router.navigate([this.center.address, 'dashboard'])
    }

    // contract sign box vars and methods
    public inputSignData = undefined
    public signData: string = undefined
    onContractSign(signData: string) {
        this.signData = signData
        this.inputSignData = signData
    }

    // fullmodal vars and funcs
    closeModal() {
        this.exitPage()
    }

    // m list method
    onMemberhispTicketItemModify(item: MembershipTicket) {
        this.cmpStore.modifyMItem(item)
    }
    onTotalPriceModify(item: MembershipTicket) {
        this.cmpStore.setTotalPrice(item)
    }

    // register ml items func
    transferMembership(btLoadingFns: ClickEmitterType) {
        btLoadingFns.showLoading()
        this.cmpStore.transferMItem({
            centerId: this.center.id,
            transferUser: this.transferCenterUser,
            transferUserMembership: this.transferUserMembership,
            user: this.curUser,
            signData: this.signData,
            memo: this.memoTerms,
            callback: () => {
                btLoadingFns.hideLoading()
                if (!_.isEmpty(this.dbCurCenterId) && this.dbCurCenterId == this.center.id) {
                    this.dashboardHelper.refreshCurUser(this.center.id, this.curUser)
                    this.nxStore.dispatch(
                        DashboardAction.startRefreshCenterUserCard({
                            centerId: this.center.id,
                            centerUser: this.transferCenterUser,
                        })
                    )
                }
                this.resetMemoTerms()
                this.closeModal()
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

    async init() {
        this.cmpStore.setMLoading('pending')
        const membershipTicket = await this.cmpStore.initMembershipItemByUM(this.transferUserMembership, this.curUser)
        this.cmpStore.addMItem(membershipTicket)
        this.cmpStore.setMLoading('done')
    }
}
