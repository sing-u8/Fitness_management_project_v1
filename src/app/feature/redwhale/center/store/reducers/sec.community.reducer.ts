import { on } from '@ngrx/store'
import { createImmerReducer } from 'ngrx-immer/store'
import _ from 'lodash'
import dayjs from 'dayjs'

import * as CommunitydActions from '../actions/sec.community.actions'

// schema
import { ChatRoom, IsTmepRoom } from '@schemas/chat-room'
import { ChatRoomLoadingMessage, ChatRoomMessage } from '@schemas/chat-room-message'
import { ChatRoomUser } from '@schemas/chat-room-user'
import { Loading } from '@schemas/store/loading'
import { CenterUser } from '@schemas/center-user'
import { Center } from '@schemas/center'

export const messagePageSize = 20

export type spot = 'main' | 'drawer' | 'both'
export type ChatLoaded = {
    isLoading: Loading
    curCenterId: string
}
export type CurChatLoaded = {
    main: {
        isLoading: Loading
        curCenterId: string
    }
    drawer: {
        isLoading: Loading
        curCenterId: string
    }
}

export interface State {
    // common
    curCenterId: string // for main
    isLoading: Loading // for main
    drawerIsLoading: Loading
    drawerCurCenterId: string
    error: string

    // main and drawer
    chatRoomList: Array<ChatRoom>

    // main - screen = main
    mainIsJoinRoomLoading: Loading
    mainPreChatRoom: ChatRoom
    mainCurChatRoom: ChatRoom
    mainChatRoomMsgs: Array<ChatRoomMessage>
    mainChatRoomMsgLoading: boolean
    mainChatRoomMsgEnd: boolean
    mainChatRoomLoadingMsgs: Array<ChatRoomLoadingMessage>
    mainChatRoomUserList: Array<ChatRoomUser>
    // main - drawer
    drawerIsJoinRoomLoading: Loading
    drawerPreChatRoom: ChatRoom
    drawerCurChatRoom: ChatRoom
    drawerChatRoomMsgs: Array<ChatRoomMessage>
    drawerChatRoomMsgLoading: boolean
    drawerChatRoomMsgEnd: boolean
    drawerChatRoomLoadingMsgs: Array<ChatRoomLoadingMessage>
    drawerChatRoomUserList: Array<ChatRoomUser>
    // // excluded for reset
    drawerJoinedChatRoom: ChatRoom
}

