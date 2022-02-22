import { Center } from './center'

export interface User {
    // default information
    id: string
    provider: string
    membership_number: string
    name: string
    sex: string
    birth_date: string
    email: string
    email_verified: boolean
    phone_number: string
    phone_number_verified: boolean
    color: string

    // terms
    privacy: boolean
    service_terms: boolean
    sms_marketing: boolean
    email_marketing: boolean
    push_notification: boolean

    // etc
    picture: string
    background: string
    access_token: string
    refresh_token: string
    custom_token: string

    // -- / frontend props
    selected_center?: Center
    sign_in_method?: string
    fcm_token: string
}
