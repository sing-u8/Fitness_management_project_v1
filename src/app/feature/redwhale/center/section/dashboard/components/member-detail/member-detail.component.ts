import { Component, OnInit, Input, Output } from '@angular/core'

import * as DashboardReducer from '@centerStore/reducers/sec.dashboard.reducer'
import _ from 'lodash'

@Component({
    selector: 'db-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.scss'],
})
export class MemberDetailComponent implements OnInit {
    @Input() curUserData: DashboardReducer.CurUseData = _.cloneDeep(DashboardReducer.CurUseDataInit)
    constructor() {}

    ngOnInit(): void {}
}
