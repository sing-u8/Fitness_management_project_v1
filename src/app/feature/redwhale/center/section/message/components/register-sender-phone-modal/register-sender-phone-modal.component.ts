import {
    AfterViewChecked,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    Renderer2,
    SimpleChanges,
    ViewChild,
} from '@angular/core'
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'

import { ClickEmitterType } from '@schemas/components/button'

import { InputHelperService } from '@services/helper/input-helper.service'

@Component({
    selector: 'msg-register-sender-phone-modal',
    templateUrl: './register-sender-phone-modal.component.html',
    styleUrls: ['./register-sender-phone-modal.component.scss'],
})
export class RegisterSenderPhoneModalComponent implements OnChanges, AfterViewChecked {
    @Input() visible: boolean
    @Input() blockClickOutside = false
    @Input() type: 'cover' | 'contain' = 'cover'

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<{ loadingFns: ClickEmitterType; data: { name: string; phone: string } }>()

    changed: boolean

    public isMouseModalDown: boolean

    public nameForm: FormControl
    public phoneForm: FormControl

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private fb: FormBuilder,
        public inputHelper: InputHelperService
    ) {
        this.isMouseModalDown = false

        this.nameForm = this.fb.control('', {
            validators: [Validators.required, Validators.pattern('^[가-힣|a-z|A-Z]{1,20}$'), this.nameValidator()],
        })
        this.phoneForm = this.fb.control('', {
            validators: [Validators.required, Validators.pattern('^[0-9]{10,11}$'), this.phoneValidator()],
        })
    }

    ngOnChanges(changes: SimpleChanges) {
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
                this.nameForm.reset()
                this.phoneForm.reset()
            }
        }
    }

    onCancel(): void {
        this.cancel.emit({})
    }

    onConfirm(loadingFns: ClickEmitterType): void {
        loadingFns.showLoading()
        this.confirm.emit({ loadingFns, data: { name: this.nameForm.value, phone: this.phoneForm.value } })
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }

    // validators
    public nameError = ''
    public phoneError = ''
    nameValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const nameRegex = /^[가-힣|a-z|A-Z]{1,20}$/
            console.log('name validator : ', control, ' -- ', control.pending)
            if (!control.pristine && control.value == '') {
                this.nameError = '이름을 입력해주세요.'
                return { nameNone: true }
            } else if (!nameRegex.test(control.value)) {
                this.nameError = '이메일 양식을 확인해주세요.'
                return { nameFormError: true }
            }

            return null
        }
    }
    phoneValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const phoneRegex = /^[0-9]{10,11}$/
            if (!control.pristine && control.value == '') {
                this.phoneError = '발신번호를 입력해주세요.'
                return { phoneNone: true }
            } else if (!phoneRegex.test(control.value)) {
                this.phoneError = '발신번호 양식을 확인해주세요.'
                return { phoneFormError: true }
            }
            return null
        }
    }
}
