import { Sender } from '@schemas/gym-notification'

export interface UserNotification {
    id: string
    sender: Sender
    user_id: string
    gym_id: string
    title: string
    script: string
    file: string
    read_yn: number // 0 or 1
    created_at: string
}

export interface UnreadNotification {
    unread_count: number
}
