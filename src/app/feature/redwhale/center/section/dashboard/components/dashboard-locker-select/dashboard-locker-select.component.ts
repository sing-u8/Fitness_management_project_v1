import {
    Component,
    Input,
    Output,
    EventEmitter,
    forwardRef,
    ElementRef,
    Renderer2,
    ViewChild,
    AfterViewInit,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
    selector: 'rw-dashboard-locker-select',
    templateUrl: './dashboard-locker-select.component.html',
    styleUrls: ['./dashboard-locker-select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DashboardLockerSelectComponent),
            multi: true,
        },
    ],
})
export class DashboardLockerSelectComponent implements AfterViewInit, ControlValueAccessor {
    @Input() items: Array<any>
    @Input() disabled: boolean
    @Input() width: string

    @Output() change = new EventEmitter()

    @ViewChild('selectElement') selectElement
    @ViewChild('selectedElement') selectedElement
    @ViewChild('itemsElement') itemsElement

    value: any
    isOpen: boolean

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.disabled = false
        this.width = '544px'
    }

    ngAfterViewInit(): void {
        this.renderer.setStyle(this.selectedElement.nativeElement, 'width', this.width)
        this.renderer.setStyle(this.itemsElement.nativeElement, 'width', this.width)

        if (this.width) {
            this.renderer.setStyle(this.selectedElement.nativeElement, 'width', `${this.width}px`)
            this.renderer.setStyle(this.itemsElement.nativeElement, 'width', `${this.width}px`)
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

    onSelect(item) {
        if (item.disabled) return

        this.close()
        this.onChanged(item)
    }

    onChange = (_) => {}
    onTouched = (_) => {}

    writeValue(value: any): void {
        this.value = value
    }

    registerOnChange(fn: any): void {
        this.onChange = fn
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn
    }

    onChanged(value: any) {
        if (this.value.id == value.id) return
        this.value = value
        this.onChange(value)
        this.change.emit(value)
    }
}
