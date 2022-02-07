import { createAction, props } from '@ngrx/store'

import { ActionTypes } from '@appStore/actionTypes'
import { DrawerTypes } from '@schemas/store/app/drawer.interface'

export const openDrawer = createAction(ActionTypes.OPEN_DRAWER, props<{ tabName: DrawerTypes }>())
export const closeDrawer = createAction(ActionTypes.CLOSE_DRAWER)
