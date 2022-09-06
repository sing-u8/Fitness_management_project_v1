import {
    Component,
    Input,
    ElementRef,
    Renderer2,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    AfterViewChecked,
    ViewChild,
} from '@angular/core'
import _ from 'lodash'

@Component({
    selector: 'rw-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnChanges, AfterViewChecked {
    @Input() visible: boolean
    @Input() text: string
    @Input() timeOutCount = 3

    @ViewChild('toastElement') toastElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()

    timer: NodeJS.Timeout
    changed: boolean
    timerId = undefined
    _timeOutCount = 0

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && !changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
        if (changes['text'] && !changes['text'].firstChange) {
            if (changes['text'].previousValue != changes['text'].currentValue && this.visible) {
                this.changed = true
            }
        }
    }

    ngAfterViewChecked() {
        if (this.changed) {
            this.changed = false
            clearInterval(this.timerId)

            if (this.visible) {
                this.renderer.addClass(this.toastElement.nativeElement, 'display-flex')
                this.setPosition()
                setTimeout(() => {
                    this.renderer.addClass(this.toastElement.nativeElement, 'rw-toast-show')
                }, 0)
                this._timeOutCount = this.timeOutCount
                this.timerId = setInterval(() => {
                    this._timeOutCount = this._timeOutCount - 1
                    if (this._timeOutCount <= 0) {
                        this.onCancel()
                        clearInterval(this.timerId)
                    }
                }, 1000)
            } else {
                this.renderer.removeClass(this.toastElement.nativeElement, 'rw-toast-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.toastElement.nativeElement, 'display-flex')
                }, 200)
                if (!_.isEmpty(this.timerId)) {
                    clearInterval(this.timerId)
                }
            }
        }
    }

    setPosition() {
        const hostPos = document.body.getBoundingClientRect()
        const toastPos = this.toastElement.nativeElement.getBoundingClientRect()
        const x = hostPos.width / 2 - toastPos.width / 2
        this.renderer.setStyle(this.toastElement.nativeElement, 'left', `${x}px`)
    }

    onCancel(): void {
        this.cancel.emit({})
    }
}
