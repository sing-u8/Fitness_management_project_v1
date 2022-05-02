import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'

import { EMPTY, Observable } from 'rxjs'
import { filter, switchMap, tap, catchError } from 'rxjs/operators'

import _ from 'lodash'
import dayjs from 'dayjs'

import { CenterUserListService } from '@services/helper/center-user-list.service'

import {
    MembershipTicket,
    Locker,
    MembershipLockerItem,
    ChoseLockers,
    Instructor,
    UpdateChoseLocker,
} from '@schemas/center/dashboard/register-ml-fullmodal'

import { MembershipItem } from '@schemas/membership-item'
import { LockerItem } from '@schemas/locker-item'
import { LockerCategory } from '@schemas/locker-category'
import { CenterUser } from '@schemas/center-user'

export interface State {
    mlItems: MembershipLockerItem[]
    choseLockers: ChoseLockers
    instructors: CenterUser[]
}
export const stateInit: State = {
    mlItems: [],
    choseLockers: new Map(),
    instructors: [],
}

@Injectable()
export class RegisterMembershipLockerFullmodalStore extends ComponentStore<State> {
    public readonly mlItems$ = this.select((s) => s.mlItems)
    public readonly choseLockers$ = this.select((s) => s.choseLockers)
    public readonly instructors$ = this.select((s) => s.instructors)

    constructor(private centerUserListService: CenterUserListService) {
        super(stateInit)
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
        console.log('addMlItem in rml cmpStore  1: ', mlItem, state)
        state.mlItems.unshift(mlItem)
        console.log('addMlItem in rml cmpStore  2 : ', mlItem, state)
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
                            // const instList = _.map(instructors, (v) => ({
                            //     name: v.center_user_name,
                            //     value: v,
                            // }))
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

    // helperFunction

    initLockerItem(locker: LockerItem, lockerCategory: LockerCategory): Locker {
        return {
            type: 'locker',
            assignee: undefined,
            date: { startDate: dayjs().format('YYYY-MM-DD'), endDate: '' },
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
            assignee: undefined,
            date: {
                startDate: dayjs().format('YYYY-MM-DD'),
                endDate: dayjs().add(membership.days, 'day').format('YYYY-MM-DD'),
            },
            price: {
                card: '',
                cash: '',
                trans: '',
                unpaid: '',
            },
            count: { count: String(membership.count), infinite: membership.unlimited },
            membershipItem: membership,
            lessonList: _.map(membership.class_items, (value) => {
                return { selected: true, item: value }
            }),
            status: 'modify' as const,
        }
    }
}
