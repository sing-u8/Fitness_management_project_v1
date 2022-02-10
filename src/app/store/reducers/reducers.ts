import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'

import { AppStateInterface } from '@schemas/store/app/appState.interface'

import { showToast, hideToast } from '@appStore/actions/toast.action'
import { openDrawer, closeDrawer } from '@appStore/actions/drawer.action'
import { showModal, hideModal } from '@appStore/actions/modal.action'
import { setRegistration, removeRegistration } from '@appStore/actions/registration.action'
import { debugLog } from '@appStore/actions/log.action'

import { environment } from '@environments/environment'

export const appFeatureKey = 'app'

const initialState: AppStateInterface = {
    toast: { visible: false, text: '' },
    drawer: { tabName: 'none' },
    modal: {
        isVisible: false,
        data: {
            text: '',
            subText: '',
            cancelButtonText: '',
            confirmButtonText: '',
        },
    },
    registration: {
        service_terms: false,
        privacy: false,
        email_marketing: false,
        sms_marketing: false,
        regCompleted: false,
        name: undefined,
        email: undefined,
        emailValid: false,
        password: undefined,
        passwordValid: false,
    },
}

export const appReducer = createImmerReducer(
    initialState,
    on(showToast, (state, action): AppStateInterface => {
        state.toast.text = action.text
        state.toast.visible = true
        return state
    }),
    on(hideToast, (state): AppStateInterface => {
        state.toast.text = undefined
        state.toast.visible = false
        return state
    }),
    // ------------------------------------------------------------------------------------//
    on(openDrawer, (state, action): AppStateInterface => {
        state.drawer.tabName = action.tabName
        return state
    }),
    on(closeDrawer, (state): AppStateInterface => {
        state.drawer.tabName = 'none'
        return state
    }),
    // ------------------------------------------------------------------------------------//
    on(showModal, (state, action): AppStateInterface => {
        state.modal.isVisible = true
        state.modal.data = action.data
        return state
    }),
    on(hideModal, (state): AppStateInterface => {
        state.modal.isVisible = false
        state.modal.data = undefined
        return state
    }),
    // ------------------------------------------------------------------------------------//
    on(setRegistration, (state, action): AppStateInterface => {
        state.registration = { ...state.registration, ...action.registration }
        return state
    }),
    on(removeRegistration, (state): AppStateInterface => {
        state.registration = {
            service_terms: false,
            privacy: false,
            email_marketing: false,
            sms_marketing: false,
            regCompleted: false,
            name: undefined,
            email: undefined,
            emailValid: false,
            password: undefined,
            passwordValid: false,
        }
        return state
    }),
    // -------------------------------------------------------------------------------------//
    on(debugLog, (state, action): AppStateInterface => {
        if (environment.production == false) {
            console.log('DEBUG LOGGER : \n', ...action.log)
        }
        return state
    })
)
