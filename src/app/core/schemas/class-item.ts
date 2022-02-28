import { CenterUser } from './center-user'
import { MembershipItem } from './membership-item'

export interface ClassItem {
    id: string
    category_name: string
    type_code: string
    type_code_name: string
    name: string
    minutes: number
    people: number
    instructor: CenterUser
    color: string
    memo: string
    reservation_days: number
    reservation_deadline_time: number
    reservation_cancellation_time: number
    sequence_number: number
    membership_items: Array<MembershipItem>
}
