import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'

import { EMPTY, Observable, forkJoin } from 'rxjs'
import { filter, switchMap, tap, catchError, map, withLatestFrom } from 'rxjs/operators'

import _ from 'lodash'
import dayjs from 'dayjs'

import { CenterUserListService } from '@services/helper/center-user-list.service'
import { CenterMembershipService } from '@services/center-membership.service'
import { CreateLockerTicketReqBody, CenterUsersLockerService } from '@services/center-users-locker.service.service'
import { CreateMembershipTicketReqBody, CenterUsersMembershipService } from '@services/center-users-membership.service'
import { CenterUsersPaymentService, CreateMLPaymentReqBody } from '@services/center-users-payment.service'

import {
    MembershipTicket,
    Locker,
    MembershipLockerItem,
    ChoseLockers,
    Instructor,
    UpdateChoseLocker,
    TotalPrice,
} from '@schemas/center/dashboard/register-ml-fullmodal'

import { MembershipItem } from '@schemas/membership-item'
import { LockerItem } from '@schemas/locker-item'
import { LockerCategory } from '@schemas/locker-category'
import { CenterUser } from '@schemas/center-user'

// ngrx
import { Store } from '@ngrx/store'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import * as LockerActions from '@centerStore/actions/sec.locker.actions'
import { showToast } from '@appStore/actions/toast.action'

export interface State {
    mlItems: MembershipLockerItem[]
    choseLockers: ChoseLockers
    membershipItems: MembershipItem[]
    instructors: CenterUser[]
}
export const stateInit: State = {
    mlItems: [],
    choseLockers: new Map(),
    membershipItems: [],
    instructors: [],
}

@Injectable()
export class RegisterMembershipLockerFullmodalStore extends ComponentStore<State> {
    public readonly mlItems$ = this.select((s) => {
        return s.mlItems
    })
    public readonly choseLockers$ = this.select((s) => s.choseLockers)
    public readonly instructors$ = this.select((s) => s.instructors)
    public readonly membershipItems$ = this.select((s) => s.membershipItems)

    public readonly totalPrice$ = this.select((s) => {
        const total: TotalPrice = {
            cash: { price: 0, name: '현금' },
            card: { price: 0, name: '카드' },
            trans: { price: 0, name: '계좌이체' },
            unpaid: { price: 0, name: '미수금' },
        }
        const priceKeys = _.keys(total)
        s.mlItems.forEach((mlItem) => {
            if (mlItem.status == 'done') {
                priceKeys.forEach((key) => {
                    total[key]['price'] += Number(mlItem.price[key].replace(/[^0-9]/gi, '')) ?? 0
                })
            }
        })
        return total
    })

    public readonly isAllMlItemDone$ = this.select(
        (s) => s.mlItems.length > 0 && _.every(s.mlItems, (mlItem) => mlItem.status == 'done')
    )

    constructor(
        private centerUserListService: CenterUserListService,
        private centerMembershipApi: CenterMembershipService,
        private centerUsersLockerApi: CenterUsersLockerService,
        private centerUsersMembershipApi: CenterUsersMembershipService,
        private centerUsersPaymentApi: CenterUsersPaymentService,
        private nxStore: Store
    ) {
        super(_.cloneDeep(stateInit))
    }

    resetAll() {
        this.setState((state) => _.cloneDeep(stateInit))
    }

    // choseLocker$ methods
    updateChoseLockers = this.updater((state, data: UpdateChoseLocker) => {
        const lockerItemCopy = data.locker
        lockerItemCopy.state_code = 'locker_item_state_in_use'
        lockerItemCopy.state_code_name = '사용중'

        state.choseLockers.set(data.lockerCategId, {
            ...state.choseLockers.get(data.lockerCategId),
            ...{ [data.locker.id]: data.locker },
        })

        return {
            ...state,
        }
    })

    resetChoseLockers = this.updater((state) => {
        state.choseLockers.clear()
        return {
            ...state,
        }
    })

