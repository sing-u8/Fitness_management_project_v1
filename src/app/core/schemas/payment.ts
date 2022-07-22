import { CenterUser } from '@schemas/center-user'
export interface Payment {
    id: string
    user_membership_id: string
    user_membership_category_name: string
    user_membership_name: string
    user_locker_id: string
    user_locker_category_name: string
    user_locker_name: string
    type_code: 'payment_type_payment' | 'payment_type_refund' | 'payment_type_transfer'
    type_code_name: string
    card: number
    trans: number
    vbank: number
    phone: number
    cash: number
    unpaid: number
    memo: string
    responsibility_user_id: string
    responsibility_user_name: string
    responsibility_center_user_name: string
    created_by: string
    created_at: string
    updated_by: string
    updated_at: string
}
