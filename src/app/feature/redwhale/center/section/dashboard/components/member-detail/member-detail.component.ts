import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core'
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import _ from 'lodash'

import { StorageService } from '@services/storage.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { WordService } from '@services/helper/word.service'
import { UsersCenterService } from '@services/users-center.service'

import { Center } from '@schemas/center'
import { Loading } from '@schemas/componentStore/loading'
import { User } from '@schemas/user'
import { MemberRole as Role } from '@schemas/center/dashboard/member-role'

import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

// ngrx
import { Store, select } from '@ngrx/store'
import * as DashboardReducer from '@centerStore/reducers/sec.dashboard.reducer'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import * as DashboardSelector from '@centerStore/selectors/sec.dashoboard.selector'
import { showToast } from '@appStore/actions/toast.action'

@Component({
    selector: 'db-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.scss'],
})
export class MemberDetailComponent implements OnInit, OnDestroy, OnChanges {
    @Input() curUserData: DashboardReducer.CurUseData = _.cloneDeep(DashboardReducer.CurUseDataInit)

    public memoForm: FormControl = this.fb.control('')
    public center: Center
    public user: User

    public unSubscriber$ = new Subject<void>()
    public userDetailTag$ = this.nxStore.select(DashboardSelector.userDeatilTag)
    public isUserDetailLoading: Loading = undefined
    public showUserDetailLoading = false

    setUserDetailTag(tag: DashboardReducer.UserDetailTag) {
        this.nxStore.dispatch(DashboardActions.setUserDetailTag({ tag }))
    }

    constructor(
        private fb: FormBuilder,
        private storageService: StorageService,
        private nxStore: Store,
        private spinner: NgxSpinnerService,
        private wordService: WordService,
        private usersCenterService: UsersCenterService
    ) {
        this.center = this.storageService.getCenter()
        this.user = this.storageService.getUser()
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
    }

    // register membership locker full modal vars and funcs
    public doShowRegisterMLFullModal = false
    toggleRegisterMLFullModal() {
        this.doShowRegisterMLFullModal = !this.doShowRegisterMLFullModal
    }
    onFinishRegisterML() {
        this.toggleRegisterMLFullModal()
    }
    //

