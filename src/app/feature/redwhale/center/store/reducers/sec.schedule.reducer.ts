import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import _ from 'lodash'

// schema
import { Loading } from '@schemas/store/loading'

import * as ScheduleActions from '../actions/sec.schedule.actions'

export interface State {
    // common
    curCenterId: string
    isLoading: Loading
    error: string

    // main
}

export const initialState: State = {
    // main
    curCenterId: undefined,
    isLoading: 'idle',
    error: '',
    // main
}

export const scheduleReducer = createImmerReducer(initialState)
