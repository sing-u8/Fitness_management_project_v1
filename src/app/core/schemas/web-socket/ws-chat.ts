import { ChatRoom } from '@schemas/chat-room'
import { ChatRoomMessage } from '@schemas/chat-room-message'
import { ChatRoomUser } from '@schemas/chat-room-user'

export type Topic = 'chat_room' | 'chat_room_user' | 'chat_room_message'
export type Operation = 'create' | 'update' | 'delete' | 'read'

export interface Base {
    topic: Topic
    operation: Operation
    info: { center_id: string }
    dataset: any
}

export interface CreateChatRoom extends Base {
    topic: 'chat_room'
    operation: 'create'
    info: {
        center_id: string
    }
    dataset: Array<ChatRoom>
}
export interface ReadChatRoom extends Base {
    topic: 'chat_room'
    operation: 'read'
    info: {
        center_id: string
        chat_room_id: string
        user_id: string
    }
    dataset: Array<never>
}
export interface UpdateChatRoom extends Base {
    topic: 'chat_room'
    operation: 'update'
    info: { chat_room_id: string; center_id: string }
    dataset: Array<ChatRoom>
}

export interface DeleteChatRoomUser extends Base {
    topic: 'chat_room_user'
    operation: 'delete'
    info: { chat_room_id: string; chat_room_user_id: string; center_id: string }
    dataset: Array<ChatRoomUser>
}
export interface CreateChatRoomUser extends Base {
    topic: 'chat_room_user'
    operation: 'create'
    info: { chat_room_id: string; center_id: string }
    dataset: Array<ChatRoomUser>
}

export interface CreateChatRoomMessage extends Base {
    topic: 'chat_room_message'
    operation: 'create'
    info: { chat_room_id: string; center_id: string }
    dataset: Array<ChatRoomMessage>
}
export interface DeleteChatRoomMessage extends Base {
    topic: 'chat_room_message'
    operation: 'delete'
    info: { chat_room_id: string; message_id: string; center_id: string }
    dataset: Array<never>
}
