import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'

import { EMPTY, firstValueFrom, Observable } from 'rxjs'
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators'

import _ from 'lodash'
import dayjs from 'dayjs'

import { CenterUserListService } from '@services/helper/center-user-list.service'
import { CenterMembershipService } from '@services/center-membership.service'
import { StorageService } from '@services/storage.service'
import { LockerHelperService } from '@services/center/locker-helper.service'
import { CenterUsersPaymentService, CreateMLPaymentReqBody } from '@services/center-users-payment.service'
import { CenterLockerService } from '@services/center-locker.service'
import { CenterContractService } from '@services/center-users-contract.service'
import { FileService } from '@services/file.service'

import {
    ChoseLockers,
    Locker,
    MembershipLockerItem,
    MembershipTicket,
    TotalPrice,
    UpdateChoseLocker,
} from '@schemas/center/dashboard/register-ml-fullmodal'

import { MembershipItem } from '@schemas/membership-item'
import { LockerItem } from '@schemas/locker-item'
import { LockerCategory } from '@schemas/locker-category'
import { CenterUser } from '@schemas/center-user'
import { UserMembership } from '@schemas/user-membership'

// ngrx
import { Store } from '@ngrx/store'
import { showToast } from '@appStore/actions/toast.action'
import { ContractTypeCode } from '@schemas/contract'
import { Loading } from '@schemas/store/loading'
import { ContractUserMembership } from '@schemas/contract-user-membership'

export interface State {
    mlItems: MembershipLockerItem[]
    choseLockers: ChoseLockers
    membershipItems: MembershipItem[]
    doLockerItemsExist: boolean
    doMembershipItemsExist: boolean
    isRenewalMLLoading: Loading
}
export const stateInit: State = {
    mlItems: [],
    choseLockers: new Map(),
    membershipItems: [],
    doLockerItemsExist: false,
    doMembershipItemsExist: false,
    // re register vars // contract_type_renewal
    isRenewalMLLoading: 'idle',
}

@Injectable()
export class RegisterMembershipLockerPageStore extends ComponentStore<State> {
    public readonly mlItems$ = this.select((s) => {
        return s.mlItems
    })
    public readonly choseLockers$ = this.select((s) => s.choseLockers)
    // public readonly instructors$ = this.select((s) => s.instructors)
    public readonly membershipItems$ = this.select((s) => s.membershipItems)
    public readonly doLockerItemsExist$ = this.select((s) => s.doLockerItemsExist)
    public readonly doMembershipItemsExist$ = this.select((s) => s.doMembershipItemsExist)

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

    public readonly isRenewalMLLoading$ = this.select((s) => s.isRenewalMLLoading)

    constructor(
        private centerUserListService: CenterUserListService,
        private centerMembershipApi: CenterMembershipService,
        private storageService: StorageService,
        private centerUsersPaymentApi: CenterUsersPaymentService,
        private fileService: FileService,
        private nxStore: Store,
        private centerLockerApi: CenterLockerService,
        private lockerHelperService: LockerHelperService,
        private centerContractService: CenterContractService
    ) {
        super(_.cloneDeep(stateInit))
    }

    resetAll() {
        this.setState((state) => _.cloneDeep(stateInit))
    }
    // renewal loaidng
    setRenewalMLLoading = this.updater((state, loading: Loading) => {
        return {
            ...state,
            isRenewalMLLoading: loading,
        }
    })

    // set check membership locker items
    setLockerItemsExist = this.updater((state, doExist: boolean) => {
        // state.doLockerItemsExist = doExist
        return {
            ...state,
            doLockerItemsExist: doExist,
        }
    })

