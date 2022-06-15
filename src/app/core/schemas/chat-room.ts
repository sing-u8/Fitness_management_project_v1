import { ChatRoomUser } from './chat-room-user'

export interface ChatRoom {
    id: string
    type_code: 'chat_room_type_chat_with_me' | 'chat_room_type_general'
    type_code_name: string
    permission_code: 'chat_room_user_permission_member' | 'chat_room_user_permission_owner'
    permission_code_name: string
    name: string
    center_name: string
    chat_room_users: Array<ChatRoomUser>
    last_message: string
    last_message_created_at: string
    unread_message_count: number
}
