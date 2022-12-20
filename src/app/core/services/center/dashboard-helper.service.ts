import { Injectable } from '@angular/core'

import { CenterUser } from '@schemas/center-user'

import _ from 'lodash'

// ngrx
import { select, Store } from '@ngrx/store'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import { MemberSelectCateg } from '@centerStore/reducers/sec.dashboard.reducer'
import * as DashboardSelector from '@centerStore/selectors/sec.dashboard.selector'
import { take } from 'rxjs/operators'

@Injectable({
    providedIn: 'root',
})
export class DashboardHelperService {
    constructor(private nxStore: Store) {}

    refreshCurUser(centerId: string, centerUser: CenterUser) {
        this.nxStore.pipe(select(DashboardSelector.curCenterId), take(1)).subscribe((curCenterId) => {
            if (!_.isEmpty(curCenterId) && curCenterId == centerId) {
                this.nxStore.dispatch(DashboardActions.startGetUserData({ centerId, centerUser }))
                this.nxStore.dispatch(DashboardActions.startGetUsersByCategory({ centerId }))
                this.nxStore.dispatch(DashboardActions.startRefreshCenterUser({ centerId, centerUser }))
            }
        })
    }
    refreshUserList(centerId: string, centerUser: CenterUser, categ_type: MemberSelectCateg) {
        this.nxStore.dispatch(DashboardActions.startGetUsersByCategory({ centerId }))
        this.nxStore.dispatch(DashboardActions.startGetUserList({ centerId, categ_type }))
    }

    refreshDrawerCurUser(centerId: string, centerUser: CenterUser) {
        this.nxStore.pipe(select(DashboardSelector.drawerCurCenterId), take(1)).subscribe((dwCurCenterId) => {
            if (!_.isEmpty(dwCurCenterId) && dwCurCenterId == centerId) {
                this.nxStore.dispatch(DashboardActions.refreshDrawerCurUser({ centerUser }))
                this.nxStore.dispatch(DashboardActions.startGetDrawerUsersByCategory({ centerId }))
                this.nxStore.dispatch(DashboardActions.startRefreshDrawerCenterUser({ centerId, centerUser }))
            }
        })
    }

    // synchronize
    // // by locker
    synchronizeUserLocker(centerId: string, userId: string) {
        this.nxStore.dispatch(DashboardActions.startSynchronizeUserLocker({ centerId, userId }))
    }
    // // by check in
    synchronizeCheckIn(centerId: string, centerUser: CenterUser) {
        this.nxStore.dispatch(DashboardActions.startGetUsersByCategory({ centerId }))
        this.nxStore.dispatch(DashboardActions.synchronizeCheckIn({ centerId, centerUser }))
    }
    synchronizeCheckInDrawer(centerId: string, centerUser: CenterUser) {
        this.nxStore.dispatch(DashboardActions.startGetDrawerUsersByCategory({ centerId }))
        this.nxStore.dispatch(DashboardActions.synchronizeCheckInDrawer({ centerId, centerUser }))
    }
    synchronizeRemoveCheckIn(centerId: string, centerUser: CenterUser) {
        this.nxStore.dispatch(DashboardActions.startGetUsersByCategory({ centerId }))
        this.nxStore.dispatch(DashboardActions.synchronizeRemoveCheckIn({ centerId, centerUser }))
    }
    synchronizeRemoveCheckInDrawer(centerId: string, centerUser: CenterUser) {
        this.nxStore.dispatch(DashboardActions.startGetDrawerUsersByCategory({ centerId }))
        this.nxStore.dispatch(DashboardActions.synchronizeRemoveCheckInDrawer({ centerId, centerUser }))
    }
}
