import { CenterUser } from '@schemas/center-user'
export interface CalendarTaskClass {
    id: string
    class_item_id: string
    type_code: string
    type_code_name: string
    state_code: string
    state_code_name: string
    duration: number
    capacity: number
    start_booking: string
    end_booking: string
    cancel_booking: string
    instructors: Array<CenterUser>
}
