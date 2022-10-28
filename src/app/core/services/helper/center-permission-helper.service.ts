import { Injectable } from '@angular/core'

import { Center, RoleCode } from '@schemas/center'
import { Permission } from '@centerStore/reducers/center.common.reducer'
import * as CenterCommonSelector from '@centerStore/selectors/center.common.selector'
import { select, Store } from '@ngrx/store'
import { take, takeUntil } from 'rxjs/operators'

import _ from 'lodash'

@Injectable({
    providedIn: 'root',
})
export class CenterPermissionHelperService {
    public center: Center
    public permissions: Permission = {
        administrator: [],
        instructor: [],
    }
    constructor(private nxStore: Store) {}

    getSettingPermission() {
        let approved = false
        this.nxStore.pipe(select(CenterCommonSelector.curCenter), take(1)).subscribe((cc) => {
            this.center = cc
        })
        this.nxStore.pipe(select(CenterCommonSelector.centerPermission), take(1)).subscribe((cp) => {
            this.permissions = {
                administrator: cp.administrator,
                instructor: cp.instructor,
            }
            switch (this.center.role_code) {
                case 'owner':
                    approved = true
                    break
                case 'instructor':
                case 'administrator':
                    approved = false
                    break
                default:
                    approved = false
                    break
            }
        })
        return approved
    }

    getRemovePaymentHistoryPermission() {
        let approved = false
        this.nxStore.pipe(select(CenterCommonSelector.curCenter), take(1)).subscribe((cc) => {
            this.center = cc
        })
        this.nxStore.pipe(select(CenterCommonSelector.centerPermission), take(1)).subscribe((cp) => {
            this.permissions = {
                administrator: cp.administrator,
                instructor: cp.instructor,
            }
            switch (this.center.role_code) {
                case 'owner':
                    approved = true
                    break
                case 'instructor':
                case 'administrator':
                    approved = this.permissions[this.center.role_code]
                        .find((v) => v.code == 'user_membership_payment')
                        .items.find((vi) => vi.code == 'delete_user_membership_payment').approved
                    break
                default:
                    approved = false
                    break
            }
        })
        return approved
    }

    getReceiveSalePermission() {
        let approved = false
        this.nxStore.pipe(select(CenterCommonSelector.curCenter), take(1)).subscribe((cc) => {
            this.center = cc
        })
        this.nxStore.pipe(select(CenterCommonSelector.centerPermission), take(1)).subscribe((cp) => {
            this.permissions = {
                administrator: cp.administrator,
                instructor: cp.instructor,
            }
            switch (this.center.role_code) {
                case 'owner':
                    approved = true
                    break
                case 'instructor':
                case 'administrator':
                    approved = this.permissions[this.center.role_code]
                        .find((v) => v?.code == 'stats_sales')
                        ?.items.find((vi) => vi.code == 'read_stats_sales').approved
                    break
                default:
                    approved = false
                    break
            }
        })
        return approved
    }
}
