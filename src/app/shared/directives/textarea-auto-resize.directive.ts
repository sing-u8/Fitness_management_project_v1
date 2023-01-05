import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Output, Input } from '@angular/core'

@Directive({
    selector: '[rw-textarea-autoResize]',
})
export class TextareaAutoResize implements AfterViewInit {
    constructor(private el: ElementRef) {}

    @Input() maxLine = 10
    @Input() heightUnit = 22
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
        let _height = 0
        if (height < 3 * this.heightUnit) {
            _height = 40
        }
        for (let i = 4; i <= this.maxLine; i++) {
            if (height < this.heightUnit * i) {
                _height = this.heightUnit * (i - 1)
                break
            }
        }
        if (height >= this.heightUnit * this.maxLine) {
            _height = this.heightUnit * this.maxLine
        }
        return _height
    }
}
