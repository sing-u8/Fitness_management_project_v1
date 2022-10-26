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

import _ from 'lodash'

type MultiSelectValue = { name: string; value: CenterUser; checked: boolean; disabled?: boolean }
type MultiSelect = Array<MultiSelectValue>

@Component({
    selector: 'rw-multi-user-select',
    templateUrl: './multi-user-select.component.html',
    styleUrls: ['./multi-user-select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MultiUserSelectComponent),
            multi: true,
        },
    ],
})
export class MultiUserSelectComponent implements AfterViewInit, ControlValueAccessor {
    @Input() items: MultiSelect
    @Input() disabled: boolean
    @Input() width: string
    @Input() height: string
    @Input() closeBgColor: string

    @Input() unCheckMode = false
    @Input() unCheckName = '담당자 없음'

    @Input() noSelectname = '담당자 없음'

    @Output() onSelectChange = new EventEmitter<any>()

    @ViewChild('selectElement') selectElement
    @ViewChild('selectedElement') selectedElement
    @ViewChild('itemsElement') itemsElement

    @ViewChildren('.item') itemElememnts: QueryList<any>

    value: MultiSelect
    isOpen: boolean

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.disabled = false
        this.width = '130px'
    }

    ngAfterViewInit(): void {
        // filtering init
        // this.onChanged(this.items[0])

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

    // !!
    onSelect(item) {
        if (item.disabled) return

        this.close()
        this.onChanged(item)
        this.onSelectChange.emit(item)
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
        this.value = value

        this.onChange(value)
    }

    // get selected value summary
    public selectedValue: MultiSelectValue = undefined
    getSelectedValueSummary() {
        const checkValues = _.filter(this.items, (v) => v.checked)
        if (checkValues.length == 0) return
        this.selectedValue = {
            name: `${checkValues[0].name}` + (checkValues.length > 1 ? ` 외 ${checkValues.length - 1}명` : ''),
            value: checkValues[0].value,
            checked: true,
        }
    }
}
