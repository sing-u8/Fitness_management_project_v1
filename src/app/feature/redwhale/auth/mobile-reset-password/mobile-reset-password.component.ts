import { Component, OnInit, Renderer2, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { FormControl, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'

import { AuthService } from '@services/auth.service'

import { User } from '@schemas/user'
// components
import { TextFieldComponent } from './components/text-field/text-field.component'
import { ButtonComponent } from '@shared/components/common/button/button.component'
import { ClickEmitterType } from '@schemas/components/button'

@Component({
    selector: 'rw-mobile-reset-password',
    templateUrl: './mobile-reset-password.component.html',
    styleUrls: ['./mobile-reset-password.component.scss'],
})
export class MobileResetPasswordComponent implements OnInit, OnDestroy, AfterViewInit {
    public passwordForm: FormControl
    public passwordConfirmForm: FormControl
    public guideTextObj = {
        password: '',
        passwordConfirm: '',
    }

    public screenWidth = String(window.innerWidth)
    public textFieldWidth = String(window.innerWidth - 40)
    // public isLoading = false;

    public token: string
    public isTokenValid = false

    public passwordChangeSuccess = false

    public resizeUnListener: () => void

    @ViewChild('l_section') l_section_el: ElementRef
    @ViewChild('middle') middle_el: ElementRef
    @ViewChild('new_password') new_password: TextFieldComponent

    constructor(
        private renderer: Renderer2,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService
    ) {
        this.passwordForm = new FormControl('', {
            validators: [this.inputValidator('password')],
        })
        this.passwordConfirmForm = new FormControl('', {
            validators: [this.inputSameValidator('passwordConfirm'), this.inputValidator('passwordConfirm')],
        }) // ! validator array에서 앞에 있는 것부터 순서대로 검증함. (필요에 따라 순서를 생각해야함)
    }
    ngOnInit(): void {
        this.token = this.activatedRoute.snapshot.queryParams['token']

        if (!this.token) {
            this.isTokenValid = false
        } else {
            this.checkResetPasswordLinkMail()
        }
    }
    ngAfterViewInit(): void {
        const vh = window.innerHeight * 0.01
        this.renderer.setStyle(this.l_section_el.nativeElement, 'height', `calc(${vh}px * 100)`)
        this.renderer.setStyle(this.middle_el.nativeElement, 'height', `calc(${vh}px * 100 - 105px)`)

        this.resizeUnListener = this.renderer.listen('window', 'resize', (e) => {
            this.screenWidth = String(window.innerWidth)
            this.textFieldWidth = String(window.innerWidth - 40)

            const vh = window.innerHeight * 0.01
            this.renderer.setStyle(this.l_section_el.nativeElement, 'height', `calc(${vh}px * 100)`)
            this.renderer.setStyle(this.middle_el.nativeElement, 'height', `calc(${vh}px * 100 - 105px)`)
        })

        // this.new_password.input_el.nativeElement.focus()
        // this.new_password.input_el.nativeElement.click()
    }
    ngOnDestroy(): void {
        this.resizeUnListener()
    }

    navigateOnClose() {
        this.router.navigate(['auth/login'])
    }

    public errorTextObj = {
        whiteSpace: '🔑 공백을 포함할 수 없어요.',
        tooShort: '🔑 비밀번호가 너무 짧아요. (8자 이상)',
        notComplex: '🔑 영어, 숫자, 특수문자가 모두 포함되어야 해요.',
        notSame: '🔑  비밀번호가 일치하지 않아요.',
    }

    inputValidator(inputType: 'password' | 'passwordConfirm'): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const pattern1 = /[0-9]/
            const pattern2 = /[a-zA-Z]/
            const pattern3 = /[~!@#$%^&*()_+|<>?:{}]/
            const pattern4 = /\s/

            if (
                inputType == 'password' &&
                !control.pristine &&
                this.passwordConfirmForm &&
                !this.passwordConfirmForm.pristine
            ) {
                // passwordForm과 passwordConfirmForm이 입력된 상태에서 다시 passwordForm을 수정했을 때
                this.passwordConfirmForm.setValue(this.passwordConfirmForm.value)
            }

            if (pattern4.test(control.value)) {
                this.setGuideText(inputType, this.errorTextObj['whiteSpace'])
                return { whiteSpace: true, status: 'warning' }
            } else if (control.value < 8) {
                this.setGuideText(inputType, this.errorTextObj['tooShort'])
                return { tooShort: true, status: 'warning' }
            } else if (
                !pattern1.test(control.value) ||
                !pattern2.test(control.value) ||
                !pattern3.test(control.value)
            ) {
                this.setGuideText(inputType, this.errorTextObj['notComplex'])
                return { notComplex: true, status: 'warning' }
            }
            return null
        }
    }
    setGuideText(inputType: 'password' | 'passwordConfirm', text: string) {
        this.guideTextObj[inputType] = text
    }

    inputSameValidator(inputType: 'password' | 'passwordConfirm'): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.valid && control.value != this.passwordForm.value) {
                this.setGuideText(inputType, this.errorTextObj['notSame'])
                return { notSame: true, status: 'error' }
            }
            return null
        }
    }

    // ------------------------------------------------------------------------- //
    formCheck() {
        if (
            // this.isTokenValid &&
            this.passwordForm.dirty &&
            this.passwordForm.valid &&
            this.passwordConfirmForm.dirty &&
            this.passwordConfirmForm.valid &&
            this.passwordConfirmForm.value == this.passwordForm.value
        ) {
            return true
        } else {
            return false
        }
    }

    checkResetPasswordLinkMail() {
        this.authService.checkResetPasswordLinkMail({ token: this.token }).subscribe({
            next: (v) => {
                this.isTokenValid = true
            },
            error: (e) => {
                this.isTokenValid = false
                if (e.code == 'FUNCTION_AUTH_008') {
                    this.showMrpToast('만료된 비밀번호 재설정 링크입니다.')
                } else if (e.code == 'FUNCTION_AUTH_011') {
                    this.showMrpToast('유효하지 않은 토큰입니다.')
                }
            },
        })
    }

    changePassword(btLoadingFns: ClickEmitterType) {
        btLoadingFns.showLoading()
        this.authService
            .changePassword({
                token: this.token,
                new_password: this.passwordConfirmForm.value,
            })
            .subscribe({
                next: (user: User) => {
                    btLoadingFns.hideLoading()
                    this.passwordChangeSuccess = true
                },
                error: (e) => {
                    btLoadingFns.hideLoading()
                    this.showMrpToast(e.message)
                },
            })
    }

    @ViewChild('change_pw_bt_el') change_pw_bt_el: ButtonComponent
    onPwConfirmEnter() {
        const btLoadingFns: ClickEmitterType = {
            showLoading: this.change_pw_bt_el.showLoading,
            hideLoading: this.change_pw_bt_el.hideLoading,
        }
        if (this.formCheck()) this.changePassword(btLoadingFns)
    }

    @ViewChild('passwordConfirm') passwordConfirm: TextFieldComponent
    onPwEnter() {
        this.passwordConfirm.input_el.nativeElement.focus()
    }

    // ------------------ toast vars and funcs ----------------------------
    public toastObj = {
        show: false,
        text: '',
    }
    showMrpToast(text: string) {
        this.toastObj.show = true
        this.toastObj.text = text
    }
    hideMrpToast() {
        this.toastObj.show = false
    }
}
