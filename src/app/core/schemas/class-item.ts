import { CenterUser } from './center-user'
import { MembershipItem } from './membership-item'

export interface ClassItem {
    id: string
    category_id: string
    category_name: string
    category_sequence_number: number
    type_code: 'class_item_type_onetoone' | 'class_item_type_group'
    type_code_name: string
    name: string
    duration: number
    capacity: number
    color: string
    memo: string
    start_booking_until: number
    end_booking_before: number
    cancel_booking_before: number
    sequence_number: number
    instructors: CenterUser[]
}

export interface FE_ClassItem extends ClassItem {
    membership_items: Array<MembershipItem>
}

export const DragulaClass = 'D_CLASS'
export const DragulaClassCategory = 'D_CLASS_CATEGORY'
