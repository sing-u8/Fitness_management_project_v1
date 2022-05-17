import {
    Component,
    OnInit,
    OnDestroy,
    SimpleChanges,
    ElementRef,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    Renderer2,
    OnChanges,
    AfterViewChecked,
} from '@angular/core'

import _ from 'lodash'
import dayjs from 'dayjs'

import { originalOrder } from '@helpers/pipe/keyvalue'
import { StorageService } from '@services/storage.service'

// components
import { ClickEmitterType } from '@shared/components/common/button/button.component'

import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { MembershipItem } from '@schemas/membership-item'
import { LockerItem } from '@schemas/locker-item'
import { LockerCategory } from '@schemas/locker-category'

// ngrx
import { Store } from '@ngrx/store'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'

@Component({
    selector: 'db-modify-payment-fullmodal',
    templateUrl: './modify-payment-fullmodal.component.html',
    styleUrls: ['./modify-payment-fullmodal.component.scss'],
})
export class ModifyPaymentFullmodalComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
    @Input() visible: boolean
    @Input() curUser: CenterUser

    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() close = new EventEmitter<any>()
    @Output() finishModify = new EventEmitter<any>()

    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    public changed: boolean

    //
    public today = dayjs().format('YYYY.MM.DD')
    public center: Center
    public originalOrder = originalOrder

    constructor(private renderer: Renderer2, private storageService: StorageService, private nxStore: Store) {}

    ngOnInit(): void {
        this.center = this.storageService.getCenter()
    }
    ngOnDestroy(): void {}
    ngOnChanges(changes: SimpleChanges): void {
        console.log('ngOnChanges ;;; ', changes)
        if (changes['visible'] && !changes['visible'].firstChange) {
            if (changes['visible'].previousValue != changes['visible'].currentValue) {
                this.changed = true
            }
        }
    }
    ngAfterViewChecked(): void {
        if (this.changed) {
            this.changed = false

            if (this.visible) {
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)
            } else {
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
            }
        }
    }
}
