import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core'

@Directive({
    selector: '[rw-textarea-autoResize]',
})
export class TextareaAutoResize implements AfterViewInit {
    constructor(private el: ElementRef) {}

    @Output('onResize') onResize = new EventEmitter<string>()

    @HostListener(':keydown.backspace')
    @HostListener(':input')
    onInput() {
        this.resize()
    }

    ngAfterViewInit() {
        if (this.el.nativeElement.scrollHeight) {
            this.resize()
        }
    }

    resize() {
        const enterLength = this.el.nativeElement.value.split(/\r\n|\r|\n/).length
        const textHeight = (enterLength < 2 ? 2 : enterLength < 10 ? enterLength : 10) * 20
        this.el.nativeElement.style.height = String(textHeight) + 'px'
        this.onResize.emit(this.el.nativeElement.style.height)
    }
}
