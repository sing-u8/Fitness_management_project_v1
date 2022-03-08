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
    EventEmitter,
    RendererStyleFlags2,
} from '@angular/core'

@Component({
    selector: 'hp-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit, OnChanges, AfterViewChecked {
    @Input() width: string
    @Input() height: string
    @Input() bgColor: string
    @Input() borderColor: string
    @Input() fontColor: string
    @Input() disabled: boolean
    @Input() text: string

    @Output() onClick = new EventEmitter<void>()

    @ViewChild('hp_button') button_el: ElementRef

    public changed = false

    constructor(private renderer: Renderer2) {}

    ngOnInit(): void {
        if (this.width) {
            this.renderer.setStyle(this.button_el.nativeElement, 'width', `${this.width}px`)
        }

        if (this.height) {
            this.renderer.setStyle(this.button_el.nativeElement, 'height', `${this.height}px`)
        }

        if (this.bgColor) {
            this.renderer.setStyle(this.button_el.nativeElement, 'backgroundColor', `${this.bgColor}`)
            this.renderer.setStyle(this.button_el.nativeElement, 'color', 'var(--white)', RendererStyleFlags2.Important)
        }

        if (this.borderColor) {
            this.renderer.setStyle(this.button_el.nativeElement, 'border', `1px solid ${this.borderColor}`)
        }

        if (this.fontColor) {
            this.renderer.setStyle(this.button_el.nativeElement, 'color', `${this.fontColor}`)
        }
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['disabled'] && !changes['disabled'].firstChange) {
            if (changes['disabled'].previousValue != changes['disabled'].currentValue) {
                this.changed = true
            }
        }
    }
    ngAfterViewChecked(): void {
        if (this.changed) {
            this.changed = false

            // if (this.disabled) {
            //     this.renderer.addClass(this.button_el.nativeElement, 'cmp-button-disabled')

            //     if (this.borderColor) {
            //         this.renderer.setStyle(this.button_el.nativeElement, 'border', `1px solid transparent`)
            //     }
            // } else {
            //     this.renderer.removeClass(this.button_el.nativeElement, 'cmp-button-disabled')

            //     if (this.borderColor) {
            //         this.renderer.setStyle(this.button_el.nativeElement, 'border', `1px solid ${this.borderColor}`)
            //     }
            // }
        }
    }
}
