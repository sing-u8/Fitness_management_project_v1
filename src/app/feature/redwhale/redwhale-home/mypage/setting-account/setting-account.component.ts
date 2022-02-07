import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { FileService } from '@services/file.service'

import { UserService } from '@services/user.service'

import { StorageService } from '@services/storage.service'
import { SettingAccountModalService } from '@services/home/setting-account-modal.service'
import { GlobalSettingAccountService } from '@services/home/global-setting-account.service'

import { User } from '@schemas/user'
import { modalType, modalData } from '@schemas/home/setting-account-modal'

// helper
import { originalOrder } from '@helpers/pipe/keyvalue'

// ngrx
import { Store } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'

@Component({
    selector: 'rw-setting-account',
    templateUrl: './setting-account.component.html',
    styleUrls: ['./setting-account.component.scss'],
})
export class SettingAccountComponent implements OnInit {
    public user: User

    public marketing_agree: { email: number; sms: number } = { email: null, sms: null }
    public inputList: {
        name: string
        email: string
        phone: string
        password?: string
        sex: string // '남성' | '여성' | '--'
        birth_date: string
        marketing_agree: string // 0 or 1
        push_notice: string // '켜기' | '끄기'
    } = {
        name: null,
        email: null,
        phone: null,
        password: null,
        sex: null,
        birth_date: null,
        marketing_agree: null,
        push_notice: null,
    }

    public delAvatarFlag: boolean
    public accountModalFlag: boolean
    public certAccountModalFlag: boolean
    public changePasswordFlag: boolean

    public delModalTextData: modalData
    public certSetModalTextData: modalData
    public setModalTextData: modalData
    public changePasswordTextData: modalData

    public modalUserData: any
    public activatedSettingModalType: modalType
    public activatedCertSettingModalType: modalType

    public infoTitle = {
        name: '이름',
        email: '이메일',
        phone: '전화번호',
        password: '비밀번호',
        sex: '성별',
        birth_date: '생년월일',
        marketing_agree: '마케팅 수신 동의',
        push_notice: '푸시알림',
    }

    constructor(
        private storageService: StorageService,
        private settingAcountModalService: SettingAccountModalService,
        private userService: UserService,
        private nxStore: Store,
        private fileservice: FileService,
        private globalSettingAccountService: GlobalSettingAccountService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.delAvatarFlag = false
        this.accountModalFlag = false
        this.certAccountModalFlag = false
        this.changePasswordFlag = false

        this.user = this.storageService.getUser()

        console.log('user in setting account: ', this.user)
        this.initInputList()
    }

    initMarktingAgree() {
        this.marketing_agree.email = this.user.marketing_email
        this.marketing_agree.sms = this.user.marketing_sms
        const agree_email_text = this.marketing_agree.email == 1 ? '수신' : '미수신'
        const agree_sms_text = this.marketing_agree.sms == 1 ? '수신' : '미수신'
        return `SMS ${agree_sms_text}, 이메일  ${agree_email_text}`
    }
    initInputList() {
        const marketing_agree_text = this.initMarktingAgree()

        this.inputList.name = this.user.given_name
        this.inputList.email = this.user.email
        this.inputList.phone = this.addDashtoPhoneNumber(this.user.phone_number)
        this.inputList.password = '********' // 들고 오는 곳 없음  더미로 * 8개 표시
        this.inputList.sex = this.user.sex == 'male' ? '남성' : this.user.sex == 'female' ? '여성' : null
        this.inputList.birth_date = this.user.birth_date ?? ''
        this.inputList.marketing_agree = marketing_agree_text
        this.inputList.push_notice = this.user.notification_yn == 1 ? '켜기' : '끄기'

        if (this.user.sign_in_method != 'email') {
            delete this.inputList.password
        }
    }

    // modal functions and variable

