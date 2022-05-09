import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'

import { EMPTY, Observable, forkJoin } from 'rxjs'
import { filter, switchMap, tap, catchError, map, withLatestFrom } from 'rxjs/operators'

import _ from 'lodash'
import dayjs from 'dayjs'

import { ClassItem } from '@schemas/class-item'
import { CenterUser } from '@schemas/center-user'

// ngrx
import { Store } from '@ngrx/store'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import { showToast } from '@appStore/actions/toast.action'

export interface State {
    datepickFlag: { start: boolean; end: boolean }
    date: { startDate: string; endDate: string }
    dayDiff: string
    lessonItemList: Array<ClassItem>
    selectedLessonText: string
    price: string
    count: {
        count: string
        infinite: boolean
    }
    assignee: {
        name: string
        value: CenterUser
    }
}
export const stateInit: State = {
    datepickFlag: { start: false, end: false },
    date: { startDate: '', endDate: '' },
    dayDiff: '',
    lessonItemList: [],
    selectedLessonText: '',
    price: '',
    count: { count: '0', infinite: false },
    assignee: { name: '', value: undefined },
}

@Injectable()
export class ModifyMembershipFullmodalStore extends ComponentStore<State> {
    constructor(private nxStore: Store) {
        super(_.cloneDeep(stateInit))
    }
}
