import { Injectable } from '@angular/core'
import _ from 'lodash'

import { CenterUser } from '@schemas/center-user'

// ngrx
import { Store } from '@ngrx/store'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import { MemberSelectCateg } from '@centerStore/reducers/sec.dashboard.reducer'
import { setDrawerCurUser } from '@centerStore/actions/sec.dashboard.actions'

@Injectable({
    providedIn: 'root',
})
export class DashboardHelperService {
    constructor(private nxStore: Store) {}

    refreshCurUser(centerId: string, centerUser: CenterUser) {
        this.nxStore.dispatch(DashboardActions.startGetUserData({ centerId, centerUser }))
        this.nxStore.dispatch(DashboardActions.startGetUsersByCategory({ centerId }))
        this.nxStore.dispatch(DashboardActions.startRefreshCenterUser({ centerId, centerUser }))
    }
    refreshUserList(centerId: string, centerUser: CenterUser, categ_type: MemberSelectCateg) {
        this.nxStore.dispatch(DashboardActions.startGetUsersByCategory({ centerId }))
        this.nxStore.dispatch(DashboardActions.startGetUserList({ centerId, categ_type }))
    }

    refreshDrawerCurUser(centerId: string, centerUser: CenterUser) {
        this.nxStore.dispatch(DashboardActions.refreshDrawerCurUser({ centerUser }))
        this.nxStore.dispatch(DashboardActions.startGetDrawerUsersByCategory({ centerId }))
        this.nxStore.dispatch(DashboardActions.startRefreshDrawerCenterUser({ centerId, centerUser }))
    }

    // synchronize
    // // by locker
    synchronizeUserLocker(centerId: string, userId: string) {
        this.nxStore.dispatch(DashboardActions.startSynchronizeUserLocker({ centerId, userId }))
    }
}
