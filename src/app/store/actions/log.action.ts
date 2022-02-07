import { createAction, props } from '@ngrx/store'

import { ActionTypes } from '@appStore/actionTypes'

export const debugLog = createAction(ActionTypes.LOG, props<{ log: Array<any> }>())
