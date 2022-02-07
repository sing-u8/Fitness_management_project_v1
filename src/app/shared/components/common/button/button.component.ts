import {
    Component,
    ViewChild,
    ElementRef,
    Input,
    Output,
    OnInit,
    Renderer2,
    OnChanges,
    SimpleChanges,
    AfterViewChecked,
    AfterViewInit,
    EventEmitter,
    RendererStyleFlags2,
} from '@angular/core'
import { NgxSpinnerService } from 'ngx-spinner'

@Component({
    selector: 'rw-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit, OnChanges, AfterViewChecked {
    @Input() width: string
    @Input() height: string
    @Input() color: string
    @Input() borderColor: string
    @Input() fontColor: string
    @Input() disabled: boolean

    @Input() isLoading: boolean

    @Input() text: string

    @Output() click = new EventEmitter<void>()
    onButtonClick() {
        this.click.emit()
    }

    @ViewChild('rw_button') button_el: ElementRef

    public changed = false

    constructor(private renderer: Renderer2, private spinner: NgxSpinnerService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['disabled'] && !changes['disabled'].firstChange) {
            if (changes['disabled'].previousValue != changes['disabled'].currentValue) {
                this.changed = true
            }
        }

        if (changes['isLoading'] && !changes['isLoading'].firstChange) {
            if (changes['isLoading'].previousValue != changes['isLoading'].currentValue) {
                this.isLoading = changes['isLoading'].currentValue
                this.isLoading == true ? this.spinner.show('loading-button') : this.spinner.hide('loading-button')
            }
        }
    }
    ngAfterViewInit(): void {
        if (this.width) {
            this.renderer.setStyle(this.button_el.nativeElement, 'width', `${this.width}px`)
        }

        if (this.height) {
            this.renderer.setStyle(this.button_el.nativeElement, 'height', `${this.height}px`)
        }

        if (!this.width && !this.height) {
            this.renderer.setStyle(this.button_el.nativeElement, 'padding', `13px 15px`)
        }

        if (this.color) {
            console.log('button color: ', this.color)
            this.renderer.setStyle(this.button_el.nativeElement, 'backgroundColor', `${this.color}`)
            this.renderer.setStyle(this.button_el.nativeElement, 'color', 'var(--white)', RendererStyleFlags2.Important)
            this.renderer.addClass(this.button_el.nativeElement, 'cmp-button-type2')
        } else if (this.borderColor) {
            this.renderer.setStyle(this.button_el.nativeElement, 'border', `1px solid ${this.borderColor}`)
            this.renderer.setStyle(this.button_el.nativeElement, 'color', 'var(--font-color)')
            this.renderer.addClass(this.button_el.nativeElement, 'cmp-button-type1')
        } else {
            this.renderer.addClass(this.button_el.nativeElement, 'cmp-button-type1')
        }

        if (this.fontColor) {
            this.renderer.setStyle(this.button_el.nativeElement, 'color', `${this.fontColor}`)
        }

        if (this.disabled) {
            this.renderer.addClass(this.button_el.nativeElement, 'cmp-button-disabled')
            if (this.borderColor) {
                this.renderer.setStyle(this.button_el.nativeElement, 'border', `1px solid transparent`)
            }
        }
    }
    ngOnInit(): void {}
    ngAfterViewChecked(): void {
        if (this.changed) {
            this.changed = false

            if (this.disabled) {
                this.renderer.addClass(this.button_el.nativeElement, 'cmp-button-disabled')

                if (this.borderColor) {
                    this.renderer.setStyle(this.button_el.nativeElement, 'border', `1px solid transparent`)
                }
            } else {
                this.renderer.removeClass(this.button_el.nativeElement, 'cmp-button-disabled')

                if (this.borderColor) {
                    this.renderer.setStyle(this.button_el.nativeElement, 'border', `1px solid ${this.borderColor}`)
                }
            }
        }
    }
}
