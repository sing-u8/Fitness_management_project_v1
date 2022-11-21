import { Component, OnInit, OnDestroy } from '@angular/core'

import dayjs from 'dayjs'
import _ from 'lodash'
import { throwError, forkJoin, Subject } from 'rxjs'
import { map, catchError, takeUntil } from 'rxjs/operators'

import { StorageService } from '@services/storage.service'
import { CenterTouchpadService } from '@services/center-touchpad.service'
import { CenterUsersLockerService } from '@services/center-users-locker.service.service'
import { CenterUsersMembershipService } from '@services/center-users-membership.service'
import { DashboardHelperService } from '@services/center/dashboard-helper.service'
import { SoundService } from '@services/helper/sound.service'

import { UserLocker } from '@schemas/user-locker'
import { UserMembership } from '@schemas/user-membership'

import { Center } from '@schemas/center'

import { NgxSpinnerService } from 'ngx-spinner'

// ngrx
import { select, Store } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'
import { CenterUser } from '@schemas/center-user'
import * as DashboardSelector from '@centerStore/selectors/sec.dashboard.selector'

@Component({
    selector: 'touch-pad',
    templateUrl: './touch-pad.component.html',
    styleUrls: ['./touch-pad.component.scss'],
})
export class TouchPadComponent implements OnInit, OnDestroy {
    public center: Center = undefined
    public touchPadInput: string

    public membershipList: Array<UserMembership> = []
    public lockerList: Array<UserLocker> = []
    public checkedInMember: CenterUser = undefined
    public memberName = ''

    public isConfirmProcess = false

    public dbCurCenterId$ = this.nxStore.select(DashboardSelector.curCenterId)
    public dwCurCenterId$ = this.nxStore.select(DashboardSelector.drawerCurCenterId)
    public dbCurCenterId = undefined
    public dwCurCenterId = undefined

    public unSubscribe$ = new Subject<boolean>()

    constructor(
        private storageService: StorageService,
        private spinner: NgxSpinnerService,
        private centerTouchPadService: CenterTouchpadService,
        private nxStore: Store,
        private centerUsersLockerService: CenterUsersLockerService,
        private centerUsersMembershipService: CenterUsersMembershipService,
        private dashboardHelper: DashboardHelperService,
        private soundService: SoundService
    ) {
        this.center = this.storageService.getCenter()
        this.touchPadInput = ''
    }

    ngOnInit(): void {
        this.dbCurCenterId$.pipe(takeUntil(this.unSubscribe$)).subscribe((dbCurCenterId) => {
            this.dbCurCenterId = dbCurCenterId
        })
        this.dwCurCenterId$.pipe(takeUntil(this.unSubscribe$)).subscribe((dwCurCenterId) => {
            this.dwCurCenterId = dwCurCenterId
        })
    }
    ngOnDestroy() {
        this.unSubscribe$.next(true)
        this.unSubscribe$.complete()
    }

    // input functions
    formCheck() {
        this.touchPadInput = this.touchPadInput.replace(/[^0-9]/gi, '')
    }
    touch(number: string) {
        if (this.touchPadInput.length > 29) return
        this.touchPadInput += number
    }
    erase() {
        this.touchPadInput = this.touchPadInput.slice(0, this.touchPadInput.length - 1)
    }
    confirm() {
        if (this.isConfirmProcess) return
        if (this.touchPadInput.length == 0) return
        if (this.touchPadInput.length > 1 && this.touchPadInput.length < 4) {
            this.nxStore.dispatch(showToast({ text: '입력하신 회원 번호를 다시 확인해주세요.' }))
            return
        }

        this.isConfirmProcess = true
        this.spinner.show('touch_pad_check_in')
        this.centerTouchPadService
            .checkIn(this.center.id, { center_membership_number: this.touchPadInput })
            .pipe(
                map((centerUser) => {
                    return forkJoin([
                        this.centerUsersLockerService.getLockerTickets(this.center.id, centerUser.id),
                        this.centerUsersMembershipService.getMembershipTickets(this.center.id, centerUser.id),
                    ]).pipe(
                        map(([lt, mt]) => {
                            this.checkedInMember = centerUser
                            return {
                                lockerTickets: lt,
                                membershipTickets: mt,
                            }
                        })
                    )
                }),
                catchError(() => {
                    return throwError(() => new Error("입력하신 회원 번호를 다시 확인해주세요.'"))
                })
            )
            .subscribe({
                next: (value) => {
                    value.subscribe(({ lockerTickets, membershipTickets }) => {
                        this.lockerList = lockerTickets
                        this.membershipList = membershipTickets
                        this.memberName = this.checkedInMember.center_user_name

                        this.showAttendanceModal()
                        this.isConfirmProcess = false
                        this.spinner.hide('touch_pad_check_in')

                        if (!_.isEmpty(this.dbCurCenterId) && this.dbCurCenterId == this.center.id) {
                            this.dashboardHelper.synchronizeCheckIn(this.center.id, this.checkedInMember)
                        }
                        if (!_.isEmpty(this.dwCurCenterId) && this.dwCurCenterId == this.center.id) {
                            this.dashboardHelper.synchronizeCheckInDrawer(this.center.id, this.checkedInMember)
                        }
                    })
                },
                error: (err) => {
                    this.nxStore.dispatch(showToast({ text: '입력하신 회원 번호를 다시 확인해주세요.' }))
                    this.spinner.hide('touch_pad_check_in')
                    this.isConfirmProcess = false
                },
            })
    }

    public doShowAttendanceModal = false
    showAttendanceModal() {
        this.doShowAttendanceModal = true
    }
    closeAttendanceModal() {
        this.doShowAttendanceModal = false
        this.touchPadInput = ''
    }

    callEmployee() {
        this.spinner.show('call_employee')
        this.centerTouchPadService.callEmployee(this.center.id).subscribe(() => {
            this.spinner.hide('call_employee')
            console.log('call employee !!! ')
        })
        // setTimeout(() => {
        //     this.spinner.hide('call_employee')
        // }, 2000)
        // this.soundService.callEmployee()
    }
}
