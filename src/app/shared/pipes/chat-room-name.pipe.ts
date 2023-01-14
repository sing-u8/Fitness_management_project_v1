import { Pipe, PipeTransform } from '@angular/core'
import { ChatRoom } from '@schemas/chat-room'
import { CenterUser } from '@schemas/center-user'
import _ from 'lodash'

@Pipe({
    name: 'chatRoomName',
})
export class ChatRoomNamePipe implements PipeTransform {
    transform(value: { chatRoom: ChatRoom; curCenterUser: CenterUser }): string {
        return this.getChatRoomName(value.curCenterUser, value.chatRoom)
    }

    getChatRoomName = (curCenterUser: CenterUser, chatRoom: ChatRoom): string => {
        if (chatRoom.type_code == 'chat_room_type_chat_with_me') {
            return chatRoom.name
        } else if (
            (chatRoom.chat_room_users.length == 1 &&
                _.isEmpty(chatRoom.name) &&
                chatRoom.permission_code == 'chat_room_user_permission_owner') ||
            (chatRoom.chat_room_users.length == 1 &&
                _.isEmpty(chatRoom.name) &&
                chatRoom.permission_code == 'chat_room_user_permission_member')
        ) {
            return chatRoom.chat_room_users[0].name
        } else if (chatRoom.chat_room_users.length > 1 && _.isEmpty(chatRoom.name)) {
            let userNames = _.map(chatRoom.chat_room_users, (v) => v.name)
            userNames.push(curCenterUser.name)
            userNames = _.sortBy(userNames, (v) => v)
            return _.reduce(
                userNames,
                (a, v, i) => {
                    if (userNames.length > i + 1) {
                        return a + v + ', '
                    } else {
                        return a + v
                    }
                },
                ''
            )
        } else {
            return chatRoom.name
        }
    }
}
