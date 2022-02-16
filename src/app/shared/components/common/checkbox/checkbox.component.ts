import { Component, Input, ElementRef, Renderer2, AfterViewInit } from '@angular/core'

@Component({
    selector: 'rw-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent implements AfterViewInit {
    @Input() checked: boolean
    @Input() text: string
    @Input() disabled: boolean
    @Input() noOpacity: boolean

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.checked = false
        this.disabled = false
        this.noOpacity = false
    }

    ngAfterViewInit(): void {
        this.text = this.text ?? ''
    }
}
