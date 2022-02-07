import { createAction, props } from '@ngrx/store'
import { ActionTypes } from '@appStore/actionTypes'

export const showToast = createAction(ActionTypes.SHOW_TOAST, props<{ text: string }>())
export const hideToast = createAction(ActionTypes.HIDE_TOAST)
