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
    state_code: string
    state_code_name: string
    category_name: string
    name: string
    start_date: string
    end_date: string
    pause_start_date: string
    pause_end_date: string
    count: number
    unlimited: boolean
    color: string
    created_by: string
    created_at: string
    updated_by: string
    updated_at: string
    user: UserInfo
    center: CenterInfo
    class: Array<ClassItem>
    payment: Array<Payment>
    history: Array<UserLockerHistory>
    // refund: Refund
}
