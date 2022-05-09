import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import _ from 'lodash'
// ngrx
import { Store } from '@ngrx/store'
import * as DashboardReducer from '@centerStore/reducers/sec.dashboard.reducer'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import * as DashboardSelector from '@centerStore/selectors/sec.dashoboard.selector'
import { showToast } from '@appStore/actions/toast.action'
@Component({
    selector: 'db-user-detail-reservation',
    templateUrl: './user-detail-reservation.component.html',
    styleUrls: ['./user-detail-reservation.component.scss'],
})
export class UserDetailReservationComponent implements OnInit {
    @Input() curUserData: DashboardReducer.CurUseData = _.cloneDeep(DashboardReducer.CurUseDataInit)

    @Output() onRegisterML = new EventEmitter<void>()
    constructor(private nxStore: Store) {}

    ngOnInit(): void {}
}
