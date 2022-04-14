import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ValidationErrors, ValidatorFn } from '@angular/forms'

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
    constructor(private fb: FormBuilder) {
        this.inquiryForm = this.fb.group({
            centerName: ['', { Validators: [Validators.required] }],
            contactName: ['', { Validators: [Validators.required] }],
            email: ['', { Validators: [Validators.required] }],
            phone: ['', { Validators: [Validators.required] }],
            enquiry: ['', { Validators: [Validators.required] }],
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
}
