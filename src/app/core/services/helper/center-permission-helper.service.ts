import { Injectable } from '@angular/core'

import { Center } from '@schemas/center'
import { Permission } from '@centerStore/reducers/center.common.reducer'
import * as CenterCommonSelector from '@centerStore/selectors/center.common.selector'
import { select, Store } from '@ngrx/store'
import { take } from 'rxjs/operators'

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
        return approved
    }

    getRemovePaymentHistoryPermission() {
        let approved = false
        this.nxStore.pipe(select(CenterCommonSelector.curCenterAndPermission), take(1)).subscribe((obj) => {
            this.center = obj.curCenter
            this.permissions = {
                administrator: obj.centerPermission.administrator,
                instructor: obj.centerPermission.instructor,
            }
            switch (this.center.role_code) {
                case 'owner':
                    approved = true
                    break
                case 'instructor':
                case 'administrator':
                    if (_.isEmpty(this.permissions[this.center.role_code])) break
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
        this.nxStore.pipe(select(CenterCommonSelector.curCenterAndPermission), take(1)).subscribe((obj) => {
            this.center = obj.curCenter
            this.permissions = {
                administrator: obj.centerPermission.administrator,
                instructor: obj.centerPermission.instructor,
            }

            switch (this.center.role_code) {
                case 'owner':
                    approved = true
                    break
                case 'instructor':
                case 'administrator':
                    if (_.isEmpty(this.permissions[this.center.role_code])) break
                    approved = this.permissions[this.center.role_code]
                        .find((v) => v.code == 'stats_sales')
                        .items.find((vi) => vi.code == 'read_stats_sales').approved
                    break
                default:
                    approved = false
                    break
            }
        })
        return approved
    }
}
