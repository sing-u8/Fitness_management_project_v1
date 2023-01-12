import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { FormBuilder, FormControl } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import _ from 'lodash'
import dayjs from 'dayjs'

import { StorageService } from '@services/storage.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { WordService } from '@services/helper/word.service'
import { CenterService } from '@services/center.service'
import { TimeService } from '@services/helper/time.service'
import { DashboardHelperService } from '@services/center/dashboard-helper.service'
import { FileService } from '@services/file.service'
import { CenterUsersCheckInService } from '@services/center-users-check-in.service'
import { ScheduleHelperService } from '@services/center/schedule-helper.service'
import { CommunityHelperService } from '@services/center/community-helper.service'
import { CenterCalendarService } from '@services/center-calendar.service'

import { Center } from '@schemas/center'
import { Loading } from '@schemas/componentStore/loading'
import { User } from '@schemas/user'
import { MemberRole as Role } from '@schemas/center/dashboard/member-role'

import { Subject } from 'rxjs'
import { take, takeUntil } from 'rxjs/operators'

// ngrx
import { select, Store } from '@ngrx/store'
import * as DashboardReducer from '@centerStore/reducers/sec.dashboard.reducer'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import * as DashboardSelector from '@centerStore/selectors/sec.dashboard.selector'
import * as ScheduleActions from '@centerStore/actions/sec.schedule.actions'
import * as ScheduleSelector from '@centerStore/selectors/sec.schedule.selector'
import * as AppSelector from '@appStore/selectors'
import * as CenterCommonActions from '@centerStore/actions/center.common.actions'
import { showToast } from '@appStore/actions/toast.action'
import { closeDrawer, openDrawer } from '@appStore/actions/drawer.action'
import { CenterUser } from '@schemas/center-user'
import { ContractTypeCode } from '@schemas/contract'
import { UserMembership } from '@schemas/user-membership'
import { UpdateUserRequestBody } from '@services/center-users.service'
import { curUserData } from '@centerStore/selectors/sec.dashboard.selector'

@Component({
    selector: 'db-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.scss'],
})
export class MemberDetailComponent implements OnInit, OnDestroy, OnChanges {
    @Input() curUserListSelect: DashboardReducer.UserListSelect = _.cloneDeep(DashboardReducer.UserListSelectInit)

    public memoForm: FormControl = this.fb.control('')
    public center: Center
    public user: User
    public userInCenter: CenterUser

    public unSubscriber$ = new Subject<void>()
    public userDetailTag$ = this.nxStore.select(DashboardSelector.userDeatilTag)
    public isUserDetailLoading: Loading = undefined
    public showUserDetailLoading = false

    setUserDetailTag(tag: DashboardReducer.UserDetailTag) {
        this.nxStore.dispatch(DashboardActions.setUserDetailTag({ tag }))
    }

    public curUserData: DashboardReducer.CurUserData = _.cloneDeep(DashboardReducer.CurUserDataInit)
    public curUserData$ = this.nxStore.select(DashboardSelector.curUserData)

    public dbCurCenterId$ = this.nxStore.select(DashboardSelector.curCenterId)
    public dwCurCenterId$ = this.nxStore.select(DashboardSelector.drawerCurCenterId)
    public dbCurCenterId = undefined
    public dwCurCenterId = undefined

