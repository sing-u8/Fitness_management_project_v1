import {
    Directive,
    ElementRef,
    Input,
    OnInit,
    Renderer2,
    OnChanges,
    SimpleChanges,
    AfterViewChecked,
} from '@angular/core'

@Directive({
    selector: '[rw-button]',
})
export class ButtonDirective implements OnInit, OnChanges, AfterViewChecked {
    @Input() rwButtonWidth: string
    @Input() rwButtonHeight: string
    @Input() rwButtonColor: string
    @Input() rwButtonBorderColor: string
    @Input() rwButtonFontColor: string
    @Input() rwButtonDisabled: boolean

    changed

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['rwButtonDisabled'] && !changes['rwButtonDisabled'].firstChange) {
            if (changes['rwButtonDisabled'].previousValue != changes['rwButtonDisabled'].currentValue) {
                this.changed = true
            }
        }
    }

    ngOnInit(): void {
        this.renderer.addClass(this.el.nativeElement, 'rw-button')

        if (this.rwButtonWidth) {
            this.el.nativeElement.style.width = `${this.rwButtonWidth}px`
        }

        if (this.rwButtonHeight) {
            this.el.nativeElement.style.height = `${this.rwButtonHeight}px`
        }

        if (!this.rwButtonWidth && !this.rwButtonHeight) {
            this.el.nativeElement.style.padding = '13px 15px'
        }

        if (this.rwButtonColor) {
            this.el.nativeElement.style.backgroundColor = this.rwButtonColor
            this.el.nativeElement.style.color = 'var(--white)'
            this.renderer.addClass(this.el.nativeElement, 'rw-button-type2')
        } else if (this.rwButtonBorderColor) {
            this.el.nativeElement.style.border = `1px solid ${this.rwButtonBorderColor}`
            this.el.nativeElement.style.color = 'var(--font-color)'
            this.renderer.addClass(this.el.nativeElement, 'rw-button-type1')
        } else {
            this.renderer.addClass(this.el.nativeElement, 'rw-button-type1')
        }

        if (this.rwButtonFontColor) {
            this.el.nativeElement.style.color = this.rwButtonFontColor
        }

        if (this.rwButtonDisabled) {
            this.renderer.addClass(this.el.nativeElement, 'rw-button-disabled')

            if (this.rwButtonBorderColor) {
                this.el.nativeElement.style.border = `1px solid transparent`
            }
        }
    }

    ngAfterViewChecked() {
        if (this.changed) {
            this.changed = false

            if (this.rwButtonDisabled) {
                this.renderer.addClass(this.el.nativeElement, 'rw-button-disabled')

                if (this.rwButtonBorderColor) {
                    this.el.nativeElement.style.border = `1px solid transparent`
                }
            } else {
                this.renderer.removeClass(this.el.nativeElement, 'rw-button-disabled')

                if (this.rwButtonBorderColor) {
                    this.el.nativeElement.style.border = `1px solid ${this.rwButtonBorderColor}`
                }
            }
        }
    }
}