    ngOnInit(): void {}
    ngOnDestroy(): void {
        this.unSubscriber$.next()
        this.unSubscriber$.complete()
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes['curUserData'].firstChange) {
            if (changes['curUserData'].previousValue['user']?.id != changes['curUserData'].currentValue['user']?.id) {
                this.memoForm.setValue(changes['curUserData'].currentValue['user']['center_user_memo'] ?? '')
                this.userNameForModal = this.curUserData.user.center_user_name

                _.forIn(this.userRole, (value, key) => {
                    this.userRole[key] = key == this.curUserData?.user?.role_code ? true : false
                })
            }
        }
    }

    updateUserMemo(memoValue: string) {
        if (this.curUserData.user.center_user_memo != memoValue) {
            this.nxStore.dispatch(
                DashboardActions.startSetCurUserData({
                    centerId: this.center.id,
                    reqBody: { center_user_memo: memoValue },
                    userId: this.curUserData.user.id,
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
        if (this.curUserData.user.center_user_name != changedName) {
            this.nxStore.dispatch(
                DashboardActions.startSetCurUserData({
                    centerId: this.center.id,
                    reqBody: { center_user_name: changedName },
                    userId: this.curUserData.user.id,
                    callback: () => {
                        this.toggleShowChangeNameModal()
                        this.nxStore.dispatch(showToast({ text: `회원 이름 변경이 완료되었습니다.` }))
                    },
                })
            )
        } else {
            this.toggleShowChangeNameModal()
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
                userId: this.curUserData.user.id,
                profileUrl: this.curUserData.user.center_user_picture,
                callback: () => {
                    this.toggleRemoveUserProfile()
                    this.nxStore.dispatch(
                        showToast({
                            text: `${this.curUserData.user.center_user_name}님의 프로필 사진이 삭제되었습니다.`,
                        })
                    )
                },
            })
        )
    }
    registerUserProfile(picture: any) {
        if (!this.isFileExist(picture.files)) return
        const files: FileList = _.assign({ length: 1 }, picture.files)
        console.log('registerUserProfile: ', files)

        this.nxStore.dispatch(
            DashboardActions.startRegisterCurUserProfile({
                userId: this.curUserData.user.id,
                reqBody: {
                    type_code: 'file_type_center_user_picture',
                    center_id: this.center.id,
                    center_user_id: this.curUserData.user.id,
                },
                profile: files,
                callback: () => {
                    this.nxStore.dispatch(
                        showToast({
                            text: `${this.curUserData.user.center_user_name}님의 프로필 사진이 변경되었습니다.`,
                        })
                    )
                },
            })
        )
    }
    isFileExist(fileList: FileList) {
        if (fileList && fileList.length == 0) {
            return false
        }
        return true
    }

    // user role -----------------------
    public userRole: Record<Role, boolean> = {
        owner: false,
        administrator: false,
        employee: false,
        member: false,
    }
    public roleName: Record<Role, string> = {
        owner: '운영자',
        administrator: '관리 직원',
        employee: '직원',
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
            this.userRole[key] = key == this.curUserData?.user?.role_code ? true : false
        })
    }
    setUserRole(role: Role) {
        _.forIn(this.userRole, (value, key) => {
            this.userRole[key] = key == role ? true : false
        })
    }

    openChangeRoleModal() {
        const changedRole: Role = _.findKey(this.userRole, (item) => item) as Role
        const isSameRole = this.curUserData?.user?.role_code == changedRole ? true : false
        this.changeRoleModalText.text =
            changedRole == 'owner'
                ? `${this.wordService.ellipsis(this.curUserData.user.center_user_name, 4)}님에게 ${
                      this.roleName[changedRole]
                  }를 양도하시겠어요?`
                : `${this.wordService.ellipsis(this.curUserData.user.center_user_name, 4)}님을 ${
                      this.roleName[changedRole]
                  }으로 변경하시겠어요?`
        this.changeRoleModalText.confirmButtonText = changedRole == 'owner' ? '운영자 양도' : '변경'
        this.changeRoleModalText.subText =
            changedRole == 'owner'
                ? `운영자 양도 후, 본인의 권한은 회원으로 변경되며
                  양도된 권한은 복구가 불가능합니다.`
                : `권한 변경 시, 새로운 접근 권한이 주어지므로
                  꼭 신중하게 선택해주세요. 🙏`
        this.doShowChangeRoleModal = isSameRole ? false : true
        this.doShowRoleSelect = false
    }
    closeChangeRoleModal() {
        this.doShowChangeRoleModal = false
        _.forIn(this.userRole, (value, key) => {
            this.userRole[key] = key == this.curUserData?.user?.role_code ? true : false
        })
    }
    confirmChangeRoleModal() {
        const roleKey = _.findKey(this.userRole, (bool) => bool)

        if (roleKey == 'owner') {
            // this.gymService.delegate(this.gym.id, { user_id: this.userData.id }).subscribe(async (__) => {
            //     this.doShowChangeRoleModal = false
            //     this.globalService.showToast(
            //         `${this.wordService.ellipsis(this.userData.gym_user_name, 4)}님이 ${
            //             this.roleName[roleKey]
            //         }로 변경되었습니다.`
            //     )
            //     await this.GymDashboardService.modifyUserInformation(this.gym.id, this.centerStaff.id, {
            //         role_code: 'member',
            //     }).toPromise()
            //     const newGym = await this.gymService.getGym(this.gym.id).toPromise()
            //     this.storageService.setGym(newGym)
            //     this.globalService.setIsGymChangedForNav(true)
            //     this.router.navigate(['./community'], { relativeTo: this.activatedRoute })
            // })
        } else {
            console.log('update member role : ', roleKey, ' - ')
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
                                text: `${this.wordService.ellipsis(this.curUserData.user.center_user_name, 4)}님이 ${
                                    this.roleName[roleKey]
                                }으로 변경되었습니다.`,
                            })
                        )
                    },
                })
            )
        }
    }
    // ------------------------------------
}
