import { Component, Input, forwardRef, ElementRef, Renderer2, ViewChild, AfterViewInit } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

import _ from 'lodash'

@Component({
    selector: 'rw-lesson-selector',
    templateUrl: './lesson-selector.component.html',
    styleUrls: ['./lesson-selector.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => LessonSelectorComponent),
            multi: true,
        },
    ],
})
export class LessonSelectorComponent implements AfterViewInit, ControlValueAccessor {
    @Input() items: Array<any>
    @Input() width: string

    @ViewChild('selectElement') selectElement
    @ViewChild('selectedElement') selectedElement
    @ViewChild('itemsElement') itemsElement

    public selectText = ''

    value: any
    isOpen: boolean

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.width = '530px'
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
        const display = this.itemsElement.nativeElement.style.display

        if (display == 'flex') {
            this.close()
        } else {
            this.renderer.setStyle(this.itemsElement.nativeElement, 'display', 'flex')
            this.isOpen = true
        }
    }

    close() {
        this.renderer.setStyle(this.itemsElement.nativeElement, 'display', 'none')
        this.isOpen = false
    }

    getSelectText() {
        const selected = _.filter(this.value, ['selected', true])
        if (selected.length > 0) {
            this.selectText =
                selected.length == 1
                    ? `${selected[0].item.name}`
                    : `${selected[0].item.name} 외 ${selected.length - 1}건`
        } else {
            this.selectText = ''
        }
    }

    onSelect(item) {
        if (item.disabled) return
        this.onChanged(item)
    }

    onChange = (_) => {}
    onTouched = (_) => {}

    writeValue(value: any): void {
        this.value = value
        this.getSelectText()
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
        this.getSelectText()
    }
}
