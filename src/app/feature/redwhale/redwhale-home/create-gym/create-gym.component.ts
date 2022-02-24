import { Component, OnInit, OnChanges } from '@angular/core'
import { Router } from '@angular/router'
import { FormBuilder, FormControl, Validators } from '@angular/forms'

import { CenterService } from '@services/center.service'
import { FileService, FileTypeCode } from '@services/file.service'

// components
import { ClickEmitterType } from '@shared/components/common/button/button.component'

// ngrx
import { Store } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'

@Component({
    selector: 'create-gym',
    templateUrl: './create-gym.component.html',
    styleUrls: ['./create-gym.component.scss'],
})
export class CreateGymComponent implements OnInit {
    public isCenterProfileRegistered: boolean
    public isCenterBackgroundRegistered: boolean

    public centerCreationAvailable: boolean

    public photoSrc: { center_picture: string; center_background: string }
    public photoName: { center_picture: string; center_background: string }

    private apiCreateFileReq: { picture?: string; background?: string }
    private localPhotoFiles: { center_picture: FileList; center_background: FileList }

    public centerNameForm: FormControl
    public centerAddrForm: FormControl

    public cetnerNameErrObj = {
        empty: '센터 이름을 입력해주세요.',
    }
    public centerAddrErrObj = {
        empty: '센터 url 주소를 입력해주세요.',
        maxlength: '15자를 초과하였습니다.',
    }

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private centerService: CenterService,
        private fileService: FileService,
        private nxStore: Store
    ) {
        this.isCenterBackgroundRegistered = false
        this.isCenterProfileRegistered = false

        this.centerCreationAvailable = false

        this.photoSrc = { center_picture: '', center_background: '' }
        this.photoName = { center_picture: '', center_background: '' }

        this.apiCreateFileReq = { picture: undefined, background: undefined }
        this.localPhotoFiles = { center_picture: undefined, center_background: undefined }

        // formbulder
        this.centerNameForm = this.fb.control('')
        this.centerAddrForm = this.fb.control('', {
            validators: [Validators.maxLength(15)],
        })
    }

    ngOnInit(): void {}
    ngOnChanges(): void {}

    goRouterLink(url: string) {
        this.router.navigateByUrl(url)
    }

    // -------------------------------photo funcs---------------------------------//
    registerPhoto(photoType: FileTypeCode, photoEle: any) {
        this.onChangeFile(photoType, photoEle.files)
        photoType == 'center_picture' ? this.toggleCenterProfileFlag() : this.toggleCenterBackgroundFlag()
    }
    removePhoto(photoType: FileTypeCode) {
        this.resetPhotoTexts(photoType)
        photoType == 'center_picture' ? this.toggleCenterProfileFlag() : this.toggleCenterBackgroundFlag()
    }

    onChangeFile(photoType: FileTypeCode, photoFile: FileList) {
        if (!this.isFileExist(photoFile)) return

        this.localPhotoFiles[photoType] = photoFile

        const fileReader = new FileReader()
        fileReader.onload = (e) => {
            this.photoSrc[photoType] = e.target.result as string
            this.photoName[photoType] = photoFile[0].name

            console.log('photoSrc , photoName : ', this.photoSrc, ' - ', this.photoName)
        }
        fileReader.readAsDataURL(photoFile[0])
    }

    // ---- photo file control helper function ------>//
    toggleCenterProfileFlag() {
        this.isCenterProfileRegistered = !this.isCenterProfileRegistered
    }
    toggleCenterBackgroundFlag() {
        this.isCenterBackgroundRegistered = !this.isCenterBackgroundRegistered
    }
    isFileExist(fileList: FileList) {
        if (fileList && fileList.length == 0) {
            return false
        }
        return true
    }
    setPhotoTag(photoType: FileTypeCode): FileTypeCode {
        let tag: FileTypeCode = undefined
        if (photoType === 'center_picture') {
            tag = 'center_picture'
        } else if (photoType === 'center_background') {
            tag = 'center_background'
        }
        return tag
    }
    setPhotoReqbodyProp(photoType: FileTypeCode) {
        let prop = ''
        if (photoType === 'center_picture') {
            prop = 'picture'
        } else if (photoType === 'center_background') {
            prop = 'background'
        }
        return prop
    }
    resetPhotoTexts(photoType: FileTypeCode) {
        this.photoName[photoType] = ''
        this.photoSrc[photoType] = ''
        this.localPhotoFiles[photoType] = null
    }
    // <---- photo file control helper function ------//
    // ------------------------------------------------------------------------//

    createCenter(btLoadingFns: ClickEmitterType) {
        btLoadingFns.showLoading()
        this.centerService
            .createCenter({ name: this.centerNameForm.value, address: this.centerAddrForm.value })
            .subscribe({
                next: (v) => {
                    this.createApiPhotoFileAsPossible('center_background', v, () => {
                        this.createApiPhotoFileAsPossible('center_picture', v, () => {
                            this.centerService
                                .updateCenter(v.id, {
                                    name: this.centerNameForm.value,
                                    address: this.centerAddrForm.value,
                                    ...this.apiCreateFileReq,
                                })
                                .subscribe({
                                    next: (center) => {
                                        btLoadingFns.hideLoading()
                                        this.goRouterLink('/redwhale-home')
                                        this.nxStore.dispatch(showToast({ text: '새로운 센터가 생성되었습니다.' }))
                                    },
                                    error: (e) => {
                                        console.log('createApiPhotoFile-updateCenter error: ', e)
                                    },
                                })
                        })
                    })
                },
                error: (e) => {
                    btLoadingFns.hideLoading()
                    this.nxStore.dispatch(showToast({ text: '이미 존재하는 센터 주소입니다.' }))
                },
            })
    }

    createApiPhotoFileAsPossible(photoType: FileTypeCode, centerInfo, callback?: () => void) {
        const centerId = centerInfo.id
        const tag = this.setPhotoTag(photoType)
        const prop = this.setPhotoReqbodyProp(photoType)
        if (this.localPhotoFiles[photoType]) {
            this.fileService
                .createFile({ type_code: tag, center_id: centerId }, this.localPhotoFiles[photoType])
                .subscribe({
                    next: (fileList) => {
                        const location = fileList[0]['location']
                        this.apiCreateFileReq[prop] = location
                        if (callback) callback()
                    },
                    error: (e) => {
                        console.log('createApiPhotoFile error: ', e)
                    },
                })
        } else {
            if (callback) callback()
        }
    }
}
