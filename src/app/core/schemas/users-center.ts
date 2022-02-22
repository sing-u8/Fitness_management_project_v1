export interface CenterUser {
    id: string
    provider: string
    family_name: string
    given_name: string
    picture: string
    sex: string
    birth_date: string
    email: string
    email_verified: number
    phone_number: string
    phone_number_verified: number
    membership_number: string
    fcm_token: string
    color: string
    terms_eula: number
    terms_privacy: number
    marketing_sms: number
    marketing_email: number
    notification_yn: number
    access_token: string
    refresh_token: string
    custom_token: string
    gym_user_name: string
    role_code: RoleCode // administrator, manager, staff, member
    role_name: string
    memo: string
    registration_at: string
}

export type RoleCode = 'administrator' | 'manager' | 'staff' | 'member'