    onInputClick(type: string) {
        const modalType = type.toUpperCase()
        if (modalType == 'DELAVATAR') {
            this.delAvatarFlag = true
            this.delModalTextData = this.settingAcountModalService.initModal(modalType as modalType)
        } else if (modalType == 'EMAIL' || modalType == 'PHONE') {
            this.certAccountModalFlag = true
            this.certSetModalTextData = this.settingAcountModalService.initModal(modalType as modalType)
            this.activatedCertSettingModalType = modalType as modalType
        } else if (modalType == 'PASSWORD') {
            this.changePasswordFlag = true
            this.changePasswordTextData = this.settingAcountModalService.initModal(modalType as modalType)
        } else {
            if (modalType == 'SEX') {
                this.modalUserData = this.user.sex
            } else if (modalType == 'MARKETING_AGREE') {
                this.modalUserData = { email: this.marketing_agree.email, sms: this.marketing_agree.sms }
            } else if (modalType == 'PUSH_NOTICE') {
                this.modalUserData = this.inputList[type] == 1 ? true : false
            } else {
                this.modalUserData = this.inputList[type]
            }
            this.accountModalFlag = true
            this.activatedSettingModalType = modalType as modalType
            this.setModalTextData = this.settingAcountModalService.initModal(modalType as modalType)
        }
    }

    // modal button functions
    onDelAvatarModalCancel() {
        this.delAvatarFlag = false
    }
    onDelAvatarModalConfirm() {
        this.removePhoto()
        this.delAvatarFlag = false
    }

    onCertSetModalCancel() {
        this.certAccountModalFlag = false
    }
    onCertSetModalConfirm(changedValue) {
        this.user = this.storageService.getUser()
        this.inputList[this.activatedCertSettingModalType.toLowerCase()] =
            this.activatedCertSettingModalType == 'PHONE' ? this.addDashtoPhoneNumber(changedValue) : changedValue
        this.activatedCertSettingModalType == 'EMAIL'
            ? this.globalSettingAccountService.setUserEmail(changedValue)
            : null
        this.certAccountModalFlag = false
    }

    onSetModalCancel() {
        this.accountModalFlag = false
    }
    onSetModalConfirm() {
        this.user = this.storageService.getUser()
        this.activatedSettingModalType == 'NAME'
            ? this.globalSettingAccountService.setUserName(this.user.given_name)
            : null
        this.initInputList()
        this.accountModalFlag = false
    }

    onChangePasswordCancel() {
        this.changePasswordFlag = false
    }
    onChangePasswordConfirm() {
        this.changePasswordFlag = false
    }

    // change avatar fucntions
    registerPhoto(picture: any) {
        const files: FileList = picture.files
        if (!this.isFileExist(files)) return

        this.fileservice.createFile({ tag: 'user-profile' }, files).subscribe((fileList) => {
            const location = fileList[0]['location']
            this.userService.updateUser(this.user.id, { picture: location }).subscribe({
                next: (user) => {
                    this.user.picture = user['picture']
                    this.globalSettingAccountService.setUserAvatar(user['picture'])
                    this.storageService.setUser(user)
                    this.nxStore.dispatch(showToast({ text: '프로필 사진이 변경되었습니다.' }))
                },
                error: (err) => {
                    console.log('create account avatar file err: ', err)
                },
            })
        })
    }
    isFileExist(fileList: FileList) {
        if (fileList && fileList.length == 0) {
            return false
        }
        return true
    }
    removePhoto() {
        const prevPicture = this.user.picture
        this.userService.updateUser(this.user.id, { picture: null }).subscribe({
            next: (user) => {
                this.fileservice.deleteFile(prevPicture).subscribe({
                    next: (res) => {
                        this.user.picture = user['picture']
                        this.storageService.setUser(user)
                        this.globalSettingAccountService.setUserAvatar(null)
                        this.nxStore.dispatch(showToast({ text: '프로필 사진이 삭제되었습니다.' }))
                        this.delAvatarFlag = false
                    },
                    error: (err) => {
                        console.log('remove file err: ', err)
                    },
                })
            },
            error: (err) => {
                console.log('err in updateuser for remove avatar', err)
            },
        })
    }

    // helper functions
    public keepOriginalOrder = originalOrder

    public addDashtoPhoneNumber(phoneNumber: string) {
        // 나중에 인풋 입력할 때마다 - 추가 하는 거 고려하기
        const phoneNum = phoneNumber.replace(/\D[^\.]/g, '')
        return phoneNum.slice(0, 3) + '-' + phoneNum.slice(3, 7) + '-' + phoneNum.slice(7)
    }

    async logout() {
        // await this.storageService.removeUser()
        // this.router.navigateByUrl('/auth/login')
        await this.storageService.logout()
    }

    gotoRemoveAccount() {
        this.router.navigateByUrl('/redwhale-home/remove-account')
    }
}
