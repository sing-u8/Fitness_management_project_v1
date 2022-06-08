import { Component, Input, OnInit, OnDestroy, Renderer2, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { Subscription } from 'rxjs'
import _ from 'lodash'

// import { SalesData, Statistics } from '@schemas/sale'
import { StatsSales } from '@schemas/stats-sales'

// rxjs
import { Observable, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

// ngrx and store
import { Store, select } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'

import * as FromSale from '@centerStore/reducers/sec.sale.reducer'
import * as SaleSelector from '@centerStore/selectors/sec.sale.selector'
import * as SaleActions from '@centerStore/actions/sec.sale.actions'

@Component({
    selector: 'rw-sale-table',
    templateUrl: './sale-table.component.html',
    styleUrls: ['./sale-table.component.scss'],
})
export class SaleTableComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() saleData: Array<StatsSales>
    @Input() saleStatistics: FromSale.SaleStatistics = _.cloneDeep(FromSale.SaleStatisticsInit)
    @Input() showEmptyTableFlag: string

    @ViewChild('sale_table') sale_table_el: ElementRef
    public productNameWidth = 0
    public resizeUnlistener: () => void

    public unsubscriber$ = new Subject<void>()

    public isMemberOpen: boolean
    public isTypeOpen: boolean
    public isMembershipLockerOpen: boolean
    public isPersonInChargeOpen: boolean
    public isProductOpen: boolean

    public isFiltered: Record<FromSale.Filters, boolean>
    public typeChecks: {
        cur: FromSale.TypeCheck
        applied: FromSale.TypeCheck
    }
    public productChecks: {
        cur: FromSale.ProductCheck
        applied: FromSale.ProductCheck
    }
    public inputs: {
        member: { cur: string; applied: string }
        membershipLocker: { cur: string; applied: string }
        personInCharge: { cur: string; applied: string }
    }

    constructor(private nxStore: Store, private renderer: Renderer2) {
        this.isMemberOpen = false
        this.isTypeOpen = false
        this.isMembershipLockerOpen = false
        this.isPersonInChargeOpen = false
        this.isProductOpen = false

        this.isFiltered = { member: false, type: false, membershipLocker: false, personInCharge: false, product: false }
        this.typeChecks = {
            cur: { payment: true, refund: true, transfer: true },
            applied: { payment: true, refund: true, transfer: true },
        }
        this.productChecks = {
            cur: { locker: true, membership: true },
            applied: { locker: true, membership: true },
        }
        this.inputs = {
            member: { cur: '', applied: '' },
            membershipLocker: { cur: '', applied: '' },
            personInCharge: { cur: '', applied: '' },
        }

        this.nxStore.pipe(select(SaleSelector.isFiltered), takeUntil(this.unsubscriber$)).subscribe((_isFiltered) => {
            this.isFiltered = { ..._isFiltered }
        })

        this.nxStore.pipe(select(SaleSelector.typeCheck), takeUntil(this.unsubscriber$)).subscribe((_typeCheck) => {
            this.typeChecks.cur = _.cloneDeep(_typeCheck)
            this.typeChecks.applied = _.cloneDeep(_typeCheck)
        })
        this.nxStore
            .pipe(select(SaleSelector.productCheck), takeUntil(this.unsubscriber$))
            .subscribe((_productCheck) => {
                this.productChecks.cur = _.cloneDeep(_productCheck)
                this.productChecks.applied = _.cloneDeep(_productCheck)
            })
        this.nxStore.pipe(select(SaleSelector.inputs), takeUntil(this.unsubscriber$)).subscribe((_inputs) => {
            _.forEach(_.keys(_inputs), (v) => {
                this.inputs[v].cur = _inputs[v]
                this.inputs[v].applied = _inputs[v]
            })
        })
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.productNameWidth = this.sale_table_el.nativeElement.offsetWidth * 0.1335
        this.resizeUnlistener = this.renderer.listen('window', 'resize', (event) => {
            this.productNameWidth = this.sale_table_el.nativeElement.offsetWidth * 0.1335
        })
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next()
        this.unsubscriber$.complete()
        this.resizeUnlistener()
    }

    toggleMember(e) {
        this.isMemberOpen = !this.isMemberOpen

        this.closeMembershipLocker()
        this.closePersonInCharge()
        this.closeType()
        this.closeProduct()
        e.stopPropagation()
    }
    toggleType(e) {
        this.isTypeOpen = !this.isTypeOpen

        this.closeMember()
        this.closeMembershipLocker()
        this.closePersonInCharge()
        this.closeProduct()
        e.stopPropagation()
    }
    toggleMembershipLocker(e) {
        this.isMembershipLockerOpen = !this.isMembershipLockerOpen

        this.closePersonInCharge()
        this.closeType()
        this.closeMember()
        this.closeProduct()
        e.stopPropagation()
    }
    togglePersonInCharge(e) {
        this.isPersonInChargeOpen = !this.isPersonInChargeOpen

        this.closeMembershipLocker()
        this.closeType()
        this.closeMember()
        this.closePersonInCharge()
        e.stopPropagation()
    }
    toggleProduct(e) {
        this.isProductOpen = !this.isProductOpen

        this.closeMembershipLocker()
        this.closeType()
        this.closeMember()
        e.stopPropagation()
    }

    closeMember() {
        this.isMemberOpen = false
    }
    closeType() {
        this.isTypeOpen = false
    }
    closeMembershipLocker() {
        this.isMembershipLockerOpen = false
    }
    closePersonInCharge() {
        this.isPersonInChargeOpen = false
    }
    closeProduct() {
        this.isProductOpen = false
    }

    // typecheck box method
    toggleTypeCheckBox(type: FromSale.TypeCheckString) {
        this.typeChecks.cur[type] = !this.typeChecks.cur[type]
    }
    applyTypeCheckBox() {
        if (!this.typeChecks.cur.payment && !this.typeChecks.cur.refund && !this.typeChecks.cur.transfer) return

        this.nxStore.dispatch(SaleActions.setTypeCheck({ newState: this.typeChecks.cur }))
        this.checkTypeChecBoxFiltered()
        this.closeType()
    }
    restoreTypeCheckToApplied() {
        _.forEach(_.keys(this.typeChecks.cur), (v) => {
            this.typeChecks.cur[v] = this.typeChecks.applied[v]
        })
    }
    resetTypeChecBox() {
        this.nxStore.dispatch(SaleActions.setTypeCheck({ newState: { payment: true, refund: true, transfer: true } }))
        this.nxStore.dispatch(
            SaleActions.setIsFiltered({
                newState: {
                    type: false,
                },
            })
        )
    }
    checkTypeChecBoxFiltered() {
        this.isFiltered.type = _.some(this.typeChecks.applied, (v) => v == false) ? true : false
        this.nxStore.dispatch(
            SaleActions.setIsFiltered({
                newState: {
                    type: this.isFiltered.type,
                },
            })
        )
    }

    // productcheck box method
    toggleProductCheckBox(type: FromSale.ProductCheckString) {
        this.productChecks.cur[type] = !this.productChecks.cur[type]
    }
    applyProductCheckBox() {
        if (!this.productChecks.cur.membership && !this.productChecks.cur.locker) return

        this.nxStore.dispatch(SaleActions.setProductCheck({ newState: this.productChecks.cur }))
        this.checkProductChecBoxFiltered()
        this.closeProduct()
    }
    restoreProductCheckToApplied() {
        _.forEach(_.keys(this.productChecks.cur), (v) => {
            this.productChecks.cur[v] = this.productChecks.applied[v]
        })
    }
    resetProductChecBox() {
        this.nxStore.dispatch(SaleActions.setProductCheck({ newState: { membership: true, locker: true } }))
        this.nxStore.dispatch(
            SaleActions.setIsFiltered({
                newState: {
                    product: false,
                },
            })
        )
    }
    checkProductChecBoxFiltered() {
        this.isFiltered.product = _.some(this.productChecks.applied, (v) => v == false) ? true : false
        this.nxStore.dispatch(
            SaleActions.setIsFiltered({
                newState: {
                    product: this.isFiltered.product,
                },
            })
        )
    }

    // inputs method
    applyInput(type: FromSale.InputString) {
        this.inputs[type].cur = _.trim(this.inputs[type].cur)
        this.inputs[type].applied != this.inputs[type].cur
            ? this.nxStore.dispatch(SaleActions.setInputs({ newState: { [type]: this.inputs[type].cur } }))
            : null

        this.checkInputFiltered(type)
    }
    restoreInputToApplied(type: FromSale.InputString) {
        this.inputs[type].cur = this.inputs[type].applied
    }
    resetInput(type: FromSale.InputString) {
        this.nxStore.dispatch(SaleActions.setInputs({ newState: { [type]: '' } }))
        this.nxStore.dispatch(
            SaleActions.setIsFiltered({
                newState: {
                    [type]: false,
                },
            })
        )
    }
    checkInputFiltered(type: FromSale.InputString) {
        this.nxStore.dispatch(
            SaleActions.setIsFiltered({
                newState: {
                    [type]: this.inputs[type].applied.length > 0 ? true : false,
                },
            })
        )
    }
    // reset all tag
    resetAllTag() {
        this.nxStore.dispatch(SaleActions.setTypeCheck({ newState: { payment: true, refund: true, transfer: true } }))
        this.nxStore.dispatch(SaleActions.setProductCheck({ newState: { membership: true, locker: true } }))
        this.nxStore.dispatch(
            SaleActions.setInputs({ newState: { member: '', membershipLocker: '', personInCharge: '' } })
        )
        this.nxStore.dispatch(
            SaleActions.setIsFiltered({
                newState: {
                    member: false,
                    membershipLocker: false,
                    personInCharge: false,
                    type: false,
                    product: false,
                },
            })
        )
    }
}
