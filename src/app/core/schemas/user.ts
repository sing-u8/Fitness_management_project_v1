import { File } from './file'
import { Gym } from './gym'

export interface User {
    // default information
    id: string
    provider: string
    membership_number: string
    name: string
    nick_name: string
    sex: string
    birth_date: string
    email: string
    email_verified: boolean
    color: string

    // terms
    privacy: boolean
    service_terms: boolean
    sms_marketing: boolean
    email_marketing: boolean
    push_notification: boolean

    // etc
    picture: Array<File>
    background: Array<File>
    access_token: string
    refresh_token: string
    custom_token: string

    // -- / frontend props
    phone_number?: string
    phone_number_verified?: boolean
    selected_gym?: Gym
    sign_in_method?: string
    fcm_token: string
}
