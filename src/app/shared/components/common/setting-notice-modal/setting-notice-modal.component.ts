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
import { Center } from '@schemas/center'
import { ClickEmitterType } from '@schemas/components/button'
import _ from 'lodash'

import { WordService } from '@services/helper/word.service'

export interface SettingNoticeConfirmOutput {
    loadingFns: ClickEmitterType
    centerNoticeText: string
}

@Component({
    selector: 'rw-setting-notice-modal',
    templateUrl: './setting-notice-modal.component.html',
    styleUrls: ['./setting-notice-modal.component.scss'],
})
export class SettingNoticeModalComponent implements OnChanges, AfterViewChecked {
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()
    @Input() centerNoticeText = ''
    @Output() centerNoticeTextChange = new EventEmitter<string>()

    @Input() center: Center
    @Input() blockClickOutside = false

    @Output() cancel = new EventEmitter<void>()
    @Output() confirm = new EventEmitter<SettingNoticeConfirmOutput>()

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    changed: boolean
    public isMouseModalDown: boolean

    constructor(private el: ElementRef, private renderer: Renderer2, private wordService: WordService) {
        this.isMouseModalDown = false
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!_.isEmpty(changes['visible']) && !changes['visible'].firstChange) {
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

    onCancel(): void {
        this.cancel.emit()
        this.centerNoticeText = this.center.contract_terms
    }

    onConfirm(loadingFns: ClickEmitterType): void {
        console.log('setting notice modal -- onConfirm : ', this.centerNoticeText)
        this.confirm.emit({
            loadingFns,
            centerNoticeText: this.centerNoticeText,
        })
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }

    // notice text byte
    noticeTextMax = 250
    limitNoticeTextByte(e) {
        return this.centerNoticeText.length < this.noticeTextMax
    }
}
