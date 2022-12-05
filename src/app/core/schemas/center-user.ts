import { RoleCode } from '@schemas/center'
export interface CenterUser {
    id:string
    membership_number:string
    name:string
    sex:string
    birth_date:string
    email:string
    phone_number:string
    color:string
    memo:string
    created_at:string
    picture:string
    background:string
    role_code:string
    role_name:string
    last_check_in:string
    service080:string
    user_membership_count:number
    user_membership_end_date:string
    total_unpaid:number
}

// id: string
// provider: string
// membership_number: string
// name: string
// sex: string
// birth_date: string
// email: string
// email_verified: boolean
// phone_number: string
// phone_number_verified: boolean
// color: string
// privacy: boolean
// service_terms: boolean
// sms_marketing: boolean
// email_marketing: boolean
// push_notification: boolean
// picture: string
// background: string
// role_code: RoleCode
// role_name: string
// center_membership_number: string
// center_user_name: string
// center_user_memo: string
// center_user_picture: string
// center_user_background: string
// created_at: string
// user_membership_count: number // 모든 회원권 수
// user_membership_end_date: string // 회원권 중 가장 빠른 end_date
// total_unpaid: number // 미납금
// last_check_in: string // YYYY-MM-DD HH:mm:ss
// service080: string
// last_logged_at: string
