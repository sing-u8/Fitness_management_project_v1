import { Component, Input, ElementRef, Renderer2 } from '@angular/core'

@Component({
    selector: 'rw-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent {
    @Input() checked: boolean
    @Input() text: string
    @Input() disabled: boolean
    @Input() noOpacity: boolean

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.checked = false
        this.text = this.text ?? ''
        this.disabled = false
        this.noOpacity = false
    }
}
