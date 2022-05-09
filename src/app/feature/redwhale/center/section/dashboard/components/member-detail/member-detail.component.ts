import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import _ from 'lodash'

import { StorageService } from '@services/storage.service'

import { Center } from '@schemas/center'

// ngrx
import { Store } from '@ngrx/store'
import * as DashboardReducer from '@centerStore/reducers/sec.dashboard.reducer'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import * as DashboardSelector from '@centerStore/selectors/sec.dashoboard.selector'
import { showToast } from '@appStore/actions/toast.action'

@Component({
    selector: 'db-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.scss'],
})
export class MemberDetailComponent implements OnInit {
    @Input() curUserData: DashboardReducer.CurUseData = _.cloneDeep(DashboardReducer.CurUseDataInit)

    @Output() onRegisterML = new EventEmitter<void>()

    public memoForm: FormControl = this.fb.control('')
    public center: Center

    public userDetailTag$ = this.nxStore.select(DashboardSelector.userDeatilTag)
    setUserDetailTag(tag: DashboardReducer.UserDetailTag) {
        this.nxStore.dispatch(DashboardActions.setUserDetailTag({ tag }))
    }

    constructor(private fb: FormBuilder, private storageService: StorageService, private nxStore: Store) {
        this.center = this.storageService.getCenter()
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

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes['curUserData'].firstChange) {
            if (changes['curUserData'].previousValue['user']?.id != changes['curUserData'].currentValue['user']?.id) {
                this.memoForm.setValue(changes['curUserData'].currentValue['user']['center_user_memo'] ?? '')
                this.userNameForModal = this.curUserData.user.center_user_name
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
}
