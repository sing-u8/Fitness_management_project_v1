import { MembershipItem } from '@schemas/membership-item'
import { ClassItem } from '@schemas/class-item'
import { LockerItem } from '@schemas/locker-item'
import { LockerCategory } from '@schemas/locker-category'
import { CenterUser } from '@schemas/center-user'
import { UserLocker } from '@schemas/user-locker'

export type ItemType = 'locker' | 'membership'
export type PriceType = 'cash' | 'card' | 'trans' | 'unpaid'

export type Instructor = { name: string; value: CenterUser }
export type TotalPrice = Record<PriceType, { price: number; name: string }>
export type Price = Record<PriceType, string>

export type MembershipTicket = {
    date?: { startDate: string; endDate: string }
    amount?: { normalAmount: string; paymentAmount: string }
    price?: Price
    count?: { count: string; infinite: boolean }
    assignee?: { name: string; value: CenterUser }
    membershipItem: MembershipItem
    status?: 'idle' | 'done'
}

export type LockerTicket = {
    date?: { startDate: string; endDate: string }
    amount?: { normalAmount: string; paymentAmount: string }
    price?: Price
    assignee?: { name: string; value: CenterUser }
    userLocker: UserLocker
    status?: 'idle' | 'done'
}
