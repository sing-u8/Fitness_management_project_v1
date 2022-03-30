import { Component, OnInit, AfterViewInit, OnDestroy, Renderer2, ViewChild, ElementRef } from '@angular/core'
import { FormBuilder, FormControl, ValidationErrors, AsyncValidatorFn, AbstractControl } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'

import _ from 'lodash'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
dayjs.locale('ko')

// rxjs
import { Observable, Subject } from 'rxjs'

// ngrx
import { Store, select } from '@ngrx/store'
import { drawerSelector } from '@appStore/selectors'
import { showToast } from '@appStore/actions/toast.action'

import * as FromDashboard from '@centerStore/reducers/sec.dashboard.reducer'
import * as DashboardSelector from '@centerStore/selectors/sec.dashoboard.selector'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}

    goToRegisterNewMember() {}
}
