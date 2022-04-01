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
    ViewChild,
} from '@angular/core'
import { FormBuilder, FormControl, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms'
import { DeviceDetectorService } from 'ngx-device-detector'

@Component({
    selector: 'hp-receive-introduction-modal',
    templateUrl: './receive-introduction-modal.component.html',
    styleUrls: ['./receive-introduction-modal.component.scss'],
})
export class ReceiveIntroductionModalComponent implements OnChanges, AfterViewChecked {
    @Input() visible: boolean
    @Input() blockClickOutside = false

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement
    @ViewChild('rw_modal') rwModalElement: ElementRef

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<any>()

    changed: boolean

    public isMouseModalDown: boolean

    public isInputDataComplete = false
    public isTermsOpen = false

    public nameInputForm: FormControl
    public emailInputForm: FormControl
    public emailError = ''

    public privacyRadio = false
    public noticeRadio = false

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private fb: FormBuilder,
        private deviceDetector: DeviceDetectorService
    ) {
        this.isMouseModalDown = false

        this.nameInputForm = this.fb.control('', [Validators.required, this.nameValidator()])
        this.emailInputForm = this.fb.control('', [Validators.required, this.emailValidator()])
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
                this.setHeightWhenMobile()
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
        this.cancel.emit({})
        this.emailInputForm.setValue('')
        this.emailInputForm.markAsPristine()
        // this.emailInputForm.reset()
        this.nameInputForm.setValue('')
        this.nameInputForm.markAsPristine()
        // this.nameInputForm.reset()
        this.isInputDataComplete = false
        this.isTermsOpen = false

        this.privacyRadio = false
        this.noticeRadio = false
    }

    onConfirm(): void {
        this.confirm.emit({})
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
    // ------------------------------------------------- //
    onSendInputData() {
        this.isInputDataComplete = true
    }

    // ------------------------------------------------- //
    nameValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value.length < 2) {
                return { nameError: true }
            }
            return null
        }
    }
    emailValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
            if (control.value == '') {
                this.emailError = '이메일 주소를 입력해주세요.'
                return { emailNone: true }
            } else if (!emailRegex.test(control.value)) {
                this.emailError = '이메일 양식을 확인해주세요.'
                return { eamilFormError: true }
            }
            return null
        }
    }

    // ------------------------------------------------- //
    togglePrivacyRadio() {
        this.privacyRadio = !this.privacyRadio
    }
    toggleNoticeRadio() {
        this.noticeRadio = !this.noticeRadio
    }

    toggleTermGrid(event) {
        this.isTermsOpen = !this.isTermsOpen
        event.stopPropagation()
    }

    // ----------------------------------
    setHeightWhenMobile() {
        if (window.innerWidth < 760) {
            const height = window.innerHeight - 50
            this.renderer.setStyle(this.rwModalElement.nativeElement, 'height', `${height}px`)
        }
    }
}
