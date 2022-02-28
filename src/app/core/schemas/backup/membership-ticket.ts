// 나중에 추가하기
import { ClassItem } from '@schemas/class-item'
// import { UserMembershipHistory } from '@schemas/user-membership-history'

export interface MembershipTicket {
    id: string
    gym_id: string
    status: string
    name: string
    category_name: string
    content: string
    membership_item_id: number
    start_date: string
    end_date: string
    period: number
    remaining_days: number
    holding_start_date: string
    holding_end_date: string
    holding_remaining_days: number
    holding_reservation_days: number
    count: number
    infinity_yn: number
    reservation_count: number
    lesson_count: number
    price: number
    refund: number
    paid_date: string
    gym_name: string
    status_name: string
    lesson_item_list: ClassItem[]
    lesson_item_ids: string[]
    history: any[] // UserMembershipHistory[]
    assignee: [
        {
            id: number
            gym_id: number
            user_id: string
            content: string
            pay_cash: number
            pay_card: number
            pay_trans: number
            unpaid: number
            paid_date: string
            refund: number
            items: Array<{
                id: number
                sales_id: string
                category: string
                locker_ticket_id: string
                membership_ticket_id: string
                content_name: string
                price: number
                paid_date: string
                customer_id: string
                customer_name: string
                customer_picture: string
                customer_color: string
                customer_phone_number: string
                assignee_id: string
                assignee_name: string
            }>
        }
    ]
}
