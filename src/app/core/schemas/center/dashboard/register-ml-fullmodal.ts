import { MembershipItem } from '@schemas/membership-item'
import { ClassItem } from '@schemas/class-item'
import { LockerItem } from '@schemas/locker-item'
import { LockerCategory } from '@schemas/locker-category'
import { CenterUser } from '@schemas/center-user'

export type ItemType = 'locker' | 'membership'
export type PriceType = 'cash' | 'card' | 'trans' | 'unpaid'
export type MembershipLockerItem = MembershipTicket | Locker
export type ChoseLockers = Map<string, { [lockerId: string]: LockerItem }>
export type UpdateChoseLocker = {
    locker: LockerItem
    lockerCategId: string
}
export type Instructor = { name: string; value: CenterUser }
export type TotlaPrice = Record<PriceType, { price: number; name: string }>

export type MembershipTicket = {
    type: 'membership'
    date?: { startDate: string; endDate: string }
    amount?: { normalAmount: string; paymentAmount: string }
    price?: Record<PriceType, string>
    count?: { count: string; infinite: boolean }
    assignee?: { name: string; value: CenterUser }
    membershipItem: MembershipItem
    lessonList: Array<{ selected: boolean; item: ClassItem }>
    status?: 'done' | 'modify'
}

export type Locker = {
    type: 'locker' // membership
    date?: { startDate: string; endDate: string }
    amount?: { normalAmount: string; paymentAmount: string }
    price?: Record<PriceType, string>
    assignee?: { name: string; value: CenterUser }
    locker: LockerItem
    lockerCategory: LockerCategory
    status?: 'done' | 'modify'
}
