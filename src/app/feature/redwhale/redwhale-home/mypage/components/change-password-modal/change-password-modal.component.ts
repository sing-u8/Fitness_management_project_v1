import {
    Component,
    Input,
    ElementRef,
    Renderer2,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    AfterViewChecked,
    OnInit,
    ViewChild,
} from '@angular/core'

import { FormBuilder, FormControl, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms'

import { UserService } from '@services/user.service'
import { StorageService } from '@services/storage.service'

import { User } from '@schemas/user'

// ngrx
import { Store } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'

@Component({
    selector: 'rw-change-password-modal',
    templateUrl: './change-password-modal.component.html',
    styleUrls: ['./change-password-modal.component.scss'],
})
export class ChangePasswordModalComponent implements OnInit, AfterViewChecked, OnChanges {
    @Input() visible: boolean
    @Input() data: any

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<any>()

    public user: User

    public currentPasswordChecked: boolean

    public pwdVisible: {
        currentPassword: boolean
        modifiedPassword: boolean
        modifiedPasswordConfirm: boolean
    } = {
        currentPassword: false,
        modifiedPassword: false,
        modifiedPasswordConfirm: false,
    }

    public pwdInputs: {
        currentPassword: FormControl
        modifiedPassword: FormControl
        modifiedPasswordConfirm: FormControl
    } = {
        currentPassword: null,
        modifiedPassword: null,
        modifiedPasswordConfirm: null,
    }
    public pwdErrTexts: { currentPassword: string; modifiedPassword: string; modifiedPasswordConfirm: string } = {
        currentPassword: '',
        modifiedPassword: '',
        modifiedPasswordConfirm: '',
    }
    public checkPasswordErrFlag: boolean

    public isMouseModalDown: boolean

    changed: boolean

    constructor(
        private el: ElementRef,
        private fb: FormBuilder,
        private renderer: Renderer2,
        private userService: UserService,
        private storageService: StorageService,
        private nxStore: Store
    ) {
        this.user = this.storageService.getUser()
        this.currentPasswordChecked = false
        this.isMouseModalDown = false
        this.checkPasswordErrFlag = false
    }

    ngOnInit() {
        this.pwdInputs['currentPassword'] = this.fb.control('', [Validators.required, this.passwordValidator()])
        this.pwdInputs['modifiedPassword'] = this.fb.control('', [
            Validators.required,
            this.passwordValidator(),
            this.modifiedPasswordValidator(),
        ])
        this.pwdInputs['modifiedPasswordConfirm'] = this.fb.control('', [
            Validators.required,
            this.modifiedConfirmPasswordValidator(),
        ])
    }
    ngOnChanges(changes: SimpleChanges) {
        // console.log('changes in setting modal: ', changes)
        if (!changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
    }
    ngAfterViewChecked() {
        if (this.changed) {
            this.changed = false

            if (this.visible) {
                this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'display-block')
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
            }
        }
    }

    onCancel(): void {
        this.currentPasswordChecked = false
        this.resetInputs()
        this.cancel.emit({})
    }

    onConfirm(): void {
        this.currentPasswordChecked = false
        this.resetInputs()
        this.confirm.emit({})
    }

    resetInputs() {
        this.pwdInputs.currentPassword.setValue('')
        this.pwdInputs.modifiedPassword.setValue('')
        this.pwdInputs.modifiedPasswordConfirm.setValue('')

        this.pwdVisible.currentPassword = false
        this.pwdVisible.modifiedPassword = false
        this.pwdVisible.modifiedPasswordConfirm = false
    }

    isCurrentPasswordChecked() {
        this.userService.checkPasswrod(this.user.id, { password: this.pwdInputs.currentPassword.value }).subscribe({
            next: (res) => {
                console.log('check pwd: ', res)
                this.goToNextStep()
            },
            error: (err) => {
                this.checkPasswordErrFlag = true
            },
        })
    }

    goToNextStep() {
        this.currentPasswordChecked = true
    }
    // icon methods
    onVisibleClick(inputType: 'currentPassword' | 'modifiedPassword' | 'modifiedPasswordConfirm') {
        this.pwdVisible[inputType] = !this.pwdVisible[inputType]
    }

    // pwd ipnut regexp checker
    onKeyPress(inputType: 'currentPassword' | 'modifiedPassword' | 'modifiedPasswordConfirm') {
        if (this.pwdInputs[inputType].errors?.['maxLength']) {
            this.setPwdErrs(inputType, null)
            return false
        }
        return true
    }

    onCurPwdKeyDown() {
        if (this.checkPasswordErrFlag) {
            this.checkPasswordErrFlag = false
        }
    }

    // pwd inputs method

    setPwdErrs(errProp: 'currentPassword' | 'modifiedPassword' | 'modifiedPasswordConfirm', errText: string) {
        if (errText != null) {
            this.pwdErrTexts[errProp] = errText
        }
    }

    // input validator
    passwordValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (/\s/.test(control.value)) {
                return { isSpace: true }
            } else if (control.value.length < 8) {
                return { minLength: true }
            } else if (
                !/[0-9]/.test(control.value) ||
                !/[a-zA-Z]/.test(control.value) ||
                !/[~!@#$%^&*()_+|<>?:{}]/.test(control.value)
            ) {
                return { isNotComplex: true }
            }
            return null
        }
    }
    modifiedPasswordValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (this.pwdInputs.currentPassword.value == control.value) {
                return { isSamePrev: true }
            }
            return null
        }
    }
    modifiedConfirmPasswordValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (this.pwdInputs.modifiedPassword.value != control.value) {
                return { isNotConfirmed: true }
            } else if (this.pwdInputs.currentPassword.value == control.value) {
                return { isSamePrev: true }
            }
            return null
        }
    }

    // set new password method
    setNewPassword() {
        this.userService
            .changePassword(this.user.id, {
                password: this.pwdInputs.currentPassword.value,
                new_password: this.pwdInputs.modifiedPassword.value,
            })
            .subscribe(
                (res) => {
                    this.nxStore.dispatch(showToast({ text: '비밀번호가 변경되었습니다.' }))
                    this.currentPasswordChecked = false
                    this.onConfirm()
                },
                (err) => {
                    console.log('err in changePassword: ', err)
                }
            )
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
}
