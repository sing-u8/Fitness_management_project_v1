import {
    Component,
    OnInit,
    OnDestroy,
    SimpleChanges,
    AfterViewChecked,
    ElementRef,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    Renderer2,
} from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, Validators, ValidationErrors, AbstractControl, FormGroup, AsyncValidatorFn } from '@angular/forms'

import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'

import { StorageService } from '@services/storage.service'
import { FileService } from '@services/file.service'
import { AuthService } from '@services/auth.service'
import { CenterUsersService, CreateUserRequestBody } from '@services/center-users.service'
import { PictureManagementService, LocalFileData } from '@services/helper/picture-management.service'

import { Center } from '@schemas/center'
// components
import { ClickEmitterType } from '@shared/components/common/button/button.component'

// ngrx
import { Store } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'

type Gender = 'male' | 'female' | ''

@Component({
    selector: 'db-direct-register-member-fullmodal',
    templateUrl: './direct-register-member-fullmodal.component.html',
    styleUrls: ['./direct-register-member-fullmodal.component.scss'],
})
export class DirectRegisterMemberFullmodalComponent implements OnInit, OnDestroy {
    // modal vars and funcs
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() close = new EventEmitter<any>()
    @Output() finishRegister = new EventEmitter<any>()

    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    public changed: boolean
    //

    public center: Center

    public gender: Gender
    public localFileData: LocalFileData

    public registerForm: FormGroup
    public inputErrs: {
        email: string
        name: string
        phone_number: string
        birth_date: string
    } = {
        email: '',
        name: '',
        phone_number: '',
        birth_date: '',
    }

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private pictureService: PictureManagementService,
        private fileService: FileService,
        private storageService: StorageService,
        private fb: FormBuilder,
        private authService: AuthService,
        private centerUsersService: CenterUsersService,
        private nxStore: Store,
        private renderer: Renderer2
    ) {
        this.gender = ''
        this.localFileData = { src: undefined, file: undefined }

        this.center = this.storageService.getCenter()
    }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            email: [
                '',
                {
                    validators: [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+[.][a-z]{2,}$')],
                    asyncValidators: [this.emailAsyncValidator()],
                },
            ],
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
                this.gender = ''
                this.registerForm.reset()
            }
        }
    }

    ngOnDestroy(): void {
        this.pictureService.resetLocalPicData()
    }
    // relative to form group
    get email() {
        return this.registerForm.get('email')
    }
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
        this.localFileData = localFileData
        console.log('localfiledata: ', this.localFileData)
    }
    deletePreviewAvatar() {
        this.pictureService.resetLocalPicData()
        this.localFileData = { src: undefined, file: undefined }
    }

    registerAvatar(userid: string, afterFn?: () => void) {
        if (this.localFileData.file) {
            this.fileService
                .createFile(
                    { type_code: 'file_type_center_user_picture', center_id: this.center.id, center_user_id: userid },
                    this.localFileData.file
                )
                .subscribe((fl) => {
                    this.nxStore.dispatch(showToast({ text: '회원 등록이 완료되었습니다.' }))
                    afterFn ? afterFn() : null
                    // this.centerUsersService.updateUser(this.center.id, userid, { picture: location }).subscribe(
                    //     (user) => {
                    //         this.nxStore.dispatch(showToast({ text: '회원 등록이 완료되었습니다.' }))
                    //         afterFn ? afterFn() : null
                    //     },
                    //     (err) => {
                    //         console.log('create account avatar file err: ', err)
                    //     }
                    // )
                })
        } else {
            this.nxStore.dispatch(showToast({ text: '회원 등록이 완료되었습니다.' }))
            afterFn ? afterFn() : null
        }
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
            email: this.email.value as string,
            phone_number: this.phone_number.value as string,
        }
        console.log('registerNewMember  : ', this.center)
        this.centerUsersService.createUser(this.center.id, registerBody).subscribe({
            next: (createdUser) => {
                this.registerAvatar(createdUser.id, () => {
                    this.finishRegister.emit()
                    btLoadingFns.hideLoading()
                })
            },

            error: (err) => {
                console.log('err in registeration by email: ', err)
                btLoadingFns.hideLoading()
            },
        })
    }
}
