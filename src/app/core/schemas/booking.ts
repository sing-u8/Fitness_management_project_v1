import { CenterUser } from '@schemas/center-user'

export interface Booking {
    id: string
    state_code: 'user_membership_class_booking_state_cancel' | 'user_membership_class_booking_state_booked' // task_end
    state_code_name: string
    name: string
    start: string
    end: string
    color: string
    memo: string
    type_code: string
    type_code_name: string
    duration: number
    capacity: number
    start_booking: string
    end_booking: string
    cancel_booking: string
    instructors: Array<CenterUser>
}
