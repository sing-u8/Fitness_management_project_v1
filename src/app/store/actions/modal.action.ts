import { createAction, props } from '@ngrx/store'
import { ActionTypes } from '@appStore/actionTypes'
import { ModalData } from '@schemas/store/app/modal.interface'

export const showModal = createAction(ActionTypes.SHOW_MODAL, props<{ data: ModalData }>())
export const hideModal = createAction(ActionTypes.HIDE_MODAL)
