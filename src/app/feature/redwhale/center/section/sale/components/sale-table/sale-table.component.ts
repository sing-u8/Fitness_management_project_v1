import { Component, Input, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import _ from 'lodash'

import { SalesData, Statistics } from '@schemas/sale'

import { GymSaleStateService, Inputs, TypeCheck, Filters } from '@services/etc/gym-sale-state.service'

@Component({
    selector: 'rw-sale-table',
    templateUrl: './sale-table.component.html',
    styleUrls: ['./sale-table.component.scss'],
})
export class SaleTableComponent implements OnInit, OnDestroy {
    @Input() saleData: Array<SalesData>
    @Input() saleStatistics: Statistics
    @Input() showEmptyTableFlag: string

    isFilteredSubscription: Subscription
    typeCheckSubscription: Subscription
    inputsSubscription: Subscription

    public isMemberOpen: boolean
    public isTypeOpen: boolean
    public isMembershipLockerOpen: boolean
    public isPersonInChargeOpen: boolean

    public isFiltered: Record<Filters, boolean> // { member: boolean; type: boolean; membershipLocker: boolean; personInCharge: boolean }
    public typeChecks: {
        cur: Record<TypeCheck, boolean> // { onetoone: boolean; group: boolean; locker: boolean }
        applied: Record<TypeCheck, boolean> // { onetoone: boolean; group: boolean; locker: boolean }
    }
    public inputs: {
        member: { cur: string; applied: string }
        membershipLocker: { cur: string; applied: string }
        personInCharge: { cur: string; applied: string }
    }

    constructor(private gymSaleState: GymSaleStateService) {
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

        this.isFilteredSubscription = gymSaleState.selectIsFiltered().subscribe((_isFiltered) => {
            this.isFiltered = { ..._isFiltered }
            // console.log('_isFiltered select: ', _isFiltered, this.isFiltered)
        })
        this.typeCheckSubscription = gymSaleState.selectTypeCheck().subscribe((_typeCheck) => {
            // console.log('_typeCheck select: ', _typeCheck)
            this.typeChecks.cur = { ..._typeCheck }
            this.typeChecks.applied = { ..._typeCheck }
        })
        this.inputsSubscription = gymSaleState.selectInputs().subscribe((_inputs) => {
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
        this.isFilteredSubscription.unsubscribe()
        this.typeCheckSubscription.unsubscribe()
        this.inputsSubscription.unsubscribe()
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
    toggleTypeCheckBox(type: TypeCheck) {
        this.typeChecks.cur[type] = !this.typeChecks.cur[type]
    }
    applyTypeCheckBox() {
        if (!this.typeChecks.cur.membership && !this.typeChecks.cur.locker) return

        this.gymSaleState.setTypeCheck(this.typeChecks.cur)
        this.checkTypeChecBoxFiltered()
        this.closeType()
    }
    restoreTypeCheckToApplied() {
        _.forEach(_.keys(this.typeChecks.cur), (v) => {
            this.typeChecks.cur[v] = this.typeChecks.applied[v]
        })
    }
    resetTypeChecBox() {
        this.gymSaleState.setTypeCheck({ membership: true, locker: true })
        this.gymSaleState.setIsFiltered({ type: false })
    }
    checkTypeChecBoxFiltered() {
        console.log('checkTypeChecBoxFiltered: this.typeChecks.applied - ', this.typeChecks.applied)
        this.isFiltered.type = _.some(this.typeChecks.applied, (v) => v == false) ? true : false
        this.gymSaleState.setIsFiltered({ type: this.isFiltered.type })
    }

    // inputs method
    applyInput(type: Inputs) {
        console.log(
            'cur  applied  state: ',
            this.inputs[type].cur,
            this.inputs[type].applied,
            this.gymSaleState.inputs[type]
        )
        this.inputs[type].cur = _.trim(this.inputs[type].cur)
        this.inputs[type].applied != this.inputs[type].cur
            ? this.gymSaleState.setInputs({ [type]: this.inputs[type].cur })
            : null

        this.checkInputFiltered(type)
    }
    restoreInputToApplied(type: Inputs) {
        this.inputs[type].cur = this.inputs[type].applied
    }
    resetInput(type: Inputs) {
        this.gymSaleState.setInputs({ [type]: '' })
        this.gymSaleState.setIsFiltered({ [type]: false })
    }
    checkInputFiltered(type: Inputs) {
        console.log('checkInputFiltered: ', this.inputs[type].applied)
        this.gymSaleState.setIsFiltered({ [type]: this.inputs[type].applied.length > 0 ? true : false })
    }
    // reset all tag
    resetAllTag() {
        this.gymSaleState.setInputs({ member: '', membershipLocker: '', personInCharge: '' })
        this.gymSaleState.setTypeCheck({ membership: true, locker: true })
        this.gymSaleState.setIsFiltered({ member: false, membershipLocker: false, personInCharge: false, type: false })
    }
}
