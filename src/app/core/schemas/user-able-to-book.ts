import { UserMembership } from '@schemas/user-membership'

export interface UserAbleToBook {
    id: string
    membership_number: string
    name: string
    sex: string
    birth_date: string
    email: string
    phone_number: string
    color: string
    memo: string
    created_at: string
    picture: string
    background: string
    role_code: string
    role_name: string
    user_memberships: Array<UserMembership>
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
// role_code: string
// role_name: string
// center_user_name: string
// center_user_memo: string
// center_user_picture: string
// center_user_background: string
// created_at: string
// user_memberships: Array<UserMembership>
