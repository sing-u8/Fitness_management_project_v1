import { createAction, props } from '@ngrx/store'

import { ActionTypes } from '@appStore/actionTypes'
import { Registration } from '@schemas/store/app/registration.interface'

export const setRegistration = createAction(ActionTypes.SET_REGISTRATION, props<{ registration: Registration }>())
export const removeRegistration = createAction(ActionTypes.REMOVE_REGISTRATION)
