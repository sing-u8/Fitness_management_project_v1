import { Component, OnInit, Input, Output, EventEmitter, Renderer2, OnDestroy } from '@angular/core'

@Component({
    selector: 'gl-lesson-icon',
    templateUrl: './lesson-icon.component.html',
    styleUrls: ['./lesson-icon.component.scss'],
})
export class LessonIconComponent implements OnInit, OnDestroy {
    @Input() backGroundColor: string
    @Input() isLesson: boolean
    @Output() onColorSelected = new EventEmitter<string>()
    public isColorDropDownOpen: boolean
    sendSelectedColor(selectedColor: string) {
        this.closeColorDropDown()
        this.onColorSelected.emit(selectedColor)
    }

    private clickListener: () => void

    public iconColors = {
        '#ffe885': false,
        '#bbe17b': false,
        '#bbeaff': false,
        '#a2bdfc': false,
        '#ffa5c1': false,
        '#f8b990': false,
        '#6ad2c0': false,
        '#6b9cb2': false,
        '#9289d2': false,
        '#eb7c7c': false,
    }
    constructor(private renderer: Renderer2) {
        this.isColorDropDownOpen = false
        this.clickListener = this.renderer.listen('window', 'click', (e: Event) => {
            this.isColorDropDownOpen ? (this.isColorDropDownOpen = false) : null
            e.stopImmediatePropagation()
        })
    }

    ngOnInit(): void {}
    ngOnDestroy(): void {
        this.clickListener()
    }

    toggleColorDropDown() {
        this.isColorDropDownOpen = !this.isColorDropDownOpen
    }
    closeColorDropDown() {
        this.isColorDropDownOpen = false
    }
}
