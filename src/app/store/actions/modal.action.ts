import { createAction, props } from '@ngrx/store'
import { ActionTypes } from '@appStore/actionTypes'
import { ModalData } from '@schemas/store/app/modal.interface'
import { Center } from '@schemas/center'
import { RoleModal } from '@schemas/store/app/modal.interface'
import { PermissionCategory } from '@schemas/permission-category'

import { ClickEmitterType } from '@schemas/components/button'

export const showModal = createAction(ActionTypes.SHOW_MODAL, props<{ data: ModalData }>())
export const hideModal = createAction(ActionTypes.HIDE_MODAL)

export const showRoleModal = createAction(
    '[App] Show Center Role Modal',
    props<{ center: Center; instPermissionCategs: Array<PermissionCategory> }>()
)
export const closeRoleModal = createAction('[App] Close Center Role Modal')
export const startCloseRoleModal = createAction(
    '[App] Start Close Center Role Modal',
    props<{ clickEmitter: ClickEmitterType; instPermissionCategs: Array<PermissionCategory>; center: Center }>()
)
export const finishCloseRoleModal = createAction('[App] Finish Close Center Role Modal')
