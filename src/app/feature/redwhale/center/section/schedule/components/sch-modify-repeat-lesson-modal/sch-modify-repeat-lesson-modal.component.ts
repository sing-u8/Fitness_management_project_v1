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

import { UpdateMode } from '@services/center-calendar.service'
import { WordService } from '@services/helper/word.service'

import _ from 'lodash'

@Component({
    selector: 'rw-sch-modify-repeat-lesson-modal',
    templateUrl: './sch-modify-repeat-lesson-modal.component.html',
    styleUrls: ['./sch-modify-repeat-lesson-modal.component.scss'],
})
export class SchModifyRepeatLessonModalComponent implements OnChanges {
    @Input() visible: boolean
    @Input() title: string
    @Input() reserveOption: UpdateMode = 'one'

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<any>()

    changed: boolean

    constructor(private el: ElementRef, private renderer: Renderer2, private wordService: WordService) {}

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
                this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'display-block')
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer.addClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)

                this.title = !_.isEmpty(this.title) ? this.wordService.ellipsis(this.title, 7) : this.title
            } else {
                this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'rw-modal-background-show')
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalBackgroundElement.nativeElement, 'display-block')
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
            }
        }
    }

    onCancel(): void {
        this.cancel.emit({})
        this.reserveOption = 'one'
    }

    onConfirm(): void {
        this.confirm.emit(this.reserveOption)
        this.reserveOption = 'one'
    }

    clickReserveLesson(option: UpdateMode) {
        this.reserveOption = option
    }
}
