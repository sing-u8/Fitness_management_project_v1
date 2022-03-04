import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of, EMPTY } from 'rxjs'
import { catchError, switchMap, tap, map, filter } from 'rxjs/operators'
import * as MembershipActions from '../actions/sec.membership.actions'
import { MembershipCategoryState, SelectedMembership } from '../reducers/sec.membership.reducer'
import * as MembershipSelector from '../selectors/sec.membership.selector'

import * as LessonActions from '../actions/sec.lesson.actions'
import { showToast } from '@appStore/actions/toast.action'

import { CenterMembershipService } from '@services/center-membership.service'

import * as _ from 'lodash'

@Injectable()
export class membershipEffect {
    constructor(private actions$: Actions, private gymMembershipApi: CenterMembershipService, private store: Store) {}

    // membership category
    public loadMembershipCategs$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MembershipActions.startLoadMembershipCategs),
            switchMap(({ centerId }) =>
                this.gymMembershipApi.getCategoryList(centerId).pipe(
                    map((categs) => {
                        const categState = _.map(categs, (categ) => {
                            const _categState: MembershipCategoryState = {
                                ...categ,
                                isCategOpen: false,
                                initialInputOn: false,
                            }
                            return _categState
                        })
                        return MembershipActions.finishLoadMembershipCategs({ membershipCategState: categState })
                    }),
                    catchError((err: string) => of(MembershipActions.error({ error: err })))
                )
            )
        )
    )

    public addMembershipCateg = createEffect(() =>
        this.actions$.pipe(
            ofType(MembershipActions.startAddMembershipCateg),
            switchMap(({ centerId, categName }) =>
                this.gymMembershipApi.createCategory(centerId, { name: categName }).pipe(
                    map((categ) => MembershipActions.FinishAddMembershipCateg({ membershipCateg: categ })),
                    catchError((err: string) => of(MembershipActions.error({ error: err })))
                )
            )
        )
    )

    public removeMembershipCateg = createEffect(
        () =>
            this.actions$.pipe(
                ofType(MembershipActions.removeMembershipCateg),
                switchMap(({ id, centerId }) =>
                    this.gymMembershipApi.deleteCategory(centerId, id).pipe(
                        map(() => LessonActions.startUpsertState({ centerId: centerId })),
                        catchError((err: string) => of(MembershipActions.error({ error: err })))
                    )
                )
            )
        // { dispatch: false }
    )

    public changeMembershipCategName = createEffect(
        () =>
            this.actions$.pipe(
                ofType(MembershipActions.changeMembershipCategName),
                switchMap(({ centerId, id, categName }) =>
                    this.gymMembershipApi.updateCategory(centerId, id, { name: categName }).pipe(
                        map(() => LessonActions.startUpsertState({ centerId: centerId })),
                        catchError((err: string) => of(MembershipActions.error({ error: err })))
                    )
                )
            )
        // { dispatch: false }
    )

    // categ data

    public updateCategMembership = createEffect(() =>
        this.actions$.pipe(
            ofType(MembershipActions.startAddMembershipToCateg),
            switchMap(({ centerId, categId, categName, reqBody }) =>
                this.gymMembershipApi.createItem(centerId, categId, reqBody).pipe(
                    switchMap((newItem) => [
                        MembershipActions.finishiAddMembershipToCateg({
                            categId: categId,
                            newMembershipData: newItem,
                        }),
                        MembershipActions.setSelectedMembership({
                            selectedMembership: {
                                centerId: centerId,
                                categId: categId,
                                categName: categName,
                                membershipData: newItem,
                            },
                        }),
                    ]),
                    catchError((err: string) => of(MembershipActions.error({ error: err })))
                )
            )
        )
    )

    // selected membership
    public updateSelectedMembership$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MembershipActions.updateSelectedMembership),
            switchMap(({ selectedMembership, reqBody, updateType }) => {
                return this.gymMembershipApi
                    .updateItem(
                        selectedMembership.centerId,
                        selectedMembership.categId,
                        selectedMembership.membershipData.id,
                        reqBody
                    )
                    .pipe(
                        catchError((err: string) =>
                            of(MembershipActions.error({ error: 'update selectedMembership err : ' + err }))
                        ),
                        concatLatestFrom(() => this.store.select(MembershipSelector.membershipCategEntities)),
                        switchMap(([action, memCategEn]) =>
                            this.gymMembershipApi.getCategoryList(selectedMembership.centerId).pipe(
                                map((categs) => {
                                    const categState = _.map(categs, (categ) => {
                                        const _categState: MembershipCategoryState = {
                                            ...categ,
                                            isCategOpen: memCategEn[categ.id].isCategOpen,
                                            initialInputOn: false,
                                        }
                                        return _categState
                                    })
                                    return categState
                                }),
                                concatLatestFrom(() => this.store.select(MembershipSelector.currentCenter)),
                                switchMap(([memCategState, curGym]) => {
                                    if (updateType == 'RemoveReservationLesson') {
                                        return [
                                            MembershipActions.updateMembershipCategs({
                                                membershipCategState: memCategState,
                                            }),
                                            LessonActions.startUpsertState({ centerId: curGym }),
                                            showToast({ text: '예약 가능한 수업 1개가 삭제되었습니다.' }),
                                        ]
                                    } else {
                                        return [
                                            MembershipActions.updateMembershipCategs({
                                                membershipCategState: memCategState,
                                            }),
                                            LessonActions.startUpsertState({ centerId: curGym }),
                                        ]
                                    }
                                })
                            )
                        )
                    )
            })
        )
    )

    public removeSelectedMembership$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MembershipActions.removeSelectedMembership),
            switchMap(({ selectedMembership }) =>
                this.gymMembershipApi
                    .deleteItem(
                        selectedMembership.centerId,
                        selectedMembership.categId,
                        selectedMembership.membershipData.id
                    )
                    .pipe(
                        catchError((err: string) => of(MembershipActions.error({ error: err }))),
                        map(() => LessonActions.startUpsertState({ centerId: selectedMembership.centerId }))
                    )
            )
        )
    )

    public refreshSelectedMembership$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MembershipActions.refreshSelectedMembership),
            concatLatestFrom(() => this.store.select(MembershipSelector.selectedMembership)),
            filter(([action, selectedMembership]) => selectedMembership.membershipData != undefined),
            switchMap(([action, selectedMembership]) => {
                console.log('refreshSelectedMembership$ : ', action, selectedMembership)
                return this.gymMembershipApi
                    .getItem(
                        selectedMembership.centerId,
                        selectedMembership.categId,
                        selectedMembership.membershipData.id
                    )
                    .pipe(
                        map((membershipItem) => {
                            const newSelectedMembership: SelectedMembership = {
                                ...selectedMembership,
                                membershipData: membershipItem,
                            }
                            return MembershipActions.setSelectedMembership({
                                selectedMembership: newSelectedMembership,
                            })
                        }),
                        catchError((err: string) => of(MembershipActions.error({ error: err })))
                    )
            })
        )
    )

    // actions from lesson
    public upsertState$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MembershipActions.startUpsertState),
            concatLatestFrom(() => this.store.select(MembershipSelector.membershipCategEntities)),
            switchMap(([action, memCategEn]) =>
                this.gymMembershipApi.getCategoryList(action.centerId).pipe(
                    map((categs) => {
                        if (_.isEmpty(memCategEn)) {
                            return MembershipActions.finishUpsertState({ membershipCategState: [] })
                        }

                        const categState = _.map(categs, (categ) => {
                            const _categState: MembershipCategoryState = {
                                ...categ,
                                isCategOpen: memCategEn[categ.id].isCategOpen,
                                initialInputOn: false,
                            }
                            return _categState
                        })
                        console.log('upser membership state : ', categs, categState)
                        return MembershipActions.finishUpsertState({ membershipCategState: categState })
                    }),
                    catchError((err: string) => of(MembershipActions.error({ error: err })))
                )
            )
        )
    )
}
