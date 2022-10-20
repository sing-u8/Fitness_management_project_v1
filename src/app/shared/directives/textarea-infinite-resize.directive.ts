import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Output, Input } from '@angular/core'

@Directive({
    selector: '[rw-TextareaInfiniteResize]',
})
export class TextareaInfiniteResizeDirective implements AfterViewInit {
    constructor(private el: ElementRef) {}

    @Output('onResize') onResize = new EventEmitter<string>()

    @HostListener(':keydown.backspace')
    @HostListener(':input')
    onInput(e) {
        this.resize()
    }

    ngAfterViewInit() {
        if (this.el.nativeElement.scrollHeight) {
            this.resize()
        }
    }

    resize() {
        this.el.nativeElement.style.height = '0'
        this.el.nativeElement.style.height = this.setResizeHeight(this.el.nativeElement.scrollHeight) + 'px'
        this.onResize.emit(this.el.nativeElement.style.height)
    }

    setResizeHeight(height: number) {
        return height + 3
    }
}
