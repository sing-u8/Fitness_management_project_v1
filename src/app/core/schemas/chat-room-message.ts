export interface ChatRoomMessage {
    id: string
    center_user_id: string
    center_user_name: string
    center_user_email: string
    center_user_color: string
    center_user_picture: string
    center_user_background: string
    type_code: ChatRoomMessageType
    type_code_name: string
    text: string
    url: string
    originalname: string
    mimetype?: string // !! need to be removed later
    contentType: string
    size: number
    unread_center_user_ids: string[]
    unread_center_user_emails: string[]
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
