import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import _ from 'lodash'
import dayjs from 'dayjs'

import * as CommunitydActions from '../actions/sec.community.actions'

// schema
import { ChatRoom, IsTmepRoom } from '@schemas/chat-room'
import { ChatRoomMessage, ChatRoomLoadingMessage } from '@schemas/chat-room-message'
import { ChatRoomUser } from '@schemas/chat-room-user'
import { Loading } from '@schemas/store/loading'
import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'
import { ChatFile } from '@schemas/center/community/chat-file'

export type spot = 'main' | 'drawer'

export interface State {
    // common
    curCenterId: string
    isLoading: Loading
    error: string

    // main
    chatRoomList: Array<ChatRoom>

    // main - screen = main
    mainPreChatRoom: ChatRoom
    mainCurChatRoom: ChatRoom
    mainChatRoomMsgs: Array<ChatRoomMessage>
    mainChatRoomLoadingMsgs: Array<ChatRoomLoadingMessage>
    mainChatRoomUserList: Array<ChatRoomUser>
    // main - drawer
    drawerPreChatRoom: ChatRoom
    drawerCurChatRoom: ChatRoom
    drawerChatRoomMsgs: Array<ChatRoomMessage>
    drawerChatRoomLoadingMsgs: Array<ChatRoomLoadingMessage>
    drawerChatRoomUserList: Array<ChatRoomUser>
}

export const initialState: State = {
    // common
    curCenterId: undefined,
    isLoading: 'idle',
    error: '',

    // main
    chatRoomList: [],

    // main - screen = main
    mainPreChatRoom: undefined,
    mainCurChatRoom: undefined,
    mainChatRoomMsgs: [],
    mainChatRoomLoadingMsgs: [],
    mainChatRoomUserList: [],
    // main - drawer
    drawerPreChatRoom: undefined,
    drawerCurChatRoom: undefined,
    drawerChatRoomMsgs: [],
    drawerChatRoomLoadingMsgs: [],
    drawerChatRoomUserList: [],
}

