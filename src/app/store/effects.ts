import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, EMPTY } from 'rxjs'
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
            switchMap(({ clickEmitter, instPermissionCategs, center }) =>
                this.centerRolePermissionApi
                    .modifyCenterRolePermission(center.id, 'instructor', 'read_stats_sales', {
                        approved: instPermissionCategs
                            .find((v) => v.code == 'stats_sales')
                            .items.find((v) => v.code == 'read_stats_sales').approved,
                    })
                    .pipe(
                        switchMap(() => {
                            clickEmitter.hideLoading()
                            return [finishCloseRoleModal()]
                        })
                    )
            )
        )
    )
}
