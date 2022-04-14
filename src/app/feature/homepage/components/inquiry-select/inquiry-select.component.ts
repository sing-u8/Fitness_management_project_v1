import {
    Component,
    OnInit,
    Input,
    forwardRef,
    ElementRef,
    Renderer2,
    ViewChild,
    AfterViewInit,
    Output,
    EventEmitter,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
    selector: 'inquiry-select',
    templateUrl: './inquiry-select.component.html',
    styleUrls: ['./inquiry-select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InquirySelectComponent),
            multi: true,
        },
    ],
})
export class InquirySelectComponent implements AfterViewInit, ControlValueAccessor {
    @Input() items: Array<{ name: string; code: string }>
    @Input() disabled: boolean

    @Output() position = new EventEmitter<{ name: string; code: string }>()
    emitPosition() {
        this.position.emit(this.value)
    }

    @ViewChild('selectElement') selectElement
    @ViewChild('itemsElement') itemsElement

    value: { name: string; code: string }
    isOpen: boolean

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.disabled = false
    }

    ngAfterViewInit(): void {
        this.value = this.items[0]
        this.emitPosition()
    }

    toggle() {
        if (this.disabled === false) {
            const display = this.itemsElement.nativeElement.style.display

            if (display == 'block') {
                this.close()
            } else {
                this.renderer.setStyle(this.itemsElement.nativeElement, 'display', 'block')
                this.isOpen = true
            }
        }
    }

    close() {
        this.renderer.setStyle(this.itemsElement.nativeElement, 'display', 'none')
        this.isOpen = false
    }

    onSelect(item: { name: string; code: string }) {
        this.close()
        this.onChanged(item)
    }

    onChange = (_) => {}
    onTouched = (_) => {}

    writeValue(value: { name: string; code: string }): void {
        this.value = value
    }

    registerOnChange(fn: any): void {
        this.onChange = fn
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn
    }

    onChanged(value: { name: string; code: string }) {
        this.value = value
        this.emitPosition()
        this.onChange(value)
    }
}