export const communityReducer = createImmerReducer(
    initialState,
    // async
    on(CommunitydActions.finishCreateChatRoom, (state, { chatRoom, spot }) => {
        if (spot == 'main') {
            state.mainCurChatRoom = chatRoom
            state.mainChatRoomUserList = chatRoom.chat_room_users
        } else {
            state.drawerCurChatRoom = chatRoom
            state.drawerChatRoomUserList = chatRoom.chat_room_users
        }
        state.chatRoomList.unshift(chatRoom)
        return state
    }),

    on(CommunitydActions.startGetChatRooms, (state) => {
        state.isLoading = 'pending'
        return state
    }),
    on(CommunitydActions.finishGetChatRooms, (state, { chatRooms, spot }) => {
        state.chatRoomList = chatRooms
        const myChatRoom = chatRooms.find((v) => v.type_code == 'chat_room_type_chat_with_me')
        if (spot == 'main' && myChatRoom != undefined) {
            state.mainCurChatRoom = myChatRoom
            state.mainChatRoomUserList = myChatRoom.chat_room_users
        } else if (myChatRoom != undefined) {
            state.drawerCurChatRoom = myChatRoom
            state.drawerChatRoomUserList = myChatRoom.chat_room_users
        }
        state.isLoading = 'done'

        return state
    }),
    on(CommunitydActions.startJoinChatRoom, (state, { chatRoom, spot }) => {
        console.log(' startJoinChatRoom ------ ', chatRoom)
        state.isLoading = 'pending'
        const chatRoomIdx = state.chatRoomList.findIndex((v) => v.id == chatRoom.id)
        const _chatRoom = _.cloneDeep(chatRoom)
        _chatRoom.unread_message_count = 0

        state.chatRoomList[chatRoomIdx] = _chatRoom

        if (spot == 'main') {
            state.mainPreChatRoom = state.mainCurChatRoom
            state.mainCurChatRoom = _chatRoom
        } else {
            state.drawerPreChatRoom = state.drawerPreChatRoom
            state.drawerCurChatRoom = _chatRoom
        }
        return state
    }),
    on(CommunitydActions.finishJoinChatRoom, (state, { chatRoom, chatRoomMesgs, chatRoomUsers, spot }) => {
        // !! 추후에 추가 수정 필요
        state.isLoading = 'done'

        if (spot == 'main') {
            state.mainPreChatRoom = undefined
            state.mainChatRoomMsgs = chatRoomMesgs
            state.mainChatRoomUserList = chatRoomUsers
        } else {
            state.drawerPreChatRoom = undefined
            state.drawerChatRoomMsgs = chatRoomMesgs
            state.drawerChatRoomUserList = chatRoomUsers
        }
        return state
    }),
    on(CommunitydActions.startUpdateChatRoomName, (state, { spot, reqBody }) => {
        if (spot == 'main') {
            state.mainCurChatRoom.name = reqBody.name
            state.chatRoomList.find((v) => v.id == state.mainCurChatRoom.id).name = reqBody.name
        } else {
            state.drawerCurChatRoom.name = reqBody.name
            state.chatRoomList.find((v) => v.id == state.drawerCurChatRoom.id).name = reqBody.name
        }
        return state
    }),
    on(CommunitydActions.finishUpdateChatRoomName, (state, { spot, chatRoom }) => {
        if (spot == 'main') {
            state.mainCurChatRoom = chatRoom
            state.chatRoomList[state.chatRoomList.findIndex((v) => v.id == state.mainCurChatRoom.id)] = chatRoom
        } else {
            state.drawerCurChatRoom = chatRoom
            state.chatRoomList[state.chatRoomList.findIndex((v) => v.id == state.drawerCurChatRoom.id)] = chatRoom
        }
        return state
    }),
    on(CommunitydActions.startLeaveChatRoom, (state, { spot }) => {
        state.isLoading = 'pending'
        if (spot == 'main') {
            state.mainPreChatRoom = state.mainCurChatRoom
            state.mainCurChatRoom = undefined
            state.mainChatRoomMsgs = []
            state.chatRoomList = state.chatRoomList.filter((v) => v.id != state.mainPreChatRoom.id)
        } else {
            state.drawerPreChatRoom = state.drawerCurChatRoom
            state.drawerCurChatRoom = undefined
            state.drawerChatRoomMsgs = []
            state.chatRoomList = state.chatRoomList.filter((v) => v.id != state.drawerPreChatRoom.id)
        }
        return state
    }),
    on(CommunitydActions.finishLeaveChatRoom, (state, { spot }) => {
        if (spot == 'main') {
            state.mainPreChatRoom = undefined
        } else {
            state.drawerPreChatRoom = undefined
        }
        return state
    }),
    on(CommunitydActions.startInviteMembers, (state, { invitedMembers, spot }) => {
        const _invitedMembers = centerUserToChatRoomMemberUser(invitedMembers)

        // !! 채팅방 속성에 인원이 추가되면 인원수도 추가하기
        if (spot == 'main') {
            state.mainCurChatRoom.chat_room_users = [
                ...state.mainCurChatRoom.chat_room_users,
                ..._invitedMembers,
            ].slice(0, 5)

            state.mainCurChatRoom.chat_room_user_count += _invitedMembers.length
            const idx = state.chatRoomList.findIndex((v) => v.id == state.mainCurChatRoom.id)
            state.chatRoomList[idx].chat_room_users = state.mainCurChatRoom.chat_room_users
            state.chatRoomList[idx].chat_room_user_count += _invitedMembers.length

            state.mainChatRoomUserList = [...state.mainChatRoomUserList, ..._invitedMembers]
        } else {
            state.drawerCurChatRoom.chat_room_users = [
                ...state.drawerCurChatRoom.chat_room_users,
                ..._invitedMembers,
            ].slice(0, 5)

            state.drawerCurChatRoom.chat_room_user_count += _invitedMembers.length
            const idx = state.chatRoomList.findIndex((v) => v.id == state.drawerCurChatRoom.id)
            state.chatRoomList[idx].chat_room_users = state.drawerCurChatRoom.chat_room_users
            state.chatRoomList[idx].chat_room_user_count += _invitedMembers.length

            state.drawerChatRoomUserList = [...state.drawerChatRoomUserList, ..._invitedMembers]
        }
        return state
    }),
    on(CommunitydActions.finishiInviteMembers, (state, { spot, chatRoom }) => {
        if (spot == 'main') {
            state.mainCurChatRoom = chatRoom
            state.chatRoomList[state.chatRoomList.findIndex((v) => v.id == state.mainCurChatRoom.id)] =
                state.mainCurChatRoom
        } else {
            state.drawerCurChatRoom = chatRoom
            state.chatRoomList[state.chatRoomList.findIndex((v) => v.id == state.drawerCurChatRoom.id)] =
                state.drawerCurChatRoom
        }
        return state
    }),

    // on(CommunitydActions.startSendMessage, (state, { spot }) => {
    //     if (spot == 'main') {
    //     } else {
    //     }
    //     return state
    // }),
    on(CommunitydActions.finishSendMessage, (state, { spot, chatRoomMessage }) => {
        if (spot == 'main') {
            state.mainChatRoomMsgs.unshift(chatRoomMessage)
        } else {
            state.drawerChatRoomMsgs.unshift(chatRoomMessage)
        }
        return state
    }),

    // on(CommunitydActions.finishSendMessageWithFile, (state) => {
    //     return state
    // }),

    // - // for temp romm
    on(CommunitydActions.finishSendMessageToTempRoom, (state, { spot, chatRoomMessage, chatRoom }) => {
        let preTempChatRoom: ChatRoom = undefined
        // !! 채팅 유저리스트는 임시 채팅방을 만들 때 해놨음, 필요 시 이것도 API에서 받아와야함.
        if (spot == 'main') {
            preTempChatRoom = state.mainCurChatRoom
            state.mainCurChatRoom = chatRoom
            state.mainChatRoomMsgs = [chatRoomMessage]
            state.chatRoomList[state.chatRoomList.findIndex((v) => v.id == preTempChatRoom.id)] = chatRoom
        } else {
            preTempChatRoom = state.drawerCurChatRoom
            state.drawerCurChatRoom = chatRoom
            state.drawerChatRoomMsgs = [chatRoomMessage]
            state.chatRoomList[state.chatRoomList.findIndex((v) => v.id == preTempChatRoom.id)] = chatRoom
        }
        return state
    }),

    // sync
    on(CommunitydActions.joinTempChatRoom, (state, { chatRoom, spot }) => {
        if (spot == 'main') {
            state.mainCurChatRoom = chatRoom
            state.mainChatRoomUserList = chatRoom.chat_room_users
            state.mainChatRoomMsgs = []
        } else {
            state.drawerCurChatRoom = chatRoom
            state.drawerChatRoomUserList = chatRoom.chat_room_users
            state.drawerChatRoomMsgs = []
        }
        return state
    }),
    on(CommunitydActions.createTempChatRoom, (state, { center, members, curUser, spot }) => {
        const tempChatRoom = makeTempChatRoom(center, curUser, members)
        state.chatRoomList.unshift(tempChatRoom)
        if (spot == 'main') {
            state.mainCurChatRoom = tempChatRoom
            state.mainChatRoomUserList = tempChatRoom.chat_room_users
            state.mainChatRoomMsgs = []
        } else {
            state.drawerCurChatRoom = tempChatRoom
            state.drawerChatRoomUserList = tempChatRoom.chat_room_users
            state.drawerChatRoomMsgs = []
        }
        return state
    }),
    on(CommunitydActions.leaveTempChatRoom, (state, { spot }) => {
        if (spot == 'main') {
            state.chatRoomList = _.filter(state.chatRoomList, (v) => v.id != state.mainCurChatRoom.id)
            state.mainCurChatRoom = undefined
            state.mainChatRoomMsgs = []
            state.mainChatRoomUserList = []
        } else {
            state.chatRoomList = _.filter(state.chatRoomList, (v) => v.id != state.mainCurChatRoom.id)
            state.drawerCurChatRoom = undefined
            state.drawerChatRoomUserList = []
            state.drawerChatRoomMsgs = []
        }
        return state
    }),

    on(CommunitydActions.addChatRoomLoadingMsgs, (state, { spot, msg }) => {
        if (spot == 'main') {
            state.mainChatRoomLoadingMsgs.unshift(msg)
        } else {
            state.drawerChatRoomLoadingMsgs.unshift(msg)
        }
        return state
    }),
    on(CommunitydActions.updateChatRoomLoadingMsg, (state, { spot, msgId, gauge }) => {
        if (spot == 'main') {
            state.mainChatRoomLoadingMsgs[
                state.mainChatRoomLoadingMsgs.findIndex((v) => v.gauge.id == msgId)
            ].gauge.value = gauge
        } else {
            state.drawerChatRoomLoadingMsgs[
                state.drawerChatRoomLoadingMsgs.findIndex((v) => v.gauge.id == msgId)
            ].gauge.value = gauge
        }
        return state
    }),
    on(CommunitydActions.removeChatRoomLoadingMsgs, (state, { spot, loadingMsgId }) => {
        if (spot == 'main') {
            state.mainChatRoomLoadingMsgs = state.mainChatRoomLoadingMsgs.filter((v) => v.gauge.id != loadingMsgId)
        } else {
            state.drawerChatRoomLoadingMsgs = state.drawerChatRoomLoadingMsgs.filter((v) => v.gauge.id != loadingMsgId)
        }
        return state
    }),

    // for web socket
    // ! 있는 채팅방에 회원이 초대 됐을 때 초대에 관한 웹 소켓이 없음
    on(CommunitydActions.createChatRoomByWS, (state, { ws_data }) => {
        state.chatRoomList.unshift(ws_data.dataset[0])
        return state
    }),
    on(CommunitydActions.updateChatRoomByWS, (state, { ws_data }) => {
        const chatRoomIdx = state.chatRoomList.findIndex((v) => v.id == ws_data.dataset[0].id)
        state.chatRoomList[chatRoomIdx] = ws_data.dataset[0]

        if (!_.isEmpty(state.mainCurChatRoom) && state.mainCurChatRoom.id == ws_data.info.chat_room_id) {
            state.mainCurChatRoom = ws_data.dataset[0]
        }
        if (!_.isEmpty(state.drawerCurChatRoom) && state.drawerCurChatRoom.id == ws_data.info.chat_room_id) {
            state.drawerCurChatRoom = ws_data.dataset[0]
        }

        return state
    }),

    on(CommunitydActions.deleteChatRoomUserByWS, (state, { ws_data }) => {
        const chatRoomIdx = state.chatRoomList.findIndex((v) => v.id == ws_data.info.chat_room_id)

        const chatRoom = state.chatRoomList[chatRoomIdx]

        chatRoom.chat_room_users.filter((v) => v.id != ws_data.dataset[0].id)
        chatRoom.chat_room_user_count -= 1
        state.chatRoomList[chatRoomIdx] = chatRoom

        if (!_.isEmpty(state.mainCurChatRoom) && state.mainCurChatRoom.id == ws_data.info.chat_room_id) {
            state.mainCurChatRoom = chatRoom
            state.mainChatRoomUserList = state.mainChatRoomUserList.filter((v) => v.id != ws_data.dataset[0].id)
        }
        if (!_.isEmpty(state.drawerCurChatRoom) && state.drawerCurChatRoom.id == ws_data.info.chat_room_id) {
            state.drawerCurChatRoom = chatRoom
            state.drawerChatRoomUserList = state.drawerChatRoomUserList.filter((v) => v.id != ws_data.dataset[0].id)
        }

        return state
    }),

    on(CommunitydActions.createChatRoomMsgByWS, (state, { ws_data }) => {
        const chatRoomIdx = state.chatRoomList.findIndex((v) => v.id == ws_data.info.chat_room_id)
        const chatRoom = state.chatRoomList[chatRoomIdx]

        chatRoom.last_message = ws_data.dataset[0].text
        chatRoom.last_message_created_at = ws_data.dataset[0].created_at
        chatRoom.unread_message_count += 1

        if (!_.isEmpty(state.mainCurChatRoom) && state.mainCurChatRoom.id == ws_data.info.chat_room_id) {
            state.mainChatRoomMsgs.unshift(ws_data.dataset[0])
            chatRoom.unread_message_count -= 1
        }
        if (!_.isEmpty(state.drawerCurChatRoom) && state.drawerCurChatRoom.id == ws_data.info.chat_room_id) {
            state.drawerChatRoomMsgs.unshift(ws_data.dataset[0])
            chatRoom.unread_message_count -= 1
        }

        return state
    }),
    on(CommunitydActions.deleteChatRoomMsgByWS, (state, { ws_data }) => {
        // ! 아직 적용되지 않은 기능
        const chatRoomIdx = state.chatRoomList.findIndex((v) => v.id == ws_data.info.chat_room_id)
        // const chatRoom = state.chatRoomList[chatRoomIdx]

        if (!_.isEmpty(state.mainCurChatRoom) && state.mainCurChatRoom.id == ws_data.info.chat_room_id) {
            state.mainChatRoomMsgs.filter((v) => v.id != ws_data.info.message_id)
        }
        if (!_.isEmpty(state.drawerCurChatRoom) && state.drawerCurChatRoom.id == ws_data.info.chat_room_id) {
            state.drawerChatRoomMsgs.filter((v) => v.id != ws_data.info.message_id)
        }
        return state
    }),

    // common
    on(CommunitydActions.setCurCenterId, (state, { centerId }) => {
        state.curCenterId = centerId
        return state
    }),
    on(CommunitydActions.error, (state, { error }) => {
        state.error = error
        return state
    }),
    on(CommunitydActions.resetAll, (state) => {
        state = { ...state, ...initialState }
        return state
    })
)

