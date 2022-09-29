import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Output, Input } from '@angular/core'

@Directive({
    selector: '[rw-TextareaHeightResize]',
})
export class TextareaHeightResizeDirective {
    constructor(private el: ElementRef) {}

    @Input() maxLine = 20
    @Input() padding = 40
    @Input() limitLine = true
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
        // const enterLength = this.el.nativeElement.value.split(/\r\n|\r|\n/).length
        // const textHeight = this.limitLine
        //     ? (enterLength < this.maxLine ? enterLength : this.maxLine) * 20 + this.padding
        //     : enterLength * 20 + this.padding
        // this.el.nativeElement.style.height = String(textHeight) + 'px'
        this.el.nativeElement.style.height = '0'
        this.el.nativeElement.style.height = this.setResizeHeight(this.el.nativeElement.scrollHeight) + 'px'
        this.onResize.emit(this.el.nativeElement.style.height)
    }

    setResizeHeight(height: number) {
        let _height = 20
        for (let i = 2; i < this.maxLine; i++) {
            if (height < 20 * i) {
                _height = 20 * (i - 1) ?? 20
                break
            }
        }
        if (height >= 20 * this.maxLine) {
            _height = 20 * this.maxLine
        }
        return _height
    }
}
