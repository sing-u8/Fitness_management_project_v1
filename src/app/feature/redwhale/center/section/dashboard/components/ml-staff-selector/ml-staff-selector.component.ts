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
import { CenterUser } from '@schemas/center-user'

@Component({
    selector: 'db-ml-staff-selector',
    templateUrl: './ml-staff-selector.component.html',
    styleUrls: ['./ml-staff-selector.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MlStaffSelectorComponent),
            multi: true,
        },
    ],
})
export class MlStaffSelectorComponent implements AfterViewInit, ControlValueAccessor {
    @Input() items: Array<{ name: string; value: CenterUser; disabled?: boolean }>
    @Input() disabled = false
    @Input() width: string
    @Input() height: string
    @Input() closeBgColor: string
    @Input() dropUp = false

    @Output() onSelectChange = new EventEmitter<any>()

    @ViewChild('selectElement') selectElement
    @ViewChild('selectedElement') selectedElement
    @ViewChild('itemsElement') itemsElement

    @ViewChildren('.item') itemElememnts: QueryList<any>

    value: { name: string; value: CenterUser; id: string }
    isOpen: boolean

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.disabled = false
        this.width = '130px'
    }

    ngAfterViewInit(): void {
        // filtering init
        this.onChanged(this.items[0])

        // setting elements style
        this.renderer.setStyle(this.selectedElement.nativeElement, 'width', this.width)
        this.renderer.setStyle(this.itemsElement.nativeElement, 'width', this.width)

        if (this.width) {
            this.renderer.setStyle(this.selectedElement.nativeElement, 'width', `${this.width}px`)
            this.renderer.setStyle(this.itemsElement.nativeElement, 'width', `${this.width}px`)
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
