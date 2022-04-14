import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms'

@Component({
    selector: 'rw-introduction-inquiry',
    templateUrl: './introduction-inquiry.component.html',
    styleUrls: ['./introduction-inquiry.component.scss'],
})
export class IntroductionInquiryComponent implements OnInit {
    public inquiryForm: FormGroup
    public errors: {
        centerName: string
        contactName: string
        email: string
        phone: string
        enquiry: string
    } = {
        centerName: '',
        contactName: '',
        email: '',
        phone: '',
        enquiry: '',
    }

    public positionItems: Array<{ name: string; code: string }> = [
        { name: '관리자', code: 'administer' },
        { name: '트레이너 및 강사', code: 'instructor' },
        { name: '회원', code: 'member' },
    ]
    public position: { name: string; code: string } = { name: '관리자', code: 'administer' }
    onPositionChanged(value: { name: string; code: string }) {
        this.position = value
    }

    public privacyAgree = false
    togglePrivacyAgree() {
        this.privacyAgree = !this.privacyAgree
    }

    public showPrivacy = false
    toggleShowPrivacy() {
        this.showPrivacy = !this.showPrivacy
    }

    constructor(private fb: FormBuilder) {
        this.inquiryForm = this.fb.group({
            centerName: ['', [this.centerNameValidator()]],
            contactName: ['', [this.contactNameValidator()]],
            email: ['', [this.emailValidator()]],
            phone: ['', [this.phoneValidator()]],
            enquiry: ['', [this.enquiryValidator()]],
        })
    }

    get centerName() {
        return this.inquiryForm.get('centerName')
    }
    get contactName() {
        return this.inquiryForm.get('contactName')
    }
    get email() {
        return this.inquiryForm.get('email')
    }
    get phone() {
        return this.inquiryForm.get('phone')
    }
    get enquiry() {
        return this.inquiryForm.get('enquiry')
    }

    ngOnInit(): void {}

    centerNameValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            console.log('centerName validator : ', control, control.value, this.errors)
            if (control.value == '') {
                this.errors.centerName = '센터명을 입력해주세요.'

                return { centerNameNone: true }
            }
            return null
        }
    }
    contactNameValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value == '') {
                this.errors.contactName = '이름을 입력해주세요.'
                return { contactNameNone: true }
            }
            return null
        }
    }
    emailValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
            if (control.value == '') {
                this.errors.email = '이메일 주소를 입력해주세요.'
                return { emailNone: true }
            } else if (!emailRegex.test(control.value)) {
                this.errors.email = '이메일 양식을 확인해주세요.'
                return { eamilFormError: true }
            }
            return null
        }
    }
    phoneValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const phoneRegex = /^[0-9]{10,11}$/
            if (control.value == '') {
                this.errors.phone = '전화번호를 입력해주세요.'
                return { phoneNone: true }
            } else if (!phoneRegex.test(control.value)) {
                this.errors.email = '전화번호를 확인해주세요.'
                return { phoneFormError: true }
            }
            return null
        }
    }
    enquiryValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value == '') {
                this.errors.enquiry = '문의 사항을 입력해주세요.'
                return { enquiryNone: true }
            }
            return null
        }
    }
}

// &#13;&#10;
