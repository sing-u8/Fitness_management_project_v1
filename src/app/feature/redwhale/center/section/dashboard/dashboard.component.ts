import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, ViewChild, ElementRef } from '@angular/core'
import { FormBuilder, FormControl, ValidationErrors, AsyncValidatorFn, AbstractControl } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'

import _ from 'lodash'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
dayjs.locale('ko')

// services
import { CenterService } from '@services/center.service'
import { StorageService } from '@services/storage.service'
import { UsersCenterService } from '@services/users-center.service'

// scehma
import { Center } from '@schemas/center'
import { User } from '@schemas/user'
import { CenterUser } from '@schemas/center-user'
import { UserLocker } from '@schemas/user-locker'

// rxjs
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

// ngrx
import { Store, select } from '@ngrx/store'
import { drawerSelector } from '@appStore/selectors'
import { showToast } from '@appStore/actions/toast.action'

import * as FromDashboard from '@centerStore/reducers/sec.dashboard.reducer'
import * as DashboardSelector from '@centerStore/selectors/sec.dashoboard.selector'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('member_management') member_management: ElementRef
    public resizeUnlistener: () => void

    @ViewChild('empty_search_container') empty_search_container: ElementRef

    public center: Center
    public centerStaff: User
    public staffRole = '' // administrator, manager, staff, member

    public memberManageCategory: FromDashboard.MemberManageCategory = undefined
    public today: string = dayjs().format('YYYY.MM.DD (ddd)')

    // member toast
    public attendedUser: CenterUser = undefined
    public doShowMemberToast = false
    showMemToast() {
        this.doShowMemberToast = true
    }
    hideMemToast() {
        this.doShowMemberToast = false
    }

    // user detail info var
    // public userData: GetUserReturn
    public doShowRoleSelect = false
    public userMemo: string

    public doShowChangeRoleModal = false
    public changeRoleModalText = {
        text: '',
        subText: `권한 변경 시, 새로운 접근 권한이 주어지므로
        꼭 신중하게 선택해주세요. 🙏`,
        cancelButtonText: '취소',
        confirmButtonText: '변경',
    }

    public doShowAttendModal = false
    public doShowCancelAttendModal = false
    public cancelAttendUserModalText = {
        text: '',
        subText: `수동 출석을 취소하실 경우,
        해당 회원은 미출석 상태로 변경됩니다.`,
        cancelButtonText: '취소',
        confirmButtonText: '확인',
    }
    public attendUserModalText = {
        text: '',
        subText: `수동 출석을 하실 경우,
        해당 회원은 출석 상태로 변경됩니다.`,
        cancelButtonText: '취소',
        confirmButtonText: '확인',
    }

    // register modal vars
    public doShowRegisterMemberModal = false
    toggleRegisterMemberModal() {
        this.doShowRegisterMemberModal = !this.doShowRegisterMemberModal
    }

    public doShowDirectRegisterMemberFullModal = false
    toggleDirectRegisterMemberFullModal() {
        this.doShowDirectRegisterMemberFullModal = !this.doShowDirectRegisterMemberFullModal
    }
    whenFinishRegisterMember() {
        this.toggleDirectRegisterMemberFullModal()
    }

    // public userDetail: {
    //     membershipLocker: { membership: Array<MembershipTicket>; locker: Array<LockerTicket> }
    //     reservation: ReservationList
    //     paymentStatement: PaymentStatementList
    // } = {
    //     membershipLocker: { membership: [], locker: [] },
    //     reservation: [],
    //     paymentStatement: [],
    // }

    // public doShowMembershipTicketModal = false
    // public doShowLockerTicketModal = false
    // public selectedMembershipTicket: MembershipTicket
    // public selectedLockerTicket: LockerTicket

    // public doShowMembershipTicketHoldModal = false
    // public doShowLockerTicketHoldModal = false

    // public doShowMembershipTicketDeleteModal = false
    // public doShowLockerTicketDeleteModal = false

    // public doShowLockerShiftModal = false
    // public willShiftedLockerTicket: LockerTicket

    // public doShowReservationCancelModal = false
    // public willCanceledReservation: Reservation
    // public cancelReservationText = {
    //     text: '',
    //     subText: `예약을 취소하실 경우,
    //   회원의 차감된 잔여 횟수가 1회 복구됩니다.`,
    //     cancelButtonText: '취소',
    //     confirmButtonText: '예약 취소',
    // }

    // // user list var
    // public otherEmptySearchNum = 0

    // public doShowChangeNameModal = false
    // public willChangedName = ''

    public showHoldDropdown = false
    public doShowHoldAllModal = false
    public doShowHoldPartialModal = false
    public holdModeFlags = { all: false, partial: false }
    public holdingNumber = 0

    // public userSearchInput: FormControl
    // public usersSelectCateg: UsersSelectCateg    // -----
    // public selectedUserList: SelectedUserList  // ----
    // public userLists: UsersList  // ----
    // public searchUserLists: UsersList
    // public managerLists: Record<Manager, Array<{ user: GetUserReturn; holdSelected: boolean }>>

    public userSearchInput: FormControl
    public usersSelectCateg$: Observable<FromDashboard.UsersSelectCateg>
    public curUserData$: Observable<FromDashboard.CurUseData>
    public usersLists$: Observable<FromDashboard.UsersLists>
    public searchedUsersLists$: Observable<FromDashboard.UsersLists>
    public selectedUserList$: Observable<FromDashboard.UserListSelect>

    public unsubscribe$ = new Subject<void>()
    constructor(
        private centerService: CenterService,
        private storageService: StorageService,
        private usersCenterService: UsersCenterService,
        private nxStore: Store,
        private fb: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private renderer: Renderer2
    ) {
        this.centerStaff = this.storageService.getUser()
        this.center = this.storageService.getCenter()

        this.nxStore
            .pipe(select(DashboardSelector.curCenterId), takeUntil(this.unsubscribe$))
            .subscribe((curCenterId) => {
                console.log(
                    'DashboardSelector.curCenterId : ',
                    curCenterId != this.center.id,
                    curCenterId,
                    this.center.id
                )
                if (curCenterId != this.center.id) {
                    // this.lockerSerState.resetLockerItemList()
                    this.nxStore.dispatch(DashboardActions.resetAll())
                    this.nxStore.dispatch(DashboardActions.startLoadMemberList({ centerId: this.center.id }))
                }
            })

        this.nxStore.dispatch(DashboardActions.setCurCenterId({ centerId: this.center.id }))

        this.usersLists$ = this.nxStore.select(DashboardSelector.usersLists)
        this.searchedUsersLists$ = this.nxStore.select(DashboardSelector.searchedUsersLists)
        this.usersSelectCateg$ = this.nxStore.select(DashboardSelector.usersSelectCategs)
        this.selectedUserList$ = this.nxStore.select(DashboardSelector.curUserListSelect)
    }

    ngOnInit(): void {}
    ngAfterViewInit(): void {}
    ngOnDestroy(): void {
        this.unsubscribe$.next()
        this.unsubscribe$.complete()
    }

    goToRegisterNewMember() {}
}
