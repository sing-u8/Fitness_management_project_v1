import {
    Component,
    Input,
    ElementRef,
    Renderer2,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    AfterViewInit,
    AfterViewChecked,
    ViewChild,
    OnDestroy,
} from '@angular/core'

import _ from 'lodash'

import { ClickEmitterType } from '@schemas/components/button'
import SignaturePad from 'signature_pad'

export interface SignatureConfirmOutput {
    signData: string
    loadingFns: ClickEmitterType
}

@Component({
    selector: 'rw-signature-pad-modal',
    templateUrl: './signature-pad-modal.component.html',
    styleUrls: ['./signature-pad-modal.component.scss'],
})
export class SignaturePadModalComponent implements OnChanges, AfterViewChecked, AfterViewInit, OnDestroy {
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()

    @Input() contractorName: string
    @Input() blockClickOutside = false

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<SignatureConfirmOutput>()

    changed: boolean
    public isMouseModalDown: boolean

    @ViewChild('signature_pad') signature_pad_el: ElementRef
    public signaturePad: SignaturePad
    onEraseSignature() {
        this.signaturePad.clear()
        this.isSignStrokeOnce = false
    }

    public isSignStrokeOnce = false

    // 적용하면 제대로 동작이 안됨 ...
    // Adjust canvas coordinate space taking into account pixel ratio,
    // to make it look crisp on mobile devices.
    // This also causes canvas to be cleared.
    public resizeCanvas() {
        // When zoomed out to less than 100%, for some very strange reason,
        // some browsers report devicePixelRatio as less than 1
        // and only part of the canvas is cleared then.
        const ratio = Math.max(window.devicePixelRatio || 1, 1)
        this.signature_pad_el.nativeElement.width = this.signature_pad_el.nativeElement * ratio
        this.signature_pad_el.nativeElement.height = this.signature_pad_el.nativeElement.offsetHeight * ratio
        this.signature_pad_el.nativeElement.getContext('2d').scale(ratio, ratio)
    }
    public resizeListener: () => void = () => {}

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

    ngAfterViewInit() {
        this.signaturePad = new SignaturePad(this.signature_pad_el.nativeElement, {
            backgroundColor: 'transparent',
        })
        this.signaturePad.clear()
        this.signaturePad.addEventListener('beginStroke', () => {
            this.isSignStrokeOnce = true
        })
        // this.resizeCanvas()
        // this.resizeListener = this.renderer.listen('window', 'onresize', (event) => {
        //     this.resizeCanvas()
        // })
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

                this.isSignStrokeOnce = false
                this.signaturePad.clear()
            }
        }
    }
    ngOnDestroy() {
        this.resizeListener()
        this.signaturePad.removeEventListener('beginStroke', () => {
            this.isSignStrokeOnce = false
        })
    }

    onCancel(): void {
        this.cancel.emit({})
    }

    onConfirm(loadingFns: ClickEmitterType): void {
        const signData: string = this.signaturePad.toDataURL('image/png')
        this.confirm.emit({
            signData,
            loadingFns,
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
