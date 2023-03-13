import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Renderer2 } from '@angular/core'
import { Router } from '@angular/router'

import dayjs from 'dayjs'
import _ from 'lodash'
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

@Component({
    selector: 'db-modify-membership-page',
    templateUrl: './modify-membership-page.component.html',
    styleUrls: ['./modify-membership-page.component.scss'],
})
export class ModifyMembershipPageComponent implements OnInit, OnDestroy {
    public centerUser: CenterUser
    public userMembership: UserMembership

    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef

    public center: Center

    constructor(
        private renderer: Renderer2,
        private storageService: StorageService,
        private centerMembershipService: CenterMembershipService,
        private centerUsersMembershipService: CenterUsersMembershipService,
        private nxStore: Store,
        private dashboardHelperService: DashboardHelperService,
        private router: Router
    ) {
        this.center = this.storageService.getCenter()
        const routerState = this.router.getCurrentNavigation().extras.state
        this.centerUser = routerState['centerUser']
        this.userMembership = routerState['userMembership']
        this.setUserMembershipData()
    }
    ngOnInit(): void {}
    ngOnDestroy(): void {}
    exitPage() {
        this.router.navigate([this.center.address, 'dashboard'])
    }

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

    // class item list vars and funcs

    // check funcs
    isClassSelected() {
        return true
        return _.some(this.classItemList, ['selected', true])
    }
    checkCount() {
        return !((this.count.count == '0' || !this.count.count) && !this.count.infinite)
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
                    this.exitPage()
                },
                error: (err) => {
                    this.nxStore.dispatch(showToast({ text: UserLockerMembershipErrors[err.code].message }))
                    loadingBt.hideLoading()
                },
            })
    }
}
