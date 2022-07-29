import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'

import { EMPTY, Observable, forkJoin } from 'rxjs'
import { filter, switchMap, tap, catchError, map, withLatestFrom, take } from 'rxjs/operators'

import _ from 'lodash'
import { CenterUserListService } from '@services/helper/center-user-list.service'
import { CenterMembershipService } from '@services/center-membership.service'
import { CenterLockerService } from '@services/center-locker.service'
import {
    UpdateLockerTicektPaymentReqBody,
    CenterUsersLockerService,
} from '@services/center-users-locker.service.service'
import {
    UpdateMembershipTicketPaymentReqBody,
    CenterUsersMembershipService,
} from '@services/center-users-membership.service'
import { DashboardHelperService } from '@services/center/dashboard-helper.service'

import {
    MembershipTicket,
    LockerTicket,
    Instructor,
    TotalPrice,
    Price,
} from '@schemas/center/dashboard/modify-payment-fullmodal'

import { MembershipItem } from '@schemas/membership-item'
import { CenterUser } from '@schemas/center-user'
import { Payment } from '@schemas/payment'
import { UserLocker } from '@schemas/user-locker'
import { UserMembership } from '@schemas/user-membership'

// ngrx
import { Store } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'

export interface State {
    membershipTicket: MembershipTicket
    lockerTicket: LockerTicket
}
export const stateInit: State = {
    membershipTicket: {
        date: { startDate: '', endDate: '' },
        amount: { normalAmount: '', paymentAmount: '' },
        price: {
            card: '',
            cash: '',
            trans: '',
            unpaid: '',
        },
        count: { count: '', infinite: false },
        assignee: { name: '', value: {} as CenterUser, id: '' },
        membershipItem: {} as MembershipItem,
        lessonList: [],
        status: 'none',
    },
    lockerTicket: {
        date: { startDate: '', endDate: '' },
        amount: { normalAmount: '', paymentAmount: '' },
        price: {
            card: '',
            cash: '',
            trans: '',
            unpaid: '',
        },
        assignee: { name: '', value: {} as CenterUser, id: '' },
        userLocker: {} as UserLocker,
        status: 'none',
    },
}

