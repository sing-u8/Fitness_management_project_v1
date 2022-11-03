import { Component, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { Auth, authState } from '@angular/fire/auth'
import { DeeplinkService } from '@services/deeplink.service'

// ngrx
import { Store, select } from '@ngrx/store'
import { modalSelector, toastSelector, roleModalSelector } from '@appStore/selectors'
import * as CenterCommonSelector from '@centerStore/selectors/center.common.selector'

import { hideModal } from '@appStore/actions/modal.action'
import { hideToast } from '@appStore/actions/toast.action'

// schemas
import { Modal } from '@schemas/store/app/modal.interface'
import { Toast } from '@schemas/store/app/toast.interface'
import { RoleModal } from '@schemas/store/app/modal.interface'
import { PermissionObj } from '@centerStore/reducers/center.common.reducer'

import _ from 'lodash'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {
    public unSubscriber$ = new Subject<void>()

    public modalState: Modal
    public toastState: Toast
    public roleModalState: RoleModal
    public centerPermissionState: PermissionObj

    constructor(private nxStore: Store, private deepLink: DeeplinkService, private fireAuth: Auth) {
        this.nxStore.pipe(select(modalSelector), takeUntil(this.unSubscriber$)).subscribe((modal) => {
            this.modalState = modal
        })
        this.nxStore.pipe(select(toastSelector), takeUntil(this.unSubscriber$)).subscribe((toast) => {
            this.toastState = toast
        })
        this.nxStore.pipe(select(roleModalSelector), takeUntil(this.unSubscriber$)).subscribe((roleModal) => {
            this.roleModalState = _.cloneDeep(roleModal)
            console.log('roleModalSelector -- ', this.roleModalState)
        })
        this.nxStore
            .pipe(select(CenterCommonSelector.centerPermission), takeUntil(this.unSubscriber$))
            .subscribe((cp) => {
                this.centerPermissionState = _.cloneDeep(cp)
            })
        // this.deepLink.launchAppWhenInMobile();
    }

    ngOnInit(): void {
        // this.fireAuth.setPersistence({ type: "SESSION" });
        // authState(this.fireAuth).subscribe();
    }

    ngOnDestroy(): void {
        this.unSubscriber$.next()
        this.unSubscriber$.complete()
    }

    hideModal() {
        this.nxStore.dispatch(hideModal())
    }
    hideToast() {
        this.nxStore.dispatch(hideToast())
    }
    //
}
