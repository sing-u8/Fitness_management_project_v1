import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Output, Input } from '@angular/core'

@Directive({
    selector: '[rw-textarea-autoResize]',
})
export class TextareaAutoResize implements AfterViewInit {
    constructor(private el: ElementRef) {}

    @Input() maxLine = 10
    @Input() heightUnit = 20
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
        if (height < 2 * this.heightUnit) {
            _height = 40
            return _height
        }

        for (let i = 2; i <= this.maxLine; i++) {
            if (height < this.heightUnit * i) {
                _height = this.heightUnit * (i - 1) + (i < 7 ? 10 : i < 9 ? 10 : 15)
                return _height
            }
        }

        if (height >= this.heightUnit * this.maxLine) {
            _height = this.heightUnit * this.maxLine + 15
            return _height
        }
        return _height
    }
}
