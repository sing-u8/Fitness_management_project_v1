import { ChatRoomUser } from './chat-room-user'

export interface ChatRoom {
    id: string | IsTempRoomType // if temp chatroom, id = temp_room
    type_code: ChatRoomTypeCode
    type_code_name: ChatRoomTypeCodeName
    permission_code: ChatRoomPermissionCode
    permission_code_name: ChatRoomPermissionCodeName
    name: string
    push_notification: boolean
    center_id: string
    center_name: string
    chat_room_user_count: number
    chat_room_users: Array<ChatRoomUser>
    chat_room_user_names: string
    last_message: string
    last_message_created_at: string
    unread_message_count: number
}
export type ChatRoomPermissionCode = 'chat_room_user_permission_member' | 'chat_room_user_permission_owner'
export type ChatRoomPermissionCodeName = '멤버' | '소유자'
export type ChatRoomTypeCode = 'chat_room_type_chat_with_me' | 'chat_room_type_general'
export type ChatRoomTypeCodeName = '일반' | '나와의 채팅'
export type IsTempRoomType = 'temp_room'

export const IsTmepRoom = 'temp_room'
