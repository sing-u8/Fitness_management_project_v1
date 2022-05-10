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
    count: {
        count: string
        infinite: boolean
    }
    // selectedLessonText: string
    // price: string
}
export const stateInit: State = {
    datepickFlag: { start: false, end: false },
    date: { startDate: '', endDate: '' },
    dayDiff: '',
    lessonItemList: [],
    count: { count: '0', infinite: false },
    // selectedLessonText: '',
    // price: '',
}

@Injectable()
export class ModifyMembershipFullmodalStore extends ComponentStore<State> {
    constructor(private nxStore: Store) {
        super(_.cloneDeep(stateInit))
    }

    resetAll() {
        this.setState((state) => _.cloneDeep(stateInit))
    }

    updateDateFlag = this.updater((state, update: { start: boolean; end: boolean }) => {
        state.datepickFlag = update
        return {
            ...state,
        }
    })

    updateDate = this.updater((state, update: { startDate: string; endDate: string }) => {
        state.date = update
        return {
            ...state,
        }
    })

    updateDayDiff = this.updater((state, update: string) => {
        state.dayDiff = update
        return {
            ...state,
        }
    })

    // updateLessonItemList = this.updater((state, update))

    updateCount = this.updater((state, update: { count: string; infinite: boolean }) => {
        state.count = update
        return {
            ...state,
        }
    })
}
