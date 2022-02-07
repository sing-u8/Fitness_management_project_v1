import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of } from 'rxjs'
import { catchError, switchMap, tap, map, filter } from 'rxjs/operators'
import * as MembershipActions from '../actions/sec.membership.actions'
import { MembershipCategoryState, SelectedMembership } from '../reducers/sec.membership.reducer'
import * as MembershipSelector from '../selectors/sec.membership.selector'

import * as LessonActions from '../actions/sec.lesson.actions'

import { GymMembershipService } from '@services/gym-membership.service'

import * as _ from 'lodash'

@Injectable()
export class membershipEffect {
    constructor(private actions$: Actions, private gymMembershipApi: GymMembershipService, private store: Store) {}

    // membership category
    public loadMembershipCategs$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MembershipActions.startLoadMembershipCategs),
            switchMap(({ gymId }) =>
                this.gymMembershipApi.getCategoryList(gymId).pipe(
                    map((categs) => {
                        const categState = _.map(categs, (categ) => {
                            const _categState: MembershipCategoryState = { ...categ, isCategOpen: false }
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
            switchMap(({ gymId, categName }) =>
                this.gymMembershipApi.createCategory(gymId, { name: categName }).pipe(
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
                switchMap(({ id, gymId }) =>
                    this.gymMembershipApi
                        .deleteCategory(gymId, id)
                        .pipe(catchError((err: string) => of(MembershipActions.error({ error: err }))))
                )
            ),
        { dispatch: false }
    )

    public changeMembershipCategName = createEffect(
        () =>
            this.actions$.pipe(
                ofType(MembershipActions.changeMembershipCategName),
                switchMap(({ gymId, id, categName }) =>
                    this.gymMembershipApi.updateCategory(gymId, id, { name: categName }).pipe(
                        tap(),
                        catchError((err: string) => of(MembershipActions.error({ error: err })))
                    )
                )
            ),
        { dispatch: false }
    )

    // categ data

    public updateCategMembership = createEffect(() =>
        this.actions$.pipe(
            ofType(MembershipActions.startAddMembershipToCateg),
            switchMap(({ gymId, categId, categName, reqBody }) =>
                this.gymMembershipApi.createItem(gymId, categId, reqBody).pipe(
                    map((newItem) =>
                        MembershipActions.finishiAddMembershipToCateg({ categId: categId, newMembershipData: newItem })
                    ),
                    catchError((err: string) => of(MembershipActions.error({ error: err })))
                )
            )
        )
    )

    // selected membership
    public updateSelectedMembership$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MembershipActions.updateSelectedMembership),
            switchMap(({ selectedMembership, reqBody }) => {
                return this.gymMembershipApi
                    .updateItem(
                        selectedMembership.gymId,
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
                            this.gymMembershipApi.getCategoryList(selectedMembership.gymId).pipe(
                                map((categs) => {
                                    const categState = _.map(categs, (categ) => {
                                        const _categState: MembershipCategoryState = {
                                            ...categ,
                                            isCategOpen: memCategEn[categ.id].isCategOpen,
                                        }
                                        return _categState
                                    })
                                    return categState
                                }),
                                concatLatestFrom(() => this.store.select(MembershipSelector.currentGym)),
                                switchMap(([memCategState, curGym]) => {
                                    return [
                                        MembershipActions.updateMembershipCategs({
                                            membershipCategState: memCategState,
                                        }),
                                        LessonActions.startUpsertState({ gymId: curGym }),
                                    ]
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
                        selectedMembership.gymId,
                        selectedMembership.categId,
                        selectedMembership.membershipData.id
                    )
                    .pipe(
                        catchError((err: string) => of(MembershipActions.error({ error: err }))),
                        map(() => LessonActions.startUpsertState({ gymId: selectedMembership.gymId }))
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
                    .getItem(selectedMembership.gymId, selectedMembership.categId, selectedMembership.membershipData.id)
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
                this.gymMembershipApi.getCategoryList(action.gymId).pipe(
                    map((categs) => {
                        const categState = _.map(categs, (categ) => {
                            const _categState: MembershipCategoryState = {
                                ...categ,
                                isCategOpen: memCategEn[categ.id].isCategOpen,
                            }
                            return _categState
                        })
                        return MembershipActions.finishUpsertState({ membershipCategState: categState })
                    }),
                    catchError((err: string) => of(MembershipActions.error({ error: err })))
                )
            )
        )
    )
}