    constructor(
        private fb: FormBuilder,
        private storageService: StorageService,
        private nxStore: Store,
        private spinner: NgxSpinnerService,
        private wordService: WordService,
        private centerService: CenterService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private timeService: TimeService,
        private dashboardHelperService: DashboardHelperService,
        private fileService: FileService,
        private centerUsersCheckInService: CenterUsersCheckInService,
        private scheduleHelperService: ScheduleHelperService,
        private communityHelperService: CommunityHelperService,
        private centerCalendarService: CenterCalendarService
    ) {
        this.center = this.storageService.getCenter()
        this.user = this.storageService.getUser()
        this.userInCenter = this.storageService.getCenterUser()
        this.staffRole = this.center.role_code as Role

        this.spinner.show('ud_loading')
        this.nxStore
            .pipe(select(DashboardSelector.isUserDetailLoading), takeUntil(this.unSubscriber$))
            .subscribe((isUserDeatilLoading) => {
                this.isUserDetailLoading = isUserDeatilLoading
                if (this.isUserDetailLoading == 'pending') {
                    this.showUserDetailLoading = true
                    this.spinner.show('ud_loading')
                } else {
                    this.showUserDetailLoading = false
                    this.spinner.hide('ud_loading')
                }
            })

        this.curUserData$.pipe(takeUntil(this.unSubscriber$)).subscribe((curUserData) => {
            this.curUserData = {
                ...curUserData,
                payments: DashboardReducer.getPaymentsWithoutTotalZero(curUserData.payments),
            }
            this.findEndDateToExpired(7)

            this.memoForm.setValue(this.curUserData?.user?.memo ?? '')
            this.userNameForModal = this.curUserData?.user?.name ?? ''
            this.userMembershipNumberForModal = this.curUserData?.user?.membership_number ?? ''

            _.forIn(this.userRole, (value, key) => {
                this.userRole[key] = key == this.curUserData?.user?.role_code
            })
        })

        this.dbCurCenterId$.pipe(takeUntil(this.unSubscriber$)).subscribe((dbCurCenterId) => {
            this.dbCurCenterId = dbCurCenterId
        })
        this.dwCurCenterId$.pipe(takeUntil(this.unSubscriber$)).subscribe((dwCurCenterId) => {
            this.dwCurCenterId = dwCurCenterId
        })
    }

    // oneToOne Chat
    onOneToOneChat() {
        this.nxStore.pipe(select(AppSelector.drawerSelector), take(1)).subscribe((drawer) => {
            if (drawer.tabName == 'community') {
                this.nxStore.dispatch(closeDrawer())
            } else {
                this.communityHelperService.createOneToOneChatRoomByDashboard(
                    'drawer',
                    this.center,
                    this.curUserData.user,
                    this.userInCenter
                )
                this.nxStore.dispatch(openDrawer({ tabName: 'community' }))
            }
        })
    }

    // transfer membership full modal vars and funcs
    public doShowTransferMFullModal = false
    openTransferMFullModal() {
        this.doShowTransferMFullModal = true
    }
    closeTransferMFullModal() {
        this.doShowTransferMFullModal = false
    }
    onFinishTransferM() {
        this.closeTransferMFullModal()
    }

    public transferCenterUser: CenterUser = undefined
    setTransferCenterUser(cu: CenterUser) {
        this.transferCenterUser = cu
    }
    public transferUserMembership: UserMembership = undefined
    setTransferUserMembership(um: UserMembership) {
        this.transferUserMembership = um
    }

    // register membership locker full modal vars and funcs
    public doShowRegisterMLFullModal = false
    public registerMLFullModalType: ContractTypeCode = 'contract_type_new'
    openRegisterMLFullModal(type: ContractTypeCode) {
        this.registerMLFullModalType = type
        this.doShowRegisterMLFullModal = true
    }
    closeRegisterMLFullModal() {
        this.doShowRegisterMLFullModal = false
    }
    onFinishRegisterML() {
        this.closeRegisterMLFullModal()
    }

    // reRegister funcs and vars
    public registerMLUserMembership: UserMembership = undefined
    setReRegisterMLUserMembership(um: UserMembership) {
        this.registerMLUserMembership = um
    }

