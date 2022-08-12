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

// component store
import { Store } from '@ngrx/store'
import { CheckContractFullmodalStore, stateInit } from './componentStore/check-contract-fullmodal.store'
import { Observable } from 'rxjs'

import { ContractPayment } from '@schemas/contract-payment'
import { ContractUserLocker } from '@schemas/contract-user-locker'
import { ContractUserMembership } from '@schemas/contract-user-membership'
import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { Contract } from '@schemas/contract'

@Component({
    selector: 'db-check-contract-fullmodal',
    templateUrl: './check-contract-fullmodal.component.html',
    styleUrls: ['./check-contract-fullmodal.component.scss'],
    providers: [CheckContractFullmodalStore],
})
export class CheckContractFullmodalComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
    @Input() curUser: CenterUser
    @Input() curContract: Contract
    @Input() visible: boolean
    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() close = new EventEmitter<any>()

    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    @ViewChild('terms') termsElement: ElementRef

    public today = dayjs().format('YYYY.MM.DD')
    public changed: boolean
    public center: Center
    public originalOrder = originalOrder

    public loading$ = this.cmpStore.loading$
    public contractUserMembershipItems$ = this.cmpStore.contractUserMembershipItems$
    public contractUserLockerItems$ = this.cmpStore.contractUserLockerItems$
    public contractPayment$ = this.cmpStore.contractPayment$
    public totalSum$ = this.cmpStore.totalSum$
    public totalPrice$ = this.cmpStore.totalPrice$

    constructor(
        private renderer: Renderer2,
        private readonly cmpStore: CheckContractFullmodalStore,
        private storageService: StorageService,
        private nxStore: Store
    ) {
        this.center = this.storageService.getCenter()
    }

    ngOnInit(): void {}
    ngOnDestroy() {}
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
                this.renderer.addClass(this.modalWrapperElement.nativeElement, 'display-flex')
                setTimeout(() => {
                    this.renderer.addClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                }, 0)
                this.cmpStore.getContractData({
                    centerId: this.center.id,
                    userId: this.curUser.id,
                    contractId: this.curContract.id,
                })
                this.renderer.setStyle(
                    this.termsElement.nativeElement,
                    'height',
                    `${this.termsElement.nativeElement.scrollHeight + 10}px`
                )
            } else {
                this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'rw-modal-wrapper-show')
                setTimeout(() => {
                    this.renderer.removeClass(this.modalWrapperElement.nativeElement, 'display-flex')
                }, 200)
                this.cmpStore.resetAll()
            }
        }
    }

    // fullmodal vars and funcs
    closeModal() {
        this.close.emit()
    }
}
