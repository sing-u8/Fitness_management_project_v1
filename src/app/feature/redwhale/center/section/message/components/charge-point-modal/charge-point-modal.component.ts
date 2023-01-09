import {
    AfterViewChecked,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    Renderer2,
    SimpleChanges,
    ViewChild,
} from '@angular/core'

import { ClickEmitterType } from '@schemas/components/button'

import { InputHelperService } from '@services/helper/input-helper.service'

import _ from 'lodash'

type ChargePoint = {
    selected: boolean
    pay: number
    point: number
}

@Component({
    selector: 'msg-charge-point-modal',
    templateUrl: './charge-point-modal.component.html',
    styleUrls: ['./charge-point-modal.component.scss'],
})
export class ChargePointModalComponent implements OnChanges, AfterViewChecked {
    @Input() visible: boolean
    @Input() blockClickOutside = false

    @ViewChild('modalBackgroundElement') modalBackgroundElement
    @ViewChild('modalWrapperElement') modalWrapperElement

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() cancel = new EventEmitter<any>()
    @Output() confirm = new EventEmitter<{ loadingFns: ClickEmitterType; amount: number; point: number }>()

    changed: boolean

    public isMouseModalDown: boolean

    constructor(private el: ElementRef, private renderer: Renderer2, public inputHelperService: InputHelperService) {
        this.isMouseModalDown = false
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes['visible'].firstChange) {
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

                this.chargePointList.forEach((v, i) => {
                    this.chargePointList[i].selected = i == 0
                })
                this.agreeCharge = false
                this.pointInput = ''
            }
        }
    }

    onCancel(): void {
        this.cancel.emit({})
    }

    onConfirm(loadingFns: ClickEmitterType): void {
        if (!(this.agreeCharge && this.isChargeablePoint())) return
        const chargePoint = Number(this.pointInput.replace(/[^0-9]/gi, '')) // this.chargePointList.find((v, i) => this.chargePointList[i].selected)
        loadingFns.showLoading()
        this.confirm.emit({ loadingFns, amount: chargePoint, point: chargePoint })
    }

    // on mouse rw-modal down
    onMouseModalDown() {
        this.isMouseModalDown = true
    }
    resetMouseModalDown() {
        this.isMouseModalDown = false
    }

    // charge point items vars and funcs
    public chargePointList: ChargePoint[] = [
        { selected: true, pay: 10000, point: 10000 },
        { selected: false, pay: 50000, point: 50000 },
        { selected: false, pay: 100000, point: 100000 },
        { selected: false, pay: 200000, point: 200000 },
    ]
    setPointSelected(idx: number) {
        this.chargePointList.forEach((v, i) => {
            this.chargePointList[i].selected = i == idx
        })
    }

    // agree charge var and func
    public agreeCharge = false
    onAgreeChargeClick() {
        this.agreeCharge = !this.agreeCharge
    }

    // input vars and funcs
    public pointInput = ''
    onSelectedItemInputKeyup(event) {
        if (event.code == 'Enter' || _.includes(event.code, 'Arrow')) return
        this.pointInput.replace(/[^0-9]/gi, '').replace(/[^0-9]/gi, ',')
    }

    isChargeablePoint() {
        return Number(this.pointInput.replace(/[^0-9]/gi, '')) >= 1000
    }

    onPointInputKeyUp(event) {
        if (event.code == 'Enter' || _.includes(event.code, 'Arrow')) return
        const preValue = String(this.pointInput)
        this.pointInput = preValue.replace(/[^0-9]/gi, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
}