    // mlItemList$ methods
    addMlItem = this.updater((state, mlItem: MembershipLockerItem) => {
        state.mlItems.unshift(mlItem)
        return {
            ...state,
        }
    })

    removeMlItem = this.updater((state, index: number) => {
        const removedItem = state.mlItems[index]
        if (removedItem.type == 'locker') {
            const removedItem = state.mlItems[index] as Locker
            const newCategLockers = state.choseLockers.get(removedItem.lockerCategory.id)
            delete newCategLockers[removedItem.locker.id]
            state.choseLockers.set(removedItem.lockerCategory.id, newCategLockers)
        } else {
            const removedItem = state.mlItems[index] as MembershipTicket
        }
        const newMlList = _.filter(state.mlItems, (v, i) => i != index)
        return {
            ...state,
            mlItems: newMlList,
        }
    })

    modifyMlItem = this.updater(
        (
            state,
            data: {
                index: number
                item: MembershipLockerItem
            }
        ) => {
            state.mlItems[data.index] = data.item
            return {
                ...state,
            }
        }
    )

    // instructors methods
    setInstructors(instructors: CenterUser[]) {
        this.setState((state) => {
            return {
                ...state,
                instructors: instructors,
            }
        })
    }

    readonly getInstructorsEffect = this.effect((centerId$: Observable<string>) =>
        centerId$.pipe(
            switchMap((centerId) =>
                this.centerUserListService.getCenterInstructorList(centerId).pipe(
                    tap({
                        next: (instructors) => {
                            this.setInstructors(instructors)
                        },
                        error: (err) => {
                            console.log('register-ml-fullmodal store - getInstructorEffect err: ', err)
                        },
                    }),
                    catchError(() => EMPTY)
                )
            )
        )
    )

    setMembershipItems(membershipItems: MembershipItem[]) {
        this.setState((state) => {
            return {
                ...state,
                membershipItems: membershipItems,
            }
        })
    }
    readonly getmembershipItemsEffect = this.effect((centerId$: Observable<string>) =>
        centerId$.pipe(
            switchMap((centerId) =>
                this.centerMembershipApi.getCategoryList(centerId).pipe(
                    tap({
                        next: (membershipCateg) => {
                            const membershipItemList = _.reduce(
                                membershipCateg,
                                (result, value) => {
                                    _.forEach(value.items, (membershipitem) => [result.push(membershipitem)])
                                    return result
                                },
                                []
                            )

                            this.setMembershipItems(membershipItemList)
                        },
                        error: (err) => {
                            console.log('register-ml-fullmodal store - getmembershipItemsEffect err: ', err)
                        },
                    }),
                    catchError(() => EMPTY)
                )
            )
        )
    )

