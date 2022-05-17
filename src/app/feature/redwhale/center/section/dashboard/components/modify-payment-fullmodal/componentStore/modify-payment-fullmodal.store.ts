import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'

import { EMPTY, Observable, forkJoin } from 'rxjs'
import { filter, switchMap, tap, catchError, map, withLatestFrom } from 'rxjs/operators'

import _ from 'lodash'
import dayjs from 'dayjs'

import { CenterUserListService } from '@services/helper/center-user-list.service'
import { CenterMembershipService } from '@services/center-membership.service'
import { CenterLockerService } from '@services/center-locker.service'
import { CreateLockerTicketReqBody, CenterUsersLockerService } from '@services/center-users-locker.service.service'
import { CreateMembershipTicketReqBody, CenterUsersMembershipService } from '@services/center-users-membership.service'

import {
    MembershipTicket,
    LockerTicket,
    Instructor,
    TotalPrice,
    Price,
} from '@schemas/center/dashboard/modify-payment-fullmodal'

import { MembershipItem } from '@schemas/membership-item'
import { LockerItem } from '@schemas/locker-item'
import { LockerCategory } from '@schemas/locker-category'
import { CenterUser } from '@schemas/center-user'
import { Payment } from '@schemas/payment'
import { UserLocker } from '@schemas/user-locker'
import { UserMembership } from '@schemas/user-membership'

// ngrx
import { Store } from '@ngrx/store'
import * as DashboardActions from '@centerStore/actions/sec.dashboard.actions'
import * as LockerActions from '@centerStore/actions/sec.locker.actions'
import { showToast } from '@appStore/actions/toast.action'

export interface State {
    membershipTicket: MembershipTicket
    lockerTicket: LockerTicket
    instructors: CenterUser[]
}
export const stateInit: State = {
    membershipTicket: undefined,
    lockerTicket: undefined,
    instructors: [],
}

@Injectable()
export class ModifyPaymentFullModalStore extends ComponentStore<State> {
    public readonly membershipTicket$ = this.select((s) => s.membershipTicket)
    public readonly lockerTicket$ = this.select((s) => s.lockerTicket)
    public readonly instructors$ = this.select((s) => s.instructors)
    public readonly totalPrice$ = this.select((s) => {
        const total: TotalPrice = {
            cash: { price: 0, name: '현금' },
            card: { price: 0, name: '카드' },
            trans: { price: 0, name: '계좌이체' },
            unpaid: { price: 0, name: '미수금' },
        }
        const itemPrice: Price =
            s.membershipTicket != undefined
                ? s.membershipTicket.price
                : s.lockerTicket != undefined
                ? s.lockerTicket.price
                : undefined
        if (itemPrice == undefined) return total

        _.forIn(itemPrice, (v, k) => {
            total[k]['price'] = Number(v.replace(/[^0-9]/gi, '')) ?? 0
        })
        return total
    })
    public readonly totalPriceSum$ = this.totalPrice$.pipe(
        map((total) => {
            let sum = 0
            _.forIn(total, (v) => {
                sum += v.price
            })
            return sum
        })
    )

    constructor(
        private centerUserListService: CenterUserListService,
        private centerLockerApi: CenterLockerService,
        private centerMembershipApi: CenterMembershipService,
        private centerUsersLockerApi: CenterUsersLockerService,
        private centerUsersMembershipApi: CenterUsersMembershipService,
        private nxStore: Store
    ) {
        super(_.cloneDeep(stateInit))
    }

    // sync method
    resetAll() {
        this.setState((state) => _.cloneDeep(stateInit))
    }

    // locker
    setLockerTicket = this.updater((state, lockerTicket: LockerTicket) => {
        state.lockerTicket = lockerTicket
        return _.cloneDeep(state)
    })
    // membership
    setmembershipTicket = this.updater((state, membershipTicket: MembershipTicket) => {
        state.membershipTicket = membershipTicket
        state.membershipTicket.status = 'done'
        return _.cloneDeep(state)
    })
    setMembershipTicketMembershipItem = this.updater((state, membershipItem: MembershipItem) => {
        state.membershipTicket.membershipItem = membershipItem
        state.membershipTicket.amount.normalAmount = String(membershipItem.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        return _.cloneDeep(state)
    })

    // instructors methods
    setInstructors(instructors: CenterUser[]) {
        this.setState((state) => {
            return {
                ...state,
                instructors: instructors,
            }
        })
    }

    // effects

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

    readonly getMembershipItemEffect = this.effect(
        (param$: Observable<{ centerId: string; categoryId: string; itemId: string }>) =>
            param$.pipe(
                switchMap((param) =>
                    this.centerMembershipApi.getItem(param.centerId, param.categoryId, param.itemId).pipe(
                        tap({
                            next: (membershipItem) => {
                                this.setMembershipTicketMembershipItem(membershipItem)
                            },
                            error: (err) => {
                                console.log('modify payment fullmodal store - getMembershipItemEffect err: ', err)
                            },
                        }),
                        catchError(() => EMPTY)
                    )
                )
            )
    )

    // helper function

    initLockerTicket(paymentItem: Payment, userLocker: UserLocker): LockerTicket {
        const price: Price = {
            card: String(paymentItem.card),
            cash: String(paymentItem.cash),
            trans: String(paymentItem.trans),
            unpaid: String(paymentItem.unpaid),
        }

        const paymentAmount = _.reduce(_.values(price), (acc, val) => acc + Number(val), 0)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')

        return {
            date: { startDate: userLocker.start_date, endDate: userLocker.end_date },
            amount: { normalAmount: paymentAmount, paymentAmount: paymentAmount },
            price: price,
            assignee: { name: paymentItem.responsibility.center_user_name, value: paymentItem.responsibility },
            userLocker: userLocker,
            status: 'done',
        }
    }
    initMembershipTicket(paymentItem: Payment, userMembership: UserMembership): MembershipTicket {
        const price: Price = {
            card: String(paymentItem.card),
            cash: String(paymentItem.cash),
            trans: String(paymentItem.trans),
            unpaid: String(paymentItem.unpaid),
        }

        const paymentAmount = _.reduce(_.values(price), (acc, val) => acc + Number(val), 0)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        return {
            date: { startDate: userMembership.start_date, endDate: userMembership.end_date },
            amount: { normalAmount: '', paymentAmount: paymentAmount },
            price: price,
            count: { count: String(userMembership.count), infinite: userMembership.unlimited },
            assignee: { name: paymentItem.responsibility.center_user_name, value: paymentItem.responsibility },
            membershipItem: undefined,
            status: 'idle',
        }
    }
}
