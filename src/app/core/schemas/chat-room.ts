export interface ChatRoom {
    id: string
    type_code: string
    type_code_name: string
    permission_code: string
    permission_code_name: string
    name: string
    center_name: string
    chat_room_user_picture_list: Array<string>
    last_message: string
    last_message_created_at: string
    unread_message_count: number
}
