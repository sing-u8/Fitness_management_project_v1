import { UserInfo } from '@schemas/user-info'
import { CenterInfo } from '@schemas/center-info'
import { ClassItem } from '@schemas/class-item'
import { Payment } from '@schemas/payment'
import { Unpaid } from '@schemas/unpaid'
import { Refund } from '@schemas/refund'
import { UserLockerHistory } from '@schemas/user-locker-history'
import { UserMembershipClass } from '@schemas/user-membership-class'
import { UserMembershipUsed } from '@schemas/user-membership-used'

export interface UserMembership {
    id: string
    state_code: 'user_membership_state_in_use' | 'user_membership_state_paused' | 'user_membership_state_refund'
    state_code_name: string
    membership_category_id: string
    membership_item_id: string
    center_name: string
    category_name: string
    name: string
    start_date: string
    end_date: string
    pause_start_date: string
    pause_end_date: string
    booked_count: number
    used_count: number
    count: number
    unlimited: boolean
    color: string
    created_by: string
    created_at: string
    updated_by: string
    updated_at: string
    total_price: number
    total_refund: number

    // !! will be removed
    user?: UserInfo
    center?: CenterInfo
    class?: Array<ClassItem>
    payment?: Array<Payment>
    history?: Array<UserLockerHistory>
}
