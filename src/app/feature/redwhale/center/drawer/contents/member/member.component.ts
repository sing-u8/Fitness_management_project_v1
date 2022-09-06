import { Component, OnInit, OnDestroy } from '@angular/core'
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
import { Store, select } from '@ngrx/store'
import { drawerSelector } from '@appStore/selectors'
import { closeDrawer } from '@appStore/actions/drawer.action'
import { showToast } from '@appStore/actions/toast.action'
import * as DashboardReducer from '@centerStore/reducers/sec.dashboard.reducer'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import * as CenterCommonActions from '@centerStore/actions/center.common.actions'
import * as DashboardSelector from '@centerStore/selectors/sec.dashoboard.selector'
// services
import { CenterService } from '@services/center.service'
import { StorageService } from '@services/storage.service'
import { UsersCenterService } from '@services/users-center.service'
import { DashboardHelperService } from '@services/center/dashboard-helper.service'
import { WordService } from '@services/helper/word.service'
import { FileService } from '@services/file.service'
import { CenterUsersCheckInService } from '@services/center-users-check-in.service'

import _ from 'lodash'

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
    public selectedUserList$ = this.nxStore.select(DashboardSelector.drawerCurUserListSelect)
    public isLoading$ = this.nxStore.select(DashboardSelector.drawerIsLoading)
    public searchedUsersLists$ = this.nxStore.select(DashboardSelector.drawerSearchedUsersLists)
    public selectedUserListsHolding$ = this.nxStore.select(DashboardSelector.drawerSelectedUserListsHolding)
    public curUserListSelect$ = this.nxStore.select(DashboardSelector.drawerCurUserListSelect)

    public unSubscriber$ = new Subject<boolean>()

    public center: Center
    public centerStaff: User
    public curCenterUser: CenterUser = undefined
    public curUserListSelect: DashboardReducer.UserListSelect = _.cloneDeep(DashboardReducer.UserListSelectInit)

    public showUserDetail = false

    public dbCurCenterId$ = this.nxStore.select(DashboardSelector.curCenterId)
    public dwCurCenterId$ = this.nxStore.select(DashboardSelector.drawerCurCenterId)
    public dbCurCenterId = undefined
    public dwCurCenterId = undefined

    public curUserData: DashboardReducer.CurUseData = undefined

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
        private centerUsersCheckInService: CenterUsersCheckInService
    ) {}

    ngOnInit(): void {
        this.drawer$ = this.nxStore.pipe(select(drawerSelector))
        this.centerStaff = this.storageService.getUser()
        this.center = this.storageService.getCenter()
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

        this.dbCurCenterId$.pipe(takeUntil(this.unSubscriber$)).subscribe((dbCurCenterId) => {
            this.dbCurCenterId = dbCurCenterId
        })
        this.dwCurCenterId$.pipe(takeUntil(this.unSubscriber$)).subscribe((dwCurCenterId) => {
            this.dwCurCenterId = dwCurCenterId
        })
        this.curUserData$.pipe(takeUntil(this.unSubscriber$)).subscribe((curUserData) => {
            this.curUserData = curUserData
        })

        this.curUserData$.pipe(takeUntil(this.unSubscriber$)).subscribe((curUserData) => {
            this.curCenterUser = curUserData.user
            this.memoForm.setValue(this.curCenterUser?.center_user_memo ?? '')
            this.userNameForModal = this.curCenterUser?.center_user_name
            this.userMembershipNumberForModal = this.curUserData?.user?.center_membership_number ?? ''

            _.forIn(this.userRole, (value, key) => {
                this.userRole[key] = key == this.curCenterUser?.role_code
            })
        })
    }
    ngOnDestroy() {
        this.unSubscriber$.next(true)
        this.unSubscriber$.complete()
    }

    closeDrawer() {
        this.nxStore.dispatch(closeDrawer())
    }

    routeToDashboard() {
        this.router.navigate(['./dashboard'], { relativeTo: this.activatedRoute })
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
                    this.toggleRegisterMemberModal()
                },
            })
        )
    }
    closeDirectRegisterMemberFullModal() {
        this.toggleDirectRegisterMemberFullModal()
        this.toggleRegisterMemberModal()
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
        if (this.curCenterUser.center_user_name != changedName) {
            this.nxStore.dispatch(
                DashboardActions.startSetCurUserData({
                    centerId: this.center.id,
                    reqBody: { center_user_name: changedName },
                    userId: this.curCenterUser.id,
                    callback: () => {
                        this.toggleShowChangeNameModal()
                        this.nxStore.dispatch(showToast({ text: `회원 이름 변경이 완료되었습니다.` }))
                        this.nxStore.dispatch(CenterCommonActions.startGetMembers({ centerId: this.center.id }))
                        this.nxStore.dispatch(CenterCommonActions.startGetInstructors({ centerId: this.center.id }))
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
        if (this.curCenterUser.center_user_memo != memoValue) {
            this.nxStore.dispatch(
                DashboardActions.startSetCurUserData({
                    centerId: this.center.id,
                    reqBody: { center_user_memo: memoValue },
                    userId: this.curCenterUser.id,
                })
            )
        }
    }

    // role select vars and funcs
    public userRole: Record<Role, boolean> = {
        owner: false,
        instructor: false,
        member: false,
    }
    public roleName: Record<Role, string> = {
        owner: '운영자',
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
                ? `${this.wordService.ellipsis(this.curCenterUser.center_user_name, 4)}님에게 ${
                      this.roleName[changedRole]
                  }를 양도하시겠어요?`
                : `${this.wordService.ellipsis(this.curCenterUser.center_user_name, 4)}님을 ${
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
                        user_id: this.curCenterUser.id,
                    },
                    callback: () => {
                        this.doShowChangeRoleModal = false
                        this.nxStore.dispatch(
                            showToast({
                                text: `${this.wordService.ellipsis(this.curCenterUser.center_user_name, 4)}님이 ${
                                    this.roleName[roleKey]
                                }로 변경되었습니다.`,
                            })
                        )
                        this.nxStore.dispatch(CenterCommonActions.startGetInstructors({ centerId: this.center.id }))
                        this.nxStore.dispatch(CenterCommonActions.startGetMembers({ centerId: this.center.id }))
                        this.centerService.getCenter(this.center.id).subscribe((center) => {
                            this.storageService.setCenter(center)
                        })
                        // !!
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
                                text: `${this.wordService.ellipsis(this.curCenterUser.center_user_name, 4)}님이 ${
                                    this.roleName[roleKey]
                                }(으)로 변경되었습니다.`,
                            })
                        )
                        this.nxStore.dispatch(CenterCommonActions.startGetInstructors({ centerId: this.center.id }))
                        this.nxStore.dispatch(CenterCommonActions.startGetMembers({ centerId: this.center.id }))
                        this.dashboardHelperService.refreshUserList(
                            this.center.id,
                            this.curCenterUser,
                            this.curUserListSelect.key
                        )
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
            DashboardActions.startRemoveDrawerCurUserProfile({
                centerId: this.center.id,
                userId: this.curCenterUser.id,
                profileUrl: this.curCenterUser.center_user_picture,
                callback: () => {
                    this.toggleRemoveUserProfile()
                    this.nxStore.dispatch(
                        showToast({
                            text: `${this.curCenterUser.center_user_name}님의 프로필 사진이 삭제되었습니다.`,
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
        if (!_.isEmpty(this.curCenterUser.center_user_picture)) {
            this.fileService.deleteFile(this.curCenterUser.center_user_picture).subscribe(() => {
                this.nxStore.dispatch(
                    DashboardActions.startRegisterDrawerCurUserProfile({
                        userId: this.curCenterUser.id,
                        reqBody: {
                            type_code: 'file_type_center_user_picture',
                            center_id: this.center.id,
                            center_user_id: this.curCenterUser.id,
                        },
                        profile: files,
                        callback: () => {
                            this.nxStore.dispatch(
                                showToast({
                                    text: `${this.curCenterUser.center_user_name}님의 프로필 사진이 변경되었습니다.`,
                                })
                            )
                            this.nxStore.dispatch(CenterCommonActions.startGetMembers({ centerId: this.center.id }))
                            this.nxStore.dispatch(CenterCommonActions.startGetInstructors({ centerId: this.center.id }))
                        },
                    })
                )
            })
        } else {
            this.nxStore.dispatch(
                DashboardActions.startRegisterDrawerCurUserProfile({
                    userId: this.curCenterUser.id,
                    reqBody: {
                        type_code: 'file_type_center_user_picture',
                        center_id: this.center.id,
                        center_user_id: this.curCenterUser.id,
                    },
                    profile: files,
                    callback: () => {
                        this.nxStore.dispatch(
                            showToast({
                                text: `${this.curCenterUser.center_user_name}님의 프로필 사진이 변경되었습니다.`,
                            })
                        )
                        this.nxStore.dispatch(CenterCommonActions.startGetMembers({ centerId: this.center.id }))
                        this.nxStore.dispatch(CenterCommonActions.startGetInstructors({ centerId: this.center.id }))
                    },
                })
            )
        }
    }
    isFileExist(fileList: FileList) {
        return !(fileList && fileList.length == 0)
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
            this.curUserData.user.center_user_name,
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
            this.nxStore.dispatch(
                showToast({
                    text: `${this.wordService.ellipsis(
                        this.curUserData.user.center_user_name,
                        4
                    )}님이 출석 처리되었습니다.`,
                })
            )
            this.onAttendModalClose()
        })
    }

    onCancelAttend() {
        this.cancelAttendUserModalText.text = `${this.wordService.ellipsis(
            this.curUserData.user.center_user_name,
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
                    text: `${this.wordService.ellipsis(
                        this.curUserData.user.center_user_name,
                        4
                    )}님이 출석 취소되었습니다.`,
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
                reqBody: { center_membership_number: membershipNumber },
                userId: this.curUserData.user.id,
                blockEffect: true,
                callback: () => {
                    this.toggleShowChangeMembershipNumberModal()
                    this.nxStore.dispatch(showToast({ text: `회원번호 변경이 완료되었습니다.` }))
                    this.nxStore.dispatch(CenterCommonActions.startGetMembers({ centerId: this.center.id }))
                    this.nxStore.dispatch(CenterCommonActions.startGetInstructors({ centerId: this.center.id }))
                },
            })
        )
    }
}
