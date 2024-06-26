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
import { forkJoin } from 'rxjs'

import { UserLockerMembershipErrors } from '@schemas/errors/user-locker-membership-errors'

import { StorageService } from '@services/storage.service'
import { CenterMembershipService } from '@services/center-membership.service'
import { CenterUsersMembershipService, UpdateMembershipTicketReqBody } from '@services/center-users-membership.service'
import { DashboardHelperService } from '@services/center/dashboard-helper.service'

// components
import { ClickEmitterType } from '@schemas/components/button'

import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { UserMembership } from '@schemas/user-membership'
import { ClassItem } from '@schemas/class-item'

// ngrx
import { Store } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import { MembershipItem } from '@schemas/membership-item'

@Component({
    selector: 'db-modify-membership-fullmodal',
    templateUrl: './modify-membership-fullmodal.component.html',
    styleUrls: ['./modify-membership-fullmodal.component.scss'],
})
export class ModifyMembershipFullmodalComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
    @Input() visible: boolean
    @Input() centerUser: CenterUser
    @Input() userMembership: UserMembership

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() close = new EventEmitter<void>()
    @Output() confirm = new EventEmitter<any>()

    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    public changed: boolean

    public center: Center

    public datepickFlag: { start: boolean; end: boolean } = { start: false, end: false }
    onStartDateBtClick(event) {
        this.datepickFlag.start = !this.datepickFlag.start
        this.datepickFlag.end = false
        event.stopPropagation()
    }
    onEndDateBtClick(event) {
        this.datepickFlag.end = !this.datepickFlag.end
        this.datepickFlag.start = false
        event.stopPropagation()
    }
    startDatepickClickOutside(event) {
        this.datepickFlag.start = false
        event.stopPropagation()
    }
    endDatepickClickOutside(event) {
        this.datepickFlag.end = false
        event.stopPropagation()
    }

    public date = {
        startDate: '',
        endDate: '',
    }
    public dayDiff = ''
    onDatePickRangeChange(event: { startDate: string; endDate: string }, type: 'start' | 'end') {
        this.date = event

        if (type == 'start') {
            if (!_.isEmpty(this.date.endDate) && dayjs(this.date.endDate).isBefore(dayjs(this.date.startDate))) {
                this.date.endDate = ''
                this.dayDiff = ''
            } else if (!_.isEmpty(this.date.endDate)) {
                this.dayDiff = String(this.getDayDiff(this.date))
            }
        }
        if (type == 'end') {
            this.dayDiff = String(this.getDayDiff(this.date))
        }
    }
    getDayDiff(date: { startDate: string; endDate: string }) {
        const date1 = dayjs(date.startDate)
        const date2 = dayjs(date.endDate)

        return date2.diff(date1, 'day') + 1
    }

    public classItemList: Array<{ selected: boolean; item: ClassItem }> = []
    resetClssItemList() {
        this.classItemList = []
    }

    public count: {
        count: string
        infinite: boolean
    } = { count: '0', infinite: false }
    onCountKeyup(event) {
        if (event.code == 'Enter') return
        this.count.count = this.count.count.replace(/[^0-9]/gi, '')
    }

    constructor(
        private renderer: Renderer2,
        private storageService: StorageService,
        private centerMembershipService: CenterMembershipService,
        private centerUsersMembershipService: CenterUsersMembershipService,
        private nxStore: Store,
        private dashboardHelperService: DashboardHelperService
    ) {}

    setUserMembershipData() {
        this.datepickFlag = { start: false, end: false }

        this.date.startDate = this.userMembership.start_date
        this.date.endDate = this.userMembership.end_date

        this.count = {
            count: String(this.userMembership.count) ?? '0',
            infinite: this.userMembership.unlimited,
        }
        this.getClassItemList()
    }
    resetUserMembershipData() {
        this.datepickFlag = { start: false, end: false }
        this.date.startDate = ''
        this.date.endDate = ''
        this.count = { count: '0', infinite: false }
        this.resetClssItemList()
    }

    public loadingClassItemList = false
    getClassItemList() {
        this.loadingClassItemList = true
        const linkedClassIds = _.split(this.userMembership.class_item_ids, ',')
        forkJoin([
            this.centerMembershipService.getLinkedClass(
                this.center.id,
                this.userMembership.membership_category_id,
                this.userMembership.membership_item_id
            ),
        ]).subscribe(([linkedClassList]) => {
            this.classItemList = _.map(linkedClassList, (v) => {
                return {
                    selected: linkedClassIds.findIndex((id) => id == v.id) != -1,
                    item: v,
                }
            }).reverse()
            this.loadingClassItemList = false
        })
    }

    ngOnInit(): void {
        this.center = this.storageService.getCenter()
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
                this.setUserMembershipData()
            } else {
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
                this.resetUserMembershipData()
            }
        }
    }

    // class item list vars and funcs

    // check funcs
    isClassSelected() {
        return true
        return _.some(this.classItemList, ['selected', true])
    }
    checkCount() {
        if ((this.count.count == '0' || !this.count.count) && !this.count.infinite) return false
        return true
    }

    // modify confirm
    confirmModify(loadingBt: ClickEmitterType) {
        if (!this.date.startDate || !this.date.endDate || !this.isClassSelected() || !this.checkCount()) {
            return
        }

        loadingBt.showLoading()
        const reqBody: UpdateMembershipTicketReqBody = {
            start_date: this.date.startDate,
            end_date: this.date.endDate,
            count: Number(this.count.count),
            unlimited: this.count.infinite,
            class_item_ids: this.classItemList.filter((v) => v.selected).map((v) => v.item.id),
        }
        this.centerUsersMembershipService
            .updateMembershipTicket(this.center.id, this.centerUser.id, this.userMembership.id, reqBody)
            .subscribe({
                next: (userMembership) => {
                    this.nxStore.dispatch(showToast({ text: `'${this.userMembership.name}' 정보가 수정되었습니다.` }))
                    this.dashboardHelperService.refreshCurUser(this.center.id, this.centerUser)
                    loadingBt.hideLoading()
                    this.confirm.emit()
                },
                error: (err) => {
                    this.nxStore.dispatch(showToast({ text: UserLockerMembershipErrors[err.code].message }))
                    loadingBt.hideLoading()
                },
            })
    }
}
