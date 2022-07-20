import { UserInfo } from '@schemas/user-info'
import { CenterInfo } from '@schemas/center-info'
import { Payment } from '@schemas/payment'
import { Unpaid } from '@schemas/unpaid'
import { UserLockerHistory } from '@schemas/user-locker-history'
import { Refund } from '@schemas/refund'

export interface UserLocker {
    id: string
    state_code:
        | 'user_locker_state_in_use'
        | 'user_locker_state_paused'
        | 'user_locker_state_refund'
        | 'user_locker_state_expired'
    state_code_name: string
    locker_category_id: string
    locker_item_id: string
    center_id: string
    center_name: string
    category_name: string
    name: string
    start_date: string
    end_date: string
    pause_start_date: string
    pause_end_date: string
    created_by: string
    created_at: string
    updated_by: string
    updated_at: string

    user_id: string
    user_name: string
    user_color: string
    user_picture: string
    user_background: string
    center_user_name: string
    center_user_memo: string
    center_user_picture: string
    center_user_background: string

    total_price: number
    total_refund: number
    total_unpaid: number
}
