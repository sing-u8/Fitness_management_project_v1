import { createAction, props } from '@ngrx/store'

import { ActionTypes } from '@appStore/actionTypes'
import { DrawerTypes, NoneType } from '@schemas/store/app/drawer.interface'

export const openDrawer = createAction(ActionTypes.OPEN_DRAWER, props<{ tabName: DrawerTypes }>())
export const closeDrawer = createAction(ActionTypes.CLOSE_DRAWER, props<{ tabName: NoneType }>())

export const setScheduleDrawerIsReset = createAction(ActionTypes.SET_SCHEDULE_IS_RESET, props<{ isReset: boolean }>())
