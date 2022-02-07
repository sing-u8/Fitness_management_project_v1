import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core'

@Directive({
    selector: '[rw-input]',
})
export class InputDirective implements OnInit {
    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngOnInit(): void {
        this.renderer.addClass(this.el.nativeElement, 'rw-input')
    }
}
