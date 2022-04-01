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
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators'

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

    public userRole: { administrator: boolean; manager: boolean; staff: boolean; member: boolean } = {
        administrator: false,
        manager: false,
        staff: false,
        member: false,
    }
    public roleName = {
        administrator: '운영자',
        manager: '관리 직원',
        staff: '일반 직원',
        member: '회원',
    }

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
    public userSearchInput$_: string
    public usersSelectCateg$: Observable<FromDashboard.UsersSelectCateg>
    public curUserData$: Observable<FromDashboard.CurUseData>
    public usersLists$: Observable<FromDashboard.UsersLists>
    public selectedUserList$_: FromDashboard.UserListSelect // Observable<FromDashboard.UserListSelect>

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
        this.center = this.storageService.getCenter()
        this.centerStaff = this.storageService.getUser()

        // <-- ngrx codes
        this.usersSelectCateg$ = this.nxStore.select(DashboardSelector.usersSelectCategs)
        this.curUserData$ = this.nxStore.select(DashboardSelector.curUserData)
        this.usersLists$ = this.nxStore.select(DashboardSelector.usersLists)
        this.nxStore
            .pipe(select(DashboardSelector.curUserListSelect), takeUntil(this.unsubscribe$))
            .subscribe((selectedUserList) => {
                this.selectedUserList$_ = _.cloneDeep(selectedUserList) // !! 바꿀 때마다 받을 지 화면을 들어올 때만 맏을지 결정하기
            })
        this.nxStore
            .pipe(select(DashboardSelector.searchInput), takeUntil(this.unsubscribe$))
            .subscribe((searchInput) => {
                this.userSearchInput$_ = _.cloneDeep(searchInput)
            })
        // ngrx codes --> //
        this.userSearchInput = this.fb.control(this.userSearchInput$_, {
            asyncValidators: [this.searchMemberValidator()],
        })
        // waitAttendances()
    }

    ngOnInit(): void {}
    ngAfterViewInit(): void {}
    ngOnDestroy(): void {
        this.unsubscribe$.next()
        this.unsubscribe$.complete()
    }

    goToRegisterNewMember() {}

    // -------------------------------------- holding mode method --------------------------------------
    toggleHoldDropDown() {
        this.showHoldDropdown = !this.showHoldDropdown
    }
    closeHoldDropDown() {
        // this.getSerachUserList(this.userSearchInput.value)
        this.showHoldDropdown = false
    }

    openAllHoldModal() {
        this.doShowHoldAllModal = true
    }
    closeAllHoldModal() {
        this.doShowHoldAllModal = false
    }
    onHoldAllCancel() {
        this.closeAllHoldModal()
    }
    onHoldAllConfirm(event: { date: { startDate: string; endDate: string }; holdWithLocker: boolean }) {
        // this.GymDashboardService.holdAllMember(this.gym.id, {
        //     start_date: event.date.startDate,
        //     end_date: event.date.endDate,
        //     including_locker_ticket_yn: event.holdWithLocker,
        // }).subscribe((__) => {
        //     this.getUserList(this.selectedUserList.key, '', '', false, () => {
        //         this.getAllUserDetail()
        //         this.closeAllHoldModal()
        //         if (event.holdWithLocker) {
        //             this.globalService.showToast(
        //                 `${this.userLists.member.length}명 회원의 회원권 / 락커 홀딩이 예약되었습니다.`
        //             )
        //         } else {
        //             this.globalService.showToast(
        //                 `${this.userLists.member.length}명 회원의 회원권 홀딩이 예약되었습니다.`
        //             )
        //         }
        //     })
        // })
    }

    openPartialHoldModal() {
        this.doShowHoldPartialModal = true
    }
    closePartialHoldModal() {
        this.doShowHoldPartialModal = false
    }
    onHoldPartialCancel() {
        this.closePartialHoldModal()
    }
    onHoldPartialConfirm(event: { date: { startDate: string; endDate: string }; holdWithLocker: boolean }) {
        // const user_ids = _.map(
        //     _.filter(this.userLists[this.selectedUserList.key], (item) => item.holdSelected),
        //     (item) => item.user.id
        // )
        // console.log('hold: ', user_ids, event.date.startDate, event.date.endDate, event.holdWithLocker)
        // this.GymDashboardService.holdPartialMember(this.gym.id, {
        //     user_ids: user_ids,
        //     start_date: event.date.startDate,
        //     end_date: event.date.endDate,
        //     including_locker_ticket_yn: event.holdWithLocker,
        // }).subscribe((__) => {
        //     this.getAllUserDetail()
        //     this.closePartialHoldModal()
        //     if (event.holdWithLocker) {
        //         this.globalService.showToast(`${this.holdingNumber}명 회원의 회원권 / 락커 홀딩이 예약되었습니다.`)
        //     } else {
        //         this.globalService.showToast(`${this.holdingNumber}명 회원의 회원권 홀딩이 예약되었습니다.`)
        //     }
        //     this.toggleHodlingMode()
        // })
    }

    toggleHodlingMode() {
        this.holdingNumber = 0
        this.holdModeFlags.partial = !this.holdModeFlags.partial
        // this.resetSelectedCategListHold()
    }
    onPartialHoldClick(holdFlag: boolean) {
        // this.holdingNumber
        // !! 500명으로 제한 해야함
        this.holdingNumber += holdFlag ? 1 : -1
    }
    resetSelectedCategListHold() {
        // this.userLists[this.selectedUserList.key].forEach((item, index) => {
        //     this.userLists[this.selectedUserList.key][index].holdSelected = false
        // })
    }

    // ------------------------------------------- selectedUserList method ----------------------------------------------
    onSelectedUserListChange(type: string) {
        // this.gymDashboardState.setSelectedUserList(this.selectedUserList)
        // this.getUserList(type, '', '', true, () => {
        //     this.getSerachUserList(this.userSearchInput.value)
        // })
    }
    // -- //-------------------------------------- member search  validator method --------------------------------------
    searchMemberValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return control.valueChanges.pipe(
                debounceTime(0),
                distinctUntilChanged(),
                map((value) => {
                    // this.getSerachUserList(value)
                    return null
                })
            )
        }
    }
}
