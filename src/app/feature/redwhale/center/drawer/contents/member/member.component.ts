import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { Drawer } from '@schemas/store/app/drawer.interface'
import { Center } from '@schemas/center'
import { User } from '@schemas/user'
import { CenterUser } from '@schemas/center-user'
import { OutputType } from '@schemas/components/direct-register-member-fullmodal'
import { MemberRole as Role } from '@schemas/center/dashboard/member-role'
// rxjs
import { Observable, Subject } from 'rxjs'
import { take, takeUntil } from 'rxjs/operators'
// ngrx
import { select, Store } from '@ngrx/store'
import { drawerSelector } from '@appStore/selectors'
import { closeDrawer } from '@appStore/actions/drawer.action'
import { showToast } from '@appStore/actions/toast.action'
import * as DashboardReducer from '@centerStore/reducers/sec.dashboard.reducer'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import * as CenterCommonActions from '@centerStore/actions/center.common.actions'
import * as DashboardSelector from '@centerStore/selectors/sec.dashboard.selector'
// services
import { CenterService } from '@services/center.service'
import { StorageService } from '@services/storage.service'
import { UsersCenterService } from '@services/users-center.service'
import { DashboardHelperService } from '@services/center/dashboard-helper.service'
import { WordService } from '@services/helper/word.service'
import { FileService } from '@services/file.service'
import { CenterUsersCheckInService } from '@services/center-users-check-in.service'
import { ScheduleHelperService } from '@services/center/schedule-helper.service'
import { CommunityHelperService } from '@services/center/community-helper.service'
import { TimeService } from '@services/helper/time.service'

import _ from 'lodash'
import { UpdateUserRequestBody } from '@services/center-users.service'
import dayjs from 'dayjs'
import * as FromDashboard from '@centerStore/reducers/sec.dashboard.reducer'

@Component({
    selector: 'dr-member',
    templateUrl: './member.component.html',
    styleUrls: ['./member.component.scss'],
})
export class MemberComponent implements OnInit, OnDestroy {
    public drawer$: Observable<Drawer>

    public usersSelectCateg$ = this.nxStore.select(DashboardSelector.drawerUsersSelectCategs)
    public curUserData$ = this.nxStore.select(DashboardSelector.drawerCurUserData)
    public usersLists$ = this.nxStore.select(DashboardSelector.drawerUsersLists)
    public searchInput$ = this.nxStore.select(DashboardSelector.drawerSearchInput)
    public selectedUserList$ = this.nxStore.select(DashboardSelector.drawerCurUserListSelect)
    public searchedUsersLists = FromDashboard.UsersListInit
    public isLoading$ = this.nxStore.select(DashboardSelector.drawerIsLoading)
    public selectedUserListsHolding$ = this.nxStore.select(DashboardSelector.drawerSelectedUserListsHolding)
    public curUserListSelect$ = this.nxStore.select(DashboardSelector.drawerCurUserListSelect)

    public unSubscriber$ = new Subject<boolean>()

    public user: User = this.storageService.getUser()
    public userInCenter: CenterUser

    public center: Center
    public centerStaff: User
    public curCenterUser: CenterUser = undefined
    public curUserListSelect: DashboardReducer.UserListSelect = _.cloneDeep(DashboardReducer.UserListSelectInit)

    public showUserDetail = false

    public curUserData: DashboardReducer.CurUserData = undefined

    constructor(
        private centerService: CenterService,
        private storageService: StorageService,
        private usersCenterService: UsersCenterService,
        private nxStore: Store,
        private fb: FormBuilder,
        private dashboardHelperService: DashboardHelperService,
        private wordService: WordService,
        private fileService: FileService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private centerUsersCheckInService: CenterUsersCheckInService,
        private scheduleHelperService: ScheduleHelperService,
        private communityHelperService: CommunityHelperService,
        private timeService: TimeService
    ) {}