export const initialState: State = {
    // common
    curCenterId: undefined,
    isLoading: 'idle',
    drawerIsLoading: 'idle',
    drawerCurCenterId: undefined,
    error: '',

    // main
    chatRoomList: [],

    // main - screen = main
    mainIsJoinRoomLoading: 'idle',
    mainPreChatRoom: undefined,
    mainCurChatRoom: undefined,
    mainChatRoomMsgs: [],
    mainChatRoomMsgEnd: false,
    mainChatRoomMsgLoading: false,
    mainChatRoomLoadingMsgs: [],
    mainChatRoomUserList: [],
    // main - drawer
    drawerIsJoinRoomLoading: 'idle',
    drawerPreChatRoom: undefined,
    drawerCurChatRoom: undefined,
    drawerChatRoomMsgs: [],
    drawerChatRoomMsgEnd: false,
    drawerChatRoomMsgLoading: false,
    drawerChatRoomLoadingMsgs: [],
    drawerChatRoomUserList: [],
    drawerJoinedChatRoom: undefined,
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

    on(CommunitydActions.startGetChatRooms, (state, { spot }) => {
        if (spot == 'main') {
            state.isLoading = 'pending'
        } else if (spot == 'drawer') {
            state.drawerIsLoading = 'pending'
        }
        return state
    }),
    on(CommunitydActions.finishGetChatRooms, (state, { chatRooms, spot }) => {
        state.chatRoomList = chatRooms
        const myChatRoom = chatRooms.find((v) => v.type_code == 'chat_room_type_chat_with_me')

        if (spot == 'main' && myChatRoom != undefined) {
            state.mainCurChatRoom = myChatRoom
            state.mainChatRoomUserList = myChatRoom.chat_room_users
        } else if (spot == 'drawer' && myChatRoom != undefined) {
            state.drawerCurChatRoom = myChatRoom
            state.drawerChatRoomUserList = myChatRoom.chat_room_users
        }

        if (spot == 'main') {
            state.isLoading = 'done'
        } else if (spot == 'drawer') {
            state.drawerIsLoading = 'done'
        }

        return state
    }),
    on(CommunitydActions.startJoinChatRoom, (state, { chatRoom, spot }) => {
        const chatRoomIdx = state.chatRoomList.findIndex((v) => v.id == chatRoom.id)
        const _chatRoom = _.cloneDeep(chatRoom)
        _chatRoom.unread_message_count = 0

        state.chatRoomList[chatRoomIdx] = _chatRoom

        const joinMain = () => {
            state.mainIsJoinRoomLoading = 'pending'
            state.mainPreChatRoom = state.mainCurChatRoom
            state.mainCurChatRoom = _chatRoom
            state.mainChatRoomMsgEnd = false
        }
        const joinDrawer = () => {
            state.drawerIsJoinRoomLoading = 'pending'
            state.drawerPreChatRoom = state.drawerCurChatRoom
            state.drawerCurChatRoom = _chatRoom
            state.drawerChatRoomMsgEnd = false
        }

        if (spot == 'main') {
            joinMain()
        } else if (spot == 'drawer') {
            joinDrawer()
        } else if (spot == 'both') {
            joinMain()
            joinDrawer()
        }
        return state
    }),
    on(CommunitydActions.finishJoinChatRoom, (state, { chatRoomMesgs, chatRoomUsers, spot }) => {
        const joinRoomMain = () => {
            state.mainIsJoinRoomLoading = 'done'

            state.mainPreChatRoom = undefined
            state.mainChatRoomMsgs = getDateInsteredMessage(chatRoomMesgs)
            state.mainChatRoomUserList = chatRoomUsers

            const lastMsgDate = _.last(state.mainChatRoomMsgs)?.created_at
            if (chatRoomMesgs.length < messagePageSize && lastMsgDate) {
                state.mainChatRoomMsgs.push(makeDateMessage(lastMsgDate))
            }
        }
        const joinRoomDrawer = () => {
            state.drawerIsJoinRoomLoading = 'done'

            state.drawerPreChatRoom = undefined
            state.drawerChatRoomMsgs = getDateInsteredMessage(chatRoomMesgs)
            state.drawerChatRoomUserList = chatRoomUsers

            const lastMsgDate = _.last(state.drawerChatRoomMsgs)?.created_at
            if (chatRoomMesgs.length < messagePageSize && lastMsgDate) {
                state.drawerChatRoomMsgs.push(makeDateMessage(lastMsgDate))
            }
        }

        if (spot == 'main') {
            joinRoomMain()
        } else if (spot == 'drawer') {
            joinRoomDrawer()
        } else if (spot == 'both') {
            joinRoomMain()
            joinRoomDrawer()
        }
        return state
    }),
    on(CommunitydActions.skipFinishJoinChatRoom, (state, { spot }) => {
        if (spot == 'main') {
            state.mainIsJoinRoomLoading = 'done'
        } else if (spot == 'drawer') {
            state.drawerIsJoinRoomLoading = 'done'
        } else if (spot == 'both') {
            state.mainIsJoinRoomLoading = 'done'
            state.drawerIsJoinRoomLoading = 'done'
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
        const leaveChatRoomMain = () => {
            state.isLoading = 'pending'
            state.mainPreChatRoom = state.mainCurChatRoom
            state.mainCurChatRoom = undefined
            state.mainChatRoomMsgs = []
            state.chatRoomList = state.chatRoomList.filter((v) => v.id != state.mainPreChatRoom.id)
        }
        const leaveChatRoomDrawer = () => {
            state.drawerIsLoading = 'pending'
            state.drawerPreChatRoom = state.drawerCurChatRoom
            state.drawerCurChatRoom = undefined
            state.drawerChatRoomMsgs = []
            state.chatRoomList = state.chatRoomList.filter((v) => v.id != state.drawerPreChatRoom.id)
        }

        if (spot == 'main') {
            if (state.mainCurChatRoom.id == state.drawerCurChatRoom?.id) {
                leaveChatRoomDrawer()
            }
            leaveChatRoomMain()
        } else {
            if (state.mainCurChatRoom?.id == state.drawerCurChatRoom.id) {
                leaveChatRoomMain()
            }
            leaveChatRoomDrawer()
        }
        return state
    }),
    on(CommunitydActions.finishLeaveChatRoom, (state, { spot }) => {
        if (spot == 'main') {
            state.isLoading = 'done'
            state.mainPreChatRoom = undefined
        } else if (spot == 'drawer') {
            state.drawerIsLoading = 'done'
            state.drawerPreChatRoom = undefined
        } else if (spot == 'both') {
            state.isLoading = 'done'
            state.mainPreChatRoom = undefined

            state.drawerIsLoading = 'done'
            state.drawerPreChatRoom = undefined
        }
        return state
    }),
    on(CommunitydActions.startInviteMembers, (state, { invitedMembers, spot }) => {
        // !! createChatRoomUserByWS 부분이랑 중복이라 코드 제거
        // const _invitedMembers = centerUserToChatRoomMemberUser(invitedMembers)

        // // !! 채팅방 속성에 인원이 추가되면 인원수도 추가하기
        // if (spot == 'main') {
        //     state.mainCurChatRoom.chat_room_users = [
        //         ...state.mainCurChatRoom.chat_room_users,
        //         ..._invitedMembers,
        //     ].slice(0, 5)

        //     state.mainCurChatRoom.chat_room_user_count += _invitedMembers.length
        //     const idx = state.chatRoomList.findIndex((v) => v.id == state.mainCurChatRoom.id)
        //     state.chatRoomList[idx].chat_room_users = state.mainCurChatRoom.chat_room_users
        //     state.chatRoomList[idx].chat_room_user_count += _invitedMembers.length

        //     state.mainChatRoomUserList = [...state.mainChatRoomUserList, ..._invitedMembers]
        // } else {
        //     state.drawerCurChatRoom.chat_room_users = [
        //         ...state.drawerCurChatRoom.chat_room_users,
        //         ..._invitedMembers,
        //     ].slice(0, 5)

        //     state.drawerCurChatRoom.chat_room_user_count += _invitedMembers.length
        //     const idx = state.chatRoomList.findIndex((v) => v.id == state.drawerCurChatRoom.id)
        //     state.chatRoomList[idx].chat_room_users = state.drawerCurChatRoom.chat_room_users
        //     state.chatRoomList[idx].chat_room_user_count += _invitedMembers.length

        //     state.drawerChatRoomUserList = [...state.drawerChatRoomUserList, ..._invitedMembers]
        // }
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

    on(CommunitydActions.finishSendMessage, (state, { spot, chatRoomMessage }) => {
        const addMsgToMain = () => {
            if (
                !_.isEmpty(state.mainChatRoomMsgs[0]) &&
                checkDayDiffBtMsgAndMsg(chatRoomMessage, state.mainChatRoomMsgs[0])
            ) {
                state.mainChatRoomMsgs.unshift(makeDateMessage(chatRoomMessage.created_at))
            }
            state.mainChatRoomMsgs.unshift(chatRoomMessage)
        }
        const addMsgToDrawer = () => {
            if (
                !_.isEmpty(state.drawerChatRoomMsgs[0]) &&
                checkDayDiffBtMsgAndMsg(chatRoomMessage, state.drawerChatRoomMsgs[0])
            ) {
                state.drawerChatRoomMsgs.unshift(makeDateMessage(chatRoomMessage.created_at))
            }
            state.drawerChatRoomMsgs.unshift(chatRoomMessage)
        }

        if (spot == 'main') {
            addMsgToMain()
            if (state.mainCurChatRoom.id == state.drawerCurChatRoom?.id) {
                addMsgToDrawer()
            }
        } else {
            addMsgToDrawer()
            if (state.mainCurChatRoom?.id == state.drawerCurChatRoom.id) {
                addMsgToMain()
            }
        }
        return state
    }),

    on(CommunitydActions.startGetMoreChatRoomMsgs, (state, { spot }) => {
        if (spot == 'main') {
            state.mainChatRoomMsgLoading = true
        } else {
            state.drawerChatRoomMsgLoading = true
        }
        return state
    }),
    on(CommunitydActions.finishGetMoreChatRoomMsgs, (state, { spot, chatRoomMsgs, chatRoomMsgEnd }) => {
        if (spot == 'main') {
            const newChatRoomMsgs = getDateInsteredMessage(chatRoomMsgs)
            state.mainChatRoomMsgs = concatChatRoomMsg(state.mainChatRoomMsgs, newChatRoomMsgs)
            if (chatRoomMsgEnd) {
                state.mainChatRoomMsgs.push(makeDateMessage(_.last(state.mainChatRoomMsgs).created_at))
            }
            state.mainChatRoomMsgEnd = chatRoomMsgEnd
            state.mainChatRoomMsgLoading = false
        } else {
            const newChatRoomMsgs = getDateInsteredMessage(chatRoomMsgs)
            state.drawerChatRoomMsgs = concatChatRoomMsg(state.drawerChatRoomMsgs, newChatRoomMsgs)
            if (chatRoomMsgEnd) {
                state.drawerChatRoomMsgs.push(makeDateMessage(_.last(state.drawerChatRoomMsgs).created_at))
            }
            state.drawerChatRoomMsgEnd = chatRoomMsgEnd
            state.drawerChatRoomMsgLoading = false
        }
        return state
    }),

    // - // for temp romm
    on(CommunitydActions.finishSendMessageToTempRoom, (state, { spot, chatRoomMessage, chatRoom }) => {
        let preTempChatRoom: ChatRoom = undefined
        // !! 채팅 유저리스트는 임시 채팅방을 만들 때 해놨음, 필요 시 이것도 API에서 받아와야함.
        const addMsgToMain = () => {
            state.mainCurChatRoom = chatRoom
            // startCreateChatRoomMsgByWS와 겹치기 떄문에 이 코드는 제거
            state.mainChatRoomMsgs = [chatRoomMessage, makeDateMessage(chatRoomMessage.created_at)]
            // state.chatRoomList[state.chatRoomList.findIndex((v) => v.id == preTempChatRoom.id)] = chatRoom
        }
        const addMsgToDrawer = () => {
            state.drawerCurChatRoom = chatRoom
            // startCreateChatRoomMsgByWS와 겹치기 떄문에 이 코드는 제거
            state.drawerChatRoomMsgs = [chatRoomMessage, makeDateMessage(chatRoomMessage.created_at)]
            // state.chatRoomList[state.chatRoomList.findIndex((v) => v.id == preTempChatRoom.id)] = chatRoom
        }

        if (spot == 'main') {
            preTempChatRoom = state.mainCurChatRoom
            addMsgToMain()
            if (state.mainCurChatRoom.id == state.drawerCurChatRoom?.id) {
                addMsgToDrawer()
            }
        } else {
            preTempChatRoom = state.drawerCurChatRoom
            addMsgToDrawer()
            if (state.mainCurChatRoom?.id == state.drawerCurChatRoom.id) {
                addMsgToMain()
            }
        }
        return state
    }),

    // sync
    on(CommunitydActions.setJoinedChatRoom, (state, { chatRoom }) => {
        state.drawerJoinedChatRoom = chatRoom
        return state
    }),
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
            state.mainChatRoomUserList = tempChatRoom.chat_room_users
            tempChatRoom.chat_room_users = tempChatRoom.chat_room_users.filter((v) => v.id != curUser.id)
            state.mainCurChatRoom = tempChatRoom
            state.mainChatRoomMsgs = []
        } else {
            state.drawerChatRoomUserList = tempChatRoom.chat_room_users
            tempChatRoom.chat_room_users = tempChatRoom.chat_room_users.filter((v) => v.id != curUser.id)
            state.drawerCurChatRoom = tempChatRoom
            state.drawerChatRoomMsgs = []
        }
        return state
    }),
    on(CommunitydActions.leaveTempChatRoom, (state, { spot }) => {
        const leaveMain = () => {
            state.chatRoomList = _.filter(state.chatRoomList, (v) => v.id != state.mainCurChatRoom.id)
            state.mainCurChatRoom = undefined
            state.mainChatRoomMsgs = []
            state.mainChatRoomUserList = []
        }
        const leaveDrawer = () => {
            state.chatRoomList = _.filter(state.chatRoomList, (v) => v.id != state.drawerCurChatRoom.id)
            state.drawerCurChatRoom = undefined
            state.drawerChatRoomUserList = []
            state.drawerChatRoomMsgs = []
        }

        if (spot == 'main') {
            leaveMain()
        } else if (spot == 'drawer') {
            leaveDrawer()
        } else if (spot == 'both') {
            leaveMain()
            leaveDrawer()
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
    // ! 있는 채팅방에 회원이 초대 됐을 때 초대에 관한 웹 소켓이 없음, 방을 만든 사람의 채팅방 데이터가 들어옴...
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

    on(CommunitydActions.createChatRoomUserByWS, (state, { ws_data }) => {
        const chatRoomIdx = _.findIndex(state.chatRoomList, (chatRoom) => {
            return chatRoom.id == ws_data.info.chat_room_id
        })

        // 최근에 자신한테도 소켓이 오기 때문에... 추가한 방지책
        if (chatRoomIdx == -1) return state

        const chatRoom = _.cloneDeep(state.chatRoomList[chatRoomIdx])
        chatRoom.chat_room_users = _.slice(
            _.unionWith(chatRoom.chat_room_users, ws_data.dataset, (a, b) => a.id == b.id),
            0,
            5
        )
        chatRoom.chat_room_user_count += ws_data.dataset.length

        _.assign(state.chatRoomList[chatRoomIdx], chatRoom)

        if (state.mainCurChatRoom?.id == ws_data.info.chat_room_id) {
            state.mainCurChatRoom.chat_room_users = _.cloneDeep(chatRoom.chat_room_users)
            state.mainCurChatRoom.chat_room_user_count = chatRoom.chat_room_user_count

            state.mainChatRoomUserList = [...state.mainChatRoomUserList, ...ws_data.dataset]
        }
        if (state.drawerCurChatRoom?.id == ws_data.info.chat_room_id) {
            state.drawerCurChatRoom.chat_room_users = _.cloneDeep(chatRoom.chat_room_users)
            state.drawerCurChatRoom.chat_room_user_count = chatRoom.chat_room_user_count

            state.drawerChatRoomUserList = [...state.drawerChatRoomUserList, ...ws_data.dataset]
        }

        return state
    }),
    on(CommunitydActions.deleteChatRoomUserByWS, (state, { ws_data }) => {
        const chatRoomIdx = state.chatRoomList.findIndex((v) => v.id == ws_data.info.chat_room_id)

        const chatRoom = state.chatRoomList[chatRoomIdx]

        chatRoom.chat_room_users.filter((v) => v.id != ws_data.info.chat_room_user_id)
        chatRoom.chat_room_user_count -= 1
        state.chatRoomList[chatRoomIdx] = chatRoom

        if (!_.isEmpty(state.mainCurChatRoom) && state.mainCurChatRoom.id == ws_data.info.chat_room_id) {
            state.mainCurChatRoom = chatRoom
            state.mainChatRoomUserList = state.mainChatRoomUserList.filter(
                (v) => v.id != ws_data.info.chat_room_user_id
            )
        }
        if (!_.isEmpty(state.drawerCurChatRoom) && state.drawerCurChatRoom.id == ws_data.info.chat_room_id) {
            state.drawerCurChatRoom = chatRoom
            state.drawerChatRoomUserList = state.drawerChatRoomUserList.filter(
                (v) => v.id != ws_data.info.chat_room_user_id
            )
        }

        return state
    }),

    on(CommunitydActions.finishCreateChatRoomMsgByWS, (state, { ws_data, chatRoomIdx, chatRoomList }) => {
        let chatRoom: ChatRoom = undefined
        if (!_.isEmpty(chatRoomList)) {
            state.chatRoomList = _.cloneDeep(chatRoomList)
            chatRoom = _.cloneDeep(state.chatRoomList[chatRoomIdx])
            chatRoom.unread_message_count = 0
        } else {
            chatRoom = _.cloneDeep(state.chatRoomList[chatRoomIdx])
        }

        let lastMsg = ''
        let lastCreatedAt = dayjs().format('YYYY-MM-DD HH:mm:dd')
        let unread_msg_count = 0
        ws_data.dataset.forEach((msg) => {
            if (msg.type_code != 'chat_room_message_type_system' && msg.type_code != 'fe_chat_room_message_type_date') {
                lastMsg = msg.text
                lastCreatedAt = msg.created_at
                unread_msg_count += 1
            }
        })

        chatRoom.last_message = lastMsg
        chatRoom.last_message_created_at = lastCreatedAt
        chatRoom.unread_message_count += unread_msg_count

        const isInMainChatRoom =
            !_.isEmpty(state.mainCurChatRoom) && state.mainCurChatRoom.id == ws_data.info.chat_room_id
        const isInDrawerChatRoom =
            !_.isEmpty(state.drawerCurChatRoom) && state.drawerCurChatRoom.id == ws_data.info.chat_room_id
        if (isInMainChatRoom) {
            _.forEach(ws_data.dataset, (msg) => {
                state.mainChatRoomMsgs.unshift(msg)
            })
        }
        if (isInDrawerChatRoom) {
            _.forEach(ws_data.dataset, (msg) => {
                state.drawerChatRoomMsgs.unshift(msg)
            })
        }
        if (isInMainChatRoom || isInDrawerChatRoom) {
            chatRoom.unread_message_count -= unread_msg_count
        }

        _.assign(state.chatRoomList[chatRoomIdx], chatRoom)
        // state.chatRoomList[chatRoomIdx] = chatRoom

        return state
    }),
    on(CommunitydActions.readChatRoomByWS, (state, { ws_data }) => {
        if (state.mainCurChatRoom?.id == ws_data.info.chat_room_id) {
            _.find(state.mainChatRoomMsgs, (msg, idx) => {
                if (msg.type_code == 'fe_chat_room_message_type_date') return false
                const unread_users_ids = msg.unread_user_ids
                const readUserId = _.remove(unread_users_ids, (id) => id == ws_data.info.user_id)
                if (!_.isEmpty(readUserId)) {
                    state.mainChatRoomMsgs[idx].unread_user_ids = unread_users_ids
                    return false
                }
                return true
            })
        }
        if (state.drawerCurChatRoom?.id == ws_data.info.chat_room_id) {
            _.find(state.drawerChatRoomMsgs, (msg, idx) => {
                if (msg.type_code == 'fe_chat_room_message_type_date') return false
                const unread_users_ids = msg.unread_user_ids
                const readUserId = _.remove(unread_users_ids, (id) => id == ws_data.info.user_id)
                if (!_.isEmpty(readUserId)) {
                    state.drawerChatRoomMsgs[idx].unread_user_ids = unread_users_ids
                    return false
                }
                return true
            })
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

    // by dashboard
    on(CommunitydActions.startGetChatRoomsByDashboard, (state, { openSpot }) => {
        if (openSpot == 'main') {
            state.isLoading = 'pending'
        } else if (openSpot == 'drawer') {
            state.drawerIsLoading = 'pending'
        }
        return state
    }),
    on(CommunitydActions.finishGetChatRoomsByDashboard, (state, { openSpot, chatRooms, cb }) => {
        if (openSpot == 'main') {
            state.isLoading = 'done'
            state.mainIsJoinRoomLoading = 'done'
        } else if (openSpot == 'drawer') {
            state.drawerIsLoading = 'done'
            state.drawerIsJoinRoomLoading = 'done'
        }

        state.chatRoomList = chatRooms
        cb ? cb(chatRooms) : null
        return state
    }),

    // common
    on(CommunitydActions.setLoading, (state, { spot, loading }) => {
        if (spot == 'main') {
            state.isLoading = loading
        } else if (spot == 'drawer') {
            state.drawerIsLoading = loading
        } else if (spot == 'both') {
            state.isLoading = loading
            state.drawerIsLoading = loading
        }
        return state
    }),
    on(CommunitydActions.setCurCenterId, (state, { centerId }) => {
        state.curCenterId = centerId
        return state
    }),
    on(CommunitydActions.setDrawerCurCenterId, (state, { centerId }) => {
        state.drawerCurCenterId = centerId
        return state
    }),
    on(CommunitydActions.error, (state, { error }) => {
        state.error = error
        return state
    }),
    on(CommunitydActions.resetAll, (state, { spot }) => {
        if (spot == 'main') {
            state = {
                ...state,
                ..._.pick(initialState, [
                    'curCenterId',
                    'isLoading',
                    'error',
                    'mainIsJoinRoomLoading',
                    'mainPreChatRoom',
                    'mainCurChatRoom',
                    'mainChatRoomMsgs',
                    'mainChatRoomMsgLoading',
                    'mainChatRoomMsgEnd',
                    'mainChatRoomLoadingMsgs',
                    'mainChatRoomUserList',
                ]),
            }
        } else if (spot == 'drawer') {
            state = {
                ...state,
                ..._.pick(initialState, [
                    'drawerCurCenterId',
                    'drawerIsLoading',
                    'error',
                    'drawerIsJoinRoomLoading',
                    'drawerPreChatRoom',
                    'drawerCurChatRoom',
                    'drawerChatRoomMsgs',
                    'drawerChatRoomMsgLoading',
                    'drawerChatRoomMsgEnd',
                    'drawerChatRoomLoadingMsgs',
                    'drawerChatRoomUserList',
                ]),
            }
        }

        return state
    })
)

// main
export const selectChatRoomList = (state: State) => state.chatRoomList
// main - screen = main
export const selectMainIsJoinRoomLoading = (state: State) => state.mainIsJoinRoomLoading
export const selectMainPreChatRoom = (state: State) => state.mainPreChatRoom
export const selectMainCurChatRoom = (state: State) => state.mainCurChatRoom
export const selectMainChatRoomMsgs = (state: State) => state.mainChatRoomMsgs
export const selectMainChatRoomMsgEnd = (state: State) => state.mainChatRoomMsgEnd
export const selectMainChatRoomMsgLoading = (state: State) => state.mainChatRoomMsgLoading
export const selectMainChatRoomLoadingMsgs = (state: State) => state.mainChatRoomLoadingMsgs
export const selectMainChatRoomUserList = (state: State) => state.mainChatRoomUserList
// main - drawer
export const selectDrawerIsJoinRoomLoading = (state: State) => state.drawerIsJoinRoomLoading
export const selectDrawerPreChatRoom = (state: State) => state.drawerPreChatRoom
export const selectDrawerCurChatRoom = (state: State) => state.drawerCurChatRoom
export const selectDrawerChatRoomMsgs = (state: State) => state.drawerChatRoomMsgs
export const selectDrawerChatRoomMsgEnd = (state: State) => state.drawerChatRoomMsgEnd
export const selectDrawerChatRoomMsgLoading = (state: State) => state.drawerChatRoomMsgLoading
export const selectDrawerChatRoomLoadingMsgs = (state: State) => state.drawerChatRoomLoadingMsgs
export const selectDrawerChatRoomUserList = (state: State) => state.drawerChatRoomUserList
export const selectDrawerJoinedChatRoom = (state: State) => state.drawerJoinedChatRoom

// common
export const selectCurCenterId = (state: State) => state.curCenterId
export const selectDrawerCurCenterId = (state: State) => state.drawerCurCenterId
export const selectIsLoading = (state: State) => state.isLoading
export const selectDrawerIsLoading = (state: State) => state.drawerIsLoading
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
        name: members.reduce(
            (acc, cur) => acc + (acc == '' ? `${cur.center_user_name}` : `, ${cur.center_user_name}`),
            members.length == 1 ? '' : `${curUser.center_user_name}`
        ),
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

// date message funcs
function getDateInsteredMessage(chatMessages: Array<ChatRoomMessage>): Array<ChatRoomMessage> {
    const newChatMsgs: Array<ChatRoomMessage> = []
    _.forEach(chatMessages, (v, i, arr) => {
        newChatMsgs.push(v)
        if (i < arr.length - 1 && checkDayDiffBtMsgAndMsg(arr[i], arr[i + 1])) {
            newChatMsgs.push(makeDateMessage(arr[i].created_at))
        }
    })
    return newChatMsgs
}
function concatChatRoomMsg(curMsgs: Array<ChatRoomMessage>, prevMsgs: Array<ChatRoomMessage>) {
    if (checkDayDiffBtMsgAndMsg(curMsgs[curMsgs.length - 1], prevMsgs[0])) {
        const dateMsg = makeDateMessage(curMsgs[curMsgs.length - 1].created_at)
        curMsgs.push(dateMsg)
    }
    return _.uniqBy(_.concat(curMsgs, prevMsgs), 'id')
}
function checkDayDiffBtMsgAndMsg(currentMsg: ChatRoomMessage, prevMsg: ChatRoomMessage) {
    return dayjs(currentMsg.created_at).diff(dayjs(prevMsg.created_at), 'day') > 0
}
function makeDateMessage(created_at: string): ChatRoomMessage {
    return {
        id: `crmd-${dayjs(created_at).format('YYYY-MM-DD HH:mm:ss')}`,
        user_id: undefined,
        user_name: undefined,
        user_picture: undefined,
        user_background: undefined,
        user_color: undefined,
        type_code: 'fe_chat_room_message_type_date',
        type_code_name: '메시지 - 날짜',
        text: undefined,
        url: undefined,
        originalname: undefined,
        contentType: undefined,
        size: undefined,
        unread_user_ids: [],
        created_at: dayjs(created_at).format('YYYY-MM-DD HH:mm:ss'),
        deleted_at: null,
    }
}
