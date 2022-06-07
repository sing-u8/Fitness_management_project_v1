import { Component, Input, OnInit, OnDestroy } from '@angular/core'
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
export class SaleTableComponent implements OnInit, OnDestroy {
    @Input() saleData: Array<StatsSales>
    @Input() saleStatistics: { total: number; cash: number; card: number; trans: number; unpaid: number } = {
        total: 0,
        cash: 0,
        card: 0,
        trans: 0,
        unpaid: 0,
    }
    @Input() showEmptyTableFlag: string

    public unsubscriber$ = new Subject<void>()

    public isMemberOpen: boolean
    public isTypeOpen: boolean
    public isMembershipLockerOpen: boolean
    public isPersonInChargeOpen: boolean

    public isFiltered: Record<FromSale.Filters, boolean>
    public typeChecks: {
        cur: FromSale.TypeCheck
        applied: FromSale.TypeCheck
    }
    public inputs: {
        member: { cur: string; applied: string }
        membershipLocker: { cur: string; applied: string }
        personInCharge: { cur: string; applied: string }
    }

    constructor(private nxStore: Store) {
        this.isMemberOpen = false
        this.isTypeOpen = false
        this.isMembershipLockerOpen = false
        this.isPersonInChargeOpen = false

        this.isFiltered = { member: false, type: false, membershipLocker: false, personInCharge: false }
        this.typeChecks = {
            cur: { membership: true, locker: true },
            applied: { membership: true, locker: true },
        }
        this.inputs = {
            member: { cur: '', applied: '' },
            membershipLocker: { cur: '', applied: '' },
            personInCharge: { cur: '', applied: '' },
        }

        this.nxStore.pipe(select(SaleSelector.isFiltered), takeUntil(this.unsubscriber$)).subscribe((_isFiltered) => {
            this.isFiltered = { ..._isFiltered }
            // console.log('_isFiltered select: ', _isFiltered, this.isFiltered)
        })

        this.nxStore.pipe(select(SaleSelector.typeCheck), takeUntil(this.unsubscriber$)).subscribe((_typeCheck) => {
            // console.log('_typeCheck select: ', _typeCheck)
            this.typeChecks.cur = _.cloneDeep(_typeCheck)
            this.typeChecks.applied = _.cloneDeep(_typeCheck)
        })
        this.nxStore.pipe(select(SaleSelector.inputs), takeUntil(this.unsubscriber$)).subscribe((_inputs) => {
            console.log('_inputs select: ', _inputs)
            _.forEach(_.keys(_inputs), (v) => {
                this.inputs[v].cur = _inputs[v]
                this.inputs[v].applied = _inputs[v]
            })
        })
    }

    ngOnInit(): void {
        // this.data = dummyData
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next()
        this.unsubscriber$.complete()
    }

    toggleMember(e) {
        this.isMemberOpen = !this.isMemberOpen

        this.closeMembershipLocker()
        this.closePersonInCharge()
        this.closeType()
        e.stopPropagation()
    }
    toggleType(e) {
        this.isTypeOpen = !this.isTypeOpen

        this.closeMember()
        this.closeMembershipLocker()
        this.closePersonInCharge()
        e.stopPropagation()
    }
    toggleMembershipLocker(e) {
        this.isMembershipLockerOpen = !this.isMembershipLockerOpen

        this.closePersonInCharge()
        this.closeType()
        this.closeMember()
        e.stopPropagation()
    }
    togglePersonInCharge(e) {
        this.isPersonInChargeOpen = !this.isPersonInChargeOpen

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

    // typecheck box method
    toggleTypeCheckBox(type: FromSale.TypeCheckString) {
        this.typeChecks.cur[type] = !this.typeChecks.cur[type]
    }
    applyTypeCheckBox() {
        if (!this.typeChecks.cur.membership && !this.typeChecks.cur.locker) return

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
        this.nxStore.dispatch(SaleActions.setTypeCheck({ newState: { membership: true, locker: true } }))
        this.nxStore.dispatch(
            SaleActions.setIsFiltered({
                newState: {
                    type: false,
                },
            })
        )
    }
    checkTypeChecBoxFiltered() {
        console.log('checkTypeChecBoxFiltered: this.typeChecks.applied - ', this.typeChecks.applied)
        this.isFiltered.type = _.some(this.typeChecks.applied, (v) => v == false) ? true : false
        this.nxStore.dispatch(
            SaleActions.setIsFiltered({
                newState: {
                    type: this.isFiltered.type,
                },
            })
        )
    }

    // inputs method
    applyInput(type: FromSale.InputString) {
        console.log('cur  applied  state: ', this.inputs[type].cur, this.inputs[type].applied)

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
        console.log('checkInputFiltered: ', this.inputs[type].applied)
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
        this.nxStore.dispatch(SaleActions.setTypeCheck({ newState: { membership: true, locker: true } }))
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
                },
            })
        )
    }
}
