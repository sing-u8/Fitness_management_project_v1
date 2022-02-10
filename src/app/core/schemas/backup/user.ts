import { Gym } from './gym'

export interface User {
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
    access_token: string
    refresh_token: string
    custom_token: string
    notification_yn: number
    selected_gym?: Gym
    sign_in_method?: string
}
