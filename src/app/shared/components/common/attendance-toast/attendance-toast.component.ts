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

import { CenterUser } from '@schemas/center-user'

@Component({
    selector: 'rw-attendance-toast',
    templateUrl: './attendance-toast.component.html',
    styleUrls: ['./attendance-toast.component.scss'],
})
export class AttendanceToastComponent implements OnChanges, AfterViewChecked {
    @Input() visible: boolean
    @Input() member: CenterUser
    @Input() delay: number

    @ViewChild('attendanceElement') attendanceElement: ElementRef

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
                this.renderer.addClass(this.attendanceElement.nativeElement, 'display-flex')
                this.setPosition()
                setTimeout(() => {
                    this.renderer.addClass(this.attendanceElement.nativeElement, 'rw-toast-show')
                }, 0)
                this.timer = setTimeout(() => {
                    this.onCancel()
                }, this.delay)
            } else {
                this.renderer.removeClass(this.attendanceElement.nativeElement, 'rw-toast-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.attendanceElement.nativeElement, 'display-flex')
                }, 200)
            }
        }
    }

    setPosition() {
        const hostPos = document.body.getBoundingClientRect()
        const toastPos = this.attendanceElement.nativeElement.getBoundingClientRect()
        const x = hostPos.width / 2 - toastPos.width / 2
        const y = 70
        this.renderer.setStyle(this.attendanceElement.nativeElement, 'left', `${x}px`)
        this.renderer.setStyle(this.attendanceElement.nativeElement, 'top', `${y}px`)
    }

    onCancel(): void {
        if (this.timer) {
            clearTimeout(this.timer)
            this.cancel.emit({})
        }
    }
}
