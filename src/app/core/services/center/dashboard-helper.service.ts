import { Injectable } from '@angular/core'
import _ from 'lodash'

import { CenterUser } from '@schemas/center-user'

// ngrx
import { Store } from '@ngrx/store'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'

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
}