    // check in
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
    onAttend() {
        this.attendUserModalText.text = `${this.wordService.ellipsis(
            this.curUserData.user.name,
            4
        )}님을 출석 처리하시겠어요?`
        this.doShowAttendModal = true
    }
    onAttendModalClose() {
        this.doShowAttendModal = false
    }
    onAttendModalConfirm() {
        this.centerUsersCheckInService.checkIn(this.center.id, this.curUserData.user.id).subscribe((res) => {
            const centerUser = this.curUserData.user
            if (!_.isEmpty(this.dbCurCenterId) && this.dbCurCenterId == this.center.id) {
                this.dashboardHelperService.synchronizeCheckIn(this.center.id, centerUser)
            }
            if (!_.isEmpty(this.dwCurCenterId) && this.dwCurCenterId == this.center.id) {
                this.dashboardHelperService.synchronizeCheckInDrawer(this.center.id, centerUser)
            }
            // this.nxStore.dispatch(
            //     showToast({
            //         text: `${this.wordService.ellipsis(
            //             this.curUserData.user.center_user_name,
            //             4
            //         )}님이 출석 처리되었습니다.`,
            //     })
            // )
            this.nxStore.dispatch(
                DashboardActions.showAttendanceToast({
                    visible: true,
                    centerUser: this.curUserData.user,
                })
            )
            this.onAttendModalClose()
        })
    }

    onCancelAttend() {
        this.cancelAttendUserModalText.text = `${this.wordService.ellipsis(
            this.curUserData.user.name,
            4
        )}님을 출석 취소하시겠어요?`
        this.doShowCancelAttendModal = true
    }
    onCancelAttendModalClose() {
        this.doShowCancelAttendModal = false
    }
    onCancelAttendConfirm() {
        this.centerUsersCheckInService.removeCheckIn(this.center.id, this.curUserData.user.id).subscribe((res) => {
            const centerUser = this.curUserData.user
            if (!_.isEmpty(this.dbCurCenterId) && this.dbCurCenterId == this.center.id) {
                this.dashboardHelperService.synchronizeRemoveCheckIn(this.center.id, centerUser)
            }
            if (!_.isEmpty(this.dwCurCenterId) && this.dwCurCenterId == this.center.id) {
                this.dashboardHelperService.synchronizeRemoveCheckInDrawer(this.center.id, centerUser)
            }
            this.nxStore.dispatch(
                showToast({
                    text: `${this.wordService.ellipsis(this.curUserData.user.name, 4)}님이 출석 취소되었습니다.`,
                })
            )
            this.onCancelAttendModalClose()
        })
    }

    //

    ngOnInit(): void {}
    ngOnDestroy(): void {
        this.unSubscriber$.next()
        this.unSubscriber$.complete()
    }

    ngOnChanges(changes: SimpleChanges): void {
        // if (!_.isEmpty(changes['curUserData'])) {
        //     if (changes['curUserData'].previousValue?.user?.id != changes['curUserData'].currentValue['user']?.id) {
        //         this.memoForm.setValue(changes['curUserData'].currentValue['user']?.['memo'] ?? '')
        //         this.userNameForModal = this.curUserData?.user?.name ?? ''
        //         this.userMembershipNumberForModal = this.curUserData?.user?.membership_number ?? ''
        //
        //         _.forIn(this.userRole, (value, key) => {
        //             this.userRole[key] = key == this.curUserData?.user?.role_code
        //         })
        //     }
        //     if (
        //         !_.isEmpty(changes['curUserData'].currentValue['user']) &&
        //         changes['curUserData'].previousValue?.user?.user_membership_end_date !=
        //             changes['curUserData'].currentValue['user']?.user_membership_end_date
        //     ) {
        //         this.findEndDateToExpired(7)
        //     }
        // }
    }

    //
    public imminentDateObj = {
        isImminent: false,
        imminentDate: 0,
    }
    findEndDateToExpired(dateToExpired: number) {
        if (_.isEmpty(this.curUserData.user)) return
        const remainDate = this.timeService.getRestPeriod(
            dayjs().format(),
            this.curUserData.user.user_membership_in_use_end_date
        )
        if (remainDate <= dateToExpired) {
            this.imminentDateObj = {
                isImminent: true,
                imminentDate: remainDate,
            }
        } else {
            this.imminentDateObj = {
                isImminent: false,
                imminentDate: 0,
            }
        }
    }
    //

    updateUserMemo(memoValue: string) {
        if (this.curUserData.user.memo != memoValue) {
            this.nxStore.dispatch(
                DashboardActions.startSetCurUserData({
                    centerId: this.center.id,
                    reqBody: { memo: memoValue },
                    userId: this.curUserData.user.id,
                    callback: () => {
                        const _centerUser = {
                            ..._.cloneDeep(this.curUserData.user),
                            memo: memoValue,
                        }
                        this.storageService.updateCenterUser(_centerUser)
                    },
                })
            )
        }
    }

