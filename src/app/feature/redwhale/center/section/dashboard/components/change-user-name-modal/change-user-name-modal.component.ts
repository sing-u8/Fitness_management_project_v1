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

@Component({
    selector: 'db-change-user-name-modal',
    templateUrl: './change-user-name-modal.component.html',
    styleUrls: ['./change-user-name-modal.component.scss'],
})
export class ChangeUserNameModalComponent implements AfterViewChecked, OnChanges {
    @Input() visible: boolean
    @Input() userName: any

    @ViewChild('modalBackgroundElement') modalBackgroundElement: ElementRef
    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    @ViewChild('inputContainer') inputContainer: ElementRef

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<any>()

    changed: boolean

    public isMouseModalDown: boolean

    public userNameInit: string

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.isMouseModalDown = false
    }

    ngOnChanges(changes: SimpleChanges) {
        this.userNameInit = this.userName
        if (changes['visible'] && !changes['visible']?.firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
                if (changes['visible'].currentValue == true) this.setInputfocus()
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

    // input autofocus
    setInputfocus() {
        setTimeout(() => {
            this.inputContainer.nativeElement.childNodes[1].focus()
        }, 0)
    }

    // main method

    nameCheck(event) {
        const reg = /^[가-힣|a-z|A-Z]+$/
        if (!reg.test(event.key)) {
            return false
        }
        return true
    }

    //

    onCancel(): void {
        this.userName = this.userNameInit
        this.resetMouseModalDown()
        this.cancel.emit({})
    }

    onConfirm(): void {
        this.confirm.emit(this.userName)
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
}