// main
export const selectChatRoomList = (state: State) => state.chatRoomList
// main - screen = main
export const selectMainPreChatRoom = (state: State) => state.mainPreChatRoom
export const selectMainCurChatRoom = (state: State) => state.mainCurChatRoom
export const selectMainChatRoomMsgs = (state: State) => state.mainChatRoomMsgs
export const selectMainChatRoomLoadingMsgs = (state: State) => state.mainChatRoomLoadingMsgs
export const selectMainChatRoomUserList = (state: State) => state.mainChatRoomUserList
// main - drawer
export const selectDrawerPreChatRoom = (state: State) => state.drawerPreChatRoom
export const selectDrawerCurChatRoom = (state: State) => state.drawerCurChatRoom
export const selectDrawerChatRoomMsgs = (state: State) => state.drawerChatRoomMsgs
export const selectDrawerChatRoomLoadingMsgs = (state: State) => state.drawerChatRoomLoadingMsgs
export const selectDrawerChatRoomUserList = (state: State) => state.drawerChatRoomUserList

// common
export const selectCurCenterId = (state: State) => state.curCenterId
export const selectIsLoading = (state: State) => state.isLoading
export const selectError = (state: State) => state.error

// etc selector
export const selectCurMainChatRoomIsTemp = (state: State) =>
    state.mainCurChatRoom && _.includes(state.mainCurChatRoom.id, IsTmepRoom)
