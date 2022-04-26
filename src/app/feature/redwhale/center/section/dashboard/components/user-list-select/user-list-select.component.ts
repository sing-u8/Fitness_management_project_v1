import {
    Component,
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

import { MemberSelectCateg } from '@centerStore/reducers/sec.dashboard.reducer'

@Component({
    selector: 'rw-user-list-select',
    templateUrl: './user-list-select.component.html',
    styleUrls: ['./user-list-select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UserListSelectComponent),
            multi: true,
        },
    ],
})
export class UserListSelectComponent implements AfterViewInit, ControlValueAccessor {
    @Input() items: Record<MemberSelectCateg, { name: string; userSize: number }>
    @Input() disabled: boolean
    @Input() width: string
    @Input() holdMode: boolean

    @Output() onTypeChange = new EventEmitter<string>()

    @ViewChild('selectElement') selectElement
    @ViewChild('selectedElement') selectedElement
    @ViewChild('itemsElement') itemsElement

    value: { key: string; value: { name: string; userSize: number } }
    isOpen: boolean

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.disabled = false
        this.width = '210px'
    }

    ngAfterViewInit(): void {
        // this.renderer.setStyle(this.selectedElement.nativeElement, 'width', this.width)
        this.renderer.setStyle(this.itemsElement.nativeElement, 'width', this.width)

        if (this.width) {
            // this.renderer.setStyle(this.selectedElement.nativeElement, 'width', `${this.width}px`)
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

    onSelect(item: { name: string; userSize: number }, type: string) {
        this.close()
        this.onChanged(item, type)
    }

    onChange = (value: { name: string; userSize: number }, type: string) => {}
    onTouched = (_) => {}

    writeValue(value: any): void {
        this.value = value
    }

    registerOnChange(fn: any): void {
        this.onChange = (value: { name: string; userSize: number }, type: string) => {
            fn({ key: type, value: value })
        }
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn
    }

    onChanged(value: { name: string; userSize: number }, type: string) {
        this.value = { key: type, value: value }
        this.onChange(value, type)
        this.onTypeChange.emit(type)
    }
}
