import {
    AfterViewChecked,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    SimpleChanges,
    ViewChild,
} from '@angular/core'
import { Router } from '@angular/router'
import {
    AbstractControl,
    AsyncValidatorFn,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms'

import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

import { StorageService } from '@services/storage.service'
import { AuthService } from '@services/auth.service'
import { CreateUserRequestBody } from '@services/center-users.service'
import { LocalFileData, PictureManagementService } from '@services/helper/picture-management.service'
import { InputHelperService } from '@services/helper/input-helper.service'

import { Center } from '@schemas/center'
import { OutputType } from '@schemas/components/direct-register-member-fullmodal'
// components
import { ClickEmitterType } from '@schemas/components/button'
// ngrx
import { Store } from '@ngrx/store'
import * as CenterCommonActions from '@centerStore/actions/center.common.actions'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import _ from 'lodash'

type Gender = 'male' | 'female' | ''

@Component({
    selector: 'db-direct-register-member-page',
    templateUrl: './direct-register-member-page.component.html',
    styleUrls: ['./direct-register-member-page.component.scss'],
})
export class DirectRegisterMemberPageComponent implements OnInit, OnDestroy {
    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    public center: Center
    public gender: Gender = 'male'
    public localFileData: LocalFileData

    public registerForm: FormGroup
    public inputErrs: {
        name: string
        phone_number: string
        birth_date: string
    } = {
        name: '',
        phone_number: '',
        birth_date: '',
    }
    public emailForm: FormControl

    constructor(
        private router: Router,
        private pictureService: PictureManagementService,
        private storageService: StorageService,
        private fb: FormBuilder,
        private authService: AuthService,
        private nxStore: Store,
        private renderer: Renderer2,
        private inputHelperService: InputHelperService
    ) {
        this.gender = 'male'
        this.localFileData = { src: undefined, file: undefined }

        this.center = this.storageService.getCenter()
    }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            name: [
                '',
                {
                    validators: [Validators.required, Validators.pattern('^[가-힣|a-z|A-Z]{1,20}$')],
                },
            ],
            phone_number: [
                '',
                {
                    validators: [
                        Validators.required,
                        Validators.pattern('\\(?([0-9]{3})\\)?([ .-]?)([0-9]{4})\\2([0-9]{4})'),
                    ],
                },
            ],
            birth_date: [
                '',
                {
                    validators: [Validators.pattern('^[0-9]{4}[.](0[1-9]|1[012])[.](0[1-9]|[12][0-9]|3[01])$')],
                },
            ],
        })
        this.emailForm = this.fb.control('', {
            validators: [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+[.][a-z]{2,}$')],
            asyncValidators: [], //  [this.emailAsyncValidator()],
        })
    }
    ngOnDestroy(): void {
        this.pictureService.resetLocalPicData()
    }
    exitPage() {
        this.router.navigate([this.center.address, 'dashboard'])
    }
    // relative to form group
    get name() {
        return this.registerForm.get('name')
    }
    get phone_number() {
        return this.registerForm.get('phone_number')
    }
    get birth_date() {
        return this.registerForm.get('birth_date')
    }

    emailAsyncValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            if (_.isEmpty(control.value)) {
                return of({ isNonEmailForm: true })
            } else {
                return this.authService.checkDuplicateMail({ email: control.value }).pipe(
                    map((v) => {
                        return null
                    }),
                    catchError((e) => {
                        return e.code == 'FUNCTION_AUTH_005' ? of({ isExisted: true }) : of({ isNonEmailForm: true })
                    })
                )
            }
        }
    }

    birthdateCheck(event) {
        if (this.inputHelperService.restrictToNumber(event)) {
            this.matchBirthdateForm(event)
            return true
        }
        return false
    }
    matchBirthdateForm(event) {
        const userDataSize = this.birth_date.value.length
        const userData = this.birth_date.value
        const lastStr = this.birth_date.value[userDataSize - 1]
        const digitReg = /[\d]/g
        const dotReg = /[.]/g

        const code = event.which ? event.which : event.keyCode

        if (userDataSize == 5 && code != 8) {
            if (digitReg.test(lastStr)) {
                this.registerForm.patchValue({ birth_date: userData.slice(0, 4) + '.' + userData.slice(4) })
            } else if (dotReg.test(lastStr)) {
                this.registerForm.patchValue({ birth_date: userData.slice(0, 4) })
            }
        } else if (userDataSize == 8 && code != 8) {
            if (digitReg.test(lastStr)) {
                this.registerForm.patchValue({ birth_date: userData.slice(0, 7) + '.' + userData.slice(7) })
            } else if (dotReg.test(lastStr)) {
                this.registerForm.patchValue({ birth_date: userData.slice(0, 7) })
            }
        }
    }

    phoneNumberCheck(event) {
        if (this.inputHelperService.restrictToNumber(event)) {
            this.matchPhoneNumberForm(event)
            return true
        }
        return false
    }
    matchPhoneNumberForm(event) {
        const userDataSize = this.phone_number.value.length
        const userData = this.phone_number.value
        const lastStr = this.phone_number.value[userDataSize - 1]
        const digitReg = /\d/g
        const dashReg = /-/g

        const code = event.which ? event.which : event.keyCode

        if (userDataSize == 4 && code != 8) {
            if (digitReg.test(lastStr)) {
                this.phone_number.patchValue(userData.slice(0, 3) + '-' + userData.slice(3))
            } else if (dashReg.test(lastStr)) {
                this.phone_number.patchValue(userData.slice(0, 3))
            }
        } else if (userDataSize == 9 && code != 8) {
            if (digitReg.test(lastStr)) {
                this.phone_number.patchValue(userData.slice(0, 8) + '-' + userData.slice(8))
            } else if (dashReg.test(lastStr)) {
                this.phone_number.patchValue(userData.slice(0, 8))
            }
        }
    }

    // preview avatar method
    onInputFileChange(photoFile: any) {
        this.pictureService.onInputFileChange(photoFile, this.saveLocalFile.bind(this))
    }
    saveLocalFile(localFileData: LocalFileData) {
        this.localFileData = _.cloneDeep(localFileData)
    }
    deletePreviewAvatar() {
        this.pictureService.resetLocalPicData()
        this.localFileData = { src: undefined, file: undefined }
    }

    // router method
    goRouterLink(uri: string) {
        this.router.navigateByUrl(uri)
    }

    // gender method
    onSelectGender(Gender: Gender) {
        this.gender = Gender
    }

    // register method
    registerNewMember(btLoadingFns: ClickEmitterType) {
        btLoadingFns.showLoading()
        const registerBody: CreateUserRequestBody = {
            name: this.name.value as string,
            sex: this.gender as string,
            birth_date: this.birth_date.value as string,
            email: this.emailForm.value as string,
            phone_number: _.camelCase(this.phone_number.value as string),
        }
        if (_.isEmpty(registerBody.email)) {
            delete registerBody.email
        }
        if (_.isEmpty(registerBody.birth_date)) {
            delete registerBody.birth_date
        }
        this.nxStore.dispatch(
            DashboardActions.startDirectRegisterMember({
                centerId: this.center.id,
                reqBody: registerBody,
                imageFile: this.localFileData.file ? _.assign({ length: 1 }, this.localFileData.file) : undefined,
                callback: () => {
                    this.nxStore.dispatch(CenterCommonActions.startGetMembers({ centerId: this.center.id }))
                    this.nxStore.dispatch(DashboardActions.startGetUsersByCategory({ centerId: this.center.id }))
                    btLoadingFns.hideLoading()
                    this.exitPage()
                },
            })
        )
    }
}
