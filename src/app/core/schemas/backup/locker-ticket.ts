export interface LockerTicket {
    id: string
    status: string
    user_id: string
    user_name: string
    user_picture: string
    gym_id: string
    gym_name: string
    locker_category_id: string
    locker_category_name: string
    locker_item_id: string
    locker_item_name: string
    start_date: string
    end_date: string
    pay_card: number
    pay_cash: number
    pay_trans: number
    unpaid: number
    pay_date: string
    refund: number
}