@Injectable()
export class ModifyPaymentFullModalStore extends ComponentStore<State> {
    public readonly membershipTicket$ = this.select((s) => s.membershipTicket)
    public readonly lockerTicket$ = this.select((s) => s.lockerTicket)
    public readonly totalPrice$ = this.select((s) => {
        const total: TotalPrice = {
            cash: { price: 0, name: '현금' },
            card: { price: 0, name: '카드' },
            trans: { price: 0, name: '계좌이체' },
            unpaid: { price: 0, name: '미수금' },
        }
        const itemPrice: Price =
            s.membershipTicket.status != 'none'
                ? s.membershipTicket.price
                : s.lockerTicket.status != 'none'
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
        private nxStore: Store,
        private dashboardHelper: DashboardHelperService
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
    setMembershipTicket = this.updater((state, membershipTicket: MembershipTicket) => {
        state.membershipTicket = membershipTicket
        state.membershipTicket.status = 'done'
        return _.cloneDeep(state)
    })
    setMembershipTicketMembershipItem = this.updater((state, membershipItem: MembershipItem) => {
        state.membershipTicket.membershipItem = membershipItem
        state.membershipTicket.amount.normalAmount = String(membershipItem.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        return _.cloneDeep(state)
    })

    // effects
    readonly getMembershipItemEffect = this.effect(
        (param$: Observable<{ centerId: string; categoryId: string; itemId: string }>) =>
            param$.pipe(
                switchMap((param) =>
                    this.centerMembershipApi.getItems(param.centerId, param.categoryId).pipe(
                        map((items) => _.find(items, (v) => v.id == param.itemId)),
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

    readonly modifyMembershipPayment = this.effect(
        (
            param$: Observable<{
                centerId: string
                curUser: CenterUser
                membershipId: string
                payment: Payment
                callback: () => void
            }>
        ) =>
            param$.pipe(
                withLatestFrom(this.membershipTicket$),
                switchMap(([param, membershipTicket]) => {
                    const reqBody: UpdateMembershipTicketPaymentReqBody = {
                        payment: {
                            card: Number(membershipTicket.price.card.replace(/[^0-9]/gi, '')),
                            trans: Number(membershipTicket.price.trans.replace(/[^0-9]/gi, '')),
                            vbank: 0,
                            phone: 0,
                            cash: Number(membershipTicket.price.cash.replace(/[^0-9]/gi, '')),
                            unpaid: Number(membershipTicket.price.unpaid.replace(/[^0-9]/gi, '')),
                            memo: '',
                            responsibility_user_id: membershipTicket.assignee.value.id,
                        },
                    }
                    return this.centerUsersMembershipApi
                        .updateMembershipTicketPayment(
                            param.centerId,
                            param.curUser.id,
                            param.membershipId,
                            param.payment.id,
                            reqBody
                        )
                        .pipe(
                            tap((result) => {
                                param.callback()
                                // this.nxStore.dispatch(
                                //     DashboardActions.startGetUserData({
                                //         centerId: param.centerId,
                                //         centerUser: param.curUser,
                                //     })
                                // )
                                this.dashboardHelper.refreshCurUser(param.centerId, param.curUser)
                                this.nxStore.dispatch(
                                    showToast({
                                        text: `'${param.payment.user_membership_name}' 결제 정보가 수정되었습니다.`,
                                    })
                                )
                            })
                        )
                })
            )
    )

    readonly modifyLockerPayment = this.effect(
        (
            param$: Observable<{
                centerId: string
                curUser: CenterUser
                lockerId: string
                payment: Payment
                callback: () => void
            }>
        ) =>
            param$.pipe(
                withLatestFrom(this.lockerTicket$),
                switchMap(([param, lockerTicket]) => {
                    const reqBody: UpdateLockerTicektPaymentReqBody = {
                        payment: {
                            card: Number(lockerTicket.price.card.replace(/[^0-9]/gi, '')),
                            trans: Number(lockerTicket.price.trans.replace(/[^0-9]/gi, '')),
                            vbank: 0,
                            phone: 0,
                            cash: Number(lockerTicket.price.cash.replace(/[^0-9]/gi, '')),
                            unpaid: Number(lockerTicket.price.unpaid.replace(/[^0-9]/gi, '')),
                            memo: '',
                            responsibility_user_id: lockerTicket.assignee.value.id,
                        },
                    }
                    return this.centerUsersLockerApi
                        .updateLockerTicketPayment(
                            param.centerId,
                            param.curUser.id,
                            param.lockerId,
                            param.payment.id,
                            reqBody
                        )
                        .pipe(
                            tap((result) => {
                                param.callback()
                                // this.nxStore.dispatch(
                                //     DashboardActions.startGetUserData({
                                //         centerId: param.centerId,
                                //         centerUser: param.curUser,
                                //     })
                                // )
                                this.dashboardHelper.refreshCurUser(param.centerId, param.curUser)
                                this.nxStore.dispatch(
                                    showToast({
                                        text: `'${param.payment.user_locker_name}' 결제 정보가 수정되었습니다.`,
                                    })
                                )
                            })
                        )
                })
            )
    )

    // helper function

    initLockerTicket(paymentItem: Payment, userLocker: UserLocker): LockerTicket {
        const price: Price = {
            card: String(paymentItem.card).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            cash: String(paymentItem.cash).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            trans: String(paymentItem.trans).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            unpaid: String(paymentItem.unpaid).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        }

        const paymentAmount = _.reduce(_.values(price), (acc, val) => acc + Number(val.replace(/[^0-9]/gi, '')), 0)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')

        return {
            date: { startDate: userLocker.start_date, endDate: userLocker.end_date },
            amount: { normalAmount: paymentAmount, paymentAmount: paymentAmount },
            price: price,
            assignee: {
                name: paymentItem.responsibility_center_user_name,
                value: undefined,
                id: paymentItem.responsibility_user_id,
            },
            userLocker: userLocker,
            status: 'done',
        }
    }
    initMembershipTicket(paymentItem: Payment, userMembership: UserMembership): MembershipTicket {
        const price: Price = {
            card: String(paymentItem.card).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            cash: String(paymentItem.cash).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            trans: String(paymentItem.trans).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            unpaid: String(paymentItem.unpaid).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        }

        const paymentAmount = _.reduce(_.values(price), (acc, val) => acc + Number(val.replace(/[^0-9]/gi, '')), 0)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        return {
            date: { startDate: userMembership.start_date, endDate: userMembership.end_date },
            amount: { normalAmount: '', paymentAmount: paymentAmount },
            price: price,
            count: { count: String(userMembership.count), infinite: userMembership.unlimited },
            assignee: {
                name: paymentItem.responsibility_center_user_name,
                value: undefined,
                id: paymentItem.responsibility_user_id,
            },
            membershipItem: {} as MembershipItem,
            lessonList: [],
            status: 'idle',
        }
    }
}
