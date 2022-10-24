import { MembershipItem } from '@schemas/membership-item'
import { CenterUser } from '@schemas/center-user'
import { ClassItem } from '@schemas/class-item'

export type PriceType = 'cash' | 'card' | 'trans' | 'unpaid'
export type TotalPrice = Record<PriceType, { price: number; name: string }>

export type MembershipTicket = {
    type: 'membership'
    date?: { startDate: string; endDate: string }
    amount?: { normalAmount: string; paymentAmount: string }
    price?: Record<PriceType, string>
    count?: { count: string; infinite: boolean }
    assignee?: { name: string; value: CenterUser }
    membershipItem: MembershipItem
    lessonList: Array<{ selected: boolean; item: ClassItem }>
}
