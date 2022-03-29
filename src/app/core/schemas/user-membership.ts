import { UserInfo } from '@schemas/user-info'
import { CenterInfo } from '@schemas/center-info'
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
    start_date: string
    end_date: string
    pause_start_date: string
    pause_end_date: string
    count: number
    unlimited: boolean
    created_by: string
    created_at: string
    updated_by: string
    updated_at: string
    user: UserInfo
    center: CenterInfo
    class: UserMembershipClass
    reservation: any
    used: UserMembershipUsed
    payment: Payment
    unpaid: Unpaid
    refund: Refund
    history: UserLockerHistory
}
