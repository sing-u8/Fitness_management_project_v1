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

import { MultiSelectValue, MultiSelect } from '@schemas/components/multi-select'

import _ from 'lodash'

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

    @Input() noSelectName = '담당자 없음'

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
    onSelect(item: MultiSelectValue, idx: number) {
        if (item.disabled) return

        this.items[idx].checked = !this.items[idx].checked

        this.onChanged(item)
        this.onSelectChange.emit(item)
    }

    onChange = (value: MultiSelectValue) => {
        if (this.value.length > 0) {
            if (!value.checked) {
                _.remove(this.value, (v) => v.value.id == value.value.id)
            } else {
                this.value.push(value)
            }
        } else {
            this.value.push(value)
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
    onSelectAllButtonClick() {
        if (this.checkIsAllChecked()) {
            this.items.forEach((v, i) => {
                this.items[i].checked = false
                _.remove(this.value, (v) => v.value.id == v.value.id)
            })
        } else {
            this.items.forEach((v, i) => {
                this.items[i].checked = true
                if (_.findIndex(this.value, (vi) => vi.value.id == v.value.id) == -1) {
                    this.value.push(this.items[i])
                }
            })
        }
        this.getSelectedValueSummary()
        this.setIsAllChecked()
    }

    onSelectUnCheckButtonClick() {
        this.items.forEach((v, i) => {
            this.items[i].checked = false
            _.remove(this.value, (v) => v.value.id == this.items[i].value.id)
        })
        this.selectedValue = undefined
        this.setIsAllChecked()
    }
}
