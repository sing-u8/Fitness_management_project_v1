import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of } from 'rxjs'
import { catchError, switchMap, tap, map, find } from 'rxjs/operators'

import _ from 'lodash'

import { CenterUserListService } from '@services/helper/center-user-list.service'
import { CenterRolePermissionService } from '@services/center-role-permission.service'

import * as centerCommonActions from '@centerStore/actions/center.common.actions'

@Injectable()
export class CenterCommonEffect {
    constructor(
        private centerUserListApi: CenterUserListService,
        private store: Store,
        private actions$: Actions,
        private centerRolePermissionApi: CenterRolePermissionService
    ) {}

    public getInstructors$ = createEffect(() =>
        this.actions$.pipe(
            ofType(centerCommonActions.startGetInstructors),
            switchMap(({ centerId }) =>
                this.centerUserListApi.getCenterInstructorList(centerId).pipe(
                    map((instructors) => {
                        return centerCommonActions.finishGetInstructors({ instructors })
                    }),
                    catchError((err: string) => {
                        return of(centerCommonActions.error({ err }))
                    })
                )
            )
        )
    )

    public getMembers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(centerCommonActions.startGetMembers),
            switchMap(({ centerId }) =>
                this.centerUserListApi
                    .getCenterUserList(centerId, (v) => true)
                    .pipe(
                        map((members) => {
                            return centerCommonActions.finishGetMembers({ members })
                        }),
                        catchError((err: string) => {
                            return of(centerCommonActions.error({ err }))
                        })
                    )
            )
        )
    )

    public getCenterPermission$ = createEffect(() =>
        this.actions$.pipe(
            ofType(centerCommonActions.startGetCenterPermission),
            switchMap(({ roleCode, centerId }) =>
                this.centerRolePermissionApi.getCenterRolePermission(centerId, roleCode).pipe(
                    switchMap((permissionCategoryList) => {
                        return [
                            centerCommonActions.finishGetCenterPermission({
                                roleCode,
                                permissionCategoryList,
                            }),
                        ]
                    })
                )
            )
        )
    )

    public updateCenterPermission$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(centerCommonActions.startUpdateCenterPermission),
                switchMap(({ roleCode, centerId, permissionCode, permmissionKeyCode, permissionCategoryList, cb }) =>
                    this.centerRolePermissionApi
                        .modifyCenterRolePermission(centerId, roleCode, permissionCode, {
                            approved: permissionCategoryList
                                .find((v) => v.code == permmissionKeyCode)
                                .items.find((v) => v.code == permissionCode).approved,
                        })
                        .pipe(
                            tap(() => {
                                cb ? cb() : null
                            })
                        )
                )
            ),
        { dispatch: false }
    )
}
