import { CenterUser } from '@schemas/center-user'
import { MembershipItem } from '@schemas/membership-item'
export interface CalendarTaskClass {
    id: string
    class_item_id: string
    category_name: string
    name: string
    type_code: 'class_item_type_onetoone' | 'class_item_type_group'
    type_code_name: string
    state_code: string
    state_code_name: string
    duration: number
    capacity: number
    start_booking: string
    end_booking: string
    cancel_booking: string
    membership_items: Array<MembershipItem>
    instructors: Array<CenterUser>
}
