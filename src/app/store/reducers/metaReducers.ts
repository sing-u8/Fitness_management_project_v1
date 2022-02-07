import { ActionReducer, MetaReducer } from '@ngrx/store'

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
    return function (state, action) {
        console.log('|<--------------------------------------------------------------------||')
        console.log('NgRx debug - current action : ', action)
        console.log('NgRx debug - current state : ', state)
        // console.log('NgRx debug - next state : ', reducer(state, action))
        console.log('||-------------------------------------------------------------------->|')
        return reducer(state, action)
    }
}

export const metaReducers: MetaReducer<any>[] = [debug]
