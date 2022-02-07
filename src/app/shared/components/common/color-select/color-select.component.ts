import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges } from '@angular/core'

@Component({
    selector: 'rw-color-select',
    templateUrl: './color-select.component.html',
    styleUrls: ['./color-select.component.scss'],
})
export class ColorSelectComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() color: string
    @Output() onColorClick = new EventEmitter<string>()

    public iconColors = [
        '#ffe885',
        '#bbe17b',
        '#bbeaff',
        '#a2bdfc',
        '#ffa5c1',
        '#f8b990',
        '#6ad2c0',
        '#6b9cb2',
        '#9289d2',
        '#eb7c7c',
    ]
    public selectedColor = ''
    public isColorDropDownOpen = false
    constructor() {}

    ngOnInit(): void {}
    ngAfterViewInit(): void {
        if (!this.color) {
            this.selectedColor = '#ffe885'
        } else {
            this.selectedColor = this.color
        }
    }
    ngOnChanges() {
        this.selectedColor = this.color
    }

    onIconClick(color: string) {
        this.selectedColor = color
        this.onColorClick.emit(color)
        this.closeDropDown()
    }

    toggleDropDown() {
        this.isColorDropDownOpen = !this.isColorDropDownOpen
    }
    closeDropDown() {
        this.isColorDropDownOpen = false
    }
}
