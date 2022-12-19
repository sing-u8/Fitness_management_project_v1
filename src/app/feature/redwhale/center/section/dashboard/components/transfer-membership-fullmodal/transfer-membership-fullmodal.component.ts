import {
    AfterViewChecked,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    SimpleChanges,
    ViewChild,
} from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

import _ from 'lodash'
import dayjs from 'dayjs'

import { originalOrder } from '@helpers/pipe/keyvalue'

import { StorageService } from '@services/storage.service'
import { DashboardHelperService } from '@services/center/dashboard-helper.service'

// components
import { ClickEmitterType } from '@schemas/components/button'

// component Store
import { TransferMembershipFullmodalStore, stateInit } from './componentStore/transfer-m-fullmodal.store'
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
//
import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { MembershipItem } from '@schemas/membership-item'
import { PriceType, TotalPrice, MembershipTicket } from '@schemas/center/dashboard/transfer-m-fullmodal'
import { ContractTypeCode } from '@schemas/contract'
import { UserMembership } from '@schemas/user-membership'

// ngrx
import { Store } from '@ngrx/store'
import * as CenterCommonSelector from '@centerStore/selectors/center.common.selector'
import * as DashboardSelector from '@centerStore/selectors/sec.dashboard.selector'
import { Loading } from '@schemas/store/loading'

type Progress = 'one' | 'two'

@Component({
    selector: 'db-transfer-membership-fullmodal',
    templateUrl: './transfer-membership-fullmodal.component.html',
    styleUrls: ['./transfer-membership-fullmodal.component.scss'],
    providers: [TransferMembershipFullmodalStore],
})
export class TransferMembershipFullmodalComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
    // modal vars and funcs
    @Input() curUser: CenterUser
    @Input() transferCenterUser: CenterUser
    @Input() visible: boolean
    @Input() transferUserMembership: UserMembership

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() close = new EventEmitter<any>()
    @Output() finishTransfer = new EventEmitter<any>()

    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    @ViewChild('terms') termsElement: ElementRef

    public changed: boolean
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
        private readonly cmpStore: TransferMembershipFullmodalStore,
        private storageService: StorageService,
        private nxStore: Store,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private dashboardHelper: DashboardHelperService
    ) {}

    ngOnInit(): void {
        this.center = this.storageService.getCenter()
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
    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && !changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
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
        if (this.changed) {
            this.changed = false

            this.center = this.storageService.getCenter()

            if (this.visible) {
                // this.cmpStore.checkMembershipItemsExist(this.center.id)
                // this.cmpStore.getInstructorsEffect(this.center.id)
                // this.cmpStore.getmembershipItemsEffect(this.center.id)
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)

                this.init()
            } else {
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)

                this.progress = 'one'
                this.cmpStore.setState(
                    _.cloneDeep({
                        ...stateInit,
                    })
                )
                this.inputSignData = undefined
                this.signData = undefined
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

    // fullmodal vars and funcs
    closeModal() {
        this.close.emit()
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
