import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { Router } from '@angular/router'

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
import { OutputType } from '@schemas/components/direct-register-member-fullmodal'

// rxjs
import { Subject } from 'rxjs'
import { take, takeUntil } from 'rxjs/operators'

// ngrx
import { Store, select } from '@ngrx/store'

import * as FromDashboard from '@centerStore/reducers/sec.dashboard.reducer'
import * as DashboardSelector from '@centerStore/selectors/sec.dashboard.selector'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import * as CenterCommonActions from '@centerStore/actions/center.common.actions'
import { showToast } from '@appStore/actions/toast.action'
import _ from 'lodash'

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
    // public attendedUser: CenterUser = undefined
    // public doShowMemberToast = false
    // showMemToast() {
    //     this.doShowMemberToast = true
    // }
    // hideMemToast() {
    //     this.doShowMemberToast = false
    // }

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
    closeRegisterMemberModal() {
        this.doShowRegisterMemberModal = false
    }

    public doShowDirectRegisterMemberFullModal = false
    toggleDirectRegisterMemberFullModal() {
        this.doShowDirectRegisterMemberFullModal = !this.doShowDirectRegisterMemberFullModal
    }
    whenFinishRegisterMember(value: OutputType) {
        this.nxStore.dispatch(
            DashboardActions.startDirectRegisterMember({
                centerId: this.center.id,
                reqBody: value.reqBody,
                imageFile: value.file,
                callback: () => {
                    this.nxStore.dispatch(CenterCommonActions.startGetMembers({ centerId: this.center.id }))
                    this.nxStore.dispatch(DashboardActions.startGetUsersByCategory({ centerId: this.center.id }))
                    value.cb ? value.cb() : null
                    this.toggleDirectRegisterMemberFullModal()
                    this.toggleRegisterMemberModal()
                },
            })
        )
    }
    closeDirectRegisterMemberFullModal() {
        this.toggleDirectRegisterMemberFullModal()
        this.toggleRegisterMemberModal()
    }

    //

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

    public usersSelectCateg$ = this.nxStore.select(DashboardSelector.usersSelectCategs)
    public curUserData$ = this.nxStore.select(DashboardSelector.curUserData)
    public usersLists$ = this.nxStore.select(DashboardSelector.usersLists)
    public searchInput$ = this.nxStore.select(DashboardSelector.searchInput)
    public searchedUsersLists = FromDashboard.UsersListInit
    public selectedUserList$ = this.nxStore.select(DashboardSelector.curUserListSelect)
    public isLoading$ = this.nxStore.select(DashboardSelector.isLoading)
    public selectedUserListsHolding$ = this.nxStore.select(DashboardSelector.selectedUserListsHolding)
    public curUserListSelect$ = this.nxStore.select(DashboardSelector.curUserListSelect)

    public unsubscribe$ = new Subject<boolean>()

    constructor(
        private centerService: CenterService,
        private storageService: StorageService,
        private usersCenterService: UsersCenterService,
        private nxStore: Store,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.centerStaff = this.storageService.getUser()
        this.center = this.storageService.getCenter()

        this.nxStore.pipe(select(DashboardSelector.curCenterId), take(1)).subscribe((curCenterId) => {
            if (curCenterId != this.center.id) {
                // this.lockerSerState.resetLockerItemList()
                this.nxStore.dispatch(DashboardActions.resetMainDashboardSstate())
                this.nxStore.dispatch(
                    DashboardActions.startLoadMemberList({
                        centerId: this.center.id,
                        cb: (cu) => {
                            this.nxStore.dispatch(
                                DashboardActions.startGetUserData({ centerId: this.center.id, centerUser: cu })
                            )
                        },
                    })
                )
            }
        })
        this.nxStore
            .pipe(select(DashboardSelector.curUserData), takeUntil(this.unsubscribe$))
            .subscribe((curUserData) => {
                this.willBeDeletedCenterUser = curUserData.user
                this.checkIsDeletableMember()
            })
        this.searchInput$.pipe(takeUntil(this.unsubscribe$)).subscribe((input) => {
            this.searchedUsersLists = _.cloneDeep(FromDashboard.UsersListInit)
            let _userList = FromDashboard.UsersListInit
            this.usersLists$.pipe(take(1)).subscribe((v) => {
                _userList = v
            })
            _.forEach(_.keys(_userList), (typeKey) => {
                this.searchedUsersLists[typeKey] = _.filter(_userList[typeKey], (item) => {
                    return _.includes(item.user.name, input) || _.includes(item.user.phone_number, input)
                })
            })
        })
        this.nxStore.dispatch(DashboardActions.startGetUsersByCategory({ centerId: this.center.id }))
        this.nxStore.dispatch(DashboardActions.setCurCenterId({ centerId: this.center.id }))
    }
    ngAfterViewInit(): void {}
    ngOnDestroy(): void {
        this.unsubscribe$.next(true)
        this.unsubscribe$.complete()
    }

    // delete member button
    checkIsDeletableMember() {
        if (_.isEmpty(this.willBeDeletedCenterUser)) return
        const centerUserRole = this.center.role_code
        switch (centerUserRole) {
            case 'instructor':
                this.isDeletableMemberUser =
                    this.willBeDeletedCenterUser.role_code != 'owner' &&
                    this.willBeDeletedCenterUser.role_code != 'administrator' &&
                    this.willBeDeletedCenterUser.role_code != 'instructor'
                break
            case 'administrator':
                this.isDeletableMemberUser =
                    this.willBeDeletedCenterUser.role_code != 'owner' &&
                    this.willBeDeletedCenterUser.role_code != 'administrator'
                break
            case 'owner':
                this.isDeletableMemberUser = this.willBeDeletedCenterUser.role_code != 'owner'
                break
            default:
                this.isDeletableMemberUser = false
                break
        }
    }
    public isDeletableMemberUser = false
    public willBeDeletedCenterUser: CenterUser = undefined
    public showDeleteMember = false
    public deleteMemberData = {
        text: '',
        subText: `매출 정보를 제외한 회원의 모든 정보가 삭제되며,
            삭제된 정보는 복구하실 수 없어요.`,
        cancelButtonText: '취소',
        confirmButtonText: '회원 삭제',
    }
    openDeleteMemberModal() {
        this.deleteMemberData.text = `${this.willBeDeletedCenterUser.name} 회원을 삭제하시겠어요?`
        this.showDeleteMember = true
    }
    closeDeleteMemberModal() {
        this.showDeleteMember = false
    }
    confirmDeleteMember() {
        let curUser: CenterUser = undefined
        const loginCenterUser: CenterUser = this.storageService.getCenterUser()
        this.curUserData$.pipe(take(1)).subscribe((cud) => {
            curUser = cud.user
        })
        this.nxStore.dispatch(
            DashboardActions.startExportMember({
                centerId: this.center.id,
                userId: curUser.id,
                callback: () => {
                    if (curUser.id == loginCenterUser.id) {
                        this.router.navigateByUrl('/redwhale-home')
                    }
                },
            })
        )
        this.nxStore.dispatch(showToast({ text: '회원 삭제가 완료되었습니다.' }))
        this.closeDeleteMemberModal()
    }
}
