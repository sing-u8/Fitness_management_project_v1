import { UserInfo } from '@schemas/user-info'
import { CenterInfo } from '@schemas/center-info'
import { Payment } from '@schemas/payment'
import { Unpaid } from '@schemas/unpaid'
import { UserLockerHistory } from '@schemas/user-locker-history'

export interface UserLocker {
    id: string
    locker_item_id: string
    state_code: string
    state_code_name: string
    start_date: string
    end_date: string
    created_by: string
    created_at: string
    updated_by: string
    updated_at: string
    user: UserInfo
    center: CenterInfo
    payment: Payment
    unpaid: Unpaid
    history: UserLockerHistory
}
