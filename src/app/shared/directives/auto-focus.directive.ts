import { Directive, AfterViewInit, ElementRef } from '@angular/core'

@Directive({
    selector: '[rw-autoFocus]',
})
export class AutoFocusDirective implements AfterViewInit {
    constructor(private el: ElementRef) {}

    ngAfterViewInit() {
        this.el.nativeElement.focus()
    }
}
