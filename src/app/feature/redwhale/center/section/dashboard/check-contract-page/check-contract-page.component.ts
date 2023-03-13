import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Renderer2, AfterViewChecked } from '@angular/core'

import dayjs from 'dayjs'

import { originalOrder } from '@helpers/pipe/keyvalue'
import { StorageService } from '@services/storage.service'

// component store
import { Store } from '@ngrx/store'
import { CheckContractPageStore } from './componentStore/check-contract-page.store'
import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { Contract } from '@schemas/contract'
import { Router } from '@angular/router'

@Component({
    selector: 'db-check-contract-page',
    templateUrl: './check-contract-page.component.html',
    styleUrls: ['./check-contract-page.component.scss'],
    providers: [CheckContractPageStore],
})
export class CheckContractPageComponent implements OnInit, AfterViewChecked, OnDestroy {
    public curUser: CenterUser
    public curContract: Contract

    @ViewChild('modalWrapperElement') modalWrapperElement: ElementRef
    @ViewChild('terms') termsElement: ElementRef
    @ViewChild('terms_memo') termsMemoElement: ElementRef

    public today = dayjs().format('YYYY.MM.DD')
    public center: Center
    public originalOrder = originalOrder

    public loading$ = this.cmpStore.loading$
    public contractUserMembershipItems$ = this.cmpStore.contractUserMembershipItems$
    public contractUserLockerItems$ = this.cmpStore.contractUserLockerItems$
    public totalSum$ = this.cmpStore.totalSum$
    public totalPrice$ = this.cmpStore.totalPrice$

    constructor(
        private renderer: Renderer2,
        private readonly cmpStore: CheckContractPageStore,
        private storageService: StorageService,
        private nxStore: Store,
        private router: Router
    ) {
        this.center = this.storageService.getCenter()
        const routerState = this.router.getCurrentNavigation().extras.state
        this.curUser = routerState['curUser']
        this.curContract = routerState['curContract']
        this.cmpStore.getContractData({
            centerId: this.center.id,
            userId: this.curUser.id,
            contractId: this.curContract.id,
        })
    }

    ngOnInit(): void {}
    ngOnDestroy() {}
    exitPage() {
        this.router.navigate([this.center.address, 'dashboard'])
    }

    ngAfterViewChecked() {
        if (this.termsElement) {
            this.renderer.setStyle(
                this.termsElement.nativeElement,
                'height',
                `${this.termsElement.nativeElement.scrollHeight + 10}px`
            )
        }
        if (this.termsMemoElement) {
            this.renderer.setStyle(
                this.termsMemoElement.nativeElement,
                'height',
                `${this.termsMemoElement.nativeElement.scrollHeight + 10}px`
            )
        }
    }

    // fullmodal vars and funcs
    closeModal() {
        this.exitPage()
    }
}
