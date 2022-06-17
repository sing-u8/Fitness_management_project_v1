export interface ChatRoomMessage {
    id: string
    user_id: string
    user_name: string
    user_picture: string
    user_background: string
    type_code: ChatRoomMessageType
    type_code_name: string
    text: string
    url: string
    originalname: string
    mimetype: string
    size: number
    read_yn: number
    created_at: string
}

export interface ChatRoomLoadingMessage extends ChatRoomMessage {
    gauge: {
        id: string
        value: number
    }
}

export type ChatRoomMessageType = 'chat_room_message_type_text' | 'chat_room_message_type_file'
