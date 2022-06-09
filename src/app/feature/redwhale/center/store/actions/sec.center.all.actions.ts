import { Store } from '@ngrx/store'

import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import * as LessonActions from '@centerStore/actions/sec.lesson.actions'
import * as LockerActions from '@centerStore/actions/sec.locker.actions'
import * as MembershipActions from '@centerStore/actions/sec.membership.actions'
import * as SaleActions from '@centerStore/actions/sec.sale.actions'
import * as ScheduleActions from '@centerStore/actions/sec.schedule.actions'

export function resetAllState(nxStore: Store) {
    nxStore.dispatch(DashboardActions.resetAll())
    nxStore.dispatch(LessonActions.resetAll())
    nxStore.dispatch(LockerActions.resetAll())
    nxStore.dispatch(MembershipActions.resetAll())
    nxStore.dispatch(SaleActions.resetAll())
    nxStore.dispatch(ScheduleActions.resetAll())
}