    // change name modal funcs and vars
    public doShowChangeNameModal = false
    public userNameForModal = ''
    toggleShowChangeNameModal() {
        this.doShowChangeNameModal = !this.doShowChangeNameModal
    }
    onChangeNameConfirm(changedName: string) {
        if (this.curUserData.user.name != changedName) {
            this.nxStore.dispatch(
                DashboardActions.startSetCurUserData({
                    centerId: this.center.id,
                    reqBody: { name: changedName },
                    userId: this.curUserData.user.id,
                    callback: () => {
                        this.toggleShowChangeNameModal()
                        this.nxStore.dispatch(showToast({ text: `회원 이름 변경이 완료되었습니다.` }))
                        this.nxStore.dispatch(CenterCommonActions.startGetMembers({ centerId: this.center.id }))
                        this.nxStore.dispatch(CenterCommonActions.startGetInstructors({ centerId: this.center.id }))

                        const userCopy = _.cloneDeep(this.curUserData.user)
                        userCopy.name = changedName
                        this.scheduleHelperService.startSynchronizeInstructorList(this.center.id, userCopy)

                        this.storageService.updateCenterUser(userCopy)
                    },
                })
            )
        } else {
            this.toggleShowChangeNameModal()
        }
    }

    public doShowChangeMembershipNumberModal = false
    public userMembershipNumberForModal = ''
    toggleShowChangeMembershipNumberModal() {
        this.doShowChangeMembershipNumberModal = !this.doShowChangeMembershipNumberModal
    }
    onChangeMembershipNumberConfirm(membershipNumber: string) {
        this.nxStore.dispatch(
            DashboardActions.startSetCurUserData({
                centerId: this.center.id,
                reqBody: { membership_number: membershipNumber },
                userId: this.curUserData.user.id,
                blockEffect: true,
                callback: () => {
                    this.toggleShowChangeMembershipNumberModal()
                    this.nxStore.dispatch(showToast({ text: `회원번호 변경이 완료되었습니다.` }))
                    this.nxStore.dispatch(CenterCommonActions.startGetMembers({ centerId: this.center.id }))
                    this.nxStore.dispatch(CenterCommonActions.startGetInstructors({ centerId: this.center.id }))

                    const _centerUser = {
                        ..._.cloneDeep(this.curUserData.user),
                        membership_number: membershipNumber,
                    }
                    this.storageService.updateCenterUser(_centerUser)
                },
            })
        )
    }

    public doShowChangeUserEmailModal = false
    toggleShowChangeUserEmailModal() {
        this.doShowChangeUserEmailModal = !this.doShowChangeUserEmailModal
    }
    onChangeUserEmailConfirm(res: { centerId: string; userId: string; reqBody: UpdateUserRequestBody }) {
        this.nxStore.dispatch(
            DashboardActions.setCurUserData({
                centerId: this.center.id,
                reqBody: res.reqBody,
                userId: this.curUserData.user.id,
            })
        )
        this.nxStore.dispatch(showToast({ text: `이메일 입력이 완료되었습니다.` }))
        this.nxStore.dispatch(CenterCommonActions.startGetMembers({ centerId: this.center.id }))
        this.nxStore.dispatch(CenterCommonActions.startGetInstructors({ centerId: this.center.id }))
        this.toggleShowChangeUserEmailModal()

        const _centerUser = {
            ..._.cloneDeep(this.curUserData.user),
            ...res.reqBody,
        }
        this.storageService.updateCenterUser(_centerUser)
    }

