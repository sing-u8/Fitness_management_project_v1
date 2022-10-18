import { Component, OnInit, OnDestroy } from '@angular/core'

import { Drawer } from '@schemas/store/app/drawer.interface'
// rxjs
import { Observable, Subject } from 'rxjs'

// ngrx
import { Store, select } from '@ngrx/store'
import { drawerSelector } from '@appStore/selectors'
import * as DashboardSelector from '@centerStore/selectors/sec.dashboard.selector'
import * as DashboardReducer from '@centerStore/reducers/sec.dashboard.reducer'
import * as DashboardAction from '@centerStore/actions/sec.dashboard.actions'
import { takeUntil } from 'rxjs/operators'

import _ from 'lodash'

@Component({
    selector: 'center',
    templateUrl: './center.component.html',
    styleUrls: ['./center.component.scss'],
})
export class CenterComponent implements OnInit, OnDestroy {
    public drawer$: Observable<Drawer>
    public attendanceToast$: Observable<DashboardReducer.AttendanceToast> = this.nxStore.select(
        DashboardSelector.attendanceToast
    )

    public attendanceToast = _.cloneDeep(DashboardReducer.AttendanceToastInit)

    public unsubscribe$ = new Subject<boolean>()

    constructor(private nxStore: Store) {}

    ngOnInit(): void {
        this.drawer$ = this.nxStore.pipe(select(drawerSelector))
        this.attendanceToast$.pipe(takeUntil(this.unsubscribe$)).subscribe((at) => {
            this.attendanceToast = at
        })
    }
    ngOnDestroy() {
        this.unsubscribe$.next(true)
        this.unsubscribe$.complete()
    }

    onCancelToastModal() {
        this.nxStore.dispatch(DashboardAction.showAttendanceToast({ visible: false, centerUser: undefined }))
    }
}
