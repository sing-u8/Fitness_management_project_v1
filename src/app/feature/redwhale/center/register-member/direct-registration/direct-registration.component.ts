import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, Validators, ValidationErrors, AbstractControl, FormGroup, AsyncValidatorFn } from '@angular/forms'

import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'

import { StorageService } from '@services/storage.service'
import { FileService } from '@services/file.service'
import { AuthService } from '@services/auth.service'
import { CenterUsersService } from '@services/center-users.service'
import { GlobalService } from '@services/global.service'
import { PictureManagementService, LocalFileData } from '@services/helper/picture-management.service'

import { Center } from '@schemas/center'

type Gender = 'male' | 'female' | ''
@Component({
    selector: 'app-direct-registration',
    templateUrl: './direct-registration.component.html',
    styleUrls: ['./direct-registration.component.scss'],
})
export class DirectRegistrationComponent implements OnInit, OnDestroy {
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

        private globalService: GlobalService
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
                    console.log('v: ', v, this.registerForm)
                    return null
                }),
                catchError((e) => {
                    return e.code == 'FUNCTION:AUTH:007' ? of({ isExisted: true }) : of({ isNonEmailForm: true })
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
            //         return e.code == 'FUNCTION:AUTH:007' ? of({ isExisted: true }) : of({ isNonEmailForm: true })
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

    registerAvatar(userid, afterFn?: () => void) {
        if (this.localFileData.file) {
            // !! 수정 필요
            // this.fileService
            //     .createFile({ type_code: 'file_type_user_picture' }, this.localFileData.file)
            //     .subscribe((fl) => {
            //         const location = fl[0]['location']
            //         this.centerUsersService.updateUser(this.center.id, userid, { picture: location }).subscribe(
            //             (user) => {
            //                 this.globalService.showToast('회원 등록이 완료되었습니다.')
            //                 afterFn ? afterFn() : null
            //             },
            //             (err) => {
            //                 console.log('create account avatar file err: ', err)
            //             }
            //         )
            //     })
        } else {
            this.globalService.showToast('회원 등록이 완료되었습니다.')
            afterFn ? afterFn() : null
        }
    }

    // router method
    goRouterLink(uri: string) {
        this.router.navigateByUrl(uri)
    }
    backMainRegistraion() {
        this.router.navigate(['../main-registration'], { relativeTo: this.activatedRoute })
    }

    // gender method
    onSelectGender(Gender: Gender) {
        this.gender = Gender
    }

    // register method
    registerNewMember() {
        console.log('register new member: ', this.registerForm)
        const registerBody = {
            email: this.email.value as string,
            given_name: this.name.value as string,
            phone_number: this.phone_number.value as string,
            birth_date: this.birth_date.value as string,
            sex: this.gender as string,
        }
        this.centerUsersService.registerByEmail(this.center.id, registerBody).subscribe(
            (res) => {
                const user = res[0]
                this.registerAvatar(user.id, () => {
                    this.backMainRegistraion()
                })
            },
            (err) => {
                console.log('err in registeration by email: ', err)
            }
        )
    }
}
