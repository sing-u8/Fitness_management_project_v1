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

import * as _ from 'lodash'

@Component({
    selector: 'rw-gym-select',
    templateUrl: './gym-select.component.html',
    styleUrls: ['./gym-select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => GymSelectComponent),
            multi: true,
        },
    ],
})
export class GymSelectComponent implements AfterViewInit, ControlValueAccessor {
    @Input() items: Array<{ name: string; value: any; disabled?: boolean }>
    @Input() disabled: boolean
    @Input() width: string
    @Input() height_type: 'small' | 'medium'
    @Input() noBorder: boolean

    @Output() onSelectChange = new EventEmitter<any>()

    @ViewChild('selectElement') selectElement
    @ViewChild('selectedElement') selectedElement
    @ViewChild('itemsElement') itemsElement

    @ViewChildren('.item') itemElememnts: QueryList<any>

    value: any
    isOpen: boolean

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.disabled = false
        this.width = '170px'
    }

    ngAfterViewInit(): void {
        console.log('items: ', this.items)
        // filtering init
        this.onChanged(this.items[0])

        // setting elements style
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
        this.onSelectChange.emit(item)
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
        this.value = value
        this.onChange(value)
    }
}
