import { Injectable } from '@angular/core'
import _ from 'lodash'

import { CenterUser } from '@schemas/center-user'

// ngrx
import { Store } from '@ngrx/store'
import * as LockerActions from '@centerStore/actions/sec.locker.actions'
import * as FromLocker from '@centerStore/reducers/sec.locker.reducer'
import { LockerItem } from '@schemas/locker-item'
import { startSynchronizeCurUserLocker } from '@centerStore/actions/sec.locker.actions'

@Injectable({
    providedIn: 'root',
})
export class LockerHelperService {
    constructor(private nxStore: Store) {}
    // synchronize
    // // by dashboard
    synchronizeLockerItemList(centerId: string) {
        this.nxStore.dispatch(LockerActions.startSynchronizeLockerItemList({ centerId }))
    }
    synchronizeCurUserLocker(centerId: string, userId: string) {
        this.nxStore.dispatch(LockerActions.startSynchronizeCurUserLocker({ centerId, userId }))
    }
}
