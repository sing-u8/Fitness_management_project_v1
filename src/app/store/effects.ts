import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, EMPTY, forkJoin } from 'rxjs'
import { catchError, switchMap, tap, map, filter } from 'rxjs/operators'

import { CenterRolePermissionService } from '@services/center-role-permission.service'

import { startCloseRoleModal, finishCloseRoleModal } from '@appStore/actions/modal.action'

@Injectable()
export class AppEffect {
    constructor(
        private actions$: Actions,
        private nxStore: Store,
        private centerRolePermissionApi: CenterRolePermissionService
    ) {}

    public closeRoleModal$ = createEffect(() =>
        this.actions$.pipe(
            ofType(startCloseRoleModal),
            switchMap(({ clickEmitter, permissionCategObj, center }) =>
                forkJoin([
                    this.centerRolePermissionApi.modifyCenterRolePermission(
                        center.id,
                        'administrator',
                        'read_stats_sales',
                        {
                            approved: permissionCategObj.administrator
                                .find((v) => v.code == 'stats_sales')
                                .items.find((v) => v.code == 'read_stats_sales').approved,
                        }
                    ),
                    this.centerRolePermissionApi.modifyCenterRolePermission(
                        center.id,
                        'administrator',
                        'delete_user_membership_payment',
                        {
                            approved: permissionCategObj.administrator
                                .find((v) => v.code == 'user_membership_payment')
                                .items.find((v) => v.code == 'delete_user_membership_payment').approved,
                        }
                    ),
                    this.centerRolePermissionApi.modifyCenterRolePermission(
                        center.id,
                        'administrator',
                        'delete_user_locker_payment',
                        {
                            approved: permissionCategObj.administrator
                                .find((v) => v.code == 'user_membership_payment')
                                .items.find((v) => v.code == 'delete_user_membership_payment').approved,
                        }
                    ),
                    this.centerRolePermissionApi.modifyCenterRolePermission(
                        center.id,
                        'instructor',
                        'read_stats_sales',
                        {
                            approved: permissionCategObj.instructor
                                .find((v) => v.code == 'stats_sales')
                                .items.find((v) => v.code == 'read_stats_sales').approved,
                        }
                    ),
                    this.centerRolePermissionApi.modifyCenterRolePermission(
                        center.id,
                        'instructor',
                        'delete_user_locker_payment',
                        {
                            approved: permissionCategObj.instructor
                                .find((v) => v.code == 'user_membership_payment')
                                .items.find((v) => v.code == 'delete_user_membership_payment').approved,
                        }
                    ),
                    this.centerRolePermissionApi.modifyCenterRolePermission(
                        center.id,
                        'instructor',
                        'delete_user_membership_payment',
                        {
                            approved: permissionCategObj.instructor
                                .find((v) => v.code == 'user_membership_payment')
                                .items.find((v) => v.code == 'delete_user_membership_payment').approved,
                        }
                    ),
                ]).pipe(
                    switchMap(() => {
                        clickEmitter.hideLoading()
                        return [finishCloseRoleModal()]
                    })
                )
            )
        )
    )
}
