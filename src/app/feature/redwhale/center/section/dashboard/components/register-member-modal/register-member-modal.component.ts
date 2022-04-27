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
import dayjs from 'dayjs'
import _ from 'lodash'
import QRCode from 'qrcode'

import { DeeplinkService } from '@services/deeplink.service'
import { StorageService } from '@services/storage.service'

import { Center } from '@schemas/center'

@Component({
    selector: 'db-register-member-modal',
    templateUrl: './register-member-modal.component.html',
    styleUrls: ['./register-member-modal.component.scss'],
})
export class RegisterMemberModalComponent implements AfterViewChecked, OnChanges, AfterViewInit {
    @Input() visible: boolean

    @Output() cancel = new EventEmitter<any>()
    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() onDirectRegister = new EventEmitter<void>()

    @ViewChild('modalBackgroundElement') modalBackgroundElement: ElementRef
    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef

    changed: boolean
    public isMouseModalDown: boolean

    public center: Center
    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private deeplinkService: DeeplinkService,
        private storageService: StorageService
    ) {
        this.center = this.storageService.getCenter()
        this.isMouseModalDown = false
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['visible'] && !changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
    }

    ngAfterViewInit(): void {
        this.createGymQRcode()
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
        this.cancel.emit({})
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }

    //
    // deeplink vars and method
    public QRcode
    @ViewChild('qrcode_canvas') qrcode_canvas: ElementRef
    @ViewChild('qrcode_canvas_download') qrcode_canvas_download: ElementRef
    createGymQRcode() {
        const qrUri = this.deeplinkService.returnDeeplink(`gymId=${this.center.id}`)
        QRCode.toCanvas(this.qrcode_canvas.nativeElement, qrUri, { width: 225 }, (err) => {})
    }
    downloadGymQRcode(event) {
        const qrUri = this.deeplinkService.returnDeeplink(`gymId=${this.center.id}`)
        QRCode.toDataURL(this.qrcode_canvas_download.nativeElement, qrUri, { width: 400 }, (err, uri) => {
            if (err) throw err
            event.target.href = uri
            event.target.download = 'CENTER_QRCODE.png'
        })
    }
}