    ngOnInit(): void {
        this.drawer$ = this.nxStore.pipe(select(drawerSelector))
        this.centerStaff = this.storageService.getUser()
        this.center = this.storageService.getCenter()
        this.userInCenter = this.storageService.getCenterUser()
        this.staffRole = this.center.role_code as Role

        this.nxStore.pipe(select(DashboardSelector.drawerCurCenterId), take(1)).subscribe((curCenterId) => {
            if (curCenterId != this.center.id) {
                this.nxStore.dispatch(DashboardActions.resetDrawerDashboardSstate())
                this.nxStore.dispatch(
                    DashboardActions.startGetDrawerUserList({
                        centerId: this.center.id,
                        categ_type: 'member',
                    })
                )
            }
        })
        this.nxStore.dispatch(DashboardActions.startGetDrawerUsersByCategory({ centerId: this.center.id }))
        this.nxStore.dispatch(DashboardActions.setDrawerCurCenterId({ centerId: this.center.id }))

        this.curUserListSelect$.pipe(takeUntil(this.unSubscriber$)).subscribe((culs) => {
            this.curUserListSelect = culs
        })

        this.curUserData$.pipe(takeUntil(this.unSubscriber$)).subscribe((curUserData) => {
            this.curUserData = curUserData
            this.findEndDateToExpired(7)

            this.curCenterUser = curUserData.user
            this.memoForm.setValue(this.curCenterUser?.memo ?? '')
            this.userNameForModal = this.curCenterUser?.name
            this.userMembershipNumberForModal = this.curUserData?.user?.membership_number ?? ''

            _.forIn(this.userRole, (value, key) => {
                this.userRole[key] = key == this.curCenterUser?.role_code
            })
        })

        this.searchInput$.pipe(takeUntil(this.unSubscriber$)).subscribe((input) => {
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
    }
    ngOnDestroy() {
        this.unSubscriber$.next(true)
        this.unSubscriber$.complete()
    }

    closeDrawer() {
        this.nxStore.dispatch(closeDrawer({ tabName: 'none' }))
    }

    routeToDashboard() {
        this.router.navigate(['./dashboard'], { relativeTo: this.activatedRoute })
    }

    // oneToOne Chat
    onOneToOneChat() {
        this.communityHelperService.createOneToOneChatRoomByDashboard(
            'main',
            this.center,
            this.curUserData.user,
            this.userInCenter
        )
        this.router.navigate(['./community'], { relativeTo: this.activatedRoute })
    }

    // register modal vars and funcs
    public doShowRegisterMemberModal = false
    toggleRegisterMemberModal() {
        this.doShowRegisterMemberModal = !this.doShowRegisterMemberModal
    }
    closeRegisterMemberModal() {
        this.doShowRegisterMemberModal = false
    }

    // register member vars and funcs
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
                    // this.toggleRegisterMemberModal()
                },
            })
        )
    }
    closeDirectRegisterMemberFullModal() {
        this.toggleDirectRegisterMemberFullModal()
        // this.toggleRegisterMemberModal()
    }

    // register membership locker full modal vars and funcs
    public doShowRegisterMLFullModal = false
    toggleRegisterMLFullModal() {
        this.doShowRegisterMLFullModal = !this.doShowRegisterMLFullModal
    }
    onFinishRegisterML() {
        this.toggleRegisterMLFullModal()
    }

    // change name modal vars and funcs
    public doShowChangeNameModal = false
    public userNameForModal = ''
    toggleShowChangeNameModal() {
        this.doShowChangeNameModal = !this.doShowChangeNameModal
    }

    onChangeNameConfirm(changedName: string) {
        if (this.curCenterUser.name != changedName) {
            this.nxStore.dispatch(
                DashboardActions.startSetCurUserData({
                    centerId: this.center.id,
                    reqBody: { name: changedName },
                    userId: this.curCenterUser.id,
                    callback: () => {
                        this.doShowChangeNameModal = false
                        this.nxStore.dispatch(showToast({ text: `회원 이름 변경이 완료되었습니다.` }))
                        this.nxStore.dispatch(CenterCommonActions.startGetMembers({ centerId: this.center.id }))
                        this.nxStore.dispatch(CenterCommonActions.startGetInstructors({ centerId: this.center.id }))

                        const userCopy = _.cloneDeep(this.curCenterUser)
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

    // curUser memo vars and funcs
    public memoForm: FormControl = this.fb.control('')
    updateUserMemo(memoValue: string) {
        if (this.curCenterUser.memo != memoValue) {
            this.nxStore.dispatch(
                DashboardActions.startSetCurUserData({
                    centerId: this.center.id,
                    reqBody: { memo: memoValue },
                    userId: this.curCenterUser.id,
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

    // role select vars and funcs
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
            this.userRole[key] = key == this.curCenterUser?.role_code
        })
    }
    setUserRole(role: Role) {
        _.forIn(this.userRole, (value, key) => {
            this.userRole[key] = key == role
        })
    }

    openChangeRoleModal() {
        const changedRole: Role = _.findKey(this.userRole, (item) => item) as Role
        const isSameRole = this.curCenterUser?.role_code == changedRole
        this.changeRoleModalText.text =
            changedRole == 'owner'
                ? `${this.wordService.ellipsis(this.curCenterUser.name, 4)}님에게 ${
                      this.roleName[changedRole]
                  }를 양도하시겠어요?`
                : `${this.wordService.ellipsis(this.curCenterUser.name, 4)}님을 ${
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
            this.userRole[key] = key == this.curCenterUser?.role_code
        })
    }
    confirmChangeRoleModal() {
        const roleKey = _.findKey(this.userRole, (bool) => bool)

        this.nxStore.dispatch(DashboardActions.startGetDrawerUsersByCategory({ centerId: this.center.id }))
        if (roleKey == 'owner') {
            // !! 추후에 수정이 필요 (이전 운영자에 대한 권한 처리 부분)
            this.nxStore.dispatch(
                DashboardActions.startDelegate({
                    centerId: this.center.id,
                    reqBody: {
                        center_user_id: this.curCenterUser.id,
                    },
                    callback: () => {
                        this.doShowChangeRoleModal = false
                        this.nxStore.dispatch(
                            showToast({
                                text: `${this.wordService.ellipsis(this.curCenterUser.name, 4)}님이 ${
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
                            this.curCenterUser,
                            this.curUserListSelect.key
                        )
                        // this.router.navigate(['./sale'], { relativeTo: this.activatedRoute })
                    },
                })
            )
        } else {
            this.nxStore.dispatch(
                DashboardActions.startSetCurUserData({
                    centerId: this.center.id,
                    userId: this.curCenterUser.id,
                    reqBody: {
                        role_code: roleKey,
                    },
                    callback: () => {
                        this.doShowChangeRoleModal = false
                        this.nxStore.dispatch(
                            showToast({
                                text: `${this.wordService.ellipsis(this.curCenterUser.name, 4)}님이 ${
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
                            this.curCenterUser,
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
                    },
                })
            )
        }
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
                userId: this.curCenterUser.id,
                profileUrl: this.curCenterUser.picture,
                callback: () => {
                    this.toggleRemoveUserProfile()
                    this.nxStore.dispatch(
                        showToast({
                            text: `${this.curCenterUser.name}님의 프로필 사진이 삭제되었습니다.`,
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

        const registerUserProfile = () => {
            this.nxStore.dispatch(
                DashboardActions.startRegisterCurUserProfile({
                    userId: this.curCenterUser.id,
                    centerUser: this.curUserData.user,
                    reqBody: {
                        type_code: 'file_type_center_user_picture',
                        center_id: this.center.id,
                        center_user_id: this.curCenterUser.id,
                    },
                    profile: files,
                    callback: (cu: CenterUser) => {
                        this.nxStore.dispatch(
                            showToast({
                                text: `${this.curCenterUser.name}님의 프로필 사진이 변경되었습니다.`,
                            })
                        )
                        this.nxStore.dispatch(CenterCommonActions.startGetMembers({ centerId: this.center.id }))
                        this.nxStore.dispatch(CenterCommonActions.startGetInstructors({ centerId: this.center.id }))
                        this.storageService.updateCenterUser(cu)
                    },
                })
            )
        }

        if (!_.isEmpty(this.curCenterUser.picture)) {
            this.fileService.deleteFile(this.curCenterUser.picture).subscribe(() => {
                registerUserProfile()
            })
        } else {
            registerUserProfile()
        }
    }
    isFileExist(fileList: FileList) {
        return !(fileList && fileList.length == 0)
    }

    // tag
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
            this.dashboardHelperService.synchronizeCheckIn(this.center.id, centerUser)
            this.dashboardHelperService.synchronizeCheckInDrawer(this.center.id, centerUser)
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
            this.dashboardHelperService.synchronizeRemoveCheckIn(this.center.id, centerUser)
            this.dashboardHelperService.synchronizeRemoveCheckInDrawer(this.center.id, centerUser)
            this.nxStore.dispatch(
                showToast({
                    text: `${this.wordService.ellipsis(this.curUserData.user.name, 4)}님이 출석 취소되었습니다.`,
                })
            )
            this.onCancelAttendModalClose()
        })
    }
    //

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
                centerId: res.centerId,
                reqBody: res.reqBody,
                userId: res.userId,
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
}
