import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Output, Input } from '@angular/core'

@Directive({
    selector: '[rw-textarea-autoResize]',
})
export class TextareaAutoResize implements AfterViewInit {
    constructor(private el: ElementRef) {}

    @Input() maxLine = 10
    @Output('onResize') onResize = new EventEmitter<string>()

    @HostListener(':keydown.backspace')
    @HostListener(':input')
    onInput(e) {
        console.log('on input : ', e)
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

        // const enterLength = this.el.nativeElement.value.split(/\r\n|\r|\n/).length
        // const textHeight = (enterLength < 2 ? 2 : enterLength < 10 ? enterLength : 10) * 20
        // this.el.nativeElement.style.height = String(textHeight) + 'px'
        this.onResize.emit(this.el.nativeElement.style.height)
    }

    setResizeHeight(height: number) {
        let _height = 0
        if (height < 3 * 20) {
            _height = 40
        }
        for (let i = 4; i <= this.maxLine; i++) {
            if (height < 20 * i) {
                _height = 20 * (i - 1)
                break
            }
        }
        if (height >= 20 * this.maxLine) {
            _height = 20 * this.maxLine
        }
        return _height
    }
}
