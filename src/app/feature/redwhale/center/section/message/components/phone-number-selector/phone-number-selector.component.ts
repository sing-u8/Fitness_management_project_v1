import {
    Component,
    Input,
    forwardRef,
    ElementRef,
    Renderer2,
    ViewChild,
    ViewChildren,
    QueryList,
    AfterViewInit,
    Output,
    EventEmitter,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

type PhoneNumber = { number: string; value: any; verified?: boolean }

@Component({
    selector: 'msg-phone-number-selector',
    templateUrl: './phone-number-selector.component.html',
    styleUrls: ['./phone-number-selector.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PhoneNumberSelectorComponent),
            multi: true,
        },
    ],
})
export class PhoneNumberSelectorComponent implements AfterViewInit, ControlValueAccessor {
    @Input() items: Array<PhoneNumber>
    @Input() disabled = false
    @Input() width: string
    @Input() height: string
    @Input() closeBgColor: string
    @Input() dropUp = false

    @Output() onSelectChange = new EventEmitter<any>()

    @ViewChild('selectElement') selectElement
    @ViewChild('selectedElement') selectedElement
    @ViewChild('itemsElement') itemsElement

    public value: PhoneNumber
    public isOpen: boolean

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.disabled = false
        this.width = '206'
    }

    ngAfterViewInit(): void {
        // setting elements style
        if (this.width) {
            this.renderer.setStyle(this.selectedElement.nativeElement, 'width', `${this.width}px`)
            this.renderer.setStyle(this.itemsElement.nativeElement, 'width', `${this.width}px`)
        }
        if (this.height) {
            this.renderer.setStyle(this.selectedElement.nativeElement, 'height', `${this.height}px`)
            this.renderer.setStyle(this.itemsElement.nativeElement, 'height', `${this.height}px`)
            this.renderer.setStyle(this.itemsElement.nativeElement, 'top', `${this.height + 5}px`)
            this.renderer.setStyle(this.itemsElement.nativeElement, 'bottom', `${this.height + 5}px`)
        }
        if (this.closeBgColor) {
            this.renderer.setStyle(this.selectedElement.nativeElement, 'backgroundColor', `${this.closeBgColor}`)
        }
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

    // value accessor methods

    onSelect(item) {
        if (item.disabled) return

        this.onSelectChange.emit(item)
        this.close()
        this.onChanged(item)
    }
    onChange = (_) => {}
    onTouched = (_) => {}
    writeValue(value: any): void {
        this.value = value
        // this.onChanged(value)
    }
    registerOnChange(fn: any): void {
        this.onChange = fn
    }
    registerOnTouched(fn: any): void {
        this.onTouched = fn
    }
    onChanged(value: any) {
        this.value = value
        this.onChange(value)
    }
}
