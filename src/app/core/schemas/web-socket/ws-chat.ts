import { ChatRoom } from '@schemas/chat-room'
import { ChatRoomMessage } from '@schemas/chat-room-message'
import { ChatRoomUser } from '@schemas/chat-room-user'

export type Topic = 'chat_room' | 'chat_room_user' | 'chat_room_message'
export type Operation = 'create' | 'update' | 'delete'

export interface Base {
    topic: Topic
    operation: Operation
    info: any
    dataset: any
}

export interface CreateChatRoom extends Base {
    topic: 'chat_room'
    operation: 'create'
    info: Record<string, never>
    dataset: Array<ChatRoom>
}
export interface UpdateChatRoom {
    topic: 'chat_room'
    operation: 'update'
    info: { chat_room_id: string }
    dataset: Array<ChatRoom>
}

export interface DeleteChatRoomUser {
    topic: 'chat_room_user'
    operation: 'delete'
    info: { chat_room_id: string; chat_room_user_id: string }
    dataset: Array<ChatRoomUser>
}

export interface CreateChatRoomMessage {
    topic: 'chat_room_message'
    operation: 'create'
    info: { chat_room_id: string }
    dataset: Array<ChatRoomMessage>
}
export interface DeleteChatRoomMessage {
    topic: 'chat_room_message'
    operation: 'delete'
    info: { chat_room_id: string; message_id: string }
    dataset: Array<never>
}
