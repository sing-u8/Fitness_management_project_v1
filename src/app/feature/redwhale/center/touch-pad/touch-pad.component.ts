import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'

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
import { CreateCenterErrors } from '@schemas/errors/create-center-errors'

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
        this.checkIsNoticeExisted()
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
        this.centerTouchPadService.SearchCheckInUsers(this.center.id, this.touchPadInput).subscribe({
            next: (cus) => {
                if (cus.length == 0) {
                    this.isConfirmProcess = false
                    // this.touchPadInput = ''
                    this.nxStore.dispatch(showToast({ text: '회원이 존재하지 않습니다.' }))
                } else if (cus.length == 1) {
                    this.checkInUser(cus[0])
                } else {
                    this.equalMembershipUsers = cus
                    this.toggleSameMembershipNumberModal()
                }
                this.spinner.hide('touch_pad_check_in')
            },
            error: (e) => {
                this.spinner.hide('touch_pad_check_in')
                if (e.code == 'AUTHENTICATION_001') {
                    this.nxStore.dispatch(showToast({ text: CreateCenterErrors.AUTHENTICATION_001.message }))
                } else if (e.code == 'AUTHENTICATION_002') {
                    this.nxStore.dispatch(showToast({ text: CreateCenterErrors.AUTHENTICATION_002.message }))
                } else if (e.code == 'AUTHENTICATION_003') {
                    this.nxStore.dispatch(showToast({ text: CreateCenterErrors.AUTHENTICATION_003.message }))
                } else if (e.code == 'FUNCTION_CENTER_001') {
                    this.nxStore.dispatch(showToast({ text: CreateCenterErrors.FUNCTION_CENTER_001.message }))
                }
            },
        })
    }

    checkInUser(cu: CenterUser) {
        this.centerTouchPadService
            .checkIn(this.center.id, { center_user_id: cu.id })
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
                        this.lockerList = lockerTickets.filter(
                            (v) =>
                                v.state_code == 'user_locker_state_in_use' || v.state_code == 'user_locker_state_paused'
                        )
                        this.membershipList = membershipTickets.filter(
                            (v) =>
                                v.state_code == 'user_membership_state_in_use' ||
                                v.state_code == 'user_membership_state_paused'
                        )
                        this.memberName = this.checkedInMember.name

                        this.showAttendanceModal()
                        this.isConfirmProcess = false
                        if (!_.isEmpty(this.dbCurCenterId) && this.dbCurCenterId == this.center.id) {
                            this.dashboardHelper.synchronizeCheckIn(this.center.id, this.checkedInMember)
                        }
                        if (!_.isEmpty(this.dwCurCenterId) && this.dwCurCenterId == this.center.id) {
                            this.dashboardHelper.synchronizeCheckInDrawer(this.center.id, this.checkedInMember)
                        }
                    })
                },
                error: (e) => {
                    if (e.code == 'AUTHENTICATION_001') {
                        this.nxStore.dispatch(showToast({ text: CreateCenterErrors.AUTHENTICATION_001.message }))
                    } else if (e.code == 'AUTHENTICATION_002') {
                        this.nxStore.dispatch(showToast({ text: CreateCenterErrors.AUTHENTICATION_002.message }))
                    } else if (e.code == 'AUTHENTICATION_003') {
                        this.nxStore.dispatch(showToast({ text: '입력하신 회원 번호를 다시 확인해주세요.' }))
                    } else if (e.code == 'FUNCTION_CENTER_001') {
                        this.nxStore.dispatch(showToast({ text: CreateCenterErrors.FUNCTION_CENTER_001.message }))
                    }
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

    // center notice vars and funcs for test
    public centerNotice = ''
    public centerNoticeFlag = false
    checkIsNoticeExisted() {
        this.center = this.storageService.getCenter()
        this.centerNotice = this.center.notice
        this.centerNoticeFlag = !_.isEmpty(this.centerNotice)
    }
    //
    public showCenterNoticeModal = false
    toggleCenterNoticeModal() {
        this.showCenterNoticeModal = !this.showCenterNoticeModal
    }
    cancelCenterNoticeModal() {
        this.showCenterNoticeModal = false
    }

    // same membership number modal
    public equalMembershipUsers: CenterUser[] = []
    public showSameMembershipNumberModal = false
    toggleSameMembershipNumberModal() {
        this.showSameMembershipNumberModal = !this.showSameMembershipNumberModal
    }
    cancelSameMembershipNumberModal() {
        this.showSameMembershipNumberModal = false
        this.equalMembershipUsers = []
    }
    confirmSameMembershipNumberModal(cu: CenterUser) {
        this.checkInUser(cu)
        this.toggleSameMembershipNumberModal()
    }
}
