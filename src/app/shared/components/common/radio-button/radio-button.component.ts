import { Component, Input, ElementRef, Renderer2, AfterViewInit, ViewChild } from '@angular/core'

@Component({
    selector: 'rw-radio-button',
    templateUrl: './radio-button.component.html',
    styleUrls: ['./radio-button.component.scss'],
})
export class RadioButtonComponent implements AfterViewInit {
    @Input() checked: boolean
    @Input() text: string
    @Input() disabled: boolean
    @Input() textSize: string // ex) "12", "15"

    @ViewChild('text_element') text_element: ElementRef

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.checked = false
        this.text = ''
        this.disabled = false
    }
    ngAfterViewInit(): void {
        if (this.textSize) {
            this.renderer.setStyle(this.text_element.nativeElement, 'font-size', `${this.textSize}px`)
        }
    }
}
