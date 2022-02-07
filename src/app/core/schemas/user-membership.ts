import { UserMembershipHistory } from './user-membership-history'

export interface UserMembership {
    id: string
    gym_id: string
    status: string
    name: string
    content: string
    start_date: string
    end_date: string
    period: number
    remaining_days: number
    count: number
    infinity_yn: number
    reservation_count: number
    lesson_count: number
    price: number
    refund: number
    gym_name: string
    status_name: string
    lesson_item_ids: Array<string>
    history: Array<UserMembershipHistory>
}
