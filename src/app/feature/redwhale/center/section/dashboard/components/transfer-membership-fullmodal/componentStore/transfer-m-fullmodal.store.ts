import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'

import { EMPTY, firstValueFrom, forkJoin, Observable } from 'rxjs'
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators'

import _ from 'lodash'
import dayjs from 'dayjs'

import { CenterUserListService } from '@services/helper/center-user-list.service'
import { CenterMembershipService } from '@services/center-membership.service'
import { StorageService } from '@services/storage.service'
import { CenterUsersPaymentService, CreateMLPaymentReqBody } from '@services/center-users-payment.service'
import { CenterUsersMembershipService } from '@services/center-users-membership.service'
import { CenterContractService } from '@services/center-users-contract.service'
import { FileService } from '@services/file.service'

import { TotalPrice, MembershipTicket } from '@schemas/center/dashboard/transfer-m-fullmodal'

import { MembershipItem } from '@schemas/membership-item'
import { CenterUser } from '@schemas/center-user'
import { UserMembership } from '@schemas/user-membership'

// ngrx
import { Store } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'
import { ContractTypeCode } from '@schemas/contract'
import { Loading } from '@schemas/store/loading'
import { MembershipLockerItem } from '@schemas/center/dashboard/register-ml-fullmodal'
import { ContractUserMembership } from '@schemas/contract-user-membership'
import { ClassItem } from '@schemas/class-item'

export interface State {
    mItem: MembershipTicket
    totalPrice: TotalPrice
    isMLoading: Loading
}
export const stateInit: State = {
    mItem: undefined,
    totalPrice: {
        cash: { price: 0, name: '현금' },
        card: { price: 0, name: '카드' },
        trans: { price: 0, name: '계좌이체' },
        unpaid: { price: 0, name: '미수금' },
    },
    isMLoading: 'idle',
}

@Injectable()
export class TransferMembershipFullmodalStore extends ComponentStore<State> {
    public readonly mItem$ = this.select((s) => s.mItem)
    public readonly isMLoading$ = this.select((s) => s.isMLoading)
    public readonly totalPrice$ = this.select((s) => s.totalPrice)

    // 이후에 필요에 따라 수정 필요
    public isAllMItemDone$ = this.select((s) => {
        return !_.isEmpty(s.mItem) && !_.isEmpty(s.mItem.date.startDate) && !_.isEmpty(s.mItem.date.endDate)
    })

    constructor(
        private centerUserListService: CenterUserListService,
        private centerMembershipApi: CenterMembershipService,
        private centerUsersMembershipService: CenterUsersMembershipService,
        private storageService: StorageService,
        private centerUsersPaymentApi: CenterUsersPaymentService,
        private fileService: FileService,
        private centerContractService: CenterContractService,
        private nxStore: Store
    ) {
        super(_.cloneDeep(stateInit))
    }

    resetAll() {
        this.setState((state) => _.cloneDeep(stateInit))
    }
    // total price
    setTotalPrice = this.updater((state, mItem: MembershipTicket) => {
        const total: TotalPrice = {
            cash: { price: 0, name: '현금' },
            card: { price: 0, name: '카드' },
            trans: { price: 0, name: '계좌이체' },
            unpaid: { price: 0, name: '미수금' },
        }
        const priceKeys = _.keys(total)
        priceKeys.forEach((key) => {
            total[key]['price'] += Number(mItem.price[key].replace(/[^0-9]/gi, '')) ?? 0
        })
        state.totalPrice = total
        return {
            ...state,
        }
    })

    // loaidng
    setMLoading = this.updater((state, loading: Loading) => {
        return {
            ...state,
            isMLoading: loading,
        }
    })

    modifyMItem = this.updater((state, item: MembershipTicket) => {
        state.mItem = item
        return _.cloneDeep(state)
    })
    setMembershipItems(membershipItems: MembershipItem[]) {
        this.setState((state) => {
            return {
                ...state,
                membershipItems: membershipItems,
            }
        })
    }
    addMItem = this.updater((state, mItem: MembershipTicket) => {
        state.mItem = {
            ...state.mItem,
            ...mItem,
        }
        return _.cloneDeep(state)
    })

