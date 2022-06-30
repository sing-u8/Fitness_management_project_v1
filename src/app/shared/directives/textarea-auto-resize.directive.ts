import { Directive, AfterViewInit, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core'

@Directive({
    selector: '[rw-textarea-autoResize]',
})
export class TextareaAutoResize implements AfterViewInit {
    constructor(private el: ElementRef) {}

    @Input('textareaResizeOption') textareaResizeOption: {
        fontSize: number
        lineHeight: number
        maxLine: number
        initHeight: number
    } = {
        fontSize: 14,
        lineHeight: 1.43,
        maxLine: 10,
        initHeight: 30,
    }

    @Output('onResize') onResize = new EventEmitter<string>()

    @HostListener(':keydown.backspace')
    @HostListener(':input')
    onInput() {
        this.resize()
    }

    public optionHeight: number

    ngAfterViewInit() {
        this.optionHeight =
            this.textareaResizeOption.fontSize *
            this.textareaResizeOption.maxLine *
            this.textareaResizeOption.lineHeight
        if (this.el.nativeElement.scrollHeight) {
            this.resize()
        }
    }

    resize() {
        // !! 초기 height를 주고 싶으면 min-height로 설정해야함.
        // this.el.nativeElement.style.height
        this.el.nativeElement.style.height =
            this.el.nativeElement.scrollHeight >= this.optionHeight
                ? this.optionHeight + 'px'
                : this.el.nativeElement.scrollHeight + 'px'
        this.onResize.emit(this.el.nativeElement.style.height)

        // console.log(
        //     'rw-textarea-autoResize ---- ',
        //     this.el.nativeElement.style.height,
        //     ' - ',
        //     this.optionHeight,
        //     ' - ',
        //     this.el.nativeElement.scrollHeight,
        //     ' - ',
        //     this.el
        // )
    }
}