    setMembershipItemExist = this.updater((state, doExist: boolean) => {
        // state.doMembershipItemsExist = doExist
        return {
            ...state,
            doMembershipItemsExist: doExist,
        }
    })

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
            const newCategLockers = state.choseLockers.get(removedItem.lockerCategoryId)
            delete newCategLockers[removedItem.locker.id]
            state.choseLockers.set(removedItem.lockerCategoryId, newCategLockers)
            state.choseLockers = new Map(state.choseLockers)
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
            return _.cloneDeep(state)
        }
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
                this.centerMembershipApi.getAllMemberships(centerId).pipe(
                    tap({
                        next: (membershipItemList) => {
                            this.setMembershipItems(_.reverse(membershipItemList))
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
        (
            reqBody$: Observable<{
                type: ContractTypeCode
                centerId: string
                user: CenterUser
                signData: string
                memo: string
                callback: () => void
                errCallback?: () => void
            }>
        ) =>
            reqBody$.pipe(
                withLatestFrom(this.mlItems$),
                map(([reqBody, mlItems]) => {
                    const lockerItems = mlItems.filter((item) => item.type == 'locker')
                    const membershipItems = mlItems.filter((item) => item.type == 'membership')

                    const createMLPaymentReqBody: CreateMLPaymentReqBody = {
                        type_code: reqBody.type,
                        memo: reqBody.memo,
                        user_memberships:
                            membershipItems.length > 0
                                ? _.map(membershipItems, (v) => {
                                      return {
                                          membership_item_id: v['membershipItem'].id,
                                          //   category_name: v['membershipItem'].category_name,
                                          //   name: v['membershipItem'].name,
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
                                              responsibility_center_user_id: v.assignee.value.id,
                                          },
                                      }
                                  })
                                : [],
                        user_lockers:
                            lockerItems.length > 0
                                ? _.map(lockerItems, (v) => {
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
                                              responsibility_center_user_id: v.assignee.value.id,
                                          },
                                      }
                                  })
                                : [],
                    }
                    if (createMLPaymentReqBody.user_lockers.length == 0) {
                        delete createMLPaymentReqBody.user_lockers
                    }
                    if (createMLPaymentReqBody.user_memberships.length == 0) {
                        delete createMLPaymentReqBody.user_memberships
                    }

                    this.centerUsersPaymentApi
                        .createMembershipAndLockerPayment(reqBody.centerId, reqBody.user.id, createMLPaymentReqBody)
                        .pipe(
                            tap((contract) => {
                                let func: () => void = () => {}
                                if (lockerItems.length > 0 && membershipItems.length > 0) {
                                    func = () => {
                                        this.lockerHelperService.synchronizeCurUserLocker(
                                            reqBody.centerId,
                                            reqBody.user.id
                                        )
                                        this.lockerHelperService.synchronizeLockerItemList(reqBody.centerId)
                                        this.nxStore.dispatch(
                                            showToast({
                                                text: `${reqBody.user.name}님의 회원권 / 락커 등록이 완료되었습니다. `,
                                            })
                                        )
                                    }
                                } else if (lockerItems.length > 0) {
                                    func = () => {
                                        this.lockerHelperService.synchronizeCurUserLocker(
                                            reqBody.centerId,
                                            reqBody.user.id
                                        )
                                        this.lockerHelperService.synchronizeLockerItemList(reqBody.centerId)
                                        this.nxStore.dispatch(
                                            showToast({
                                                text: `${reqBody.user.name}님의 락커 등록이 완료되었습니다. `,
                                            })
                                        )
                                    }
                                } else if (membershipItems.length > 0) {
                                    func = () => {
                                        this.nxStore.dispatch(
                                            showToast({
                                                text: `${reqBody.user.name}님의 회원권 등록이 완료되었습니다. `,
                                            })
                                        )
                                    }
                                }
                                if (!_.isEmpty(reqBody.signData)) {
                                    this.fileService
                                        .urlToFileList(reqBody.signData, 'signData.png')
                                        .then((fileList) => {
                                            this.fileService
                                                .createFile(
                                                    {
                                                        type_code: 'file_type_center_contract',
                                                        center_id: reqBody.centerId,
                                                        center_contract_id: contract.id,
                                                        center_user_id: reqBody.user.id,
                                                    },
                                                    fileList
                                                )
                                                .subscribe(() => {
                                                    func()
                                                    reqBody.callback()
                                                })
                                        })
                                } else {
                                    func()
                                    reqBody.callback()
                                }
                            })
                        )
                        .pipe(
                            catchError((err) => {
                                reqBody.errCallback()
                                return EMPTY
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

    // check locker, membership items exist
    checkLockerItemsExist = this.effect((centerId$: Observable<string>) =>
        centerId$.pipe(
            switchMap((centerId) =>
                this.centerLockerApi.getCategoryList(centerId).pipe(
                    tap({
                        next: (lockerCategs) => {
                            const doExist = _.some(lockerCategs, (v) => v.item_count != 0)
                            this.setLockerItemsExist(doExist)
                        },
                        error: (err) => {
                            console.log('register-ml-fullmodal store - checkLockerItemsExist err: ', err)
                        },
                    })
                )
            )
        )
    )
    checkMembershipItemsExist = this.effect((centerId$: Observable<string>) =>
        centerId$.pipe(
            switchMap((centerId) =>
                this.centerMembershipApi.getCategoryList(centerId).pipe(
                    tap({
                        next: (membershipCategs) => {
                            const doExist = _.some(membershipCategs, (v) => v.item_count != 0)
                            this.setMembershipItemExist(doExist)
                        },
                        error: (err) => {
                            console.log('register-ml-fullmodal store - checkMembershipItemsExist err: ', err)
                        },
                    })
                )
            )
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
            lockerCategoryId: lockerCategory.id,
            lockerCategoryName: lockerCategory.name,
            status: 'modify' as const,
        }
    }

    async initMembershipItem(membership: MembershipItem): Promise<MembershipTicket> {
        return {
            type: 'membership',
            loadingType: 'new',
            date: {
                startDate: dayjs().format('YYYY-MM-DD'),
                endDate: dayjs()
                    .add(membership.days - 1, 'day')
                    .format('YYYY-MM-DD'),
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
            lessonList: [],
            status: 'modify' as const,
        }
    }

    // 회원권을 지웠을 경우에 연결된 수업을 얻을 수 없음
    async initMembershipItemByUM(userMembership: UserMembership, curUser: CenterUser): Promise<MembershipTicket> {
        const center = this.storageService.getCenter()
        const linkedClass = await firstValueFrom(
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

        return {
            type: 'membership',
            date: {
                startDate: dayjs().format('YYYY-MM-DD'),
                endDate: dayjs()
                    .add(dayjs(contractMembership.end_date).diff(contractMembership.start_date, 'day'), 'day')
                    .format('YYYY-MM-DD'),
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
            count: { count: String(contractMembership.count), infinite: contractMembership.unlimited },
            assignee: undefined,
            membershipItem: {
                id: userMembership.membership_item_id,
                category_id: userMembership.membership_category_id,
                category_name: userMembership.category_name,
                name: contractMembership.name,
                days: dayjs(contractMembership.end_date).diff(contractMembership.start_date, 'day') + 1,
                count: contractMembership.count, // userMembership.count - userMembership.used_count,
                unlimited: contractMembership.unlimited,
                price: cmTotalPrice,
                color: contractMembership.color,
                memo: '',
                sequence_number: 0,
                category_sequence_number: 0,
            },
            lessonList: _.map(linkedClass, (value) => {
                return { selected: true, item: value }
            }),
            status: 'modify' as const,
        }
    }
}
