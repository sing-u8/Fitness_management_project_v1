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
import { ClickEmitterType } from '@shared/components/common/button/button.component'
import _ from 'lodash'

export interface SettingTermConfirmOutput {
    loadingFns: ClickEmitterType
    centerTerm: string
}

@Component({
    selector: 'rw-setting-terms-modal',
    templateUrl: './setting-terms-modal.component.html',
    styleUrls: ['./setting-terms-modal.component.scss'],
})
export class SettingTermsModalComponent implements OnChanges, AfterViewChecked {
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()
    @Input() centerTerm = ''
    @Output() centerTermChange = new EventEmitter<string>()

    @Input() center: Center
    @Input() blockClickOutside = false

    @Output() cancel = new EventEmitter<void>()
    @Output() confirm = new EventEmitter<SettingTermConfirmOutput>()

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    changed: boolean
    public isMouseModalDown: boolean

    constructor(private el: ElementRef, private renderer: Renderer2) {
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
        this.centerTerm = this.center.contract_terms
    }

    onConfirm(loadingFns: ClickEmitterType): void {
        this.confirm.emit({
            loadingFns,
            centerTerm: this.centerTerm,
        })
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }
}
