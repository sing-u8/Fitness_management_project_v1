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

@Component({
    selector: 'rw-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnChanges, AfterViewChecked {
    @Input() visible: boolean
    @Input() text: string
    @Input() delay: number

    @ViewChild('toastElement') toastElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()

    changed: boolean
    timer: any

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.delay = 2000
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && !changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
    }

    ngAfterViewChecked() {
        if (this.changed) {
            this.changed = false

            if (this.visible) {
                this.renderer.addClass(this.toastElement.nativeElement, 'display-flex')
                this.setPosition()
                setTimeout(() => {
                    this.renderer.addClass(this.toastElement.nativeElement, 'rw-toast-show')
                }, 0)
                this.timer = setTimeout(() => {
                    this.onCancel()
                }, this.delay)
            } else {
                this.renderer.removeClass(this.toastElement.nativeElement, 'rw-toast-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.toastElement.nativeElement, 'display-flex')
                }, 200)
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
        if (this.timer) {
            clearTimeout(this.timer)
            this.cancel.emit({})
        }
    }
}