    registerMlItems = this.effect(
        (reqBody$: Observable<{ centerId: string; user: CenterUser; callback: () => void }>) =>
            reqBody$.pipe(
                withLatestFrom(this.mlItems$),
                map(([reqBody, mlItems]) => {
                    const lockerItems = mlItems.filter((item) => item.type == 'locker')
                    const membershipItems = mlItems.filter((item) => item.type == 'membership')

                    const createMLPaymentReqBody: CreateMLPaymentReqBody = {
                        user_memberships: _.map(membershipItems, (v) => {
                            return {
                                membership_item_id: v['membershipItem'].id,
                                category_name: v['membershipItem'].category_name,
                                name: v['membershipItem'].name,
                                start_date: v.date.startDate,
                                end_date: v.date.endDate,
                                count: Number(v['count'].count),
                                unlimited: v['count'].infinite,
                                color: v['membershipItem'].color,
                                class_item_ids: _.map(
                                    _.filter(v['lessonList'], (v) => v.selected == true),
                                    (v) => v.item.id
                                ),
                                payment: {
                                    card: Number(v.price.card.replace(/[^0-9]/gi, '')),
                                    trans: Number(v.price.trans.replace(/[^0-9]/gi, '')),
                                    cash: Number(v.price.cash.replace(/[^0-9]/gi, '')),
                                    unpaid: Number(v.price.unpaid.replace(/[^0-9]/gi, '')),
                                    vbank: 0,
                                    phone: 0,
                                    memo: '',
                                    responsibility_user_id: v.assignee.value.id,
                                },
                            }
                        }),
                        user_lockers: _.map(lockerItems, (v) => {
                            return {
                                locker_item_id: v['locker'].id as string,
                                start_date: v.date.startDate,
                                end_date: v.date.endDate,
                                payment: {
                                    card: Number(v.price.card.replace(/[^0-9]/gi, '')),
                                    trans: Number(v.price.trans.replace(/[^0-9]/gi, '')),
                                    cash: Number(v.price.cash.replace(/[^0-9]/gi, '')),
                                    unpaid: Number(v.price.unpaid.replace(/[^0-9]/gi, '')),
                                    vbank: 0,
                                    phone: 0,
                                    memo: '',
                                    responsibility_user_id: v.assignee.value.id,
                                },
                            }
                        }),
                    }
                    this.centerUsersPaymentApi
                        .createMembershipAndLockerPayment(reqBody.centerId, reqBody.user.id, createMLPaymentReqBody)
                        .pipe(
                            tap(() => {
                                if (lockerItems.length > 0 && membershipItems.length > 0) {
                                    this.nxStore.dispatch(
                                        LockerActions.startUpdateStateAfterRegisterLockerInDashboard()
                                    )
                                    this.nxStore.dispatch(
                                        showToast({
                                            text: `${reqBody.user.center_user_name}님의 회원권 / 락커 등록이 완료되었습니다. `,
                                        })
                                    )
                                } else if (lockerItems.length > 0) {
                                    this.nxStore.dispatch(
                                        LockerActions.startUpdateStateAfterRegisterLockerInDashboard()
                                    )
                                    this.nxStore.dispatch(
                                        showToast({
                                            text: `${reqBody.user.center_user_name}님의 락커 등록이 완료되었습니다. `,
                                        })
                                    )
                                } else if (membershipItems.length > 0) {
                                    this.nxStore.dispatch(
                                        showToast({
                                            text: `${reqBody.user.center_user_name}님의 회원권 등록이 완료되었습니다. `,
                                        })
                                    )
                                }
                                reqBody.callback()
                            })
                        )
                        .subscribe()
                }),
                catchError((err) => {
                    console.log('registerMlItems err : ', err)
                    return EMPTY
                })
            )
    )

    // helperFunction

    initLockerItem(locker: LockerItem, lockerCategory: LockerCategory): Locker {
        return {
            type: 'locker',
            assignee: undefined,
            date: { startDate: dayjs().format('YYYY-MM-DD'), endDate: '' },
            amount: {
                normalAmount: '0',
                paymentAmount: '0',
            },
            price: {
                card: '',
                cash: '',
                trans: '',
                unpaid: '',
            },
            locker: locker,
            lockerCategory: lockerCategory,
            status: 'modify' as const,
        }
    }

    initMembershipItem(membership: MembershipItem): MembershipTicket {
        const price = membership.price ? membership.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'
        return {
            type: 'membership',
            date: {
                startDate: dayjs().format('YYYY-MM-DD'),
                endDate: dayjs().add(membership.days, 'day').format('YYYY-MM-DD'),
            },
            amount: {
                normalAmount: String(membership.price).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                paymentAmount: '0',
            },
            price: {
                card: '',
                cash: '',
                trans: '',
                unpaid: '',
            },
            count: { count: String(membership.count), infinite: membership.unlimited },
            assignee: undefined,
            membershipItem: membership,
            lessonList: _.map(membership.class_items, (value) => {
                return { selected: true, item: value }
            }),
            status: 'modify' as const,
        }
    }
}
