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
    selector: 'mrp-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnChanges, AfterViewChecked {
    @Input() visible: boolean
    @Input() text: string
    @Input() delay: number

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()

    @ViewChild('toastElement') toastElement

    public changed: boolean
    public timer: any

    constructor(private el: ElementRef, private renderer: Renderer2) {
        if (!this.delay) {
            this.delay = 2000
        }
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
                this.timer = setTimeout(() => {
                    this.onCancel()
                }, this.delay)
            }
        }
    }

    onCancel(): void {
        if (this.timer) {
            clearTimeout(this.timer)
            this.cancel.emit({})
        }
    }
}
