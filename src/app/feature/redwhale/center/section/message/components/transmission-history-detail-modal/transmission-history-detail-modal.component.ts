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

import { Loading } from '@schemas/store/loading'
import { SMSHistory } from '@schemas/sms-history'
import { SMSHistoryGroup } from '@schemas/sms-history-group'

@Component({
    selector: 'msg-transmission-history-detail-modal',
    templateUrl: './transmission-history-detail-modal.component.html',
    styleUrls: ['./transmission-history-detail-modal.component.scss'],
})
export class TransmissionHistoryDetailModalComponent implements OnChanges, AfterViewChecked {
    @Input() smsHistoryList: Array<SMSHistory>
    @Input() curHistoryGroup: SMSHistoryGroup
    @Input() Loading: Loading
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()

    @Input() blockClickOutside = false

    @Output() close = new EventEmitter<any>()

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    changed: boolean
    public isMouseModalDown: boolean

    constructor(private el: ElementRef, private renderer: Renderer2) {}
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

    onClose(): void {
        this.close.emit({})
    }
    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }

    // filter
    filterTransmitFailure(item: SMSHistory) {
        return !item.success_yn
    }
    filterTransmitSuccess(item: SMSHistory) {
        return item.success_yn
    }
}