    public doShowChangeUserPhoneNumberModal = false
    toggleShowChangeUserPhoneNumberModal() {
        this.doShowChangeUserPhoneNumberModal = !this.doShowChangeUserPhoneNumberModal
    }
    onChangeUserPhoneNumberConfirm(res: { centerId: string; userId: string; reqBody: UpdateUserRequestBody }) {
        this.nxStore.dispatch(
            DashboardActions.setCurUserData({
                centerId: this.center.id,
                reqBody: res.reqBody,
                userId: this.curUserData.user.id,
            })
        )
        this.nxStore.dispatch(showToast({ text: `전화번호 입력이 완료되었습니다.` }))
        this.nxStore.dispatch(CenterCommonActions.startGetMembers({ centerId: this.center.id }))
        this.nxStore.dispatch(CenterCommonActions.startGetInstructors({ centerId: this.center.id }))
        this.toggleShowChangeUserPhoneNumberModal()

        const _centerUser = {
            ..._.cloneDeep(this.curUserData.user),
            ...res.reqBody,
        }
        this.storageService.updateCenterUser(_centerUser)
    }

    public doShowChangeUserBirthDateModal = false
    toggleShowChangeUserBirthDateModal() {
        this.doShowChangeUserBirthDateModal = !this.doShowChangeUserBirthDateModal
    }
    onChangeUserBirthDateConfirm(res: { centerId: string; userId: string; reqBody: UpdateUserRequestBody }) {
        this.nxStore.dispatch(
            DashboardActions.setCurUserData({
                centerId: this.center.id,
                reqBody: res.reqBody,
                userId: this.curUserData.user.id,
            })
        )
        this.nxStore.dispatch(showToast({ text: `생년월일 입력이 완료되었습니다.` }))
        this.nxStore.dispatch(CenterCommonActions.startGetMembers({ centerId: this.center.id }))
        this.nxStore.dispatch(CenterCommonActions.startGetInstructors({ centerId: this.center.id }))
        this.toggleShowChangeUserBirthDateModal()

        const _centerUser = {
            ..._.cloneDeep(this.curUserData.user),
            ...res.reqBody,
        }
        this.storageService.updateCenterUser(_centerUser)
    }

    // update user profile funcs and vars
    public doShowRemoveUserProfile = false
    public removeUserProfileData = {
        text: '프로필 사진을 삭제하시겠어요?',
        subText: `프로필 사진을 삭제할 경우,
                    다시 복구하실 수 없어요.`,
        confirmButtonText: '삭제',
    }
    public toggleRemoveUserProfile() {
        this.doShowRemoveUserProfile = !this.doShowRemoveUserProfile
    }
    public removeUserProfile() {
        this.nxStore.dispatch(
            DashboardActions.startRemoveCurUserProfile({
                centerId: this.center.id,
                userId: this.curUserData.user.id,
                profileUrl: this.curUserData.user.picture,
                callback: () => {
                    this.toggleRemoveUserProfile()
                    this.nxStore.dispatch(
                        showToast({
                            text: `${this.curUserData.user.name}님의 프로필 사진이 삭제되었습니다.`,
                        })
                    )
                    this.nxStore.dispatch(CenterCommonActions.startGetMembers({ centerId: this.center.id }))
                    this.nxStore.dispatch(CenterCommonActions.startGetInstructors({ centerId: this.center.id }))
                },
            })
        )
    }
    registerUserProfile(picture: any) {
        if (!this.isFileExist(picture.files)) return
        const files: FileList = _.assign({ length: 1 }, picture.files)
        if (!_.isEmpty(this.curUserData.user.picture)) {
            this.fileService.deleteFile(this.curUserData.user.picture).subscribe(() => {
                this.nxStore.dispatch(
                    DashboardActions.startRegisterCurUserProfile({
                        userId: this.curUserData.user.id,
                        centerUser: this.curUserData.user,
                        reqBody: {
                            type_code: 'file_type_center_user_picture',
                            center_id: this.center.id,
                            center_user_id: this.curUserData.user.id,
                        },
                        profile: files,
                        callback: (cu: CenterUser) => {
                            this.nxStore.dispatch(
                                showToast({
                                    text: `${this.curUserData.user.name}님의 프로필 사진이 변경되었습니다.`,
                                })
                            )
                            this.nxStore.dispatch(CenterCommonActions.startGetMembers({ centerId: this.center.id }))
                            this.nxStore.dispatch(CenterCommonActions.startGetInstructors({ centerId: this.center.id }))
                            this.storageService.updateCenterUser(cu)
                        },
                    })
                )
            })
        } else {
            this.nxStore.dispatch(
                DashboardActions.startRegisterCurUserProfile({
                    userId: this.curUserData.user.id,
                    centerUser: this.curUserData.user,
                    reqBody: {
                        type_code: 'file_type_center_user_picture',
                        center_id: this.center.id,
                        center_user_id: this.curUserData.user.id,
                    },
                    profile: files,
                    callback: (cu: CenterUser) => {
                        this.nxStore.dispatch(
                            showToast({
                                text: `${this.curUserData.user.name}님의 프로필 사진이 변경되었습니다.`,
                            })
                        )
                        this.nxStore.dispatch(CenterCommonActions.startGetMembers({ centerId: this.center.id }))
                        this.nxStore.dispatch(CenterCommonActions.startGetInstructors({ centerId: this.center.id }))
                        this.storageService.updateCenterUser(cu)
                    },
                })
            )
        }
    }
    isFileExist(fileList: FileList) {
        return !(fileList && fileList.length == 0)
    }
    // user role -----------------------
    public userRole: Record<Role, boolean> = {
        owner: false,
        administrator: false,
        instructor: false,
        member: false,
    }
    public roleName: Record<Role, string> = {
        owner: '운영자',
        administrator: '관리자',
        instructor: '강사',
        member: '회원',
    }
    public staffRole: Role = undefined

