export interface ChatRoomMessage {
    id: string
    user_id: string
    user_name: string
    user_picture: string
    user_background: string
    user_color: string
    type_code: ChatRoomMessageType
    type_code_name: string
    text: string
    url: string
    originalname: string
    mimetype: string
    size: number
    unread_user_ids: string[]
    created_at: string
    deleted_at: string
}

export interface ChatRoomLoadingMessage extends ChatRoomMessage {
    gauge: {
        id: string
        value: number
    }
}

export type ChatRoomMessageType =
    | 'chat_room_message_type_text'
    | 'chat_room_message_type_file'
    | 'chat_room_message_type_system'
    | 'fe_chat_room_message_type_date'