export const selectCurDrawerChatRoomIsTemp = (state: State) =>
    state.drawerCurChatRoom && _.includes(state.drawerCurChatRoom.id, IsTmepRoom)

//

// helper
function centerUserToChatRoomMemberUser(members: Array<CenterUser>): Array<ChatRoomUser> {
    return _.map(members, (v) => ({
        id: v.id,
        name: v.center_user_name,
        permission_code: 'chat_room_user_permission_member',
        permission_code_name: '멤버',
        color: v.color,
        picture: v.center_user_picture,
        background: v.center_user_background,
    }))
}
function centerUserToChatRoomOwnerUser(curUser: CenterUser): ChatRoomUser {
    return {
        id: curUser.id,
        name: curUser.center_user_name,
        permission_code: 'chat_room_user_permission_owner',
        permission_code_name: '소유자',
        color: curUser.color,
        picture: curUser.center_user_picture,
        background: curUser.center_user_background,
    }
}

function makeTempChatRoom(center: Center, curUser: CenterUser, members: Array<CenterUser>): ChatRoom {
    return {
        id: 'temp_room-' + dayjs().format('YYMMDD/HH:mm:SSS'), // if temp chatroom, id = temp-room
        type_code: 'chat_room_type_general',
        type_code_name: '일반',
        permission_code: 'chat_room_user_permission_owner',
        permission_code_name: '소유자',
        name: members.reduce((acc, cur) => acc + `, ${cur.center_user_name}`, `${curUser.center_user_name}`),
        center_name: center.name,
        chat_room_user_count: 1 + members.length,
        chat_room_users: [
            {
                id: curUser.id,
                name: curUser.center_user_name,
                permission_code: 'chat_room_user_permission_owner',
                permission_code_name: '소유자',
                color: curUser.color,
                picture: curUser.center_user_picture,
                background: curUser.center_user_background,
            },
            ...members.map((v) => ({
                id: v.id,
                name: v.center_user_name,
                permission_code: 'chat_room_user_permission_member',
                permission_code_name: '멤버',
                color: v.color,
                picture: v.center_user_picture,
                background: v.center_user_background,
            })),
        ],
        last_message: null,
        last_message_created_at: null,
        unread_message_count: 0,
    }
}