    public doShowChangeRoleModal = false
    public changeRoleModalText = {
        text: '',
        subText: `권한 변경 시, 새로운 접근 권한이 주어지므로
        꼭 신중하게 선택해주세요. 🙏`,
        cancelButtonText: '취소',
        confirmButtonText: '변경',
    }

    public doShowRoleSelect = false

    toggleRoleSelect() {
        if (!this.doShowRoleSelect) {
            this.doShowRoleSelect = true
        } else {
            this.closeRoleSelect()
        }
    }
    closeRoleSelect() {
        this.doShowRoleSelect = false
        _.forIn(this.userRole, (value, key) => {
            this.userRole[key] = key == this.curUserData?.user?.role_code
        })
    }
    setUserRole(role: Role) {
        _.forIn(this.userRole, (value, key) => {
            this.userRole[key] = key == role
        })
    }

    openChangeRoleModal() {
        const changedRole: Role = _.findKey(this.userRole, (item) => item) as Role
        const isSameRole = this.curUserData?.user?.role_code == changedRole
        this.changeRoleModalText.text =
            changedRole == 'owner'
                ? `${this.wordService.ellipsis(this.curUserData.user.name, 4)}님에게 ${
                      this.roleName[changedRole]
                  }를 양도하시겠어요?`
                : `${this.wordService.ellipsis(this.curUserData.user.name, 4)}님을 ${
                      this.roleName[changedRole]
                  }(으)로 변경하시겠어요?`
        this.changeRoleModalText.confirmButtonText = changedRole == 'owner' ? '운영자 양도' : '변경'
        this.changeRoleModalText.subText =
            changedRole == 'owner'
                ? `운영자 양도 후, 본인의 권한은 회원으로 변경되며
                  양도된 권한은 복구가 불가능합니다.`
                : `권한 변경 시, 새로운 접근 권한이 주어지므로
                  꼭 신중하게 선택해주세요. 🙏`
        this.doShowChangeRoleModal = !isSameRole
        this.doShowRoleSelect = false
    }
    closeChangeRoleModal() {
        this.doShowChangeRoleModal = false
        _.forIn(this.userRole, (value, key) => {
            this.userRole[key] = key == this.curUserData?.user?.role_code
        })
    }
    confirmChangeRoleModal() {
        const roleKey = _.findKey(this.userRole, (bool) => bool)

        this.nxStore.dispatch(DashboardActions.startGetUsersByCategory({ centerId: this.center.id }))
        if (roleKey == 'owner') {
            // !! 추후에 수정이 필요 (이전 운영자에 대한 권한 처리 부분)
            this.nxStore.dispatch(
                DashboardActions.startDelegate({
                    centerId: this.center.id,
                    reqBody: {
                        center_user_id: this.curUserData.user.id,
                    },
                    callback: () => {
                        this.doShowChangeRoleModal = false
                        this.nxStore.dispatch(
                            showToast({
                                text: `${this.wordService.ellipsis(this.curUserData.user.name, 4)}님이 ${
                                    this.roleName[roleKey]
                                }로 변경되었습니다.`,
                            })
                        )
                        this.nxStore.dispatch(CenterCommonActions.startGetInstructors({ centerId: this.center.id }))
                        this.nxStore.dispatch(CenterCommonActions.startGetMembers({ centerId: this.center.id }))
                        this.nxStore.dispatch(
                            CenterCommonActions.startGetCenterPermission({ centerId: this.center.id })
                        )
                        this.centerService.getCenter(this.center.id).subscribe((center) => {
                            this.storageService.setCenter(center)
                        })
                        this.nxStore.dispatch(CenterCommonActions.startGetCurCenter({ centerId: this.center.id }))
                        this.dashboardHelperService.refreshUserList(
                            this.center.id,
                            this.curUserData.user,
                            this.curUserListSelect.key
                        )

                        this.centerCalendarService
                            .getCalendars(this.center.id, { typeCode: 'calendar_type_center_calendar' })
                            .subscribe((cals) => {
                                this.nxStore.dispatch(
                                    ScheduleActions.startCreateInstructorFilter({
                                        centerId: this.center.id,
                                        centerCalendarId: cals[0].id,
                                        reqBody: {
                                            instructor_center_user_id: this.curUserData.user.id,
                                        },
                                    })
                                )
                            })
                        // this.router.navigate(['./sale'], { relativeTo: this.activatedRoute })
                    },
                })
            )
        } else {
            this.nxStore.dispatch(
                DashboardActions.startSetCurUserData({
                    centerId: this.center.id,
                    userId: this.curUserData.user.id,
                    reqBody: {
                        role_code: roleKey,
                    },
                    callback: () => {
                        this.doShowChangeRoleModal = false
                        this.nxStore.dispatch(
                            showToast({
                                text: `${this.wordService.ellipsis(this.curUserData.user.name, 4)}님이 ${
                                    this.roleName[roleKey]
                                }(으)로 변경되었습니다.`,
                            })
                        )
                        this.nxStore.dispatch(CenterCommonActions.startGetInstructors({ centerId: this.center.id }))
                        this.nxStore.dispatch(CenterCommonActions.startGetMembers({ centerId: this.center.id }))
                        this.nxStore.dispatch(
                            CenterCommonActions.startGetCenterPermission({ centerId: this.center.id })
                        )
                        this.nxStore.dispatch(CenterCommonActions.startGetCurCenter({ centerId: this.center.id }))
                        this.dashboardHelperService.refreshUserList(
                            this.center.id,
                            this.curUserData.user,
                            this.curUserListSelect.key
                        )
                        this.dashboardHelperService.refreshDrawerUserList(
                            this.center.id,
                            this.curUserData.user,
                            this.curUserListSelect.key
                        )

                        const _centerUser = {
                            ..._.cloneDeep(this.curUserData.user),
                            role_code: roleKey,
                        }
                        this.storageService.updateCenterUser(_centerUser)

                        if (roleKey != 'member') {
                            this.centerCalendarService
                                .getCalendars(this.center.id, { typeCode: 'calendar_type_center_calendar' })
                                .subscribe((cals) => {
                                    this.nxStore.dispatch(
                                        ScheduleActions.startCreateInstructorFilter({
                                            centerId: this.center.id,
                                            centerCalendarId: cals[0].id,
                                            reqBody: {
                                                instructor_center_user_id: this.curUserData.user.id,
                                            },
                                        })
                                    )
                                })
                        }
                    },
                })
            )
        }
    }
    // ------------------------------------
}
