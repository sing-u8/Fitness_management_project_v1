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

@Component({
    selector: 'hp-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit, OnChanges, AfterViewChecked, AfterViewInit {
    @Input() width: string
    @Input() height: string
    @Input() bgColor: string
    @Input() borderColor: string
    @Input() fontColor: string
    @Input() fontSize: string
    @Input() disabled: boolean
    @Input() text: string

    @Output() onClick = new EventEmitter<void>()

    @ViewChild('hp_button') button_el: ElementRef

    public changed = false

    constructor(private renderer: Renderer2) {}

    ngOnInit(): void {}
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['disabled'] && !changes['disabled'].firstChange) {
            if (changes['disabled'].previousValue != changes['disabled'].currentValue) {
                this.changed = true
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
        if (this.fontColor) {
            this.renderer.setStyle(this.button_el.nativeElement, 'fontSize', `${this.fontSize}`)
        }
    }

    public isDisabled = false
    ngAfterViewChecked(): void {
        if (this.changed) {
            this.changed = false

            if (this.disabled) {
                this.isDisabled = true
                console.log('button is disabled true: ', this.isDisabled)
            } else {
                this.isDisabled = false
                console.log('button is disabled false : ', this.isDisabled)
            }
        }
    }
}