    transferMItem = this.effect(
        (
            param$: Observable<{
                centerId: string
                transferUser: CenterUser
                transferUserMembership: UserMembership
                user: CenterUser
                signData: string
                memo: string
                callback: () => void
                errCallback?: () => void
            }>
        ) =>
            param$.pipe(
                withLatestFrom(this.mItem$),
                map(([param, mItem]) => {
                    const createMLPaymentReqBody: CreateMLPaymentReqBody = {
                        type_code: 'contract_type_transfer',
                        transfer: {
                            user_membership_id: param.transferUserMembership.id,
                            transferee_center_user_id: param.transferUser.id,
                        },
                        memo: param.memo,
                        user_memberships: [
                            {
                                membership_item_id: mItem.membershipItem.id,
                                start_date: mItem.date.startDate,
                                end_date: mItem.date.endDate,
                                count: Number(mItem.count.count),
                                unlimited: mItem.count.infinite,
                                color: mItem.membershipItem.color,
                                class_item_ids: _.map(
                                    _.filter(mItem.lessonList, (v) => v.selected == true),
                                    (v) => v.item.id
                                ),
                                payment: {
                                    card: Number(mItem.price.card.replace(/[^0-9]/gi, '')),
                                    trans: Number(mItem.price.trans.replace(/[^0-9]/gi, '')),
                                    cash: Number(mItem.price.cash.replace(/[^0-9]/gi, '')),
                                    unpaid: Number(mItem.price.unpaid.replace(/[^0-9]/gi, '')),
                                    vbank: 0,
                                    phone: 0,
                                    memo: '',
                                    responsibility_center_user_id: mItem.assignee.value.id,
                                },
                            },
                        ],
                    }

                    forkJoin([
                        this.centerUsersPaymentApi.createMembershipAndLockerPayment(
                            param.centerId,
                            param.user.id,
                            createMLPaymentReqBody
                        ),
                    ])
                        .pipe(
                            tap(([contract]) => {
                                const func: () => void = () => {
                                    this.nxStore.dispatch(
                                        showToast({
                                            text: `${mItem.membershipItem.name}회원권이 양도되었습니다. `,
                                        })
                                    )
                                }

                                if (!_.isEmpty(param.signData)) {
                                    this.fileService.urlToFileList(param.signData, 'signData.png').then((fileList) => {
                                        this.fileService
                                            .createFile(
                                                {
                                                    type_code: 'file_type_center_contract',
                                                    center_id: param.centerId,
                                                    center_contract_id: contract.id,
                                                    center_user_id: param.user.id,
                                                },
                                                fileList
                                            )
                                            .subscribe(() => {
                                                func()
                                                param.callback()
                                            })
                                    })
                                } else {
                                    func()
                                    param.callback()
                                }
                            })
                        )
                        .pipe(
                            catchError((err) => {
                                param.errCallback()
                                return EMPTY
                            })
                        )
                        .subscribe()
                })
            )
    )

    // ------
    // 회원권을 지웠을 경우에 연결된 수업을 얻을 수 없음
    async initMembershipItemByUM(userMembership: UserMembership, curUser: CenterUser): Promise<MembershipTicket> {
        const center = this.storageService.getCenter()
        const linkedClass: ClassItem[] = await firstValueFrom(
            this.centerMembershipApi
                .getLinkedClass(center.id, userMembership.membership_category_id, userMembership.membership_item_id)
                .pipe(map((v) => _.reverse(v)))
        )
        const contractMembership: ContractUserMembership = await firstValueFrom(
            this.centerContractService.getContractMembershipDetail(
                center.id,
                curUser.id,
                userMembership.contract_id,
                userMembership.contract_user_membership_id
            )
        )

        const cmTotalPrice =
            contractMembership.cash + contractMembership.card + contractMembership.trans + contractMembership.unpaid

        const linkedClassIds = _.split(userMembership.class_item_ids, ',')

        return {
            type: 'membership',
            date: {
                startDate: dayjs().format('YYYY-MM-DD'),
                endDate: dayjs()
                    .add(dayjs(userMembership.end_date).diff(dayjs().format('YYYY-MM-DD'), 'day'), 'day')
                    .format('YYYY-MM-DD'),
                // dayjs()
                //   .add(dayjs(contractMembership.end_date).diff(dayjs().format('YYYY-MM-DD'), 'day'), 'day')
                //   .format('YYYY-MM-DD'),
            },
            amount: {
                normalAmount: String(cmTotalPrice).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                paymentAmount: '0',
            },
            price: {
                card: '',
                cash: '',
                trans: '',
                unpaid: '',
            },
            count: {
                count: String(userMembership.count - userMembership.used_count),
                infinite: userMembership.unlimited,
            },
            assignee: undefined,
            membershipItem: {
                id: userMembership.membership_item_id,
                category_id: userMembership.membership_category_id,
                category_name: userMembership.category_name,
                name: contractMembership.name,
                days: dayjs(contractMembership.end_date).diff(contractMembership.start_date, 'day') + 1,
                count: contractMembership.count,
                unlimited: contractMembership.unlimited,
                price: cmTotalPrice,
                color: contractMembership.color,
                memo: '',
                sequence_number: 0,
            },
            lessonList: _.map(linkedClass, (value) => {
                return { selected: linkedClassIds.findIndex((id) => id == value.id) != -1, item: value }
            }),
        }
    }
}
