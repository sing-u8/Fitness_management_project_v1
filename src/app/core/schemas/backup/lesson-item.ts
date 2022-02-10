import { GymUser } from './gym-user'
import { MembershipItem } from './membership-item'

export interface LessonItem {
    id?: string
    category_name?: string
    type?: string
    type_name?: string
    name?: string
    minutes?: number
    people?: number
    color?: string
    reservation_start?: number
    reservation_end?: number
    reservation_cancel_end?: number
    memo?: string
    sequence_number?: number
    trainer?: GymUser
    membership_item_list?: Array<MembershipItem>
}
