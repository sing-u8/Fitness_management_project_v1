export interface LockerTicketHistory {
    id: string
    locker_item_id: string
    status: string
    start_date: string
    end_date: string
    purchase_days: number
    remaining_days: number
    price: number
    status_name: string
    locker_category_id: string
    locker_category_name: string
    locker_item_name: string
    created_at: string
}
