import { ChatRoomUser } from './chat-room-user'

export interface ChatRoom {
    id: string
    type_code: ChatRoomTypeCode
    type_code_name: string
    permission_code: ChatRoomPermissionCode
    permission_code_name: string
    name: string
    center_name: string
    chat_room_users: Array<ChatRoomUser>
    last_message: string
    last_message_created_at: string
    unread_message_count: number
}

export type ChatRoomPermissionCode = 'chat_room_user_permission_member' | 'chat_room_user_permission_owner'
export type ChatRoomTypeCode = 'chat_room_type_chat_with_me' | 'chat_room_type_general'
