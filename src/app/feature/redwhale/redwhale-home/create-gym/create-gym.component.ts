import { Component, OnInit, OnChanges } from '@angular/core'
import { Router } from '@angular/router'
import { FormBuilder, FormControl, Validators } from '@angular/forms'

import { GymService } from '@services/gym.service'
import { FileService } from '@services/file.service'

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

    // public centerName: string
    // public centerAddress: string
    public centerCreationAvailable: boolean

    // public InputWarnings: { centerName: boolean; centerAddress: boolean }
    // public inputWarningTexts: { centerAddress: string; centerName: string }

    public photoSrc: { centerProfile: string; centerBackground: string }
    public photoName: { centerProfile: string; centerBackground: string }

    private apiCreateFileReq: { address: string; picture?: string; background?: string }
    private localPhotoFiles: { centerProfile: FileList; centerBackground: FileList }

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
        private gymService: GymService,
        private fileService: FileService,
        private nxStore: Store
    ) {
        this.isCenterBackgroundRegistered = false
        this.isCenterProfileRegistered = false

        this.centerCreationAvailable = false

        this.photoSrc = { centerProfile: '', centerBackground: '' }
        this.photoName = { centerProfile: '', centerBackground: '' }

        this.apiCreateFileReq = { address: '' }
        this.localPhotoFiles = { centerProfile: null, centerBackground: null }

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
    registerPhoto(photoType: 'centerProfile' | 'centerBackground', photoEle: any) {
        this.onChangeFile(photoType, photoEle.files)
        photoType == 'centerProfile' ? this.toggleCenterProfileFlag() : this.toggleCenterBackgroundFlag()
    }
    removePhoto(photoType: 'centerProfile' | 'centerBackground') {
        this.resetPhotoTexts(photoType)
        photoType == 'centerProfile' ? this.toggleCenterProfileFlag() : this.toggleCenterBackgroundFlag()
    }

    onChangeFile(photoType: 'centerProfile' | 'centerBackground', photoFile: FileList) {
        if (!this.isFileExist(photoFile)) return

        this.localPhotoFiles[photoType] = photoFile

        const fileReader = new FileReader()
        fileReader.onload = (e) => {
            this.photoSrc[photoType] = e.target.result as string
            this.photoName[photoType] = photoFile[0].name
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
    setPhotoTag(photoType: 'centerProfile' | 'centerBackground') {
        let tag = ''
        if (photoType === 'centerProfile') {
            tag = 'gym-profile'
        } else if (photoType === 'centerBackground') {
            tag = 'gym-background'
        }
        return tag
    }
    setPhotoReqbodyProp(photoType: 'centerProfile' | 'centerBackground') {
        let prop = ''
        if (photoType === 'centerProfile') {
            prop = 'picture'
        } else if (photoType === 'centerBackground') {
            prop = 'background'
        }
        return prop
    }
    resetPhotoTexts(photoType: 'centerProfile' | 'centerBackground') {
        this.photoName[photoType] = ''
        this.photoSrc[photoType] = ''
        this.localPhotoFiles[photoType] = null
    }
    // <---- photo file control helper function ------//
    // ------------------------------------------------------------------------//

    createGym() {
        this.gymService.createGym({ name: this.centerNameForm.value, address: this.centerAddrForm.value }).subscribe({
            next: (v) => {
                /*
                  address: "heasdf", background: null, color: "#FFA5C1", id: 225, name: "hello123", permissions: [], picture: null, role_code:"administrator", role_name:"운영자", timezone: "Asia/Seoul"
                */
                this.createApiPhotoFile('centerBackground', v, () => {
                    this.createApiPhotoFile('centerProfile', v, () => {
                        this.goRouterLink('/redwhale-home')
                        this.nxStore.dispatch(showToast({ text: '새로운 센터가 생성되었습니다.' }))
                    })
                })
            },
            error: (e) => {
                // this.setInputWarning('centerAddress', true)
                // this.setInputWarningText('centerAddress', e.message)
            },
        })
    }
    createApiPhotoFile(photoType: 'centerProfile' | 'centerBackground', gymInfo, callback?: () => void) {
        const gymId = gymInfo.id
        const tag = this.setPhotoTag(photoType)
        const prop = this.setPhotoReqbodyProp(photoType)
        this.apiCreateFileReq['address'] = gymInfo.address
        if (this.localPhotoFiles[photoType]) {
            this.fileService.createFile({ tag: tag, gym_id: gymId }, this.localPhotoFiles[photoType]).subscribe({
                next: (fileList) => {
                    const location = fileList[0]['location']
                    this.apiCreateFileReq[prop] = location
                    this.gymService.updateGym(gymId, this.apiCreateFileReq).subscribe({
                        next: (gym) => {
                            if (callback) callback()
                        },
                        error: (e) => {
                            console.log('createApiPhotoFile-updateGym error: ', e)
                        },
                    })
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
