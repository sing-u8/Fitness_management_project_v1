import { ChatRoom } from '@schemas/chat-room'
import { ChatRoomMessage } from '@schemas/chat-room-message'
import { ChatRoomUser } from '@schemas/chat-room-user'
import { CenterUser } from '@schemas/center-user'

export type Topic = ChatTopic | TouchPadTopic
export type Operation = ChatOperation | TouchPadOperation

export type ChatTopic = 'chat_room' | 'chat_room_user' | 'chat_room_message'
export type ChatOperation = 'create' | 'update' | 'delete' | 'read'

export type TouchPadTopic = 'touchpad'
export type TouchPadOperation = 'call' | 'check_in'

export interface Base {
    topic: Topic
    operation: Operation
    info: { center_id: string }
    dataset: any
}

// 0
export interface CreateChatRoom extends Base {
    topic: 'chat_room'
    operation: 'create'
    info: {
        center_id: string
    }
    dataset: Array<ChatRoom>
}
// 0
export interface ReadChatRoom extends Base {
    topic: 'chat_room'
    operation: 'read'
    info: {
        center_id: string
        chat_room_id: string
        center_user_id: string
        center_user_email: string
    }
    dataset: Array<never>
}
// 0
export interface UpdateChatRoom extends Base {
    topic: 'chat_room'
    operation: 'update'
    info: { chat_room_id: string; center_id: string }
    dataset: Array<ChatRoom>
}
// 0
export interface DeleteChatRoomUser extends Base {
    topic: 'chat_room_user'
    operation: 'delete'
    info: { center_id: string; chat_room_id: string; center_user_id: string; center_user_email: string }
    dataset: Array<never>
}
// 0
export interface CreateChatRoomUser extends Base {
    topic: 'chat_room_user'
    operation: 'create'
    info: { chat_room_id: string; center_id: string }
    dataset: Array<ChatRoomUser>
}

// 0
export interface CreateChatRoomMessage extends Base {
    topic: 'chat_room_message'
    operation: 'create'
    info: { chat_room_id: string; center_id: string; center_user_email: string; center_user_id: string }
    dataset: Array<ChatRoomMessage>
}
// 0
export interface DeleteChatRoomMessage extends Base {
    topic: 'chat_room_message'
    operation: 'delete'
    info: { chat_room_id: string; message_id: string; center_id: string }
    dataset: Array<ChatRoomMessage> // index: 0 - 삭제된 메시지; index: 1 - 최신 메시지
}

// -- touch pad
export interface touchPadCall extends Base {
    topic: 'touchpad'
    operation: 'call'
    info: { center_id: string }
    dataset: Array<never>
}
export interface touchPadCheckIn extends Base {
    topic: 'touchpad'
    operation: 'check_in'
    info: { center_id: string }
    dataset: Array<CenterUser>
}
