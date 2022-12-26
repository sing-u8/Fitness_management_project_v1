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
    OnChanges,
    SimpleChanges,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

import { MultiSelectValue, MultiSelect } from '@schemas/components/multi-select'

import _ from 'lodash'

@Component({
    selector: 'gl-multi-instructor-select',
    templateUrl: './multi-instructor-select.component.html',
    styleUrls: ['./multi-instructor-select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MultiInstructorSelectComponent),
            multi: true,
        },
    ],
})
export class MultiInstructorSelectComponent implements AfterViewInit, ControlValueAccessor, OnChanges {
    @Input() items: MultiSelect
    @Input() disabled: boolean
    @Input() height: string
    @Input() height_type: 'small' | 'medium' = 'small'
    @Input() closeBgColor: string

    @Input() unCheckMode = false
    @Input() unCheckName = '담당자 없음'

    @Input() noSelectName = '담당자 없음'

    @Output() onSelectChange = new EventEmitter<{ selectedValue: MultiSelectValue; items: MultiSelect }>()
    @Output() onClose = new EventEmitter<MultiSelect>()

    @ViewChild('selectElement') selectElement
    @ViewChild('selectedElement') selectedElement
    @ViewChild('itemsElement') itemsElement

    @ViewChildren('.item') itemElememnts: QueryList<any>

    value: MultiSelect
    isOpen: boolean

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.disabled = false
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['items'] && !changes['items'].firstChange) {
            this.getSelectedValueSummary()
        }
    }

    ngAfterViewInit(): void {
        // filtering init
        // this.onChanged(this.items[0])

        // setting elements style
        this.renderer.setStyle(this.selectedElement.nativeElement, 'width', `104px`)
        this.renderer.setStyle(this.itemsElement.nativeElement, 'width', `104px`)

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
        if (this.isOpen) {
            this.renderer.setStyle(this.itemsElement.nativeElement, 'display', 'none')
            this.isOpen = false
            this.onClose.emit(this.items)
        }
    }

    // !!
    onSelect(item: MultiSelectValue, idx: number) {
        if (item.disabled) return

        this.items = _.cloneDeep(this.items)
        this.items[idx].checked = !this.items[idx].checked

        this.onChanged(item)
        this.onSelectChange.emit({ selectedValue: this.items[idx], items: this.items })

        const checkedItems = this.items.filter((v) => v.checked)
        if (checkedItems.length > 1) {
            this.renderer.setStyle(this.selectedElement.nativeElement, 'width', `145px`)
            this.renderer.setStyle(this.itemsElement.nativeElement, 'width', `145px`)
        } else {
            this.renderer.setStyle(this.selectedElement.nativeElement, 'width', `104px`)
            this.renderer.setStyle(this.itemsElement.nativeElement, 'width', `104px`)
        }
    }

    onChange = (_value: MultiSelectValue) => {
        if (this.value.length > 0) {
            if (!_value.checked) {
                this.value = _.filter(this.value, (v) => v.value.id != _value.value.id)
            } else {
                this.value = [...this.value, _value]
            }
        } else {
            this.value = [...this.value, _value]
        }

        this.setIsAllChecked()
        this.getSelectedValueSummary()
    }
    onTouched = (_) => {}

    writeValue(value: MultiSelect): void {
        _.forEach(value, (v) => {
            const idx = this.items.findIndex((vi) => vi.value.id == v.value.id && v.checked)
            if (idx != -1) {
                this.items[idx].checked = true
            }
        })
        this.setIsAllChecked()
        this.getSelectedValueSummary()
        this.value = value
    }

    registerOnChange(fn: any): void {
        // this.onChange = fn
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn
    }

    onChanged(value: MultiSelectValue) {
        this.onChange(value)
    }

    // get selected value summary
    public selectedValue: MultiSelectValue = undefined
    getSelectedValueSummary() {
        const checkValues = _.filter(this.items, (v) => v.checked)
        if (checkValues.length == 0) {
            this.selectedValue = undefined
        } else {
            this.selectedValue = {
                name: `${checkValues[0].name}` + (checkValues.length > 1 ? ` 외 ${checkValues.length - 1}명` : ''),
                value: checkValues[0].value,
                checked: true,
            }
        }
    }

    // on click all
    public isAllChecked = false
    setIsAllChecked() {
        this.isAllChecked = this.checkIsAllChecked()
    }

    checkIsAllChecked() {
        return this.items.every((v) => v.checked)
    }
}
