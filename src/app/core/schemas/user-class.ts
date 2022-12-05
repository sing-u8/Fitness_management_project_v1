import { CenterUser } from '@schemas/center-user'
import { UserMembership } from '@schemas/user-membership'

export interface UserClass {
    id: string
    name: string
    start: string
    end: string
    all_day: boolean
    color: string
    memo: string
    type_code: string
    type_code_name: string
    duration: number
    capacity: number
    start_booking: string
    end_booking: string
    cancel_booking: string
    booked_count: number
    attended_count: number
    center_name: string
    instructors: Array<CenterUser>
    user_membership: UserMembership
    calendar_task_id: string
    booking_id: string
}
