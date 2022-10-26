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
    AfterViewInit,
} from '@angular/core'

@Component({
    selector: 'rw-component-toast',
    templateUrl: './component-toast.component.html',
    styleUrls: ['./component-toast.component.scss'],
})
export class ComponentToastComponent implements OnChanges, AfterViewChecked, AfterViewInit {
    @Input() visible: boolean
    @Input() text: string
    @Input() width: string

    @ViewChild('toastElement') toastElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()

    changed: boolean

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

    ngAfterViewInit() {
        if (this.width) {
            this.renderer.setStyle(this.toastElement.nativeElement, 'width', `${this.width}px`)
        }
    }

    ngAfterViewChecked() {
        if (this.changed) {
            this.changed = false
            if (this.visible) {
                this.renderer.addClass(this.toastElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer.addClass(this.toastElement.nativeElement, 'rw-toast-show')
                }, 0)
            } else {
                this.renderer.removeClass(this.toastElement.nativeElement, 'rw-toast-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.toastElement.nativeElement, 'display-flex')
                }, 200)
            }
        }
    }

    onCancel(): void {
        this.cancel.emit({})
    }
}
