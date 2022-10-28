import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, forkJoin } from 'rxjs'
import { catchError, switchMap, tap, map } from 'rxjs/operators'

import _ from 'lodash'

import { CenterUserListService } from '@services/helper/center-user-list.service'
import { CenterRolePermissionService } from '@services/center-role-permission.service'
import { StorageService } from '@services/storage.service'
import { CenterService } from '@services/center.service'

import * as centerCommonActions from '@centerStore/actions/center.common.actions'
import * as centerCommonSelector from '@centerStore/selectors/center.common.selector'

@Injectable()
export class CenterCommonEffect {
    constructor(
        private centerUserListApi: CenterUserListService,
        private store: Store,
        private actions$: Actions,
        private centerRolePermissionApi: CenterRolePermissionService,
        private centerApi: CenterService,
        private storageService: StorageService
    ) {}

    public getCenter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(centerCommonActions.startGetCurCenter),
            switchMap(({ centerId }) =>
                this.centerApi.getCenter(centerId).pipe(
                    switchMap((cc) => {
                        this.storageService.setCenter(cc)
                        return [centerCommonActions.finishGetCurCenter({ center: cc })]
                    })
                )
            )
        )
    )

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
            switchMap(({ centerId }) =>
                forkJoin([
                    this.centerRolePermissionApi.getCenterRolePermission(centerId, 'administrator'),
                    this.centerRolePermissionApi.getCenterRolePermission(centerId, 'instructor'),
                ]).pipe(
                    switchMap(([adminPCList, instPCList]) => {
                        console.log('getCenterPermission$ effect : ', adminPCList, ' -- ', instPCList)
                        return [
                            centerCommonActions.finishGetCenterPermission({
                                permissionObj: {
                                    administrator: adminPCList,
                                    instructor: instPCList,
                                },
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
                concatLatestFrom(() => [this.store.select(centerCommonSelector.centerPermission)]),
                switchMap(([{ centerId, permitObj, cb }, cpObj]) =>
                    forkJoin([
                        this.centerRolePermissionApi.modifyCenterRolePermission(
                            centerId,
                            'administrator',
                            'read_stats_sales',
                            {
                                approved: permitObj.administrator
                                    .find((v) => v.code == 'stats_sales')
                                    .items.find((v) => v.code == 'read_stats_sales').approved,
                            }
                        ),
                        this.centerRolePermissionApi.modifyCenterRolePermission(
                            centerId,
                            'administrator',
                            'delete_user_membership_payment',
                            {
                                approved: permitObj.administrator
                                    .find((v) => v.code == 'user_membership_payment')
                                    .items.find((v) => v.code == 'delete_user_membership_payment').approved,
                            }
                        ),
                        this.centerRolePermissionApi.modifyCenterRolePermission(
                            centerId,
                            'administrator',
                            'delete_user_locker_payment',
                            {
                                approved: permitObj.administrator
                                    .find((v) => v.code == 'user_membership_payment')
                                    .items.find((v) => v.code == 'delete_user_membership_payment').approved,
                            }
                        ),
                        this.centerRolePermissionApi.modifyCenterRolePermission(
                            centerId,
                            'instructor',
                            'read_stats_sales',
                            {
                                approved: permitObj.instructor
                                    .find((v) => v.code == 'stats_sales')
                                    .items.find((v) => v.code == 'read_stats_sales').approved,
                            }
                        ),
                        this.centerRolePermissionApi.modifyCenterRolePermission(
                            centerId,
                            'instructor',
                            'delete_user_locker_payment',
                            {
                                approved: permitObj.instructor
                                    .find((v) => v.code == 'user_membership_payment')
                                    .items.find((v) => v.code == 'delete_user_membership_payment').approved,
                            }
                        ),
                        this.centerRolePermissionApi.modifyCenterRolePermission(
                            centerId,
                            'instructor',
                            'delete_user_membership_payment',
                            {
                                approved: permitObj.instructor
                                    .find((v) => v.code == 'user_membership_payment')
                                    .items.find((v) => v.code == 'delete_user_membership_payment').approved,
                            }
                        ),
                    ]).pipe(
                        tap(() => {
                            cb ? cb() : null
                        })
                    )
                )
            ),
        { dispatch: false }
    )
}
