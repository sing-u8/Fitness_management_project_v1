import { CenterUser } from '@schemas/center-user'
import { MembershipItem } from '@schemas/membership-item'
export interface CalendarTaskClass {
    id: string
    class_item_id: string
    category_name: string
    type_code: 'class_item_type_onetoone' | 'class_item_type_group'
    type_code_name: string
    name: string
    state_code: string
    state_code_name: string
    duration: number
    capacity: number
    start_booking_until: number
    end_booking_before: number
    cancel_booking_before: number
    start_booking: string
    end_booking: string
    cancel_booking: string
    booked_count: number
    instructors: Array<CenterUser>
    membership_items: Array<MembershipItem>
}
