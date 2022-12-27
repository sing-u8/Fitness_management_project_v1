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
    AfterViewChecked,
    Output,
    EventEmitter,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { CenterUser } from '@schemas/center-user'
import _ from 'lodash'

interface TrainerFilter {
    name: string
    value: CenterUser
}

@Component({
    selector: 'gl-lesson-select',
    templateUrl: './lesson-select.component.html',
    styleUrls: ['./lesson-select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => LessonSelectComponent),
            multi: true,
        },
    ],
})
export class LessonSelectComponent implements AfterViewInit, ControlValueAccessor, AfterViewChecked {
    @Input() items: Array<{ name: string; value: any; disabled?: boolean }>
    @Input() disabled: boolean
    @Input() width: string
    @Input() height_type: 'small' | 'medium'
    @Input() closeBgColor: string
    @Input() noBorder: boolean

    @Output() onSelectChange = new EventEmitter<any>()
    @Output() onSelectChanges = new EventEmitter<{ prev: any; cur: any }>()

    @ViewChild('selectElement') selectElement: ElementRef
    @ViewChild('selectedElement') selectedElement: ElementRef
    @ViewChild('itemsElement') itemsElement: ElementRef
    @ViewChild('value_name_el') value_name_el: ElementRef

    @ViewChildren('.item') itemElememnts: QueryList<any>

    value: TrainerFilter
    isOpen: boolean

    public initItemsWidth = 0

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.disabled = false
        this.width = ''
    }

    ngAfterViewInit(): void {
        // filtering init
        this.onChanged(this.items[0])

        // setting elements style
        this.renderer.setStyle(this.selectedElement.nativeElement, 'width', this.width)
        this.renderer.setStyle(this.itemsElement.nativeElement, 'width', this.width)

        console.log(
            'ngAfterViewInit in lesson select : ',
            this.selectedElement.nativeElement,
            this.selectedElement,
            !_.isEmpty(this.width)
        )

        if (!_.isEmpty(this.width)) {
            this.renderer.setStyle(this.selectedElement.nativeElement, 'width', `${this.width}px`)
            this.renderer.setStyle(this.itemsElement.nativeElement, 'width', `${this.width}px`)
        }
        this.initItemsWidth = this.itemsElement.nativeElement.clientWidth

        if (this.closeBgColor) {
            this.renderer.setStyle(this.selectedElement.nativeElement, 'backgroundColor', `${this.closeBgColor}`)
        }
    }
    ngAfterViewChecked() {
        if (_.isEmpty(this.width) && this.initItemsWidth != this.itemsElement.nativeElement.clientWidth) {
            this.renderer.setStyle(
                this.itemsElement.nativeElement,
                'width',
                `${this.selectedElement.nativeElement.clientWidth}px`
            )
            this.initItemsWidth = this.itemsElement.nativeElement.clientWidth
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
        this.onSelectChanges.emit({ prev: this.value, cur: item })
        this.close()
        this.onChanged(item)
    }

    onChange = (_) => {}
    onTouched = (_) => {}

    writeValue(value: TrainerFilter): void {
        this.value = value
    }

    registerOnChange(fn: any): void {
        this.onChange = fn
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn
    }

    onChanged(value: TrainerFilter) {
        this.value = value

        this.onChange(value)
    }
}
