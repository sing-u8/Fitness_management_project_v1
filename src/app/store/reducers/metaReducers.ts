import { ActionReducer, MetaReducer } from '@ngrx/store'

import { environment } from '@environments/environment'

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
    if (environment.production == false) {
        return function (state, action) {
            console.log('|<--------------------------------------------------------------------||')
            console.log('NgRx debug - current action : ', action)
            console.log('NgRx debug - current state : ', state)
            console.log('||-------------------------------------------------------------------->|')
            return reducer(state, action)
        }
    }
    return function (state, action) {
        return reducer(state, action)
    }
}

export const metaReducers: MetaReducer<any>[] = [debug]
