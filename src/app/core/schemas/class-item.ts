import { CenterUser } from './center-user'
import { MembershipItem } from './membership-item'

export interface ClassItem {
    id: string
    category_id: string
    category_name: string
    type_code: 'class_item_type_onetoone' | 'class_item_type_group'
    type_code_name: string
    name: string
    duration: number
    capacity: number
    instructors: CenterUser[]
    color: string
    memo: string
    start_booking_until: number
    end_booking_before: number
    cancel_booking_before: number
    sequence_number: number
}

export interface FE_ClassItem extends ClassItem {
    membership_items: Array<MembershipItem>
}
