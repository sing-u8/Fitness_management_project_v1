import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'

import { EMPTY, Observable } from 'rxjs'
import { filter, switchMap, tap, catchError } from 'rxjs/operators'

import _ from 'lodash'
import dayjs from 'dayjs'

import { MembershipItem } from '@schemas/membership-item'
import { ClassItem } from '@schemas/class-item'
import { LockerItem } from '@schemas/locker-item'
import { LockerCategory } from '@schemas/locker-category'
import { CenterUser } from '@schemas/center-user'

export type ItemType = 'locker' | 'membership'

export type MembershipTicket = {
    type?: ItemType // locker
    date?: { startDate: string; endDate: string }
    amount?: { normalAmount: string; paymentAmount: string }
    price?: {
        cash: string
        card: string
        trans: string
        unpaid: string
    }
    count?: { count: string; infinite: boolean }
    assignee?: { name: string; value: CenterUser }
    membershipItem: MembershipItem
    lessonList: Array<{ selected: boolean; item: ClassItem }>
    // lessons?: Array<LessonItem>
    status?: 'done' | 'modify'
}

export type Locker = {
    type?: ItemType // membership
    date?: { startDate: string; endDate: string }
    amount?: { normalAmount: string; paymentAmount: string }
    price?: {
        cash: string
        card: string
        trans: string
        unpaid: string
    }
    assignee?: { name: string; value: CenterUser }
    locker: LockerItem
    lockerCategory: LockerCategory
    status?: 'done' | 'modify'
}

export type MembershipLockerItem = MembershipTicket | Locker
export type ChoseLockers = Map<string, { [lockerId: string]: LockerItem }>

const itemListInit: MembershipLockerItem[] = []

export interface State {
    mlItemList: MembershipLockerItem[]
    choseLockers: ChoseLockers
}
export const stateInit: State = {
    mlItemList: [],
    choseLockers: new Map(),
}

@Injectable()
export class RegisterMembershipLockerFullmodalStore extends ComponentStore<State> {
    public readonly mlItemList$ = this.select((s) => s.mlItemList)
    public readonly choseLocker$ = this.select((s) => s.choseLockers)

    constructor() {
        super(stateInit)
    }

    updateChoseLockers = this.updater(
        (
            state,
            data: {
                locker: LockerItem
                lockerCategId: string
            }
        ) => {
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
        }
    )

    resetChoseLockers = this.updater((state) => {
        state.choseLockers.clear()
        return {
            ...state,
        }
    })

    addMlItem = this.updater((state, mlItem: MembershipLockerItem) => {
        state.mlItemList.unshift(mlItem)
        return {
            ...state,
        }
    })

    removeMlItem = this.updater((state, index: number) => {
        const removedItem = state.mlItemList[index]
        if (removedItem.type == 'locker') {
            const removedItem = state.mlItemList[index] as Locker
            const newCategLockers = state.choseLockers.get(removedItem.lockerCategory.id)
            delete newCategLockers[removedItem.locker.id]
            state.choseLockers.set(removedItem.lockerCategory.id, newCategLockers)
        } else {
            const removedItem = state.mlItemList[index] as MembershipTicket
        }
        const newMlList = _.filter(state.mlItemList, (v, i) => i != index)
        return {
            ...state,
            mlItemList: newMlList,
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
            state.mlItemList[data.index] = data.item
            return {
                ...state,
            }
        }
    )

    // helperFunction

    initLockerItem(locker: LockerItem, lockerCategory: LockerCategory) {
        return {
            type: 'locker',
            assignee: undefined,
            date: { startDate: dayjs().format('YYYY-MM-DD'), endDate: '' },
            price: '',
            locker: locker,
            lockerCategory: lockerCategory,
            status: 'modify' as const,
        }
    }

    initMembershipItem(membership: MembershipItem) {
        const price = membership.price ? membership.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'
        return {
            type: 'membership',
            assignee: undefined,
            date: {
                startDate: dayjs().format('YYYY-MM-DD'),
                endDate: dayjs().add(membership.days, 'day').format('YYYY-MM-DD'),
            },
            price: price,
            count: { count: String(membership.count), infinite: membership.unlimited },
            membershipItem: membership,
            lessonList: _.map(membership.class_items, (value) => {
                return { selected: true, item: value }
            }),
            status: 'modify' as const,
        }
    }
}
