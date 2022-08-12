import { Inject, Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'

import { EMPTY, Observable, firstValueFrom, forkJoin } from 'rxjs'
import { filter, switchMap, tap, catchError, map, withLatestFrom } from 'rxjs/operators'

import _ from 'lodash'
import dayjs from 'dayjs'

import { CenterContractService } from '@services/center-users-contract.service'

import { ContractPayment } from '@schemas/contract-payment'
import { ContractUserLocker } from '@schemas/contract-user-locker'
import { ContractUserMembership } from '@schemas/contract-user-membership'
import { CenterUser } from '@schemas/center-user'
import { Loading } from '@schemas/componentStore/loading'

// ngrx
import { Store } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'

export interface State {
    loading: Loading
    contractUserMembershipItems: Array<ContractUserMembership>
    contractUserLockerItems: Array<ContractUserLocker>
    contractPayment: ContractPayment
}
export const stateInit: State = {
    loading: 'idle',
    contractUserMembershipItems: [],
    contractUserLockerItems: [],
    contractPayment: {
        card: 0,
        trans: 0,
        vbank: 0,
        phone: 0,
        cash: 0,
        unpaid: 0,
    },
}

@Injectable()
export class CheckContractFullmodalStore extends ComponentStore<State> {
    public readonly loading$ = this.select((s) => s.loading)
    public readonly contractUserMembershipItems$ = this.select((s) => s.contractUserMembershipItems)
    public readonly contractUserLockerItems$ = this.select((s) => s.contractUserLockerItems)
    public readonly contractPayment$ = this.select((s) => s.contractPayment)

    public readonly totalSum$ = this.select(
        (s) => s.contractPayment.card + s.contractPayment.cash + s.contractPayment.unpaid + s.contractPayment.trans
    )
    public readonly totalPrice$ = this.select((s) => {
        return {
            cash: { price: s.contractPayment.cash, name: '현금' },
            card: { price: s.contractPayment.card, name: '카드' },
            trans: { price: s.contractPayment.trans, name: '계좌이체' },
            unpaid: { price: s.contractPayment.unpaid, name: '미수금' },
        }
    })

    constructor(private centerContractApi: CenterContractService) {
        super(_.cloneDeep(stateInit))
    }

    resetAll() {
        this.setState((state) => _.cloneDeep(stateInit))
    }

    setLoading(loading: Loading) {
        this.setState((state) => ({
            ...state,
            loading,
        }))
    }
    setContractUserMembereshipItems(contractUserMembershipItems: Array<ContractUserMembership>) {
        this.setState((state) => {
            return {
                ...state,
                contractUserMembershipItems,
            }
        })
    }
    setContractUserLockerItems(contractUserLockerItems: Array<ContractUserLocker>) {
        this.setState((state) => {
            return {
                ...state,
                contractUserLockerItems,
            }
        })
    }
    setContractPayment(contractPayment: ContractPayment) {
        this.setState((state) => {
            return {
                ...state,
                contractPayment,
            }
        })
    }

    // get methods effect
    getContractData = this.effect((reqBody$: Observable<{ centerId: string; userId: string; contractId: string }>) =>
        reqBody$.pipe(
            switchMap((reqbody) => {
                this.setLoading('pending')
                return forkJoin([
                    this.centerContractApi.getContractLocker(reqbody.centerId, reqbody.userId, reqbody.contractId),
                    this.centerContractApi.getContractMembership(reqbody.centerId, reqbody.userId, reqbody.contractId),
                    this.centerContractApi.getContractPayment(reqbody.centerId, reqbody.userId, reqbody.contractId),
                ]).pipe(
                    map(([lockers, memberships, payments]) => {
                        this.setState((state) => {
                            console.log('end get data ----- ',reqbody , {
                                ...state,
                                loading: 'done',
                                contractUserLockerItems: lockers,
                                contractUserMembershipItems: memberships,
                                contractPayment: payments,
                            })
                            return {
                                ...state,
                                loading: 'done',
                                contractUserLockerItems: lockers,
                                contractUserMembershipItems: memberships,
                                contractPayment: payments[0],
                            }
                        })
                    })
                )
            }),
            catchError((err) => {
                console.log('registerMlItems err : ', err)
                return EMPTY
            })
        )
    )
}
