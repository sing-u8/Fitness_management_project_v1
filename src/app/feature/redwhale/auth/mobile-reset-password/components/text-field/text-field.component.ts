import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    AfterViewInit,
    OnChanges,
    Renderer2,
    ViewChild,
    ElementRef,
    RendererStyleFlags2,
    SimpleChanges,
} from '@angular/core'
import { FormControl, Validator, ValidatorFn, ValidationErrors } from '@angular/forms'

@Component({
    selector: 'mrp-text-field',
    templateUrl: './text-field.component.html',
    styleUrls: ['./text-field.component.scss'],
})

// status : warning, error, idle
export class TextFieldComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() title: string
    @Input() placeHolder: string
    @Input() guideText: string
    @Input() guidePlaceHoldText: string
    @Input() validatorErrs: ValidationErrors = {}
    @Input() form: FormControl
    @Input() width: string

    @Output() onEnter = new EventEmitter()
    Enter(event: Event) {
        this.onEnter.emit(event)
    }
    @Output() onKeyUp = new EventEmitter()
    keyUp(event: KeyboardEvent) {
        this.onKeyUp.emit(event)
    }
    public textVisible = false

    @ViewChild('l_text_field_el') l_text_field_el: ElementRef
    @ViewChild('input_el') input_el: ElementRef

    constructor(private renderer: Renderer2) {}

    ngOnInit(): void {}
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['width'] && !changes['width'].firstChange) {
            if (changes['width'].previousValue != changes['width'].currentValue) {
                this.width = changes['width'].currentValue
                this.renderer.setStyle(
                    this.l_text_field_el.nativeElement,
                    'width',
                    `${Number(this.width) / 10}rem`,
                    RendererStyleFlags2.Important
                )
            }
        }
    }
    ngAfterViewInit(): void {
        if (this.width) {
            this.renderer.setStyle(
                this.l_text_field_el.nativeElement,
                'width',
                `${Number(this.width) / 10}rem`,
                RendererStyleFlags2.Important
            )
        }
    }

    toggleVisible() {
        this.textVisible = !this.textVisible
    }

    // input foucs func
    public isFocused = false
    onInputFocused() {
        this.isFocused = true
    }
    onInputBlured() {
        this.isFocused = false
    }
}
