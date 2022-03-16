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
import { FormBuilder, FormControl, Validators } from '@angular/forms'

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

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<any>()

    changed: boolean

    public isMouseModalDown: boolean

    public isInputDataComplete = false
    public isTermsOpen = false

    public nameInputForm: FormControl
    public emailInputForm: FormControl

    public privacyRadio = false
    public noticeRadio = false

    constructor(private el: ElementRef, private renderer: Renderer2, private fb: FormBuilder) {
        this.isMouseModalDown = false

        this.nameInputForm = this.fb.control('')
        this.emailInputForm = this.fb.control('')
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
            }
        }
    }

    onCancel(): void {
        this.cancel.emit({})
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
    togglePrivacyRadio() {
        this.privacyRadio = !this.privacyRadio
    }
    toggleNoticeRadio() {
        this.noticeRadio = !this.noticeRadio
    }
}
