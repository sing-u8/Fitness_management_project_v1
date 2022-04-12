import { createFeatureSelector, createSelector } from '@ngrx/store'

import { AppStateInterface } from '@schemas/store/app/appState.interface'

import { appFeatureKey } from '@appStore/reducers/reducers'

export const appFeatureSelector = createFeatureSelector<AppStateInterface>(appFeatureKey)

export const drawerSelector = createSelector(appFeatureSelector, (appState) => appState.drawer)
export const toastSelector = createSelector(appFeatureSelector, (appState) => appState.toast)
export const modalSelector = createSelector(appFeatureSelector, (appState) => appState.modal)
export const registrationSelector = createSelector(appFeatureSelector, (appState) => appState.registration)
export const scheduleIsResetSelector = createSelector(appFeatureSelector, (appState) => appState.scheduleDrawerIsReset)
