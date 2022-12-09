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

import { Center } from '@schemas/center'
import { OutputType } from '@schemas/components/direct-register-member-fullmodal'
// components
import { ClickEmitterType } from '@schemas/components/button'
// ngrx
import { Store } from '@ngrx/store'
import _ from 'lodash'

type Gender = 'male' | 'female' | ''

@Component({
    selector: 'db-direct-register-member-fullmodal',
    templateUrl: './direct-register-member-fullmodal.component.html',
    styleUrls: ['./direct-register-member-fullmodal.component.scss'],
})
export class DirectRegisterMemberFullmodalComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
    // modal vars and funcs
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() close = new EventEmitter<any>()
    @Output() finishRegister = new EventEmitter<OutputType>()

    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    public changed: boolean
    //

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
        private renderer: Renderer2
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
                    validators: [Validators.required, Validators.pattern('^[0-9]{10,11}$')],
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
            asyncValidators: [this.emailAsyncValidator()],
        })
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && !changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
    }

    ngAfterViewChecked() {
        if (this.changed) {
            this.changed = false

            if (this.visible) {
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)
            } else {
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)

                this.pictureService.resetLocalPicData()
                this.localFileData = { src: undefined, file: undefined }
                this.gender = 'male'
                this.emailForm.setValue('')
                this.name.setValue('')
                this.phone_number.setValue('')
                this.birth_date.setValue('')
                this.emailForm.markAsPristine()
                this.name.markAsPristine()
                this.phone_number.markAsPristine()
                this.birth_date.markAsPristine()
            }
        }
    }

    ngOnDestroy(): void {
        this.pictureService.resetLocalPicData()
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
            return this.authService.checkDuplicateMail({ email: control.value }).pipe(
                map((v) => {
                    return null
                }),
                catchError((e) => {
                    return e.code == 'FUNCTION_AUTH_005' ? of({ isExisted: true }) : of({ isNonEmailForm: true })
                })
            )

            // 그냥 참고 사항
            // return control.valueChanges.pipe(
            //     distinctUntilChanged(),
            //     debounceTime(1000),
            //     switchMap((v) => this.authService.checkDuplicateMail({ email: v })),

            //     map((v) => {
            //         console.log('v: ', v, this.registerForm)
            //         return null
            //     }),
            //     catchError((e) => {
            //         console.log('e: ', e, this.registerForm)
            //         return e.code == 'FUNCTION_AUTH_007' ? of({ isExisted: true }) : of({ isNonEmailForm: true })
            //     })
            // )
        }
    }

    birthdateCheck(event) {
        const code = event.which ? event.which : event.keyCode

        if (code < 48 || code > 57) {
            return false
        }

        this.matchBirthdateForm(event)
        return true
    }
    matchBirthdateForm(event) {
        const userDataSize = this.birth_date.value.length
        const userData = this.birth_date.value
        const lastStr = this.birth_date.value[userDataSize - 1]
        const digitReg = /[\d]/g
        const dotReg = /[.]/g

        if (userDataSize == 5) {
            if (digitReg.test(lastStr)) {
                this.registerForm.patchValue({ birth_date: userData.slice(0, 4) + '.' + userData.slice(4) })
            } else if (dotReg.test(lastStr)) {
                this.registerForm.patchValue({ birth_date: userData.slice(0, 4) })
            }
        } else if (userDataSize == 8) {
            if (digitReg.test(lastStr)) {
                this.registerForm.patchValue({ birth_date: userData.slice(0, 7) + '.' + userData.slice(7) })
            } else if (dotReg.test(lastStr)) {
                this.registerForm.patchValue({ birth_date: userData.slice(0, 7) })
            }
        }
    }

    // preview avatar method
    onInputFileChange(photoFile: any) {
        this.pictureService.onInputFileChange(photoFile, this.saveLocalFile.bind(this))
    }
    saveLocalFile(localFileData: LocalFileData) {
        this.localFileData = _.cloneDeep(localFileData)
        // console.log(
        //     'localfiledata: ',
        //     this.localFileData,
        //     this.localFileData.file,
        //     _.assign({}, this.localFileData.file)
        // )
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
            phone_number: this.phone_number.value as string,
        }
        if (_.isEmpty(registerBody.email)) {
            delete registerBody.email
        }
        if(_.isEmpty(registerBody.birth_date)){
            delete registerBody.birth_date
        }
        this.finishRegister.emit({
            reqBody: registerBody,
            file: this.localFileData.file ? _.assign({ length: 1 }, this.localFileData.file) : undefined,
            cb: () => {
                btLoadingFns.hideLoading()
            },
        })

        // this.nxStore.dispatch(
        //     DashboardActions.startDirectRegisterMember({
        //         centerId: this.center.id,
        //         reqBody: registerBody,
        //         imageFile: this.localFileData.file ? _.assign({ length: 1 }, this.localFileData.file) : undefined,
        //         callback: () => {
        //             this.finishRegister.emit()
        //             btLoadingFns.hideLoading()
        //             this.nxStore.dispatch(CenterCommonActions.startGetMembers({ centerId: this.center.id }))
        //             this.nxStore.dispatch(DashboardActions.startGetUsersByCategory({ centerId: this.center.id }))
        //         },
        //     })
        // )
    }
}
