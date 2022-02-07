import { Injectable } from '@angular/core'

import { BehaviorSubject } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'

@Injectable({ providedIn: 'root' })
export class GlobalService {
    private registration: any = null

    public drawer: any = {
        tabName: '',
    }

    public modal: any = {
        data: {},
    }

    public toast: any = {
        visible: false,
        text: null,
    }

    public isGymChangedForNavState: BehaviorSubject<boolean>
    get isGymChangedForNav() {
        return this.isGymChangedForNavState.getValue()
    }
    setIsGymChangedForNav(newState: boolean) {
        this.isGymChangedForNavState.next(newState)
    }
    selectIsGymChangedForNav() {
        return this.isGymChangedForNavState.asObservable().pipe(distinctUntilChanged())
    }

    public getRegistration() {
        return this.registration
    }

    public setRegistration(obj: any) {
        this.registration = { ...this.registration, ...obj }
    }

    public removeRegistration() {
        this.registration = null
    }

    public resetScheduleDrawerState: BehaviorSubject<boolean>
    setResetScheduleDrawerState(newState: boolean) {
        this.resetScheduleDrawerState.next(newState)
    }
    selectResetScheduleDrawerState() {
        return this.resetScheduleDrawerState.asObservable().pipe(distinctUntilChanged())
    }

    public openDrawer(
        tabName:
            | 'member'
            | 'community'
            | 'notification'
            | 'general-schedule'
            | 'lesson-schedule'
            | 'modify-general-schedule'
            | 'modify-lesson-schedule'
    ) {
        this.drawer['tabName'] = tabName
    }

    public closeDrawer() {
        this.drawer['tabName'] = ''
    }

    public showModal(data: any) {
        this.modal['data'] = data
    }

    public hideModal() {
        this.modal['data'] = null
    }

    public showToast(text: string) {
        this.toast.visible = true
        this.toast.text = text
    }

    public hideToast() {
        this.toast.visible = false
    }

    constructor() {
        this.resetScheduleDrawerState = new BehaviorSubject<boolean>(false)
        this.isGymChangedForNavState = new BehaviorSubject<boolean>(false)
    }
}
