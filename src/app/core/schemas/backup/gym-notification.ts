import { User, Link, File } from '@schemas/firestore/message'

export interface Sender {
    sender_id: string
    is_sent_from_gym: boolean // default false
}

export interface GymNotification {
    user_ids: Array<string>
    sender: Sender
    category: {
        interface: 'notification | chat'
        chat: {
            room_id: string
            message: {
                interface: 'text | image | video | file'
                text: string
                file: Array<File>
                // "--NOT_REQUIRED_BELOW_FIELDS--": "--NOT_REQUIRED_BELOW_FIELDS--"
                user?: User
                link?: Link
                timestamp?: number
                unreadUserIds?: Array<string>
                unreadCount?: number
            }
        }
        notification: {
            script: string
            file: [
                {
                    url: string
                    originFileName: string
                    mimeinterface: string
                }
            ]
        }
    }
}
