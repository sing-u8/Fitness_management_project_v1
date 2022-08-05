import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { WordService } from '@services/helper/word.service'
import { StorageService } from '@services/storage.service'
import { TimeService } from '@services/helper/time.service'
import { DashboardHelperService } from '@services/center/dashboard-helper.service'

import { Center } from '@schemas/center'

import _ from 'lodash'
import dayjs from 'dayjs'

// ngrx
import { Store } from '@ngrx/store'
import * as DashboardReducer from '@centerStore/reducers/sec.dashboard.reducer'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import { showToast } from '@appStore/actions/toast.action'

@Component({
    selector: 'db-user-detail-contract',
    templateUrl: './user-detail-contract.component.html',
    styleUrls: ['./user-detail-contract.component.scss'],
})
export class UserDetailContractComponent implements OnInit {
    @Input() curUserData: DashboardReducer.CurUseData = _.cloneDeep(DashboardReducer.CurUseDataInit)
    @Output() onRegisterML = new EventEmitter<void>()

    constructor(
        private nxStore: Store,
        private wordService: WordService,
        private storageService: StorageService,
        private timeService: TimeService,
        private dashboardHelper: DashboardHelperService
    ) {}

    ngOnInit(): void {}

    public center: Center = this.storageService.getCenter()
}
